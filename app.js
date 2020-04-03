const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/404');

const app = express();

app.set('view engine', 'ejs'); 

// app.set('view engine', 'pug'); // express allows us to use templating engines. trying to add pug to node by itself would be more complicated
app.set('views', 'views'); // this is the default, so you only need to include this if you have your views in a different dir 

const adminRoutes = require('./routes/admin'); // imports the admin.js, adminRoutes is a valid middleware function
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false})); // registers a middleware
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes); 
app.use(shopRoutes);

app.use(errorController.get404);
 
app.listen(3000);