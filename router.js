import passport from 'passport';
import passportService from './services/passport.js';

import { signUp, signIn } from './controllers/Authentication.js';

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate('local', { session: false});

const route = app => {
  app.get('/', requireAuth, (req, res) => {
    res.send('Hi there!');
  });

  app.post('/signIn', requireSignIn, signIn);
  app.post('/signUp', signUp);
};

export default route;