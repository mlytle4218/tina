var Television = require('../../models/television');


function findAllTelevision(req, res, next) {
  Television.find(function(err, television){
    if (err)
      res.send(err);

    // console.log(user);
    res.json(television);
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
  console.log("in post router");
  // console.log(req);
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
  //console.log(req.body);
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
      res.sent(error);
    } else {
      res.send({'message':'successful'});
    }
  })
}

module.exports.findAllTelevision = findAllTelevision;
module.exports.findSingleTelevision = findSingleTelevision;
module.exports.createTelevision = createTelevision;
module.exports.updateTelevision = updateTelevision;
module.exports.deleteTelevision = deleteTelevision;