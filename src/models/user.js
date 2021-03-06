var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// var UserSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     unique: true,
//     required: true,
//     trim: true
//   },
//   username: {
//     type: String,
//     unique: true,
//     required: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   passwordConf: {
//     type: String,
//     required: true,
//   }
// });
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  theater: [{
    title: String,
    role: String,
    companyDirector: String,
    startDate: Date,
    endDate: Date
   }],
   television: [{
    title: String,
    role: String,
    studio: String,
    startDate: Date,
    endDate: Date
   }],
   film: [{
    title: String,
    role: String,
    director: String,
    startDate: Date,
    endDate: Date
   }]
});

//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        console.log("user authenticate error");
        return callback(err)
      } else if (!user) {
        console.log("user authenticate not error");
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});


var User = mongoose.model('User', UserSchema);
module.exports = User;

