const Company = require("../Models/company.model.js");

// Create and Save a new Company
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a company object
  const company = new Company({
    company_id: req.body.company_id,
    company_name: req.body.company_name,
    company_description: req.body.company_description,
    company_ticker: req.body.company_ticker,
  });

  // Save Company in the database
  Company.create(company, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the company entry."
      });
    else res.send('Inserted company successfully!');
  });
};

// Retrieve all companies from the database (with condition).
exports.findAll = (req, res) => {
    const ticker = req.query.ticker;
    console.log("Query ticker:",ticker);
    Company.getAll(ticker, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Users."
        });
      else res.send(data);
    });
};

// Check if a company exists in company table
exports.check =(req,res) =>{
    const ticker = req.query.ticker;
    Company.check(ticker,(err,result)=>{
      if(err){
        res.status(500).send({
          message:
            err.message || "Some error occurred while checking!"
        });
      }
      else{
        res.send(result)
      }
    })
}

// Find a single company with a id
exports.findOne = (req, res) => {
    Company.findById(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Company with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Company with id " + req.params.id
            });
          }
        } else res.send(data);
      });
};

// Retrieving user's Id based on ticker
exports.findID = (req, res) => {
  let ticker = req.params.ticker;
  Company.findId(ticker, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Company with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Company with id " + req.params.id
          });
        }
      } else res.send(data);
    });
};


// Update a Company based on the request sent
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a company object
  const company = new Company({
    company_id: req.body.company_id,
    company_name: req.body.company_name,
    company_description: req.body.company_description,
    company_ticker: req.body.company_ticker,
  });

  Company.updateCompany(
    company,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Company with id ${req.body.user_id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Company with id " + req.body.user_id
          });
        }
      } else res.send('Updated Company entry succesfully!');
    }
  );
};

// Delete a Companies with the specified id in the request
exports.delete = (req, res) => {
    Company.remove(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Company with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Company with id " + req.params.id
            });
          }
        } else res.send({ message: `Company was deleted successfully!` });
      });
};

// Delete all Companies from the database.
exports.deleteAll = (req, res) => {
    Company.removeAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all Companies."
          });
        else res.send({ message: `All Companies were deleted successfully!` });
      });
};