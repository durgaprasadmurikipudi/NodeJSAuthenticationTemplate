import passport from 'passport';

import { signUp, signIn } from './controllers/Authentication.js';

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false});

const route = app => {
  app.get('/', requireAuth, (req, res) => {
    res.send('Hi there!');
  });

  app.post('/signIn', requireSignIn, signIn);
  app.post('/signup', signUp);
};

export default route;