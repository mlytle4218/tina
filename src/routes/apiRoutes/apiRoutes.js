var Theater = require('../../models/theater'),
    Movie = require('../../models/movie'),
    Television = require('../../models/television'),
    Image = require('../../models/image'),
    Video = require('../../models/video'),
    Contact = require('../../models/contact'),
    // File = require('../../models/file'),
    fs = require("fs");
    

function findAllData(req, res) {
  //console.log(req);
    Promise.all([
            Theater.find(),
            Movie.find(),
            Television.find(),
            Image.find(),
            Video.find(),
            Contact.find(),
            // File.find()

        ]).then(function(results) {
            // const [theaters, movies, televisions, images, videos, contacts,files] = results;
            const [theaters, movies, televisions, images, videos, contacts] = results;
            fs.readdir("public/files", function(err, items) {
              console.log(items);
           
              for (var i=0; i<items.length; i++) {
                  console.log(items[i]);
              }
          });
          console.log(fs.exists("public/files/Christina_Ferrarro_resume.pdf"));
          fs.exists("public/files/Christina_Ferrarro_resume.pdf", function(exists){
            console.log("in exits callback");
            if (exists){
              console.log(exists);
              res.json({
                theater: theaters,
                movie: movies,
                television: televisions,
                image: images,
                video: videos,
                contact: contacts,
                file: "files/Christina_Ferrarro_resume.pdf"

              });
            } else {
              console.log("does not exists in callback");
              res.json({
                theater: theaters,
                movie: movies,
                television: televisions,
                image: images,
                video: videos,
                contact: contacts
              });
            }
            
            
          });
            // if (fs.exists("public/files/Christina_Ferrarro_resume.pdf")){
            //   console.log("file exists");
            //   res.json({
            //     theater: theaters,
            //     movie: movies,
            //     television: televisions,
            //     image: images,
            //     video: videos,
            //     contact: contacts,
            //     file: "files/Christina_Ferrarro_resume.pdf"

            //   });
            // } else {
            //   console.log("file does not exist")
            //   res.json({
            //     theater: theaters,
            //     movie: movies,
            //     television: televisions,
            //     image: images,
            //     video: videos,
            //     contact: contacts
            //   });
            // }

            

        }).catch(function(error) {
            //console.error("Something went wrong", error);
        })
};


function trial(){
  return "hi";
};


// Image functions

function findAllImages(req, res, next) {
  Image.find(function(error, image) {
    if(error) {
      console.log(error);
      res.send(error);
    } else {
      res.json(image);
    }
  })
}

//Video Functions
function findAllVideos(req,res, next) {
  Video.find(function(error, video) {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      res.json(video);
    }
  })
}


// Theater functions

function findAllTheater(req, res, next) {
  Theater.find(function(error, theater){
    if (error) {
      console.log(error);
      res.send(error);
    } else { 
      res.json(theater);
    }
  });
};

function findSingleTheater(req, res, next){
  Theater.findById(req.params.id, function(error, theater){
    if (error) {
      return next(error);
    } else {
      return res.json(theater);
    }
  });
}

function createTheater(req, res, next) {
  // console.log("in createTheater post router");
  // console.log(req.body);
  var theaterData = {
    title : req.body.title,
    role : req.body.role,
    companyDirector : req.body.companyDirector,
    dateStart : req.body.dateStart,
    dateEnd : req.body.dateEnd
  };

  Theater.create(theaterData, function(error, theater){
    if (error) {
      return next(error);
    } else {
      return res.json(theater);
    }
  });
}

function updateTheater(req, res, next){
  // console.log(req.body);
  var theaterData = {
    title : req.body.title,
    role : req.body.role,
    companyDirector : req.body.companyDirector,
    dateStart : req.body.dateStart,
    dateEnd : req.body.dateEnd
  };
  

  Theater.findByIdAndUpdate(req.params.id, theaterData,{new: true}, function(error, theater){
    if (error){
      return next(error);
    } else {
      console.log(theater);
      return res.json(theater);
    }
  });
}

function deleteTheater(req, res, next){
  Theater.remove({_id : req.params.id}, function(error){
    if (error) {
      res.send(error);
    } else {
      res.send({'message':'successful'});
    }
  })

}


// movie functions
function findAllMovie(req, res, next) {
  Movie.find(function(error, movie){
    if (error) {
      res.send(error);
    } else { 
      res.json(movie);
    }
  });
};

function findSingleMovie(req, res, next){
  Movie.findById(req.params.id, function(error, movie){
    if (error) {
      return next(error);
    } else {
      return res.json(movie);
    }
  });
}

function createMovie(req, res, next) {
  var movieData = {
    title : req.body.title,
    role : req.body.role,
    director : req.body.director,
    dateStart : req.body.dateStart,
    dateEnd : req.body.dateEnd
  };

  Movie.create(movieData, function(error, movie){
    if (error) {
      return next(error);
    } else {
      return res.json(movie);
    }
  });
}

function updateMovie(req, res, next){
  var movieData = {
    title : req.body.title,
    role : req.body.role,
    director : req.body.director,
    dateStart : req.body.dateStart,
    dateEnd : req.body.dateEnd
  };
console.log("in updateMovie");
  Movie.findByIdAndUpdate(req.params.id, movieData, {new: true}, function(error, movie){
    if (error){
      return next(error);
    } else {
      console.log(movie);
      return res.json(movie);
    }
  });
}

function deleteMovie(req, res, next){
  Movie.remove({_id : req.params.id}, function(error){
    if (error) {
      res.send(error);
    } else {
      res.send({'message':'successful'});
    }
  })
  }
// television functions

function findAllTelevision(req, res, next) {
  Television.find(function(error, television){
    if (error) {
      console.log(error);
      res.send(error);
    } else { 
      res.json(television);
    }
  });
};

function findSingleTelevision(req, res, next){
  Television.findById(req.params.id, function(error, television){
    if (error) {
      return next(error);
    } else {
      return res.json(television);
    }
  });
}

function createTelevision(req, res, next) {
  var televisionData = {
    title : req.body.title,
    role : req.body.role,
    studio : req.body.studio,
    dateStart : req.body.dateStart,
    dateEnd : req.body.dateEnd
  };

  Television.create(televisionData, function(error, television){
    if (error) {
      return next(error);
    } else {
      return res.json(television);
    }
  });
}

function updateTelevision(req, res, next){
  var televisionData = {
    title : req.body.title,
    role : req.body.role,
    studio : req.body.studio,
    dateStart : req.body.dateStart,
    dateEnd : req.body.dateEnd
  };

  Television.findByIdAndUpdate(req.params.id, televisionData, {new: true}, function(error, television){
    if (error){
      return next(error);
    } else {
      return res.json(television);
    }
  });
}

function deleteTelevision(req, res, next){
  Television.remove({_id : req.params.id}, function(error){
    if (error) {
      res.send(error);
    } else {
      res.send({'message':'successful'});
    }
  })
}
// contact functions

// function findAllContacts(req, res, next) {
//   Contact.find(function(error, contact){
//     if (error) {
//       console.log(error);
//       res.send(error);
//     } else { 
//       res.json(contact);
//     }
//   });
// };

// function findSingleContact(req, res, next){
//   Contact.findById(req.params.id, function(error, contact){
//     if (error) {
//       return next(error);
//     } else {
//       return res.json(contact);
//     }
//   });
// }

// function createContact(req, res, next) {
//   var contactData = {
//     name : req.body.name,
//     company : req.body.company,
//     title : req.body.title,
//     phone : req.body.phone,
//     email : req.body.email
//   };

//   Contact.create(contactData, function(error, contact){
//     if (error) {
//       return next(error);
//     } else {
//       return res.json(contact);
//     }
//   });
// }

// function updateContact(req, res, next){
//   var contactData = {
//     name : req.body.name,
//     company : req.body.company,
//     title : req.body.title,
//     phone : req.body.phone,
//     email : req.body.email
//   };

//   Contact.findByIdAndUpdate(req.params.id, contactData, {new: true}, function(error, contact){
//     if (error){
//       return next(error);
//     } else {
//       return res.json(contact);
//     }
//   });
// }

// function deleteContact(req, res, next){
//   Contact.remove({_id : req.params.id}, function(error){
//     if (error) {
//       res.send(error);
//     } else {
//       res.send({'message':'successful'});
//     }
//   })
// }

module.exports.findAllTelevision = findAllTelevision;
module.exports.findSingleTelevision = findSingleTelevision;
module.exports.createTelevision = createTelevision;
module.exports.updateTelevision = updateTelevision;
module.exports.deleteTelevision = deleteTelevision;

module.exports.findAllMovie = findAllMovie;
module.exports.findSingleMovie = findSingleMovie;
module.exports.createMovie = createMovie;
module.exports.updateMovie = updateMovie;
module.exports.deleteMovie = deleteMovie;

module.exports.trial = trial;
module.exports.findAllData = findAllData;
module.exports.findAllTheater = findAllTheater;
module.exports.findSingleTheater = findSingleTheater;
module.exports.createTheater = createTheater;
module.exports.updateTheater = updateTheater;
module.exports.deleteTheater = deleteTheater;

module.exports.findAllImages = findAllImages;
module.exports.findAllVideos = findAllVideos;