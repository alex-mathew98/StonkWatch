const mySQLConnection = require("./db.js");
const Config = require("../Config/db.config.js");
const DB = Config.DB;

// Constructor for user portfolio entry model
const UserPortfolio = function(entry) {
    this.portfolio_entry = entry.portfolio_entry;
    this.user_id = entry.user_id;
    this.company_ticker = entry.company_ticker;
    this.quantity = entry.quantity;
    this.price_bought = entry.price_bought;
};

// Retreving portfolio entries from User Portfolio table
UserPortfolio.getAll = (portfolio_entry, result) => {
    let query = `SELECT * FROM ${DB}.user_portfolio`;
  
    if (portfolio_entry) {
      query += ` WHERE portfolio_entry = '${portfolio_entry}'`;
    }

    mySQLConnection.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("Portfolio Entry: ", res);
      result(null, res);
    });
};

// Retreving a user's portfolio data from User Portfolio table based on user id
UserPortfolio.findById = (id, result) => {
    let query = `SELECT * FROM user_portfolio WHERE user_id = ${id}`;
    mySQLConnection.query(query, (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("Found user's portfolio holdings: ", res);
        result(null, res);
        return;
      }
  
      // not found portfolio for user with the id
      result({ kind: "not_found" }, null);
    });
  };

  // Checking the watchlist if company exists in the watchlist 
UserPortfolio.checkExisting = (userID,ticker, result) => {
  mySQLConnection.query(`SELECT * FROM ${DB}.user_portfolio WHERE user_id = ${userID} AND company_ticker = '${ticker}' `, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
      return;
    }

    if (res.length > 0) {
      result(null,true);
      return;
    }

    result(null,false);
  });
};

  // Creating an entry for a new portfolio entry
  UserPortfolio.create = (newEntry, result) => {
    let query = "SET @portfolio_entry = ?; SET @user_id = ?; SET @company_ticker = ?; SET @quantity = ?; SET @price_bought = ?; \
    CALL AddToPortfolio(@portfolio_entry,@user_id,@company_ticker,@quantity,@price_bought);";
    mySQLConnection.query(
        query,
        [newEntry.portfolio_entry,newEntry.user_id, newEntry.company_ticker, newEntry.quantity, newEntry.price_bought], 
        (err, rows, fields) => {
            if (!err){
                rows.forEach(element => {
                    if(element.constructor == Array)
                        result(null, { id: element[0].portfolio_entry});
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

  // Updating a portfolio entry based on request sent
  UserPortfolio.updateUser = (entry, result) => {
    let query = "SET @portfolio_entry = ?; SET @user_id = ?; SET @company_ticker = ?; SET @quantity = ?; SET @price_bought = ?; \
    CALL AddToPortfolio(@portfolio_entry,@user_id,@company_ticker,@quantity,@price_bought);";
    mySQLConnection.query(
      query,
      [entry.portfolio_entry,entry.user_id, entry.company_ticker, entry.quantity, entry.price_bought],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found portfolio entry with the id
          result({ kind: "not_found" }, null);
          return;
        }
        console.log("Updated portfolio entry successfully: ", { ...entry});
        result(null, { id: entry.portfolio_entry });
      }
    );
  };

  //Removing a portfolio entry based on the id provided
  UserPortfolio.remove = (id, result) => {
    mySQLConnection.query(`DELETE FROM ${DB}.user_portfolio WHERE portfolio_entry = ?`, id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found entry with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("Deleted entry with id: ", id);
      result(null, res);
    });
  };

  module.exports = UserPortfolio;