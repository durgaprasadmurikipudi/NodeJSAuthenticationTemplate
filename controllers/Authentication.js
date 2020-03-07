import jwt from 'jwt-simple';
import User from '../models/user.js';
import SECRET_KEY from '../config.js';

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({sub: user.id, iat: timestamp}, SECRET_KEY);
}

export const signUp = (req, res, next) => {
  const { email, password } = req.body;

  // If either of email and password are not present, send error
  if(!email || !password)
    return res.send(422).send({error: 'Email and Password are mandatory fields'});

  // see if a given user with given email exits
  let foundUser;
  User.findOne({email: email}, function (err, existingUser) {
    if(err) next(err);

    if(existingUser) {
      foundUser = true;
    }
  });

  if(foundUser) return res.send(422).send({error: 'Email already in use.'});

  // if record does not exits, create a new one, save it and send the response
  const user = new User({
    email, password
  });

  user.save(function(err) {
    if(err) return next(err);

    res.json({token: tokenForUser(user)});
  })
};

export const signIn = (req, res, next) => {

}