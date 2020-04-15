const mysql = require('mysql2'); // importing the package and storing it 

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node-complete',
  password: 'n0d3m@xmy5q!'
});

module.exports = pool.promise();