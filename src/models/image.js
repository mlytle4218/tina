var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
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
  order: {
    type: [Number]
  },
  urlBlur: {
    type: String,
    required: true,
    trim: true
  }
});


var Image = mongoose.model('Image', ImageSchema);
module.exports = Image;