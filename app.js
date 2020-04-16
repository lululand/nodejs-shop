const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/404");
const sequelize = require("./util/database");

const Product = require("./models/product");
const User = require("./models/user");
// const Cart = require('./models/cart');

const app = express();

app.set("view engine", "ejs");
app.set("views", "views"); // this is the default, so you only need to include this if you have your views in a different dir

const adminRoutes = require("./routes/admin"); // imports the admin.js, adminRoutes is a valid middleware function. incoming requests are funneled through middleware
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false })); // registers a middleware
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // an incoming request will execute this funciton. npm start never runs this - it registers it for incoming requests. this will only be reached if the server is started successfully down in sequelize below
  User.findByPk(1)
    .then((user) => {
      req.user = user; // we can add a new field to our request object, we should just make sure we don't override an existing one like body. user is undefined by default, now we're storing the user retrieved from the db there. the user from the db is not just a JS obj with the values from the db, it's a sequelize obj with the values from the db with sqlz's added utiliy methods (like destroy), so whenever we call req.user in our app we can use those methods
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" }); // user-created product. cascade is if any user is deleted other data associated will be deleted
User.hasMany(Product);

sequelize // npm start runs sequelize, not incoming requests
  //.sync({ force: true }) // force overwriting wouldn't be used in production
  .sync()
  .then(result => {
    return User.findByPk(1); // we're manually creating this for interim use
    // console.log(result);
    // app.listen(3000);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "max", email: "max@max.com" });
    }
    return user; // if you return a value in a then block it's automatically wrapped in a promise 
  })
  .then(user => {
    // console.log(user);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  }); // looks at models we defined, then creates tables for them
