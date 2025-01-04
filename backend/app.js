// .env
require('dotenv').config();

// Initialize mongo connection - close application if no connection string specified
if (!require('./controllers/mongo.controller').mongo()) process.exit(1);

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);

const indexRouter = require('./routes/index.route');
const usersRouter = require('./routes/users.route');
const authRouter = require('./routes/auth.route');
const noteRouter = require('./routes/note.route');
const userRouter = require('./routes/user.route');
const sphereRouter = require('./routes/sphere.route');

const app = express();
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
}));
const passport = require('passport');
// Initialize passport
app.use(passport.initialize());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sphere', sphereRouter);
app.use('/auth', authRouter);
app.use('/note', noteRouter);
app.use('/user', userRouter);
app.use('/sphere', sphereRouter);

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


// const {Firestore} = require('@google-cloud/firestore');
//
// // Create a new client
// const firestore = new Firestore();
//
// async function quickstart() {
//   // Obtain a document reference.
//   const document = firestore.doc('posts/intro-to-firestore');
//
//   // Enter new data into the document.
//   await document.set({
//     title: 'Welcome to Firestore',
//     body: 'Hello World',
//   });
//   console.log('Entered new data into the document');
//
//   // Update an existing document.
//   await document.update({
//     body: 'My first Firestore app',
//   });
//   console.log('Updated an existing document');
//
//   // Read the document.
//   const doc = await document.get();
//   console.log('Read the document');
//
//   // Delete the document.
//   // await document.delete();
//   // console.log('Deleted the document');
// }
// quickstart();
