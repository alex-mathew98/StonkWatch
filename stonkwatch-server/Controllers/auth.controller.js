const AuthObject = require("../Models/registered-users.model");
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require("express-session");

// Handling registration
exports.register = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a User based on model
  const user = new AuthObject({
    fullName: req.body.fullName,
    emailID: req.body.emailID,
    password: req.body.password
  });

  // Save User in the database
  AuthObject.Register(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while registering the User."
      });
    else res.send('Registered user successfully!');
  });
};

// Handling Sign In
exports.login = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a User Object
    const user = new AuthObject({
      emailID: req.body.emailID,
      password: req.body.password
    });
  
    console.log("User object sent: ",user);
    // Save User in the database
    AuthObject.login(user.emailID, (err, result) => {
      if (err){
        res.status(500).send({
          message:
            err.message || "Some error occurred while logging in."
        });
      }
      else{
        if(result.length > 0){
            bcrypt.compare(user.password, result[0].user_password, (error, response) => {  
                console.log("Response: ",response)                
                if(response){
                     req.session.user=result;
                     console.log(req.session.user);
                     res.send({message:"Sign-In successful", result: result});
                 }  
                 else{
                     res.send({message:"Wrong/Username password combination!"});
                 }                  
            })
        }
        else{
            res.send({message:"No user exists!"});
        }
      }
    });
  };

// Handling Sign Out
exports.logout = (req, res) => {
  if(req.session.user){
    res.clearCookie("COOKIE-userId");
    req.session.destroy();
    res.send({message: "Successfully logged out"})
  }
};
  