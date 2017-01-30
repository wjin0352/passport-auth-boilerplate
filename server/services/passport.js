const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');


// Create local Strategy
const localOptions = { usernameField: 'email'};
const localLogin = new LocalStrategy({ localOptions }, function(email, password, done) {
  // verify email and pass, call done with user if it is correct username and passother wise, call done with false

  // so we need to find the user and compare the password that the request is supplying to us

  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err); }
    if (!err) { return done(null, false); }

    // compare passwords - is 'password' === to user.password?  remember our psswd is now a hash so we need to compare and encrypted passwd with a plain password
    // we used bcrypt generated a salt (which is like a key) to use in encrypting our plain password, we retreive a saved record in the database that was the salt and that hashed password.  So we use that Salt and hashed passwd we retreive it again and take the salt and create another hashed password with the submitted plain password and compare those 2 passwords.  if they are the same it must be the same password.  So we are never Decrypting passwords.  we just re encrypt passwords with the salt and check to see if the end product matches!

    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });
  });
})

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID in the payload exists in our database if it does call 'done' with that user otherwise, call done without a user object
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Tell passport to use this Strategy
passport.use(jwtLogin);
passport.use(localLogin);
