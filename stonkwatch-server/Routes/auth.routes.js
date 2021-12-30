module.exports = app => {
    const Auth = require("../Controllers/auth.controller");
  
    var router = require("express").Router();
  
    // Register a new User
    router.post("/register", Auth.register);
  
    // Sign-In for a user
    router.post("/login", Auth.login);

    // Sign-Out for a user
    router.get("/logout", Auth.logout);
  
    app.use('/api/authentication', router);
};