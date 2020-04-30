const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product", // making relations
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

// the mg methods key is an object that allows us to add our own methods
// with our own logic
userSchema.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString(); // if true product exists in cart
  });
  let newQuantity = 1; // if not in the cart we give it a default of 1
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) { // if item is already in cart, update qty
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({ // if item not there, add to the array w/ push
      productId: product._id, // mg will store in object id
      quantity: newQuantity // make sure key names match userSchema above
    }); 
  }
  const updatedCart = { // create object which holds items property array
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);




// *****************************************
// ************** MongoDB ******************
// *****************************************

// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;

// const ObjectId = mongodb.ObjectID;

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // the cart will be like { iems: [] }
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() === product._id.toString(); // if true we know the product already exists in the cart
//     });
//     let newQuantity = 1; // if not in the cart we give it a default of 1
//     // we don't want to update by always overwriting items with a new array with exactly one object, instead I want to add a new object to that array if the product isn't in the cart, or if it is, I want to update that one product. One approach is to create a new array where you copy in all the existing elements with the ... this gives us a new array with all the items in the cart, and now we can edit this array without affecting the old array
//     const updatedCartItems = [...this.cart.items];
//     if (cartProductIndex >= 0) {
//       // if the item is already in the cart, update the qty
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity,
//       }); // if the item was not there, add it to the array with push
//     }
//     const updatedCart = {
//       // create an object which holds items property array
//       items: updatedCartItems,
//     };
//     const db = getDb();
//     return db.collection("users").updateOne(
//       // update our user to add a product to the cart
//       { _id: new ObjectId(this._id) }, // find it
//       { $set: { cart: updatedCart } } // 'cart' which we expect to have in a user in the db will now receive updatedCart as a new object which will override the old one
//     );
//   }

//   getCart() {
//     // we're not reaching out to a cart collection bc there isn't one
//     // return a cart with all the product details
//     // return this.cart;
//     const db = getDb();
//     const productIds = this.cart.items.map((i) => {
//       // constructing an array to use in find() below. this.cart.items is an array of objects like in push() in addToCart() above. We map() it to transform the items we get back to just return the productIds as strings
//       return i.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } }) // mdb query syntax. find products where _id = an array of ids (created above). i.e. give me all elements where the id is in the productIds array.
//       .toArray() // We get a cursor w/ all matching products, so we convert toArray
//       .then((products) => {
//         // array of products returned from db. we want to add the qty back
//         return products.map((p) => {
//           // map takes a function which transforms every element in the array
//           return {
//             // returning a new object
//             ...p, // which has all the old product properties
//             quantity: this.cart.items.find((i) => {
//               // plus add a new qty prop
//               return i.productId.toString() === p._id.toString(); // to get the right qty we reach out to users cart items - find item with id = to the product just fetched from db
//             }).quantity, // from the cart items, extract the qty for that product
//           };
//         });
//       });
//   }

//   deleteItemFromCart(productId) {
//     //
//     const updatedCartItems = this.cart.items.filter((item) => {
//       return item.productId.toString() !== productId.toString(); // if doesn't equal item we're deleting, keep in new array
//     }); // js filter method, uses criteria on the items array, runs on every item, returns true if we want to keep, false to get rid of. we want to keep all items except the item we're deleting.
//     const updatedCart = {
//       // create an object which holds items property array
//       items: updatedCartItems,
//     };
//     const db = getDb();
//     return db.collection("users").updateOne(
//       // update our user to delete a product from the cart
//       { _id: new ObjectId(this._id) }, // find it
//       { $set: { cart: { items: updatedCartItems } } } // 'cart' which we expect to have in a user in the db will now receive updatedCartItems as a new object which will override the old one
//     );
//   }

//   addOrder() {
//     // doesn't take any args bc the cart is passed so is already registered for this user
//     const db = getDb(); // create a new collection
//     return this.getCart()  // calling method from above
//       .then((products) => {
//         const order = {
//           items: products, // prod info will also be part of the order and can be duplicated in the orders collection because it wouldn't need to be updated, it would serve as a snapshop in orders collection
//           user: {  // some user data, not all
//             _id: new ObjectId(this._id),
//             name: this.name, // this info will end up in both the orders and users collections, but it could be fine to only update it in the user collection
//           }
//         };
//         return db
//           .collection("orders") // could also add other fields like total value
//           .insertOne(order); // insert into the orders before clearing cart and db below
//       })
//       .then((result) => {
//         this.cart = { items: [] }; // after clicking order, returns cart to empty. clears user object
//         return db.collection("users").updateOne(
//           // update our user to delete a product from the cart
//           { _id: new ObjectId(this._id) }, // find it
//           { $set: { cart: { items: [] } } } // 'cart' which we expect to have in the db user will now receive updatedCartItems as a new object which will override the old one with empty array. clears it in the database in addition to user object above
//         );
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new ObjectId(this._id) })
//       .toArray(); // in mongodb you can check nested props by defining the path to them, this will look for _id in the user prop. this will give us all orders for that user
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new ObjectId(userId) })
//       .then((user) => {
//         console.log(user);
//         return user;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }

// module.exports = User;

// // ********************************************
// // ****************** with sequelize ************//
// // const Sequelize = require('sequelize').Sequelize;

// // const sequelize = require('../util/database');

// // const User = sequelize.define('user', {
// //   id: {
// //     type: Sequelize.INTEGER,
// //     autoIncrement: true,
// //     allowNull: false,
// //     primaryKey: true
// //   },
// //   name: Sequelize.STRING,
// //   email: Sequelize.STRING
// // });
