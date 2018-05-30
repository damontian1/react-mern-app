const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  location: {
    type: String
  },
  github: {
    type: String
  }
});

module.exports = mongoose.model("profiles", ProfileSchema);