const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const errorController = require('./controllers/404');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views'); // this is the default, so you only need to include this if you have your views in a different dir

const adminRoutes = require('./routes/admin'); // imports the admin.js, adminRoutes is a valid middleware function. incoming requests are funneled through middleware
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// registering middleware
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false})); // saveUninitialized ensures a session isn't saved where it doesn't need to be. you can also configure the cookie, we're going with the default settings

app.use((req, res, next) => {
  User.findById('5ea9e95e60aab73e749f8171')
    .then(user => {
      req.user = user; // this is a full mg model so we can call all the mg methods on it
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://kirsten:rs9w8dh9vB1Cd3Nw@cluster0-zvwh9.mongodb.net/shop?retryWrites=true'
  )
  .then(result => {
    User.findOne().then(user => {
      // findOne w/ no args gets 1st user it finds
      if (!user) {
        const user = new User({
          // create a user before we start listening
          name: 'kirsten',
          email: 'kirsten@kl.com',
          cart: {
            items: []
          }
        });
      }
      user.save();
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

// *******************************************
// **************** MongoDb ******************
// const mongoConnect = require("./util/database").mongoConnect;

// mongoConnect(() => {
//   useUnifiedTopology: true,
//   app.listen(3000);
// });

// app.use((req, res, next) => {
//   User.findById("5ea9e838a034a871e000f15b")
//     .then((user) => {
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       next();
//     })
//     .catch((err) => console.log(err));
// });

// *******************************************
// **************** Sequelize ******************

// const sequelize = require("./util/database");
// const Product = require("./models/product");
// const User = require("./models/user");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");
// const Order = require("./models/order");
// const OrderItem = require("./models/order-item");

// app.use((req, res, next) => {
//   // ** an incoming request will execute this funciton. npm start never runs this - it registers it for incoming requests. this will only be reached if the server is started successfully down in sequelize below
//   User.findByPk(1)
//     .then((user) => {
//       req.user = user; // ** we can add a new field to our request object, we should just make sure we don't override an existing one like body. user is undefined by default, now we're storing the user retrieved from the db there. the user from the db is not just a JS obj with the values from the db, it's a sequelize obj with the values from the db with sqlz's added utiliy methods (like destroy), so whenever we call req.user in our app we can use those methods
//       next();
//     })
//     .catch((err) => console.log(err));
// });

// Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" }); // user-created product. cascade is if any user is deleted other data associated will be deleted
// User.hasMany(Product);
// User.hasOne(Cart); // this will add a key/new field to the cart - the userId
// Cart.belongsTo(User); // inverse of above - optional, one direction is enough
// Cart.belongsToMany(Product, { through: CartItem }); // many-to-many. through tells sqlz the intermediate table where these connections should be stored
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order); // 1-to-many
// Order.belongsToMany(Product, { through: OrderItem }); // in-btwn table

// sequelize // npm start runs sequelize, not incoming requests
//   // .sync({ force: true })
//   .sync()
//   .then((result) => {
//     return User.findByPk(1); // we're manually creating this for interim use
//     // console.log(result);
//     // app.listen(3000);
//   })
//   .then((user) => {
//     if (!user) {
//       return User.create({ name: "max", email: "max@max.com" });
//     }
//     return user; // if you return a value in a then block it's automatically wrapped in a promise
//   })
//   .then((user) => {
//     user.createCart();
//   })
//   .then((cart) => {
//     app.listen(3000);
//   })
//   .catch((err) => {
//     console.log(err);
//   }); // looks at models we defined, then creates tables for them
