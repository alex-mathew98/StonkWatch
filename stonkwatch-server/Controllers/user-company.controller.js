const UserCompany = require("../Models/user-company.model.js");

// Create and Save a new UserCompany Associatio
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a UserCompany Association
  const userCompanyAssociation = new UserCompany({
    user_company_id: req.body.user_company_id,
    user_id: req.body.user_id,
    company_id: req.body.company_id
  });

  // Save Association in the database
  UserCompany.create(userCompanyAssociation, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Association."
      });
    else res.send('Inserted Association successfully!');
  });
};

// Retrieve all UserCompany Associations from the database (with condition).
exports.findAll = (req, res) => {
    const userID = req.query.userID;
    console.log("Query userID:",userID);
    UserCompany.getAll(userID, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving associations."
        });
      else res.send(data);
    });
};

// Find a single Association with a id provided
exports.findOne = (req, res) => {
    UserCompany.findById(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Association with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Association with id " + req.params.id
            });
          }
        } else res.send(data);
      });
};

// Check if company exists in the watchlist
exports.checkWatchList = (req, res) => {
    const userID = req.params.id;
    const companyID = req.query.companyID;
    UserCompany.checkWatchlist(userID,companyID,(err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while checking the associations."
        });
      else res.send(data);
    });
};

// Retrieve all the companies followed by the user from the company table
exports.retrieveCompanies = (req, res) => {
    UserCompany.getCompaniesFollowed(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found companies followed by user with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving companies followed by user with id " + req.params.id
            });
          }
        } else res.send(data);
      });
};

// Delete a Association with the specified id in the request
exports.delete = (req, res) => {
    UserCompany.remove(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Association with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Association with id " + req.params.id
            });
          }
        } else res.send({ message: `Association was deleted successfully!` });
      });
};
