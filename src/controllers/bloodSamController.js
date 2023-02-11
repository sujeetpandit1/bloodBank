const bloodModel = require("../models/bloodSModule");
const userModule = require("../models/userModule");
const mongoose = require('mongoose')


const bloodbankList = async (req, res) => {
    try {
        const data = req.query

        const list = await bloodModel.find(data)
        if (!list.length > 0) return res.status(404).send({ status: false, message: "Blood Data Not Found" });
        return res.status(200).send({ status: true, count: list.length, message: list })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

};


const bloodSampleAdded =async (req, res) => {
    
    try {

        let allowedField=["bloodGroup", "userId", "availability", "unit"]
        const data = req.body
        const keyOf=Object.keys(data)  
        const receivedKey=allowedField.filter((x) => !keyOf.includes(x))
        if(receivedKey.length) return res.status(400).send({status: false, message: `${receivedKey} field key is missing`});
        const { bloodGroup, userId, availability, unit } = data;
        if(!bloodGroup.trim()) return res.status(400).send({ status: false, message: `Enter bloodGroup` });
        if(!userId.trim()) return res.status(400).send({ status: false, message: `Enter Hospital Id` });
        if(userId.length !=24) return res.status(400).send({ status: false, message: `Enter Correct Hospital Id` });
       
        if(!availability.trim()) return res.status(400).send({status:false, message: "Please Specify availability"});
        if(!(availability == "Yes" || availability == "No"))return res.status(400).send({status:false, message: "Please Select Type of availability"});
        if(!unit) return res.status(400).send({ status: false, message: `Enter unit` });
        if(typeof unit !== "number") return res.status(400).send({ status: false, message: `unit should be in Number Only` });


        const sampleSaved = await bloodModel.create(data)
        return res.status(201).send({status:true, message:"Blood Sample Addedd Successfully", data:sampleSaved})

    } catch (error) {
      return res.status(500).send({status: false, message: error.message });
    }
  };


  const updateBloodSample = async (req, res) => {
    try {
      let bloodId = req.params;
      // console.log(bloodId);
      if(!mongoose.Types.ObjectId.isValid(bloodId)) return res.status(400).send({ status: false, message: "Enter Correct Id" })//gpt correct this
      let checkBlood = await bloodModel.findOne({_id: mongoose.Types.ObjectId(bloodId)});
      if(!checkBlood) return res.status(404).send({ status: false, message: "Blood Not Found" });

      let data= req.body
      let {userId, availability, bloodGroup, unit} = data

      if(!userId) return res.status(400).send({ status: false, message: `Enter Hospital Id` });
      // if(userId.length !=24) return res.status(400).send({ status: false, message: `Enter Correct Hospital Id` });
      //  console.log(data);
      if(!availability.trim()) return res.status(400).send({status:false, message: "Please Specify availability"});
      if(!(availability == "Yes" || availability == "No"))return res.status(400).send({status:false, message: "Please Select Type of availability"});
      if(!unit) return res.status(400).send({ status: false, message: `Enter unit` });
      if(typeof unit !== "number") return res.status(400).send({ status: false, message: `unit should be in Number Only` });
      // console.log(data);
      let updatedBlood = await bloodModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(bloodId)}, { $set: {bloodGroup:bloodGroup, availability: availability, unit:unit} }, { new: true });
      if (!updatedBlood) return res.status(404).send({ status: false, message: 'Blood with this data not found' });
      return res.status(200).send({ status: true, message: "Success", data: updatedBlood });
  
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };

  const deleteData = async function (req, res) {
    try {
        
        let bloodId = req.params;
      // console.log(bloodId);
        if(!mongoose.Types.ObjectId.isValid(bloodId)) return res.status(400).send({ status: false, message: "Enter Correct Id" })//gpt correct this
        let checkBlood = await bloodModel.findOne({_id: mongoose.Types.ObjectId(bloodId)});
        if(!checkBlood) return res.status(404).send({ status: false, message: "Blood Not Found" });
        let data= req.body
        let {userId} = data
        console.log(data);
        if(!userId) return res.status(400).send({ status: false, message: `Enter Hospital Id` });
        
        let deleteData = await bloodModel.deleteOne({_id:mongoose.Types.ObjectId(bloodId)}, { new: true });
        return res.status(200).send({ status: true, message: "This Blood Data is deleted successfully", data: deleteData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
};

const getBloodSamplesByHospital = async (req, res) => {
  try {
      let { userId } = req.body;
      if(!userId) return res.status(400).send({ status: false, message: `Enter Hospital Id` });

      const bloodSamples = await bloodModel.find({ userId });
      if (!bloodSamples.length) return res.status(404).send({ status: false, message: "Blood Data for this Hospital Not Found" });
      return res.status(200).send({ status: true, count: bloodSamples.length, data: bloodSamples });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

  module.exports={bloodbankList, bloodSampleAdded,updateBloodSample, deleteData,getBloodSamplesByHospital} 

 