const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // simple email regex validation
  }
  ,
  password: {
    type: String,
    required: true,
  },
});

// Static signup method
userSchema.statics.register = async function (email, password) {
  const exists = await this.findOne({ email });

  if (exists) {
    throw Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });
  return user;
};

//Static login ethod
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error('Incorrect email or password');
  }

  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    throw Error('Incorrect email or password');
  }

  return user;
};


module.exports = mongoose.model('user', userSchema);
