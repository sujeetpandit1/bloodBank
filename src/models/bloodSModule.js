const mongoose = require('mongoose');

// Define Blood Sample Schema
const bloodSampleSchema = new mongoose.Schema({
  bloodGroup: {
    type: String,
    required: true,
    trim:true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  availability: {
    type: String,
    required: true,
    enum: ['Yes', 'No'],
    trim:true
  },
  unit:{
    type: Number,
    required: true,
    trim:true
  },
  userType:{
    type: String,
    default: "Hospital"
  }
},{timestamps:true});

// Create Blood Sample Model
module.exports=mongoose.model('BloodSample', bloodSampleSchema);