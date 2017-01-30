const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// set session to false because we dont want to use cookies by default we are using tokens
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  // defining our routes and handling them
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: 'there' });
  });
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
};
