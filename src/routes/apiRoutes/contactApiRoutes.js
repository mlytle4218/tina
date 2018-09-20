var Contact = require('../../models/contact');



  
  function createContact(req, res, next) {
    var contactData = {
        name: req.body.name,
        company: req.body.company,
        title: req.body.title,
        phone: req.body.phone,
        email: req.body.email
      };
  
    Contact.create(contactData, function(error, contact){
      if (error) {
        return next(error);
      } else {
        return res.json(contact);
      }
    });
  }
  
  function updateContact(req, res, next){
    //console.log(req.body);
    var contactData = {
      name: req.body.name,
      company: req.body.company,
      title: req.body.title,
      phone: req.body.phone,
      email: req.body.email
    };
  
    Contact.findByIdAndUpdate(req.params.id, contactData, {new: true}, function(error, contact){
      if (error){
        return next(error);
      } else {
        return res.json(contact);
      }
    });
  }
  
  function deleteContact(req, res, next){
    Contact.remove({_id : req.params.id}, function(error){
      if (error) {
        res.sent(error);
      } else {
        res.send({'message':'successful'});
      }
    })
  }


module.exports.createContact = createContact;
module.exports.updateContact = updateContact;
module.exports.deleteContact = deleteContact;