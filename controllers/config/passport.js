var passport = require('passport');
var User = require('../../models/User');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Passport strategy allowing a new user to sign up
passport.use('local-signup', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, 
  function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({'email': email}, function(err, user) {
        if (err) {
          return done(err);
        }
        else if (user) {
          console.log("The email address is already in use.");
          return done(null, false, req.flash('signupMessage', 'The email address is already in use.'));
        }
        else {
          var newUser = new User();
          newUser.email = email;
          newUser.password = newUser.encryptPassword(password);
          newUser.save(function(err) {
            if (err) {
              throw err;
            }
            return done(null, newUser, req.flash('userMessage', 'Success!'));
          });
        }
      });
    });
  }
));

// Passport local strategy for an existing user to log in
passport.use('local-login', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    User.findOne({'email': email}, function(err, user) {
      if (err) {
        return done(err);
      }
      else if (!user) {
        return done(null, false, req.flash('loginMessage', 'User not found. Please enter a valid email address.'));
      }
      else if (!user.validPassword(password)) {
        return done(null, false, req.flash('loginMessage', 'Incorrect password. Please try again.'));
      }
      return done(null, user, req.flash('userMessage', 'Success!'));
    });
  }
));
