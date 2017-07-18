var passport = require('passport');
var User = require('../models/User');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local.signup', new LocalStrategy(
  {
    // nameField: 'name',
    // emailField: 'email',
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, 
  function(req, name, email, username, password, res) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min: 6});
    var errors = req.validationErrors();
    if (errors) {
      var messages = [];
      errors.forEach(function(error, res) {
        messages.push(error.msg);
      });
      res.send(req.flash('error', messages));
    }
    User.findOne({'email': email }, function(req, err, user, res) {
      if (err) {
        return (err);
      }
      else if (user) {
        return ({message: 'Email is already in use.'});
      }
      var newUser = new User();
      // newUser.name = name;
      // newUser.username = username;
      newUser.email = email;
      newUser.password = newUser.encryptPassword(password);
      newUser.save(function(err, res) {
        if (err) {
          res.send(err);
        }
        res.send(newUser);
      });
    });
  }
));

passport.use('local.signin', new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validateErrors();
    if (errors) {
      var messages = [];
      error.forEach(function(error) {
        messages.push(error.msg);
      });
      return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {message: 'User not found.'});
      }
      if (!user.validPassword(password)) {
        return done(null, false, {message: 'Incorrect password.'});
      }
      return done(null, user);
    });
  }
));