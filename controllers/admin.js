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
  const imageURL = req.body.imageURL;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageURL, description, price);
  product
    .save()
    .then(() => {
      res.redirect("/"); // only redirect once the insert completed
    })
    .catch((err) => console.log(err)); // added null with the change to the product model
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit; // query object created/managed  by express. edit is the key in the query param ?edit=true and if it is set in the req then we'll get the value, if not we'll get undefined which = false
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId; // we can retrieve this from the incoming request - it is set in the route admin.js
  Product.findById(prodId, (product) => {
    // we also have the cb where we recieve the product that was retrieved. we assume we get a product
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
  });
};

exports.postEditProduct = (req, res, next) => {
  // 1- fetch info for the product
  const prodId = req.body.productId; // we can access the productId from the edit-product page via the hidden input field that we named productId
  // 2- create a new product instance and populate it with that info
  const updatedTitle = req.body.title;
  const updatedImageURL = req.body.imageURL;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageURL,
    updatedPrice,
    updatedDescription
  );
  // 3- then call save()
  updatedProduct.save(); // we need to add a cb so that it only redirects after saving is done
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  // 1- fetch info for the product
  const prodId = req.body.productId; // we can access the productId from the edit-product page via the hidden input field that we named productId
  // 2- call the delete method?
  Product.deleteById(prodId); // we need to add a cb so that it only redirects after deleting is done
  res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows]) => {
      res.render("admin/products", {
        prods: rows,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};
