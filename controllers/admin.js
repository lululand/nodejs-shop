const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product", // can use 'path' for changing nav page to active class
    editing: false, // added this since we have if/else in template
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, price, description, imageUrl);
  product
    .save()
    .then((result) => {
      // console.log(result);
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit; // query object managed by express. edit is the key in the query param ?edit=true and if set in the req then we'll get the value, if not we'll get undefined which = false
//   if (!editMode) {
//     return res.redirect("/");
//   }
//   const prodId = req.params.productId; // we can retrieve this from the incoming request - it is set in the route admin.js
//   req.user
//     .getProducts({ where: { id: prodId } })
//     // Product.findByPk(prodId)
//     .then((products) => {
//       const product = products[0]; // it returns array, so need to specify
//       if (!product) {
//         // if it's undefined then return redirect
//         return res.redirect("/"); // normally better to show an error
//       }
//       res.render("admin/edit-product", {
//         pageTitle: "Edit Product",
//         path: "/admin/edit-product",
//         editing: editMode, // now we only enter edit mode if this is set as true and can use 'editing' key in our template
//         product: product, // passing our product on a 'product' key, can use in template to pre-populate the page fields
//       });
//     })
//     .catch((err) => console.log(err));
// };

// exports.postEditProduct = (req, res, next) => {
//   const prodId = req.body.productId; // we can access the productId from the edit-product page via the hidden input field that we named productId
//   // 2- create a new product instance and populate it with that info
//   const updatedTitle = req.body.title;
//   const updatedimageUrl = req.body.imageUrl;
//   const updatedPrice = req.body.price;
//   const updatedDescription = req.body.description;
//   Product.findByPk(prodId)
//     .then((product) => {
//       product.title = updatedTitle;
//       product.price = updatedPrice;
//       product.description = updatedDescription;
//       product.imageUrl = updatedimageUrl;
//       return product.save(); // another method provided by sqlz.
//     })
//     .then((result) => {
//       console.log("updated product");
//       res.redirect("/admin/products");
//     })
//     .catch((err) => console.log(err)); // catches errors for both .thens
// };

// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId; // we can access the productId from the edit-product page via the hidden input field that we named productId
//   Product.findByPk(prodId)
//     .then((product) => {
//       return product.destroy(); // adding return will also yield a promise
//     })
//     .then((result) => {
//       console.log("destroyed product");
//       res.redirect("/admin/products");
//     }) // this will execute once the destroy succeeded
//     .catch((err) => console.log(err));
// };

// exports.getProducts = (req, res, next) => {
//   req.user
//     .getProducts() // will give us all products for this user
//     .then((products) => {
//       res.render("admin/products", {
//         prods: products,
//         pageTitle: "Admin Products",
//         path: "/admin/products",
//       });
//     })
//     .catch((err) => console.log(err));
// };





// *****************************************
//  ********** with sequelize **************
// exports.postAddProduct = (req, res, next) => {
//   const title = req.body.title;
//   const imageUrl = req.body.imageUrl;
//   const price = req.body.price;
//   const description = req.body.description;
//   req.user // this will automatically create a connected model
//     .createProduct({
//       // sqlz method automatically added because of Product.belongsTo
//       title: title, // attribute definied in the model: const
//       price: price,
//       imageUrl: imageUrl,
//       description: description,
//       // userId: req.user.id   // the sqlz user obj which has the db data + sqlz helper methods. so this should create new prodcts with that user being associated
//     })
//     .then((result) => {
//       // console.log(result);
//       console.log("Created Product");
//       res.redirect("/admin/products");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };


// exports.postAddProduct = (req, res, next) => {
//   const title = req.body.title;
//   const imageUrl = req.body.imageUrl;
//   const price = req.body.price;
//   const description = req.body.description;
//   req.user // this will automatically create a connected model
//     .createProduct({
//       // sqlz method automatically added because of Product.belongsTo
//       title: title, // attribute definied in the model: const
//       price: price,
//       imageUrl: imageUrl,
//       description: description,
//       // userId: req.user.id   // the sqlz user obj which has the db data + sqlz helper methods. so this should create new prodcts with that user being associated
//     })
//     .then((result) => {
//       // console.log(result);
//       console.log("Created Product");
//       res.redirect("/admin/products");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
