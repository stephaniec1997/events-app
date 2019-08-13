const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const Schema = mongoose.Schema;

const userSchema = new Schema({
  username:{
    type: String,
    required: true,
    unique: true,
    trim: true, //trims whitespace out
    minlength:3
  },
  email:{
    type: String,
    required: true,
    unique: true,
    trim: true, //trims whitespace out
  },
  password:{
    type: String,
    required: true,
    trim: true, //trims whitespace out
    minlength:5
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isVerified: { type: Boolean, default: false },
  admin: {type:Boolean, required: true, default: false},
}, {
  timestamps: true,
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
