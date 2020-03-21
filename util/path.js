const path = require('path');

module.exports = path.dirname(process.mainModule.filename); 
// helps construct path to parent dir. dirname returns the directory name of a path
// process is a global variable, and a main module property which refers to app.js, - essentially process.mainModule.filename gives us the path to the file that's responsible for the app running 