// packages
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var secrets = require('./secrets');
var port = 9001;
var app = express();

app.use(bodyParser.json());
app.use(session({
  secret: secrets.session,
  resave: false,
  saveUnitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new FacebookStrategy({
  clientID: secrets.fb.clientID,
  clientSecret: secrets.fb.clientSecret,
  callbackURL: 'http://localhost:' + port + '/api/auth/facebook/callback'
}, function (accessToken, refreshToken, profile, done) {
  done(null, profile);
}));

passport.serializeUser(function (user, done) {
  console.log('the user being serialized ', user);
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  console.log('the obj being deserialized is ', obj);
  done(null, obj);

});

app.get('/api/auth/facebook', passport.authenticate('facebook'));

app.get('/api/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/api/profile/',
  failureRedirect: '/api/auth/facebook'
}));

app.get('/api/profile', function (req, res) {
  console.log(req);
  if (!req.isAuthenticated()) {
    res.status(401).send('nope');
  } else {
    res.status(200).send(req.user);
  }
});

app.listen(port, function (err) {
  if (!err) {
    console.log('server up on ' + port);
  }
});