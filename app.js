const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs'); 

// app.set('view engine', 'pug'); // express allows us to use templating engines. trying to add pug to node by itself would be more complicated
app.set('views', 'views'); // if you have your views in a different dir you indicate it here

const adminData = require('./routes/admin'); // imports the admin.js, adminRoutes is a valid middleware function
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false})); // registers a middleware
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes); 
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render('404', {pageTitle: 'Page Not Found'});
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});
 
app.listen(3000);