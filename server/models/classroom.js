const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const classroomSchema = new Schema({
  title: String,
  description: String,
  shortCode: String,
  classCode: String,
  videoUrl: String,
  tags: [ String ],
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  sessions: [
    { type: ObjectId, ref: 'Session' },
  ],
});

module.exports = mongoose.model('Classroom', classroomSchema);
