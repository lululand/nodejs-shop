const path = require('path'); // path is a core js module

const express = require('express');

const rootDir = require('../util/path'); // to replace __dirname to start the filepaths - constructing a path to out root directory

const router = express.Router();

router.get('/add-product', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
}); // had to update action with the /admin because of the filtering in app.js

router.post('/add-product', (req, res, next) => {
  console.log(req.body); // by default body doesn't parse
  res.redirect('/');
});

module.exports = router; // this exports it so we can import in app.js