const express= require('express')
const { bloodSampleAdded, updateBloodSample, bloodbankList, deleteData, getBloodSamplesByHospital } = require('../controllers/bloodSamController')
const { requestBloodSample, bloodReqList } = require('../controllers/requestController')
const { registerUser, userLogin } = require('../controllers/userController')
const { authentication, authorisation } = require('../middleware/auth')

const router=express.Router()


/**  ---------  API's ---------- **/
router.post('/register', registerUser)
router.post('/login',  userLogin)

router.get('/public', bloodbankList)
router.post('/bloodSampleAdded', authentication, authorisation,bloodSampleAdded)
router.put('/updateBloodBank/:id',authentication, authorisation, updateBloodSample) 
router.delete('/delete/:id',authentication, authorisation,deleteData)
router.get('/getSampleByHospital', authentication, authorisation,getBloodSamplesByHospital)


router.post('/sampleRequest', authentication, requestBloodSample)
router.get('/listOfBloodReq', authentication, bloodReqList)


router.get('/testing', (_req, res) => {
    return res.status(200).send({status: true, message: " Hello Testing API is Live"})})
router.all('/**', (_req, res) => {
    return res.status(404).send({status: false, message: " Requested API not Available"})})

module.exports=router; 