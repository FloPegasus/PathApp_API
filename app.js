var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
let cors = require('cors');
let bodyParser = require('body-parser')

var authRouter = require('./routes/RouterAuth');
var usersRouter = require('./routes/UserRouter');
var characterRouter = require('./routes/CharacterRouter');

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


mongoose.Promise = Promise
mongoose.connect('mongodb://localhost:27017/PathMongo', {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.once('open', () => {
    console.log('connexion réussie à la base de donnée', db.client.s.url)
})

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/character', characterRouter);

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

app.listen(3000, 'localhost', () => {
  console.log('mon serveur est démaré sur le port 3000')
})

module.exports = app;
