module.exports = app => {
    const users = require("../Controllers/user.controller.js");
  
    var router = require("express").Router();
  
    // Create a new User
    router.post("/", users.create);
  
    // Retrieve all Users
    router.get("/", users.findAll);

    // Checking if user exists
    router.get("/check/:emailID",users.check);
  
    // Retrieve a single user with id
    router.get("/:id", users.findOne);
  
    // Update a user 
    router.put("/", users.update);
  
    // Delete a user with id
    router.delete("/:id", users.delete);
  
    // Delete all users
    router.delete("/", users.deleteAll);
  
    app.use('/api/users', router);
};