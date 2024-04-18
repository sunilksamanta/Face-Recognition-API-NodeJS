const mongoose = require('mongoose');

const FaceSchema = new mongoose.Schema({
  name: String,
  descriptors: [Number]
});

module.exports = mongoose.model('Face', FaceSchema);
