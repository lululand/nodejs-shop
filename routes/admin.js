const path = require('path'); // path is a core js module

const express = require('express');

const rootDir = require('../util/path'); // to replace __dirname to start the filepaths - constructing a path to out root directory

const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
  res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product', formsCSS: true, productCSS: true, activeAddProduct: true });
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
}); // had to update action with the /admin because of the filtering in app.js

router.post('/add-product', (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect('/');
});


exports.routes = router;
exports.products = products;
// module.exports = router; 
// this exports it so we can import in app.js