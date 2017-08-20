const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const emotionSchema = new Schema({
  angry: Number,
  disgust: Number,
  feat: Number,
  happy: Number,
  sad: Number,
  surprise: Number,
  neutral: Number,
  createdAt: { type: Date, default: Date.now },
  sessionId: { type: ObjectId, ref: 'Session' }, // todo: might remove
  videoTs: Number,
});

module.exports = mongoose.model('Emotion', emotionSchema);
