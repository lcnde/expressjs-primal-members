exports.home = function (req, res) {
  res.render('home', 
    { 
      title: 'Primal', 
      stylesheetName: 'home.css' 
    });
};

exports.talkBoard_get = function (req, res) {
  res.render('talk-board',
  {
    title: 'talkboard',
    stylesheetName: 'index.css'
  });
};

exports.shop = function (req, res) {
  res.render('shop', 
  { 
    title: 'shop', 
    stylesheetName: 'index.css' 
  });
};


exports.membership = function (req, res) {
  res.render('membership', 
  { 
    title: 'membership', 
    stylesheetName: 'index.css' 
  });
};

exports.cart = function (req, res) {
  res.render('cart', 
  { 
    title: 'Cart', 
    stylesheetName: 'index.css' 
  });
};
