const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
  // json web tokens have a "sub" property short for subject. who does it belong too, we will say its belongs to a user go to jwt.io for deeper information on authentication using tokens
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  // User has already had email n passwd auth'd
  // we just need to give them a token
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
  // if using postman to test make sure you use raw json and click on json for data type because I didn't include urlencoded option on bodyParser.
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);
  if (!email || !password) {
    return res.status(422).send({ error: 'you must provide email and password' });
  }

  // see if user with given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err) }

    // if user with email doesnt exist create and save user record
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }
    // if user with email does exist, return Error
    const user = new User({
      email: email,
      password: password
    });

    // user.save actually saves record to the database, note that this takes time and can possibly fail, so pass a callback when user is saved
    user.save(function(err) {
      if (err) { return next(err); }
      // respond to request indicating user was created
      res.json({ token: tokenForUser(user) });
    });
  })
}
