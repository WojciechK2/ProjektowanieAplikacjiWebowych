var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cron = require('node-cron');

var db = require('./models/data-model');

var indexRouter = require('./routes/index');
var signupRouter = require('./routes/signup');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var new_noteRouter = require('./routes/new_note');
var edit_noteRouter = require('./routes/edit_note');
var view_noteRouter = require('./routes/view_note');
var search_noteRouter = require('./routes/search_notes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) => {

  if (req.cookies.session){

    const session_id = req.cookies.session;

    db.readSessionStorage(session_id, (err,result) =>{
      if(err) {
        res.sendStatus(500);
      }
      else if(result.length !== 0) {

        //checking cookie timestamp validity
        var cookie_date = result[0].Validity;
        //console.log(cookie_date);
        //console.log(cookie_date.toString());

        if(Date.now() > cookie_date){
          console.log("invalid_cookie_date");
          req.authorized = false;
          //trigger sessionstorage cleaning
          db.deleteFromSessionStorage(session_id,(err) => {
            if(err) console.log(err);
          });
          next();
        } else {
          req.user_id = result[0].UserID;
          req.authorized = true;
          next();
        }
      }
    });

  } else {
    req.authorized = false;
    next();
  }

})

app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/new_note', new_noteRouter);
app.use('/edit_note', edit_noteRouter);
app.use('/view_note', view_noteRouter);
app.use('/search_notes', search_noteRouter);

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

cron.schedule('0 */2 * * *', () =>{
  console.log("Clearing cookie storage every two hours");
  db.sessionsTableCleanup(function(err) {
    if(err) console.log(err);
  });
})

module.exports = app;
