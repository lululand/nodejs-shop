const Sequelize = require("sequelize").Sequelize; // importing a constructor function/class

const sequelize = new Sequelize("node-complete", "root", "n0d3m@xmy5q!", {
  dialect: "mysql",
  host: "localhost",
}); // creating new instance, connecting it to our schema name.

module.exports = sequelize; // this object will automatically connect to the database - set up a connection pool. and has a lot of other features

// **************************************************
// ********** below was connecting w/o sequelize
// **************************************************
// const mysql = require('mysql2'); // importing the package and storing it

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'node-complete',
//   password: 'n0d3m@xmy5q!'
// });

// module.exports = pool.promise();
