var express = require('express');
var router = express.Router();
var User = require('../models/user');
var config = require('../config');
var jwt = require('jsonwebtoken');
var allModule = require('./apiRoutes/apiRoutes');
var movieModule = require('./apiRoutes/movieApiRoutes');
var televisionModule = require('./apiRoutes/televisionApiRoutes');
var contactModule = require('./apiRoutes/contactApiRoutes');
var fileUpload = require('./apiRoutes/fileUploadRoutes');
var bearerToken = require('express-bearer-token');

var checkForBearerToken = function(req, res, next) {
  // console.log(req.headers);
  if (req.token) {
    jwt.verify(req.token, config.secret, function(error, decoded) {
      if (error) {
        console.log(error);
        return res.json({ success: false, message: 'Failed to authenticate.' })
      } else {
        // console.log("says its fine");
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token'
    });
  }

};



router.use(bearerToken());

router.post('/user/authenticate', function(req, res, next){
  console.log('email  :' + req.body.email);
  // console.log('password  :' + req.body.password);
  if (req.body.email && req.body.password) {
    // console.log("just before User.authenticates ")
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      // console.log('just after User.authenticate');
      if(error) {
        // console.log("authenticate if error");
        return next(error);
      } else if (!user){
        // console.log("authenticate !user errors");
        return res.json({success: false, message: "user not found" });
      } else {
        // console.log("authenticate not error");
        const payload = {user: user._id};
        var token = jwt.sign(payload, config.secret, {
          expiresIn: 86400 //24 hours
          // expiresIn: 10 //10 seconds
        })
        // console.log(token);
        return res.json({
          success: true,
          token: token
        });
      }
      console.log("errrr what?");
    });
  } else {
    return res.json({success: false, message: "email or password or both missing"});
  }
});

router.get('/pageLoadData', allModule.findAllData);

// router.use(checkForBearerToken);


router.post('/user/', function(req, res, next){
  console.log("new user route");
  console.log(req.body);
  if (req.body.email && req.body.password){
    var user = new User({
      email: req.body.email,
      password: req.body.password
    });
    // console.log(JSON.stringify(user));
    User.create(user, function(error, user){
      // console.log("just after create");
      if (error) {
        console.error(error);
        res.json({success: false, message: "could not save"});
      } else if (!user){
        // console.log("!user");
      } else {
        res.json(user);
      }

    })
  } else {
    res.json({success: false, message: "email or password or both missing"});
  }

});

router.get('/user/',function(req, res, next){
  // console.log("in find users");
  User.find(function(error, user){
    if (error)
      res.json({success: false, message: "none found"});
    res.json(user);
  });
});



//READ ALL
router.get('/theater', allModule.findAllTheater);
router.get('/movie', movieModule.findAllMovie);
router.get('/television', televisionModule.findAllTelevision);

// router.get('/', function (req, res, next) {
//   // return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
//   //send whether logged in to the view
//   // res.locals.loggedIn = (req.session.userId) ? true : false;
//   res.render(
//     'index',
//     {title: 'Hey Hey Hey!', message: 'Yo Yo'})
// });


// checks for the bearer token

// router.use(function(req, res, next){
//   //req.token comes from express-bearer-token's implementation
//   if (req.token) {
//     jwt.verify(req.token, config.secret, function(error, decoded) {
//       if (error) {
//         return res.json({ success: false, message: 'Failed to authenticate.'})
//       } else {
//         req.decoded = decoded;
//         next();
//       }
//     });
//   } else {
//     return res.status(403).send({
//       success: false,
//       message: 'No token'
//     });
//   }
// });


//user routes
//READ ALL users
router.get('/user', function(req, res, next) {
  User.findOne(function(err, user){
    if (err)
      res.send(err);
 
    res.json(user);
  });
});


//UPDATE user
router.put('/user', function(req, res, next) {
  User.findById(req.params._id, function(err, user){
    //console.log(req.body)
    if(err) {
      res.status(500).send({message: "Could not find a user with id " + req.params._id});
    }

    var temp = req.body.film

    user.film = temp

    note.save(function(err, data) {
      if(err){
        res.status(500).send({message: "Could not update note with id " + req.params._id});
      } else {
        res.send(data);
      }
    })
  })
}); 


//image CRUD routes

//READ ALL IMAGES
router.get('/image', allModule.findAllImages);

router.get('/video', allModule.findAllVideos);



//theater CRUD routes

//Add resume
router.post('/resume/', fileUpload.uploadResume);



//READ SINGLE BY ID
router.get('/theater/:id', allModule.findSingleTheater);

//CREATE
router.post('/theater', allModule.createTheater);

//UPDATE
router.put('/theater/:id', allModule.updateTheater);

//DELETE
router.delete('/theater/:id', allModule.deleteTheater);


//movie CRUD routes

//READ ALL

//READ SINGLE BY ID
router.get('/movie/:id', movieModule.findSingleMovie);

//CREATE
router.post('/movie', movieModule.createMovie);

//UPDATE
router.put('/movie/:id', movieModule.updateMovie);

//DELETE
router.delete('/movie/:id', movieModule.deleteMovie);


//television CRUD routes

//READ ALL

//READ SINGLE BY ID
router.get('/television/:id', televisionModule.findSingleTelevision);

//CREATE
router.post('/television', televisionModule.createTelevision);

//UPDATE
router.put('/television/:id', televisionModule.updateTelevision);

//DELETE
router.delete('/television/:id', televisionModule.deleteTelevision);


// router.post('/addImage', );

router.post('/image', fileUpload.uploadImage);

router.delete('/image/:id/:imageFileName/:thumbImageFileName', fileUpload.removeImage);

router.put('/image/:id', fileUpload.updateImage);

router.put('/images/', fileUpload.updateImagesOrder);

router.post('/video', fileUpload.uploadVideo);

router.delete('/video/:id/:videoFileName/:thumbVideoFileName', fileUpload.removeVideo);

router.put('/video/:id', fileUpload.updateVideo);

router.put('/videos/', fileUpload.updateVideosOrder);

router.post('/contact', contactModule.createContact);

router.delete('/contact/:id', contactModule.deleteContact);

router.put('/contact/:id', contactModule.updateContact);

//commented out just for other stuff
// GET route for reading data
// router.get('/', function (req, res, next) {
//   // return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
//   //send whether logged in to the view
//   res.locals.loggedIn = (req.session.userId) ? true : false;
//   res.render(
//     'index',
//     {title: 'Hey Hey Hey!', message: 'Yo Yo'})
// });


// //POST route for updating data
// router.post('/', function (req, res, next) {

//   if (req.body.email && req.body.password) {

//     var userData = {
//       email: req.body.email,
//       password: req.body.password,
//     }

//     User.create(userData, function (error, user) {
//       if (error) {
//         return next(error);
//       } else {
//         req.session.userId = user._id;
//         return res.redirect('/profile');
//       }
//     });

//   } else if (req.body.logemail && req.body.logpassword) {
//     User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
//       if (error || !user) {
//         var err = new Error('Wrong email or password.');
//         err.status = 401;
//         return next(err);
//       } else {
//         req.session.userId = user._id;
//         return res.redirect('/profile');
//       }
//     });
//   } else {
//     var err = new Error('All fields required.');
//     err.status = 400;
//     return next(err);
//   }
// })



// commented out just for workign with other stuff
// //POST route for updating data
// router.post('/', function (req, res, next) {

//   if (req.body.logemail && req.body.logpassword) {
//     User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
//       if (error || !user) {
//         var err = new Error('Wrong email or password.');
//         err.status = 401;
//         return next(err);
//       } else {
//         req.session.userId = user._id;
//         return res.redirect('/profile');
//       }
//     });
//   } else {
//     var err = new Error('All fields required.');
//     err.status = 400;
//     return next(err);
//   }
// })






// GET route after registering
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not Signed In');
          err.status = 400;
          return next(err);
        } else {
          // return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
          return res.render(
            'profile',
            {title: 'Hey Hey Hey!', message: 'Logged in'})
        }
      }
    });
});

// // GET for logout logout
// router.get('/logout', function (req, res, next) {
//   if (req.session) {
//     // delete session object
//     req.session.destroy(function (err) {
//       if (err) {
//         return next(err);
//       } else {
//         return res.redirect('/');
//       }
//     });
//   }
// });


// router.use(express.static(__dirname + '/public'));
// router.get('/',function(req, res){//get,put,post,delete   
//   res.sendFile(__dirname + '/public/index.html');
// });


module.exports = router;