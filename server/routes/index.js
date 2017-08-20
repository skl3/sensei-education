const express = require('express');
const shortid = require('shortid');
const request = require('request');
const mongoose = require('mongoose');
const router = express.Router();

// for querying objectIds
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// Mongoose models
const Classroom = require('../models/classroom');
const Emotion = require('../models/emotion');
const Session = require('../models/session');

// Other APIs
const TRUEFACE_API = 'https://api.chui.ai/v1';
const TRUEFACE_API_KEY = 'h1itnXrydBa4cN1wxdjSs60i31Cmx1I41Q32GkIP';
const FACE2EMOTION_API = 'https://face2emotionapp.herokuapp.com/predict';

// TODO: improve this endpoint to search on title and description as well
// query classrooms by classCode
router.get('/classrooms', (req, res, next) => {
  return Classroom.findOne({ classCode: req.query.code })
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
    .then(classrooms => res.status(200).json(
      classrooms.filter((classroom) => classroom.title && classroom.videoUrl)))
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
  }).save()
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

// Create session inside Classroom & return classroom obj w/ embedded sessions
router.post('/classrooms/:code/sessions', (req, res, next) => {
  const classCode = req.params.code;
  const { sessionId } = req.body;
  return Classroom.findOne({ classCode })
    .then(classroom => {
      return (new Session({
        sessionId,
        startTime: new Date(),
        classroomId: ObjectId(classroom._id),
      }))
        .save()
        .then(session => {
          return Classroom.findOneAndUpdate({ _id: classroom._id }, { $push: { sessions: session._id }})
            .then(updatedClassroom => {
              return res.status(200).json(updatedClassroom);
            })
            .catch(err => {
              console.error("Update classroom session error");
              return res.status(500).json({
                success: false,
                message: "Update classroom session error",
                error: err,
              });
            });
        })
        .catch(err => {
          console.error("Session creation error: ", err);
          return res.status(500).json({
            success: false,
            message: "Session creation error",
            error: err,
          });
        });
    })
    .catch(err => {
      console.error("Classroom not found by class code", err);
      return res.status(500).json({
        success: false,
        message: "Classroom not found by class code error",
        error: err,
      });
    });

});

// TODO: [WIP] post image for classroom
router.post('/classrooms/:id/images', (req, res, next) => {
  const classroomCode = req.params.id;
  const { sessionId, encodedImage, videoTs } = req.body; // sessionId and encodedImage inside req body
  console.log(videoTs, 'videots');
  // determine whether there is a new session
  return Session.findOne({ sessionId })
    .then(session => {
      return updateSessionWithNewImage(
        sessionId, encodedImage, videoTs, res);
    })
    .catch(err => {
      console.error("Error querying for session existence", err);
      throw new Error("Error querying for session existence", err);
    });
});

// update session with new image
function updateSessionWithNewImage(sessionId, encodedImage, videoTs, res) {
  return Session.findOneAndUpdate({ sessionId }, { $push: { images: encodedImage }})
    .then(session => {
      // pass the base64 encoded image to trufaceapi
      const truefaceReqOptions = {
        url: TRUEFACE_API + '/facedetect',
        method: "POST",
        json: true,
        body: { img: encodedImage },
        headers: {
          'x-api-key': TRUEFACE_API_KEY,
          'Content-Type': "application/json",
        },
      };
      return request(truefaceReqOptions, (error, response, body) => {
        // get the cropped coordinates
        if (error) {
          console.error("Error w/ req to trueface: ", error);
          return res.status(500).json({
            success: false,
            message: "Error w/ req to trueface API:",
            error
          });
        }
        // pass to Mike's NN api
        const { faces, success, msg } =  body;
        // console.log({ faces, success, msg });
        if (!success || msg == 'no face detected') {
          return res.status(203).json({
            success: false,
            data: "Failed to identify face",
          });
        }
        // console.log('faces', faces);
        const face2emotionReqOptions = {
          url: FACE2EMOTION_API,
          headers: { 'Content-Type': "application/json" },
          method: "POST",
          json: true,
          body: {
            image: encodedImage,
            faces,
          },
        }
        return request(face2emotionReqOptions, (error, response, body) => {
          if (error) {
            console.error("Error w/ req to Face2Emotion: ", error);
            return res.status(500).json({
              success: false,
              message: "Error w/ req to Face2Emotion API",
              error,
            });
          }
          // console.log(body, 'response from face2emotion'); // should be a map
          const emotionsMap = body.data[0]; // TODO: support multiple predictions
          console.log(emotionsMap, 'emotionsmap');
          const { angry, disgust, fear, happy, sad, surprise, neutral } = emotionsMap;
          return new Emotion({
            angry,
            disgust,
            fear,
            happy,
            sad,
            surprise,
            neutral,
            sessionId: session._id,
            videoTs,
          }).save()
            .then(newEmotion => {
              // console.log(newEmotion, 'new emotion created');
              return Session.findOneAndUpdate({ sessionId }, { $push: { emotions: newEmotion._id }})
                .then(session2 => res.status(200).json(newEmotion))
                .catch(err => {
                  console.error("Error updating session with encoded image", err);
                  return res.status(500).json({
                    success: false,
                    message: "Error updating session with encoded image",
                    error: err,
                  });
                });
            })
            .catch(err => {
              console.error("Error with creation emotion prediction");
              return res.status(500).json({
                success: false,
                message: "Error with creation emotion prediction",
                error: err,
              });
            });

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
      return res.status(500).json({
        success: false,
        error: err,
        message: "Error getting classroom for analytics",
      });
    });
});

// get classroom analytics
router.get('/classrooms/:classCode/code', (req, res, next) => {
  // query all the sessions from classroom
  const { classCode } = req.params;
  console.log('classcode', classCode);
  return Classroom.findOne({ classCode })
    .then(classroom => res.status(200).json(classroom))
    .catch(err => {
      console.error("Error getting classroom for analytics", err);
      return res.status(500).json({
        success: false,
        error: err,
        message: "Error getting classroom for analytics",
      });
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
