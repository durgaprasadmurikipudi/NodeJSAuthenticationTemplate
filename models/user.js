import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

// Define the model
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true},
  password: String
});

// On save hook, encrypt password.
UserSchema.pre('save', function(next) {
  const user = this;

  bcrypt.genSalt(10, function(err, salt ){
    if(err) next(err);

    bcrypt.hash(user.password, salt, null, function(err, hashedResult) {
      if(err) next(err);

      user.password = hashedResult;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function( candidatePassword, callback ) {
  bcrypt.compare( candidatePassword, this.password, (error, isMatch) => {
    if(error) return callback(error);

    callback(null, isMatch);
  });
};

// Create them model class 
// creating the collection of users
const modelClass = mongoose.model('user', UserSchema);

// Export
export default modelClass;