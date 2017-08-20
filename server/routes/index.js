const express = require('express');
const shortid = require('shortid');
const router = express.Router();

// Mongoose models
const Classroom = require('../models/classroom');
const Emotion = require('../models/emotion');
const Session = require('../models/session');

// Other APIs
const TRUEFACE_API = 'https://api.chui.ai/v1';
const TRUEFACE_API_KEY = 'h1itnXrydBa4cN1wxdjSs60i31Cmx1I41Q32GkIP';
const FACE2EMOTION_API = process.env.face2emotion || '';

// TODO: improve this endpoint to search on title and description as well
// query classrooms
router.get('/classrooms', (req, res, next) => {
  return Classroom.findOne({ shortCode: req.query.code })
    .then(classroom => {
      return classroom ?
        res.status(200).json(classroom) :
        res.status(404).json({ data: "Not found" })
    })
    .catch(err => {
      console.error("Error fetching single classroom", err);
      throw new Error("Error fetching single classroom", err);
    });
});

// get public classrooms
router.get('/classrooms/public', (req, res, next) => {
  return Classroom.find({ isPublic: true })
    .then(classrooms => res.status(200).json(classrooms))
    .catch(err => {
      console.error("Error fetching classrooms", err);
      throw new Error("Error fetching classrooms", err);
    });
});

// create classroom
router.post('/classrooms', (req, res, next) => {
  return new Classroom({
    shortCode: shortid.generate(),
    classCode: shortid.generate(),
  })
    .save()
    .then(createdClassroom => res.status(200).json(createdClassroom))
    .catch(err => {
      console.error("New classroom created error: ", err); // Log error
      return res.status(500).json(err);
    });
});

// update classroom information - WEIRD fetch lib thing, not passing body
router.patch('/classrooms/:id', (req, res, next) => {
  const { id } = req.params;
  const { title, description, videoUrl, tags, isPublic } = req.body;
  return Classroom.findOneAndUpdate({ _id: id }, {
    title,
    description,
    videoUrl,
    tags,
    isPublic,
  }).then(updatedClassroom => {
    return res.status(200).json(updatedClassroom);
  }).catch(err => {
    console.error("Classroom update error: ", err);
    throw new Error("Classroom update error: ", err);
  });
});

// TODO: [WIP] post image for classroom
router.post('/classrooms/:id/images', (req, res, next) => {
  const classroomId = req.params.id;
  const { sessionId, encodedImage, videoTs } = req.body; // sessionId and encodedImage inside req body
  // determine whether there is a new session
  return Session.find({ id: sessionId })
    .then(session => {
      // create the session if it does not exist
      if (!session) {
        new Session({ classroomId, startTime: new Date() })
          .save()
          .then(newSesssion => {
            // update classroom with new session
            return Classroom.findOneAndUpdate({ id: classroomId })
              .then(updatedClassroom => {
                console.log("Nothing to see here", updatedClassroom);
                // TODO: updateSessionWithNewImage
                const emotionPredictions = updateSessionWithNewImage(sessionId, classroomId, encodedImage);
                return res.status(200).json(emotionPredictions); // TODO: format response data
              })
              .catch(err => {
                console.error("Classroom update error: ", err);
                throw new Error("Classroom update error: ", err);
              });
          })
          .catch(err => {
            console.error("New session created error: ", err); // Log error
            throw new Error("New session created error: ", err);
          });
      } else {
        const emotionPredictions = updateSessionWithNewImage(sessionId, classroomId, encodedImage);
        return res.status(200).json(emotionPredictions); // TODO: format response data
      }
    })
    .catch(err => {
      console.error("Error querying for session existence", err);
      throw new Error("Error querying for session existence", err);
    });
});

// update session with new image
function updateSessionWithNewImage(sessionId, classroomId, encodedImage) {
  return Session.findOneAndUpdate(
    { id: sessionId, classroomId },
    { $push: { images: encodedImage }}
  )
   .then(session => {
      // pass the base64 encoded image to trufaceapi
      const truefaceReqOptions = {
        url: TRUEFACE_API + '/facedetect',
        method: "POST",
        data: { img: encodedImage },
        headers: {
          'x-api-key': TRUEFACE_API_KEY,
          'Content-Type': "application/json",
        },
      };
      return request(truefaceReqOptions, (error, response, body) => {
        // get the cropped coordinates
        if (error) {
          console.error("Error w/ req to trueface: ", error);
          throw new Error("Error w/ req to trueface API: ", error);
        }
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        // pass to Mike's NN api
        const { faces } =  response.body.data;
        const face2emotionReqOptions = {
          url: + '/',
          meethod: "POST",
          data: {
            image: encodedImage,
            faces,
          },
        }
        return request(face2emotionReqOptions, (error, response, body) => {
          if (error) {
            console.error("Error w/ req to Face2Emotion: ", error);
            throw new Error("Error w/ req to Face2Emotion API: ", error);
          }
          console.log(response, 'response from face2emotion'); // should be a map
          const emotionPredictions = response.data;
          return emotionPredictions;
        });
      });

    })
    .catch(err => {
      console.error("Error updating session with encoded image", err);
      throw new Error("Error updating session with encoded image", err);
    });
}

// get classroom analytics
router.get('/classrooms/:id', (req, res, next) => {
  // query all the sessions from classroom
  const { id } = req.params;
  return Classroom.findOne({ shortCode: id })
    .populate({
      path: 'sessions',
      model: 'Session',
      populate: {
        path: 'emotions',
        model: 'Emotion'
      }
    })
    .then(classroom => res.status(200).json(classroom))
    .catch(err => {
      console.error("Error getting classroom for analytics", err);
      throw new Error("Error getting classroom for analytics", err);
    });
});

// get session analytics/emotions
router.get('/sessions/:id', (req, res, next) => {
  const { id } = req.params.id;
  return Session.find({ id })
    .populate('emotions')
    .then(session => res.status(200).json(session))
    .catch(err => {
      console.error("Error getting session analytics", err);
      throw new Error("Error getting session analytics", err);
    });
});

module.exports = router;
