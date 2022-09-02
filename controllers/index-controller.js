exports.home = function (req, res) {
  res.render('home', 
    { 
      title: 'Primal'
    });
};


exports.shop = function (req, res) {
  res.render('shop', 
  { 
    title: 'shop'
  });
};


exports.membership = function (req, res) {
  res.render('membership', 
  { 
    title: 'membership'
  });
};

exports.cart = function (req, res) {
  res.render('cart', 
  { 
    title: 'Cart'
  });
};
