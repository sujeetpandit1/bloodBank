const mongoose = require('mongoose');

const bloodSampleRequestSchema = new mongoose.Schema({
  bloodGroup: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'BloodSample',
    trim:true
  },
  hospitalId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  unit:{
    type: mongoose.Schema.Types.Mixed,
    ref: 'BloodSample',
    trim:true
  },
  status:{
    type:String,
    default: "Requested"
  }
});

module.exports = mongoose.model('BloodSampleRequest', bloodSampleRequestSchema)