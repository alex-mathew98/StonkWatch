const mySQLConnection = require("./db.js");
const Config = require("../Config/db.config.js");
const DB = Config.DB;
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Constructor for AuthObject user model
const AuthObject = function(user) {
    this.fullName = user.fullName;
    this.emailID = user.emailID;
    this.password = user.password;
};

// Registering a user
AuthObject.Register = (user, result) => {
    const fullName = user.fullName
    const emailID = user.emailID
    const password = user.password  

    let query = `SELECT * FROM ${DB}.registered_users WHERE user_email_id = '${emailID}'`;

    console.log('Query:',query);
    mySQLConnection.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      else{
          //If user exists:
          if(res.length>0){
            console.log("User already exists");
            result(null,{message: "User already exists"}) 
          }
          //If user doesnt exist,add it to db:
          else{
            bcrypt.hash(password,saltRounds, (err,hash) =>{

                if(err){
                    console.log(err);
                }
                mySQLConnection.query(`INSERT INTO ${DB}.registered_users(user_email_id,user_password,user_full_name) VALUES (?,?,?)`,[emailID,hash,fullName], (err, rows, fields) => {
                    
                    if (!err){
                        result(null,{message: "User has been succesfully registered"}) 
                    }
                    else{
                        console.log(err);
                    }
                })
            })
          }
      }
    });
};

// Handling login 
AuthObject.login = (emailID, result) => {
    mySQLConnection.query(`SELECT * FROM ${DB}.registered_users WHERE user_email_id = '${emailID}' `, (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("Found user: ", res);
        result(null, res);
        return;
      }
  
      // not found Tutorial with the id
      result(null, res);
    });
  };

  
  module.exports = AuthObject;