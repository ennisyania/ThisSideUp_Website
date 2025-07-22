import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';




const Schema = mongoose.Schema;
const userSchema = new Schema({
  userId: {
    type: String,
    default: () => `usr_${nanoid(6)}`, // e.g., usr_f1z2a9
    unique: true,
  },
  firstName: { type: String },
  lastName: { type: String },  // optional full name field
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  registeredDate: { type: Date, default: Date.now },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  }
}, { timestamps: true });

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

// Static login method
userSchema.statics.login = async function (email, password) {
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

export default mongoose.model('user', userSchema);
