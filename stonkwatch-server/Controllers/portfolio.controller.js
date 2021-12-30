const UserPortfolio = require("../Models/portfolio.model.js");

// Create and Save a new entry to the portfolio
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a portfolio entry
  const portfolio_entry = new UserPortfolio({
    portfolio_entry: req.body.portfolio_entry,
    user_id: req.body.user_id,
    company_ticker: req.body.company_ticker,
    quantity: req.body.quantity,
    price_bought: req.body.price_bought
  });

  // Save portfolio entry in the database
  UserPortfolio.create(portfolio_entry, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the portfolio entry."
      });
    else res.send('Inserted entry successfully!');
  });
};

// Retrieve all entries from the database (with condition).
exports.findAll = (req, res) => {
    const portfolio_entry = req.query.portfolio_entry;
    console.log("Portfolio Entry:",portfolio_entry);
    UserPortfolio.getAll(portfolio_entry, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving portfolio entries."
        });
      else res.send(data);
    });
};

// Find a portfolio associated with a user id
exports.findOne = (req, res) => {
    UserPortfolio.findById(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found portfolio associated with user id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving portfolio associated with user id " + req.params.id
            });
          }
        } else res.send(data);
      });
};

// Check if company exists in the portfolio
exports.checkExisting = (req, res) => {
  const userID = req.params.id;
  const ticker = req.query.ticker;
  UserPortfolio.checkExisting(userID,ticker,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while checking the associations."
      });
    else res.send(data);
  });
};


// Update a portfolio entry based on the request sent
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const portfolio_entry = new UserPortfolio({
    portfolio_entry: req.body.portfolio_entry,
    user_id: req.body.user_id,
    company_ticker: req.body.company_ticker,
    quantity: req.body.quantity,
    price_bought: req.body.price_bought
  });

  UserPortfolio.updateUser(
    portfolio_entry,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found portfolio entry with id provided ${req.body.portfolio_entry}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating portfolio entry with id " + req.body.portfolio_entry
          });
        }
      } else res.send('Updated portfolio entry successfully!');
    }
  );
};

// Delete a portfolio entry with the specified id in the request
exports.delete = (req, res) => {
    UserPortfolio.remove(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found portfolio entry with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete portfolio entry with id " + req.params.id
            });
          }
        } else res.send({ message: `Portfolio entry was deleted successfully!` });
      });
};
