var mongoose = require('mongoose');

var ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    trim: true
  },
  company: {
    type: String,
    // required: true,
    trim: true
  },
  title: {
    type: String,
    // required: true,
    trim: true
  },
  phone: {
    type: String,
    // required: true
  },
  email: {
      type: String,
      // required: true
  }
});


var Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;