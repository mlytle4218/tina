var mongoose = require('mongoose');

var VideoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true
  },
  urlThumb: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String
  },
  date: {
    type: Date
  },
  order: {
    type: [Number]
  }
});


var Video = mongoose.model('Video', VideoSchema);
module.exports = Video;