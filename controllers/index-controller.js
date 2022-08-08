exports.index = function (req, res) {
  res.render('index', 
    { 
      title: 'Primal', 
      stylesheetName: 'index.css' 
    });
};
