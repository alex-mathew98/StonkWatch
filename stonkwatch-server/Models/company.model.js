const mySQLConnection = require("./db.js");
const Config = require("../Config/db.config.js");
const DB = Config.DB;

// Constructor for company model
const Company = function(company) {
    this.company_id = company.company_id;
    this.company_name = company.company_name;
    this.company_description = company.company_description;
    this.company_ticker = company.company_ticker;
};

// Retreving Companies from Company table
Company.getAll = (ticker, result) => {
    let query = `SELECT * FROM ${DB}.company`;
  
    if (ticker) {
      query += ` WHERE company_ticker = '%${ticker}%'`;
    }
    console.log('Query:',query);
    mySQLConnection.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("Company: ", res);
      result(null, res);
    });
};

//Checking if company exists in the company table
Company.check = (ticker, result) => {
  let query = `SELECT * FROM ${DB}.company WHERE company_ticker = '${ticker}'`;
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

// Retreving Company from Company table based on Company id
Company.findById = (id, result) => {
    mySQLConnection.query(`SELECT * FROM ${DB}.company WHERE company_id = ${id}`, (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("Found Company: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Company with the id
      result({ kind: "not_found" }, null);
    });
  };

  // Retrieiving company id based on ticker
  Company.findId = (ticker, result) => {
    mySQLConnection.query(`SELECT company_id FROM ${DB}.company WHERE company_ticker = '${ticker}'`, (err, rows, fields) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }
      else if(rows.length){
        result(null,rows);
        return;
      }

      result({ kind: "not_found" }, null);
    });
  };

  // Creating an entry for a new Company
  Company.create = (newCompany, result) => {
    let query = "SET @company_id = ?; SET @company_name = ?; SET @company_description = ?; SET @company_ticker = ?; \
    CALL CompanyAddOrEdit(@company_id,@company_name,@company_description,@company_ticker);";
    mySQLConnection.query(
        query,
        [newCompany.company_id, newCompany.company_name, newCompany.company_description, newCompany.company_ticker], 
        (err, rows, fields) => {
            if (!err){
                rows.forEach(element => {
                    if(element.constructor == Array)
                        result(null, { id: element[0].company_id});
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

  // Updating a Company entry 
  Company.updateCompany = (company, result) => {
    let query = "SET @company_id = ?; SET @company_name = ?; SET @company_description = ?; SET @company_ticker = ?; \
    CALL CompanyAddOrEdit(@company_id,@company_name,@company_description,@company_ticker);";
    mySQLConnection.query(
      query,
      [company.company_id, company.company_name, company.company_description,company.company_ticker],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Company with the id
          result({ kind: "not_found" }, null);
          return;
        }
        // Watch out -Errors might happen
        console.log("Updated Company Successfully: ", { ...company});
        result(null, { id: company.company_id });
      }
    );
  };

  //Removing a Company's entry based on company id
  Company.remove = (id, result) => {
    mySQLConnection.query(`DELETE FROM ${DB}.company WHERE company_id = ?`, id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Company with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("Deleted Company with id: ", id);
      result(null, res);
    });
  };

  //Removing all Companies
  Company.removeAll = result => {
    mySQLConnection.query(`DELETE FROM ${DB}.company`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log(`Deleted ${res.affectedRows} companies`);
      result(null, res);
    });
  };

  module.exports = Company;