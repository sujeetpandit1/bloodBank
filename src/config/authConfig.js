const { verifyToken, authorize } = require('./auth');

const addBloodSample = [verifyToken, authorize(['hospital']), (req, res) => {
  // Add blood sample logic
}];

const updateBloodSample = [verifyToken, authorize(['hospital']), (req, res) => {
  // Update blood sample logic
}];

const deleteBloodSample = [verifyToken, authorize(['hospital']), (req, res) => {
  // Delete blood sample logic
}];

const getAllBloodSamples = (req, res) => {
  // Get all blood samples logic
};

const getBloodSamplesByHospital = (req, res) => {
  // Get blood samples for a particular hospital logic
};

module.exports = {addBloodSample,updateBloodSample,deleteBloodSample,getAllBloodSamples,getBloodSamplesByHospital};