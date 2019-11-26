const USER_AUTH = require('../config').USER_AUTH_SECRET;
const jwt = require('jsonwebtoken');
const AkunAccount = require("../models/akunModel")


async function access(req, res, next) {
   
   var token = req.headers.token;
   if(!token){
      return res.status(400).send({ success: false, error: "jwt_must_provided" })
   }
   try{
      var decodedAuth = jwt.verify(token, USER_AUTH);
      var agent= await AkunAccount.getByUID(decodedAuth.uid);
      if(!agent){ 
         return res.status(400).send({ success: false, error: "agent not valid" })
       }
   }catch(error){
      //console.log('error user jwt', error);
      return res.status(400).send({ success: false, error: error.message });
      
   } 
   var exp = (decodedAuth.exp - (new Date().getTime()/1000)) / 60;
   req.agent = {"uid":decodedAuth.uid, "exp":exp}
   next();
}

module.exports={access};