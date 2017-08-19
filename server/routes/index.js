const express = require('express');
const shortid = require('shortid');
const router = express.Router();

// Mongoose models
const Classroom = require('../models/classroom');
const Emotion = require('../models/emotion');
const Session = require('../models/session');

// get public classrooms
router.get('/classrooms', (req, res, next) => {
  return Classroom.find({ isPublic: true })
    .then(classrooms => res.status(200).json(classrooms))
    .catch(err => {
      console.error("Error fetching classrooms", err);
      throw new Error("Error fetching classrooms", err);
    });
});

// create classroom
router.post('/classrooms', (req, res, next) => {
  return new Classroom({ shortCode: shortid.generate() })
    .save()
    .then(createdClassroom => res.status(200).json(createdClassroom))
    .catch(err => {
      console.error("New classroom created error: ", err); // Log error
      return res.status(500).json(err);
    });
});

// update classroom information
router.patch('/classrooms/:id', (req, res, next) => {
  const { id } = req.params;
  const { title, description, tags, isPublic } = req.body;
  const updated = {
    title,
    description,
    tags,
    isPublic,
  };
  return Classroom.findOneAndUpdate({ id }, updated)
    .then(updatedClassroom => res.status(200).json(updatedClassroom))
    .catch(err => {
      console.error("Classroom update error: ", err);
      throw new Error("Classroom update error: ", err);
    });
});

// TODO: [WIP] post image for classroom
router.post('/classrooms/:id/images', (req, res, next) => {
  const classroomId = req.params.id;
  const { sessionId, image } = req.body; // sessionId and encoded image inside req body
  // determine whether there is a new session
  Session.find({ id: sessionId })
    .then(session => {
      // create the session if it does not exist
      if (!session) {
        const newSession = new Session({
          classroomId,
          startTime: new Date(),
        })
        newSession.save((err, createdSession) => {
          if (err) {
            console.error("New session created error: ", err); // Log error
            return res.status(500).json(err);
          }
          return res.status(200).json(createdSession);
        });
        // update classroom with new
        Classroom.findOneAndUpdate({ })
          .then()
          .catch(err => {
            console.error("Classroom update error: ", err);
            throw new Error("Classroom update error: ", err);
          });
      }
    })
    .catch(err => {
      console.error("Error querying for session existence", err);
      throw new Error("Error querying for session existence", err);
    });


  // update session with new image
  Session.findOneAndUpdate({ id: sessionId, classromId }, { $push: { images: image }} )
    .then(session => {
      // pass the base64 encoded image to trufaceapi

      // get the cropped coordinates

      // pass to Mike's NN api
    })
    .catch(err => {
      console.error("Error updating session with encoded image", err);
      throw new Error("Error updating session with encoded image", err);
    });
});

// get classroom analytics
router.get('/classrooms/:id', (req, res, next) => {
  // query all the sessions from classroom
  const classroomId = req.params.id;
  return Classroom.find({ id: classroomId })
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

});

module.exports = router;
