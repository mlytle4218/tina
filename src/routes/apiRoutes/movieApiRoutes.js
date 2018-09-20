var Movie = require('../../models/movie');


function findAllMovie(req, res, next) {
  Movie.find(function(err, movie){
    if (err)
      res.send(err);

    // console.log(user);
    res.json(movie);
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
  console.log("in post router");
  // console.log(req);
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
  //console.log(req.body);
  var movieData = {
    title : req.body.title,
    role : req.body.role,
    director : req.body.director,
    dateStart : req.body.dateStart,
    dateEnd : req.body.dateEnd
  };

  Movie.findByIdAndUpdate(req.params.id, movieData, {new: true}, function(error, movie){
    if (error){
      return next(error);
    } else {
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

module.exports.findAllMovie = findAllMovie;
module.exports.findSingleMovie = findSingleMovie;
module.exports.createMovie = createMovie;
module.exports.updateMovie = updateMovie;
module.exports.deleteMovie = deleteMovie;