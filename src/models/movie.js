var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
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
  director: {
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


var Movie = mongoose.model('Movie', MovieSchema);
module.exports = Movie;