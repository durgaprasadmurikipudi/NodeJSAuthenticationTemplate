import passport from 'passport';
import passportJwt from 'passport-jwt';
import LocalStrategy from 'passport-local';

import User from '../models/user.js';
import SECRET_KEY from '../config.js';

const JwtStrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;

const LocalOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(LocalOptions, (email, password, done) => {
  User.findOne({email}, (err, user) => {
    if(err) 
      return done(err);

    if(!user) 
      return done(null, false);

    user.comparePasswords(password, function(err, isMatch) {
      if(err) return done(err);

      if(!isMatch) return done(null, false);

      return done(null, user);
    });
  })
});

// setup options for JwtStrategy
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromHeader('authorization'), // We have to tell, passport where to look jwt token in request body,
                                                          // it can be present in URL, body, or header. So thats what we are saying
                                                          // to llok in header, under name 'authorization'.
  secretOrKey: SECRET_KEY  // We are tellign with what secret key did we encode this JWT. With this we will decode all the properties
                           // that we sent to JWT token.
};

//Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // See if userId is present in data base. Payload contains whatever we sent to JWT tokenize at first when sending to user
  // Since we sent, userId and iat, it will be returned back.
  User.findById(payload.sub, (err, user) => {
    if(err) done(err, false); // Call the done with error as we recieved error and false, becuase we have no user to send.

    if(user)
    {
      done(null, user); // send the user, if found
    }
    else {
      done(null, false); // if the user is not found, invalid user.
    }
  });
});

// Tell passport to use this strategy.
passport.use(jwtLogin);
passport.use(localLogin);