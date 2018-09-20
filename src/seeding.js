var mongoose = require('mongoose');
var Theater = require('../models/theater'),
    Movie = require('../models/movie'),
    Television = require('../models/television'),
    User = require('../models/user');
var userSeed = require('./users.json');



mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/demoReel', { useMongoClient: true });
// mongoose.connect('mongodb://localhost/demoReel', function(err) {
  mongoose.connect('mongodb://mongo', function(err) {
    if (err) {
        console.error(err);
    } else {
        console.log('Connected');
    }    
});


var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

console.log(userSeed);

for (var user in userSeed) {
	console.log(user[0].email);
}


for (var i = 0; i < userSeed.length; i++) {
	// console.log(userSeed[i]);
	var u = {
		email: userSeed[i].email,
		password: userSeed[i].password
	};
	User.create(u, function(error, user){
		if (error) {
			console.log(error)
			return next(error);
		} else {
			return res.json(user);
		}
	});
}