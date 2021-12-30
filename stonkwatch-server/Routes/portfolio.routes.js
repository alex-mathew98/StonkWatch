module.exports = app => {
    const user_portfolio = require("../Controllers/portfolio.controller.js");
  
    var router = require("express").Router();
  
    // Create a new portfolio entry
    router.post("/", user_portfolio.create);
  
    // Retrieve all portfolio entries in the database
    router.get("/", user_portfolio.findAll);
  
    // Retrieve a user's portfolio based on the user id
    router.get("/:id", user_portfolio.findOne);

    // Check if ticker exists in the portfolio
    router.get("/check/:id", user_portfolio.checkExisting);

    // Update an existing portfolio entry 
    router.put("/", user_portfolio.update);
  
    // Delete a portfolio entry with id
    router.delete("/:id", user_portfolio.delete);
  
    app.use('/api/user-portfolio', router);
};