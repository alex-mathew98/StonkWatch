module.exports = app => {
    const watchlistEntries = require("../Controllers/user-company.controller.js");
  
    var router = require("express").Router();
  
    // Create a new User
    router.post("/", watchlistEntries.create);
  
    // Retrieve all Users
    router.get("/", watchlistEntries.findAll);
  
    // Retrieve associations with id
    router.get("/:id", watchlistEntries.findOne);
  
    // Check watchlist for existing entries
    router.get("/check/:id", watchlistEntries.checkWatchList);

    // Retrieve company details followed by user with id
    router.get("/following/:id", watchlistEntries.retrieveCompanies);

    // Delete a watchlist entry with id
    router.delete("/:id", watchlistEntries.delete);

    app.use('/api/watchlist', router);
};