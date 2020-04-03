const path = require('path'); // path is a core js module

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
// this is telling express - when a req reaches the add-product route it should execute getAddProduct. which is why it doesn't have the function parens() it doesn't execute it, it just passes a reference to it
router.get('/add-product', adminController.getAddProduct); 
// admin/products
router.get('/products', adminController.getProducts); 

router.post('/add-product', adminController.postAddProduct);

module.exports = router;
