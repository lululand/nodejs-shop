const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data', 
  'products.json'
  );

const getProductsFromFile = cb => { // helper function which recieves a callback which it executes once it's done reading the file. 
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
    cb(JSON.parse(fileContent));
    }
  });
}

// a function to look through the array and find the product to edit? 


module.exports = class Products {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    }); 
  }

  // edit() {

  // }

  static fetchAll(cb) {
   getProductsFromFile(cb);
  }
};