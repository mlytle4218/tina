var mongoose = require('mongoose');

var TheaterSchema = new mongoose.Schema({
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
  companyDirector: {
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


var Theater = mongoose.model('Theater', TheaterSchema);
module.exports = Theater;
