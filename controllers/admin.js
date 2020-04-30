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
  const product = new Product({
    title: title, // left side is keys we defined in our schema, right side is data we receive in controller action above
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user._id // access the user id and assign it here
  });
  product
    .save() // mongoose provides save method
    .then((result) => {  // mongoose also gives us a then method
      // console.log(result);
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {  // ditto catch
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit; // query object managed by express. edit is the key in the query param ?edit=true and if set in the req then we'll get the value, if not we'll get undefined which = false
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId; // we can retrieve this from the incoming request - it is set in the route admin.js
  Product.findById(prodId)
    // Product.findById(prodId)
    .then((product) => {
      if (!product) {
        // if it's undefined then return redirect
        return res.redirect("/"); // normally better to show an error
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode, // now we only enter edit mode if this is set as true and can use 'editing' key in our template
        product: product, // passing our product on a 'product' key, can use in template to pre-populate the page fields
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId; // we can access the productId from the edit-product page via the hidden input field that we named productId
  // 2- create a new product instance and populate it with that info
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;

  Product.findById(prodId)
    .then((product) => {
      // gives us a full mg object
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageUrl;
      return product.save(); // if it exists changes will be saved, so auto update it
    })
    .then((result) => {
      console.log("updated product");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err)); // catches errors for both .thens
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId; // we can access the productId from the edit-product page via the hidden input field that we named productId
  Product.findByIdAndRemove(prodId) // mg method
    .then(() => {
      console.log("destroyed product");
      res.redirect("/admin/products");
    }) // this will execute once the destroy succeeded
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    // .select("title price -_id")
    // .populate("userId", "name") // tells mongoose to populate a field with all the info and not just the id 
    .then((products) => {
      // console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

// *****************************************
// ************** MongoDB ******************
// *****************************************
// const mongodb = require("mongodb");
// const ObjectId = mongodb.ObjectID;

// exports.postAddProduct = (req, res, next) => {
//   const title = req.body.title;
//   const imageUrl = req.body.imageUrl;
//   const price = req.body.price;
//   const description = req.body.description;
//   const product = new Product(
//     title,
//     price,
//     description,
//     imageUrl,
//     null, // we don't have the id when creating a new product
//     req.user._id // string of id of user which we store in our request via middleware - put there so we can extract the user in one central place. later we'll update this
//   );
//   product
//     .save()
//     .then((result) => {
//       // console.log(result);
//       console.log("Created Product");
//       res.redirect("/admin/products");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// exports.postEditProduct = (req, res, next) => {
//   const prodId = req.body.productId; // we can access the productId from the edit-product page via the hidden input field that we named productId
//   // 2- create a new product instance and populate it with that info
//   const updatedTitle = req.body.title;
//   const updatedPrice = req.body.price;
//   const updatedimageUrl = req.body.imageUrl;
//   const updatedDescription = req.body.description;

//   const product = new Product(
//     updatedTitle,
//     updatedPrice,
//     updatedDescription,
//     updatedimageUrl,
//     new ObjectId(prodId)
//   );
//   product
//     .save() // can use here bc we modified the method for both creating/updating
//     .then((result) => {
//       console.log("updated product");
//       res.redirect("/admin/products");
//     })
//     .catch((err) => console.log(err)); // catches errors for both .thens
// };

// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId; // we can access the productId from the edit-product page via the hidden input field that we named productId
//   Product.deleteById(prodId)
//     .then(() => {
//       console.log("destroyed product");
//       res.redirect("/admin/products");
//     }) // this will execute once the destroy succeeded
//     .catch((err) => console.log(err));
// };



// *****************************************
//  ********** with sequelize **************
// *****************************************
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
