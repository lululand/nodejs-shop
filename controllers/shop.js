const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find() // doesn't give us a cursor, but all the products
    .then(products => {
      console.log(products);
      // products list array
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.isLoggedIn 
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId) // findById is definied by mongoose. we can pass a string and mg will auto convert it to an object id
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.isLoggedIn 
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      // products list array
      res.render('shop/index', {
        // render our page in then block
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.isLoggedIn 
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isAuthenticated: req.isLoggedIn 
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  // fetch the product we want to add
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product); // we added the addToCart method in our user model
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      console.log(user.cart.items);
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({  // initializing from model
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
      isAuthenticated: req.isLoggedIn 
    });
  })
  .catch(err => console.log(err));
};

// *****************************************
// ************** MongoDB ******************
// *****************************************

// exports.getProducts = (req, res, next) => {
//   Product.fetchAll()
//     .then((products) => {
//       // products list array
//       res.render("shop/product-list", {
//         prods: products,
//         pageTitle: "All Products",
//         path: "/products",
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// in the first method below, even though we're searching for one id, since it's a findAll method it returns an array, so we need [0]
// exports.getProduct = (req, res, next) => {
//   const prodId = req.params.productId;
// Product.findAll({ where: { id: prodId } })
//   .then((products) => {
//     res.render("shop/product-detail", {
//       product: products[0],
//       pageTitle: products[0].title,
//       path: "/products"
//     });
//   })
//   .catch(err => console.log(err));
//   Product.findById(prodId)
//     .then((product) => {
//       res.render("shop/product-detail", {
//         product: product,
//         pageTitle: product.title,
//         path: "/products",
//       });
//     })
//     .catch((err) => console.log(err));
// };

// exports.getIndex = (req, res, next) => {
//   Product.fetchAll()
//     .then((products) => {
//       // products list array
//       res.render("shop/index", {
//         // render our page in then block
//         prods: products,
//         pageTitle: "Shop",
//         path: "/",
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// exports.getCart = (req, res, next) => {
//   req.user
//     .getCart() // product references are included in the cart
//     .then((products) => {
//       res.render("shop/cart", {
//         path: "/cart",
//         pageTitle: "Your Cart",
//         products: products,
//       });
//     })
//     .catch((err) => console.log(err));
// };

// exports.postCartDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   req.user
//     .deleteItemFromCart(prodId)
//     .then((result) => {
//       res.redirect("/cart");
//     })
//     .catch((err) => console.log(err));
//   // Product.findById(prodId, (product) => {
//   //   Cart.deleteProduct(prodId, product.price);
//   //   res.redirect("/cart");
//   // });
// };
