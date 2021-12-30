const mySQLConnection = require("./db.js");
const Config = require("../Config/db.config.js");
const DB = Config.DB;

// Constructor for user model
const User = function(user) {
    this.user_id = user.user_id;
    this.email_id = user.email_id;
    this.full_name = user.full_name;
};

// Retreving Users from User table
User.getAll = (email, result) => {
    let query = `SELECT * FROM ${DB}.users`;
  
    if (email) {
      query += ` WHERE email_id = '${email}'`;
    }
    console.log('Query:',query);
    mySQLConnection.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("User: ", res);
      result(null, res);
    });
};

//Checking if user exists in the database
User.check = (email, result) => {
    let query = `SELECT * FROM ${DB}.users WHERE email_id = '${email}'`;
    mySQLConnection.query(query, (err, rows, fields) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      else{

        if(rows.length > 0){
          result(null,true)
          return;
        }
        else{
          result(null,false)
          return;
        }
      }
    });
};

// Retreving Users from User table based on user id
User.findById = (id, result) => {
    mySQLConnection.query(`SELECT * FROM ${DB}.users WHERE user_id = ${id}`, (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("Found user: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found user with the id
      result({ kind: "not_found" }, null);
    });
  };

  // Creating an entry for a new user
  User.create = (newUser, result) => {
    let query = "SET @user_id = ?; SET @email_id = ?; SET @full_name = ?; \
    CALL UsersAddOrEdit(@user_id,@email_id,@full_name);"
    mySQLConnection.query(
        query,
        [newUser.user_id,newUser.email_id,newUser.full_name], 
        (err, rows, fields) => {
            if (!err){
                rows.forEach(element => {
                    if(element.constructor == Array)
                        result(null, { id: element[0].user_id});
                });
            }
            else{
                console.log("error: ", err);
                result(err, null);
                return;
            }
            
        }
    );
  };

  // Updating a users entry based on user id
  User.updateUser = (user, result) => {
    let query = "SET @user_id = ?; SET @email_id = ?; SET @full_name = ?; \
    CALL UsersAddOrEdit(@user_id,@email_id,@full_name);"
    mySQLConnection.query(
      query,
      [user.user_id, user.email_id, user.full_name],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found User with the id
          result({ kind: "not_found" }, null);
          return;
        }
        console.log("Updated User Successfully: ", { ...user});
        result(null, { id: user.user_id });
      }
    );
  };

  //Removing a user's entry
  User.remove = (id, result) => {
    mySQLConnection.query(`DELETE FROM ${DB}.users WHERE user_id = ?`, id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found User with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("Deleted user with id: ", id);
      result(null, res);
    });
  };

  //Removing all users
  User.removeAll = result => {
    mySQLConnection.query(`DELETE FROM ${DB}.users`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log(`Deleted ${res.affectedRows} users`);
      result(null, res);
    });
  };

  module.exports = User;