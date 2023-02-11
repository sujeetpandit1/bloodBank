const userModel = require('../models/userModule')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


const registerUser =async (req, res) => {
    
    try {

        let allowedField=["email", "password", "userType"]
        const data = req.body
        const keyOf=Object.keys(data)  
        const receivedKey=allowedField.filter((x) => !keyOf.includes(x))
        if(receivedKey.length) return res.status(400).send({status: false, message: `${receivedKey} field key is missing`});

        const { email, password, userType } = data;
        if(!email) return res.status(400).send({ status: false, message: `email cannot be blank` });
        if (!(/^\s*[a-zA-Z][a-zA-Z0-9]*([-\.\_\+][a-zA-Z0-9]+)*\@[a-zA-Z]+(\.[a-zAZ]{2,5})+\s*$/.test(email))) return res.status(400).send({status: false,message: `${email} should be a valid email address`});

        const checkMail= await userModel.findOne({email:email})
        if(checkMail) return res.status(400).send({status:false, message: `this ${email} is already registered, please enter new one or RESET Password`});

        if(!password) return res.status(400).send({status:false, message: "Password is required"});
        if(!(/^\s*(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,15}\s*$/.test(password))) return res.status(400).send({status:false, message: "Pasword Should be in Alphanumeric and special character and length 8-15 digit only"});

        const hash=bcrypt.hashSync(data.password, saltRounds);
        data.password=hash

        if(!userType.trim()) return res.status(400).send({status:false, message: "Please Specify Type of User"});
        if(!(userType == "Hospital" || userType == "Receiver"))return res.status(400).send({status:false, message: "Please Select Type of User"});

        const savedUser= await userModel.create(data)
        return res.status(201).send({status:true, message:"User Successfully Registered", data:savedUser})
    } catch (error) {
      return res.status(500).send({status: false, message: error.message });
    }
  };

  const userLogin = async function (req, res){
    try {
        const fieldAllowed=["password", "email"]
        const data=req.body
        const keyOf=Object.keys(data)
        const receivedKey=fieldAllowed.filter((x) => !keyOf.includes(x))
        if(receivedKey.length) return res.status(400).send({status: false, message: `${receivedKey} field key is missing`});

        const {email, password} = data
        if(!email.trim()) return res.status(400).send({ status: false, message: `email cannot be blank` });
        if(!password.trim()) return res.status(400).send({status:false, message: "Password is required"});

        const user= await userModel.findOne({email:email}) 
        if(!user) return res.status(400).send({status:false, message: " No user found with this credentials"})

        const match = await bcrypt.compare(password, user.password)     
        if(!match) return res.status(404).send({status:false, message: "Password is Incorrect"});


        //token

        const token =jwt.sign({
            userId:user._id
        }, "arjunpandit", {expiresIn:"12h"})
        // res.setHeaders('x-access-token', token)

        return res.status(200).send({status:true, message: "Login Successfull", data:{userId:user._id, userType:user.userType, token:token}})
        // return res.status(200).send({status:true, message: "Login Successfull"})
   

    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }
}

  module.exports={registerUser, userLogin}