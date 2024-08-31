const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
    },
    age: {
      type: Number,
      min: 18,
      max: 99,
    }
  });
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;