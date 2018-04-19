var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var flash = require('connect-flash');
var passport = require("passport");

//Routers imports for endpoints
var index = require("./routes/index");
var dashboard = require("./routes/dashboard");
var login = require("./routes/login");
var logout = require('./routes/logout');

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, "public", "images", "favicon.png")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(flash());

//express-session middleware
app.use(
  session({
    secret: "Iambanana", // session secret
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false /*Use 'true' without setting up HTTPS will result in redirect errors*/,
      maxAge: 24 * 60 * 60 * 1000 //1 day
    }
  })
);

//PassportJS middleware
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions

require('./config/passport/index')(passport);

app.use("/", index);
app.use("/dashboard", dashboard);
app.use("/login", login);
app.use("/logout", logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");

  next();
});
// abc

module.exports = app;
