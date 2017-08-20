const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const sessionSchema = new Schema({
  sessionId: String, // UUID
  classroonId: { type: ObjectId, ref: 'Classroom' }, // todo: might remove
  createdAt: { type: Date, default: Date.now },
  startTime: { type: Date },
  endTime: { type: Date },
  images: [ String ],
  emotions: [
    { type: ObjectId, ref: 'Emotion' },
  ],
});

module.exports = mongoose.model('Session', sessionSchema);
