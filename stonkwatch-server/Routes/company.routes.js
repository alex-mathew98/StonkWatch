module.exports = app => {
    const companies = require("../Controllers/company.controller.js");
  
    var router = require("express").Router();
  
    // Create a new company
    router.post("/", companies.create);
  
    // Retrieve all companies
    router.get("/", companies.findAll);

    // Checking if company is present in company table
    router.get("/check",companies.check);
  
    // Retrieve a single company with id
    router.get("/:id", companies.findOne);

    // Checking company id based on ticker
    router.get("/get-id/:ticker",companies.findID);
  
    // Update a company 
    router.put("/", companies.update);
  
    // Delete a company with id provided
    router.delete("/:id", companies.delete);
  
    // Delete all companies
    router.delete("/", companies.deleteAll);
  
    app.use('/api/company', router);
};