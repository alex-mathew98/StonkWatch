const User = require("../Models/user.model.js");

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a User
  const user = new User({
    user_id: req.body.user_id,
    email_id: req.body.email_id,
    full_name: req.body.full_name
  });

  // Save User in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    else res.send('Inserted user successfully!');
  });
};

// Retrieve all Users from the database (with condition).
exports.findAll = (req, res) => {
    const emailID = req.query.emailID;
    console.log("Query Email:",emailID);
    User.getAll(emailID, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Users."
        });
      else res.send(data);
    });
};

exports.check =(req,res) =>{
  const emailID = req.params.emailID;
  User.check(emailID,(err,result)=>{
    if(err){
      res.status(500).send({
        message:
          err.message || "Some error occurred while checking!"
      });
    }
    else{
      console.log("Result Server:",result)
      res.send(result)
    }
  })
}

// Find a single user with a id
exports.findOne = (req, res) => {
    User.findById(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found User with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving User with id " + req.params.id
            });
          }
        } else res.send(data);
      });
};

// Update a user identified based on the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  const user = new User({
    user_id: req.body.user_id,
    email_id: req.body.email_id,
    full_name: req.body.full_name
  });

  User.updateUser(
    user,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with id ${req.body.user_id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating User with id " + req.body.user_id
          });
        }
      } else res.send('Updated user succesfully!');
    }
  );
};

// Delete a user with the specified id in the request
exports.delete = (req, res) => {
    User.remove(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found User with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete User with id " + req.params.id
            });
          }
        } else res.send({ message: `User was deleted successfully!` });
      });
};

// Delete all user from the database.
exports.deleteAll = (req, res) => {
    User.removeAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all Users."
          });
        else res.send({ message: `All Users were deleted successfully!` });
      });
};