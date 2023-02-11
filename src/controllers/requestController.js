const bloodSampleReqModel = require('../models/bloodReqModule');
const bloodModule = require('../models/bloodSModule');
const userModule = require('../models/userModule');

const requestBloodSample = async (req, res) => {
    try {
     
        const isReceiver = await userModule.findOne({userType: 'Receiver'})
        if(!isReceiver) return res.status(400).send({success: false, message: 'Unauthorized access, only receivers are allowed to request blood sample'});
        
        let data = req.body;
        let {bloodGroup, unit} = data
        
        let checkBlood = await bloodModule.findOne({bloodGroup: bloodGroup})
        if(!checkBlood) return res.status(400).send({success: false, message: `${bloodGroup} Blood is not available.`});
        
        if (checkBlood.unit < unit) return res.status(400).send({ success: false, message: `Not enough units of ${bloodGroup} blood available` });
    
        // Decrease the unit from the blood model
        checkBlood.unit -= unit;
        if (checkBlood.unit === 0) {checkBlood.availability = 'No'};
        await bloodModule.updateOne({_id: checkBlood._id}, {$set: {unit: checkBlood.unit, availability: checkBlood.availability}});

        const request =await bloodSampleReqModel.create(data);
        return res.status(200).send({success: true, message: 'Blood sample requested successfully', data: request});
    } catch (error) {
      return res.status(500).send({success: false, message:error.message});
    }
  };

const bloodReqList = async (req, res) => {
  try { 
    const data = req.query
    if (!data.bloodGroup) return res.status(400).send({ success: false, message: `Please specify bloodGroup` });

    const isHospital = await userModule.findOne({userType: 'Hospital'})
    if(!isHospital) return res.status(400).send({success: false, message: 'Unauthorized access, only Hospitals are allowed to request blood sample'});
    const list = await bloodSampleReqModel.find({ bloodGroup: data.bloodGroup });
    if (!list.length) return res.status(404).send({ status: false, message: "Blood requested data not found" });
    return res.status(200).send({ status: true, count: list.length, data: list });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};



  module.exports={requestBloodSample,bloodReqList}