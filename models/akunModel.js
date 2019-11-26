const database = require('./index').database;
const bcrypt = require('bcryptjs');
const TABLE_NAME = 'akun';

async function insert(username, password, email, handphone){
    var hashPassword = await bcrypt.hash(password, 10);
 
    var account = {
       username: username,
       email: email,
       handphone: handphone,
       password: hashPassword,
       //photo: image
    };
 
    try{
       var result = await database(TABLE_NAME).insert(account);
    }catch(error){
       return Promise.reject(error);
    }
 
    return Promise.resolve(result);
 }

 async function getByUsername(username){
    try{
       var result = await database(TABLE_NAME).where({ username: username });
    }catch(error){
       return Promise.reject(error);
    }
 
    return Promise.resolve(result[0]);
 }

 async function getByHandphone(handphone){
   try{
      var result = await database(TABLE_NAME).where({ handphone: handphone });
   }catch(error){
      return Promise.reject(error);
   }

   return Promise.resolve(result[0]);
}

async function getByEmail(email){
   try{
      var result = await database(TABLE_NAME).where({ email: email });
   }catch(error){
      return Promise.reject(error);
   }

   return Promise.resolve(result[0]);
}

async function insertPhoto(image, akun_id){
   var account = {    
      photo: image
   };

   try{
      var result = await database(TABLE_NAME).where({uid_akun:akun_id}).update(account);
   }catch(error){
      return Promise.reject(error);
   }

   return Promise.resolve(result);
}

module.exports={getByEmail, getByUsername, getByHandphone, insert, insertPhoto}