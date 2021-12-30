const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require("express-session");

const app = express();

var corsOptions = {
    origin: ["http://localhost:3000"],
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
      key: "COOKIE-userId",
      secret: "subscribe",
      resave: false,
      saveUninitialized: false,
      cookie:{
          expires: 60 * 60*24,
      },
}));

require("./Routes/user.routes.js")(app);
require("./Routes/company.routes.js")(app);
require("./Routes/user-company.routes.js")(app);
require("./Routes/portfolio.routes.js")(app);
require("./Routes/auth.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});