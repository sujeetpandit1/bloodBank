const jwt = require('jsonwebtoken');

const authentication = function(req, res, next){
  try {
      const token = req.headers["x-access-token"];
      if(!token) return res.status(401).send({status:false, message: "token is missing"});    
      const decoded = jwt.verify(token, "arjunpandit", {ignoreExpiration:true}, ((err, result)=>{               
      if(err) return undefined
      else  return result
      }));

      if (decoded == undefined) { return res.status(401).send({status:false, message: "Invalid Token"}) };                                                                                                         
      if(Date.now() > decoded.exp*1000) return res.status(401).send({status:false, message: "Token/login session expired"}); 

      req["decoded"] = decoded 
// console.log(decoded);

      next();

  } catch (error) {
      // console.log(error);
      return res.status(500).send({status:false, message: error.message});
  }

};

const authorisation = function(req, res, next){      
  try {
      const userId = req.body.userId;                                              
      const loggedInUserId = req.decoded; 
      
      if(userId != loggedInUserId.userId) return res.status(403).send({status:false, message:"You are not authorised to make this request"});
      next();
      
  } catch (error) {
      // console.log(error);
      return res.status(500).send({status:false, message: error.message});        
  }
};



module.exports={authentication, authorisation}