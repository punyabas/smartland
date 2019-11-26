const tanah = require('express').Router();
const JOI = require('joi');
var fs = require('fs');
var path = require('path');
var LoginRequired = require('../helper/LoginRequired');

//const jwt = require('jsonwebtoken');
//const LoginRequired = require('../helper/LoginRequired');

const TanahAccount = require("../models/tanahModel")
var multer  = require('multer');

var storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, 'uploads')
   },
   filename: function (req, file, cb) {
      var fname = file.fieldname + '-' + Date.now() + path.extname(file.originalname);

      cb(null, fname);
   }
 })
  

var upload = multer({ storage : storage });

//const USER_AUTH = require('../config').USER_AUTH_SECRET;
function distancek(lat1, lat2, lon1, lon2){
   if ((lat1 == lat2) && (lon1 == lon2)) {
       var miles=0;
     return miles;
    }
    else {
      var theta = lon1 - lon2;
      var dist =  Math.sin(lat1 * Math.PI / 180) *  Math.sin(lat2* Math.PI / 180) +  Math.cos(lat1* Math.PI / 180) * Math.cos(lat2* Math.PI / 180) * Math.cos(theta* Math.PI / 180);
      var dist1 = Math.acos(dist);
      var dist2 = dist1* 180 / Math.PI;
      var miles = dist2 * 60 * 1.1515;
      return miles * 1.609344;
    }

  }

  
  tanah.get('/getLatLon', async function(req, res, next){    
      
      const Schema = JOI.object().keys({
      lat: JOI.string().trim().required(),
      lon: JOI.string().trim().required()
   });

   JOI.validate(req.body, Schema).then(result => {
      next();
   }).catch(error => {
      res.status(400).send({
         success: false,
         error: error.message
      });
   }); 
    }, async function(req,res,next){  
        try{
      // var result = await TanahAccount.getTanahByID('b2d20b72-0f9d-11ea-8fcc-2cfda175881a');
          var result = await TanahAccount.getTanahAll();
         // return res.send({ success: true, error: result });
      next(result);
   
      }catch(error){
         console.log(error);
         return res.status(400).send({ success: false, error: error.message });
      }
     }, 
     async function(tanah,req,res,next){
      var lat1 = req.body.lat;
      var lon1 = req.body.lon; 
      //console.log(tanah);
      var tanahlist = [];
      tanah.forEach(function(listan) {
          var lat2 = listan.lat;
          var lon2 = listan.lon;

          var jarak=distancek(lat1, lat2, lon1, lon2);
      
          if(jarak<=10)
          {
              tanahlist.push(listan.uid_tanah);
          }
      });
      //console.log(tanahlist);
    var tanahlistkom=[]
    for (let index = 0; index < tanahlist.length; index++) {
      try{
          var result =  await TanahAccount.getTanahByUID(tanahlist[index]);
          tanahlistkom.push(result);
         }catch(error){
            console.log(error);
            return res.status(400).send({ success: false, error: error.message });
         }
    }
      
  res.send({
      success: true,
      data: tanahlistkom
   });
  
});

tanah.get('/getByCity', async function(req, res, next){    
      
   const Schema = JOI.object().keys({
   city: JOI.string().trim().required(),
});

JOI.validate(req.body, Schema).then(result => {
   next();
}).catch(error => {
   res.status(400).send({
      success: false,
      error: error.message
   });
}); 
 }, async function(req,res,next){  
   try{
     var result = await TanahAccount.getTanahByLoc(req.body.city);
     return res.send({ success: true, hasil: result });

 }catch(error){
    console.log(error);
    return res.status(400).send({ success: false, error: error.message });
 }
})

tanah.get('/getQuery', async function(req, res, next){    
      
   const Schema = JOI.object().keys({
      tag:JOI.string().trim().required(),
      hargamin:JOI.string().trim().required(),
      hargamaks:JOI.string().trim().required(),
      luasmin:JOI.string().trim().required(),
      luasmaks:JOI.string().trim().required(),
      alamat:JOI.string().trim().required()
});

JOI.validate(req.body, Schema).then(result => {
   next();
}).catch(error => {
   res.status(400).send({
      success: false,
      error: error.message
   });
}); 
 }, async function(req,res,next){  
   try{
     var result = await TanahAccount.getTanahQuery(req.body.tag, req.body.hargamin, req.body.hargamaks, req.body.luasmin, req.body.luasmaks, req.body.alamat);
     return res.send({ success: true, hasil: result });

 }catch(error){
    console.log(error);
    return res.status(400).send({ success: false, error: error.message });
 }
}
 
 );

tanah.use(LoginRequired.access);

tanah.post('/register', function(req, res, next){
    const Schema = JOI.object().keys({
        luas: JOI.string().trim().required(),
        lat: JOI.string().trim().required(),
        lon: JOI.string().trim().required(),
        harga: JOI.string().trim().required(),
        deskripsi : JOI.string().trim().required(),
        tag : JOI.string().trim().required(),
        alamat : JOI.string().trim().required(),
        id_akun : JOI.string().trim().required()
     });


     JOI.validate(req.body, Schema).then(result => {
        next();
     }).catch(error => {
        res.status(400).send({
           success: false,
           error: error.message
        });
     });
    }, async function(req, res, next){
    
        try{
           var account = await TanahAccount.insert(req.body.luas, req.body.lat, req.body.lon, req.body.harga, req.body.deskripsi, req.body.tag, req.body.alamat, req.body.id_akun  );
        }catch(error){
           console.log(error);
           return res.status(400).send({ success: false, error: error.message });
        }
        res.send({
            success: true,
            data: account
         });
    })

    tanah.post('/uplodaphoto', upload.single('image'), async function(req, res, next){  
        try{
  
           var id = req.body.akun;
           //var img = fs.readFileSync(req.file.path);
          var img= fs.readFileSync(req.file.path);
          var haha = img.toString('base64');
           //var image = req.file;
           //var wow = img.toString('base64')
         var result = await TanahAccount.insertPhoto(haha, id);
        }catch(error){
           console.log(error);
           return res.status(400).send({ success: false, error: error.message });
        }
        fs.unlinkSync(req.file.path);
        res.send({
         success: true,
         data: result
      });
       }
     );

     tanah.post('/uplodasertif', upload.single('image'), async function(req, res, next){  
        try{
  
           var id = req.body.akun;
           //var img = fs.readFileSync(req.file.path);
          var img= fs.readFileSync(req.file.path);
          var haha = img.toString('base64');
           //var image = req.file;
           //var wow = img.toString('base64')
         var result = await TanahAccount.insertSertifikat(haha, id);
        }catch(error){
           console.log(error);
           return res.status(400).send({ success: false, error: error.message });
        }
        fs.unlinkSync(req.file.path);
        res.send({
         success: true,
         data: result
      });
       }
     );

     
tanah.post('/update', function(req, res, next){
   const Schema = JOI.object().keys({
       luas: JOI.string().trim().required(),
       lat: JOI.string().trim().required(),
       lon: JOI.string().trim().required(),
       harga: JOI.string().trim().required(),
       deskripsi : JOI.string().trim().required(),
       tag : JOI.string().trim().required(),
       alamat : JOI.string().trim().required(),
       id_tanah : JOI.string().trim().required()
    });


    JOI.validate(req.body, Schema).then(result => {
       next();
    }).catch(error => {
       res.status(400).send({
          success: false,
          error: error.message
       });
    });
   }, async function(req, res, next){
   
       try{
          var account = await TanahAccount.update(req.body.luas, req.body.lat, req.body.lon, req.body.harga, req.body.deskripsi, req.body.tag, req.body.alamat, req.body.id_tanah  );
       }catch(error){
          console.log(error);
          return res.status(400).send({ success: false, error: error.message });
       }
       res.send({
           success: true,
           data: account
        });
   })

    
 module.exports = tanah;