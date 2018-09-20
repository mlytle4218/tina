var mongoose = require('mongoose');

var TelevisionSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
    trim: true
  },
  role: {
    type: String,
    // required: true,
    trim: true
  },
  studio: {
    type: String,
    // required: true,
    trim: true
  },
  dateStart: {
    type: Date,
    // required: true
  },
  dateEnd: {
    type: Date,
    // required: true
  }
});


var Television = mongoose.model('Television', TelevisionSchema);
module.exports = Television;