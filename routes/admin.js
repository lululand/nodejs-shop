const path = require('path'); // path is a core js module

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
// this is telling express - when a req reaches the add-product route it should execute getAddProduct. which is why it doesn't have the function parens() it doesn't execute it, it just passes a reference to it
router.get('/add-product', adminController.getAddProduct); 

// admin/products => GET
router.get('/products', adminController.getProducts); 

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct); // dynamic path segment indicated with a :

router.post('/edit-product', adminController.postEditProduct); 

router.post('/delete-product', adminController.postDeleteProduct); 

module.exports = router;
