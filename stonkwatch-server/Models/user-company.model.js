const mySQLConnection = require("./db.js");
const Config = require("../Config/db.config.js");
const DB = Config.DB;

// Constructor for user model
const UserCompany = function(userCompanyAssociation) {
    this.user_company_id = userCompanyAssociation.user_company_id;
    this.user_id = userCompanyAssociation.user_id;
    this.company_id = userCompanyAssociation.company_id;
};

// Retreving Users from UserCompanyAssociation table
UserCompany.getAll = (uid, result) => {
    let query = `SELECT * FROM ${DB}.user_company_association`;
  
    if (uid) {
      query += ` WHERE user_id = ${uid}`;
    }
    mySQLConnection.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("User-company associations: ", res);
      result(null, res);
    });
};

// Retreving Associations from UserCompanyAssociation table based on user id
UserCompany.findById = (id, result) => {
    mySQLConnection.query(`SELECT * FROM ${DB}.user_company_association WHERE user_id = ${id}`, (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("Found Companies followed by user");
        result(null, res);
        return;
      }
  
      // not found Association with the id provided
      result({ kind: "not_found" }, null);
    });
};

//Get the companies followed by the user
UserCompany.getCompaniesFollowed = (id, result) => {
    mySQLConnection.query(`SELECT user_company_association.user_company_id,company.company_name,company.company_ticker FROM ${DB}.company \
    JOIN user_company_association \
    ON company.company_id = user_company_association.company_id \
    JOIN users \
    ON users.user_id = user_company_association.user_id \
    WHERE users.user_id = ${id};`, (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("Found Companies followed by user: ", res);
        result(null, res);
        return;
      }
  
      // not found Companies followed by the user id provided
      result({ kind: "not_found" }, null);
    });
  };



// Checking the watchlist if company exists in the watchlist 
UserCompany.checkWatchlist = (userID,companyID, result) => {
    mySQLConnection.query(`SELECT * FROM ${DB}.user_company_association WHERE user_id = ${userID} AND company_id = ${companyID} `, (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length > 0) {
        console.log("Company Exists in the Watchlist");
        result(null,true);
        return;
      }
  
      result(null,false);
    });
  };


  // Creating an entry for a new user-company association
  UserCompany.create = (newUserCompanyAssociation, result) => {
    let query = "SET @user_company_id = ?; SET @user_id = ?; SET @company_id = ?; \
    CALL AddUserWatchList(@user_company_id,@user_id,@company_id);"
    mySQLConnection.query(
        query,
        [newUserCompanyAssociation.user_company_id, newUserCompanyAssociation.user_id, newUserCompanyAssociation.company_id], 
        (err, rows, fields) => {
            if (!err){
                rows.forEach(element => {
                    if(element.constructor == Array)
                        result(null, { id: element[0].user_company_id});
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

  //Removing a user-company association entry based on user_company_id
  UserCompany.remove = (id, result) => {
    mySQLConnection.query(`DELETE FROM ${DB}.user_company_association WHERE user_company_id = ?`, id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Association with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("Deleted association with id: ", id);
      result(null, res);
    });
  };

  module.exports = UserCompany;