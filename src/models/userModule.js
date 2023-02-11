const mongoose = require ('mongoose')

// Define User Schema
const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      trim:true
    },
    password: {
      type: String,
      required: true,
      trim:true
    },
    userType: {
      type: String,
      required: true,
      enum: ['Hospital', 'Receiver'],
      trim:true
    }
  },{timestamps:true});
  
  // Create User Model
  module.exports= mongoose.model('User', userSchema);