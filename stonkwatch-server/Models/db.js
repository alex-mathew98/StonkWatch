const mysql = require("mysql");
const dbConfig = require("../Config/db.config.js");

// Create a connection pool to the database
const connection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  multipleStatements:true
});

// Open the MySQL connection
connection.getConnection(function(err, connection) {
  console.log("Successfully connected to the database.");
  if (err) throw err;
  connection.release();
});

module.exports = connection;