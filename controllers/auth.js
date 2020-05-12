exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req
  //   .get('Cookie')
  //   .split(';')[1]
  //   .trim()
  //   .split('=')[1];
  // console.log(req.session);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  // res.setHeader('Set-Cookie', 'loggedIn=true'); // Set-Cookie is a reserved name. the browser sends this data to the server with every req. other settings include Expires, Max-Age, Domain, Secure, HttpOnly  
  res.redirect('/');
};
