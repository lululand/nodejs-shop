const mongodb = require("mongodb"); // gives access to the package
const MongoClient = mongodb.MongoClient; // creating the client

let _db; // underscore signals we'll only use this internally in this file

const mongoConnect = (callback) => {
  // creating a method const so we can use this in app.js
  MongoClient.connect(
    "mongodb+srv://kirsten:rs9w8dh9vB1Cd3Nw@cluster0-zvwh9.mongodb.net/shop?retryWrites=true&w=majority"
  ) // all we need to connect
    .then((client) => {
      // client object which gives us access to the db
      console.log("Connected!");
      _db = client.db(); // storing db connection to variable
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if(_db) {
    return _db;
  }
  throw 'No database found!';
}

// eporting 2 methods - one for storing the connection to the db and therefore it will keep running, one where we return access to that connected db if it exists
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

// **************************************************
// ********** connecting WITH sequelize
// **************************************************
// const Sequelize = require("sequelize").Sequelize; // importing a constructor function/class

// const sequelize = new Sequelize("node-complete", "root", "n0d3m@xmy5q!", {
//   dialect: "mysql",
//   host: "localhost",
// }); // creating new instance, connecting it to our schema name.

// module.exports = sequelize; // this object will automatically connect to the database - set up a connection pool. and has a lot of other features

// **************************************************
// ********** connecting w/o sequelize
// **************************************************
// const mysql = require('mysql2'); // importing the package and storing it

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'node-complete',
//   password: 'n0d3m@xmy5q!'
// });

// module.exports = pool.promise();
