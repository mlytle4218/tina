var mongoose = require('mongoose');

var FileSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true
  }
});


var File = mongoose.model('File', FileSchema);
module.exports = File;