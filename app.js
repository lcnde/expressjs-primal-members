var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const checkUtils = require('./config/check-utils');

const User = require('./models/user')

// configure dotenv to use database secrets
require('dotenv').config();

// connect to database
const mongoose = require('mongoose');
const mongoDb = `mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.omje9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoDb, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error.'));

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'cats', // you usually want to store the secret inside an env variable so you dont expose it to the public
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: mongoDb,
    collectionName: 'sessions',
  }),
  cookie: {
    // thanks to maxAge I'm pretty sure that MongoDB is deleting expired sessions from the database
    maxAge: 1000 * 60 * 60 * 24, // equals 1 day = 1000 ms / 1 sec * 60 sec / 1min * 60 min / 1 hour * 24 hours / 1 day
  },
}));

// add the passport configuration (should be added before the line that initializes passport)
require('./config/passport');

// this "refreshes" passportjs middleware every single time we load a route.
app.use(passport.initialize());
app.use(passport.session());

/* In express, you can set and access various local variables throughout your entire app (even in views) with the locals object. We can use this knowledge to write ourselves a custom middleware that will simplify how we access our current user in our views.
Middleware functions are simply functions that take the req and res objects, manipulate them, and pass them on through the rest of the app. 
If you insert this code somewhere between where you instantiate the passport middleware and before you render your views, you will have access to the currentUser variable in all of your views, and you won’t have to manually pass it into all of the controllers in which you need it.*/
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// middleware that provides a function to use inside our templates that will help with checking user authentication parameters
app.use(function(req, res, next) {
  // pass the user only for debugging
  // res.locals.currentUser ={
  //   username: 'Adam Monke',
  //   password: 'legit-member123',
  //   is_member: true,
  //   is_admin: true,
  // };
  // utility functions (check README to see what they do)
  let checkMember = checkUtils.isMember(res.locals);
  res.locals.checkMember = checkMember;
  let checkAdmin = checkUtils.isAdmin(res.locals);
  res.locals.checkAdmin = checkAdmin;
  next();
});

// middleware used only for debugging
app.use((req, res, next) => {
  // console.log('session', req.session);
  // console.log('user', req.user);
  // console.log('sessionID:', req.sessionID);
  next();
})

app.use('/', indexRouter);
app.use('/', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
