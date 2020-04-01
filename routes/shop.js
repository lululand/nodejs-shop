const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  const products = adminData.products;
  res.render('shop', { 
    prods: products, 
    pageTitle: 'Shop', 
    path: '/', 
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true 
  }); // must do it this way in hbs
  // res.render('shop', {prods: products, pageTitle: 'Shop', path: '/'});  // <-- can do it this way with pug
  // don't need .pug since we defined pug as the engine. this also allows us to pass in data that should be rendered in our view. 
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
}); 

module.exports = router;