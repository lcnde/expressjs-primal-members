exports.home = function (req, res) {
  res.render('home', 
    { 
      title: 'Primal', 
      stylesheetName: 'home.css' 
    });
};


exports.shop = function (req, res) {
  res.render('shop', 
  { 
    title: 'shop', 
    stylesheetName: 'shop.css' 
  });
};


exports.membership = function (req, res) {
  res.render('membership', 
  { 
    title: 'membership', 
    stylesheetName: 'membership.css' 
  });
};

exports.cart = function (req, res) {
  res.render('cart', 
  { 
    title: 'Cart', 
    stylesheetName: 'index.css' 
  });
};
