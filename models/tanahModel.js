const database = require('./index').database;
const TABLE_NAME = 'tanah';

async function insert(luas, lat, lon, harga, deskripsi, tag, alamat, id_akun ){
 
    var account = {
        luas : luas,
        lat : lat,
        lon : lon,
        harga : harga,
        deskripsi : deskripsi,
        tag : tag,
        alamat : alamat,
        id_akun : id_akun,
        waktu_daftar: Date.now()
    };
 
    try{
       var result = await database(TABLE_NAME).insert(account);
    }catch(error){
       return Promise.reject(error);
    }
 
    return Promise.resolve(result);
 }

 async function insertPhoto(image, akun_id){
    var account = {    
       photo: image
    };
 
    try{
       var result = await database(TABLE_NAME).where({uid_tanah:akun_id}).update(account);
    }catch(error){
       return Promise.reject(error);
    }
 
    return Promise.resolve(result);
 }

 async function insertSertifikat(image, akun_id){
    var account = {    
       sertifikat: image
    };
 
    try{
       var result = await database(TABLE_NAME).where({uid_tanah:akun_id}).update(account);
    }catch(error){
       return Promise.reject(error);
    }
 
    return Promise.resolve(result);
 }

 //get tanah per pengguna
 async function getTanahByID(id){
    try{
        var result = await database(TABLE_NAME).where({ id_akun: id }).orderBy('waktu_daftar');
     }catch(error){
        return Promise.reject(error);
     }
  
     return Promise.resolve(result);
 }

 async function getTanahByLoc(Loc){
   try{
       var result = await database(TABLE_NAME).where({ alamat: Loc }).orderBy('waktu_daftar');
    }catch(error){
       return Promise.reject(error);
    }
 
    return Promise.resolve(result);
}

 //get tanah all
 async function getTanahAll(){
    try{
       var result = await database(TABLE_NAME).orderBy('waktu_daftar');
    }catch(error){
       return Promise.reject(error);
    }
    return Promise.resolve(result);
 }

//get tanah satuan
//  async function getTanahByUID(tanid){
//     var wow=[];
//     tanid.forEach( async function(uid){
//     try{
//         var result = await database(TABLE_NAME).where({ uid_tanah: ''+uid });
//        // console.log(result[0]);
//         wow.push(result[0]);
//         console.log(wow);
//      }catch(error){
//         return Promise.reject(error);
//      }
//       return Promise.resolve(result[0]);
//     })
//     //console.log(wow);
//     return Promise.resolve(wow);
// }

async function getTanahByUID(tanid){
   try{
        var result = await database(TABLE_NAME).where({ uid_tanah: tanid });
       // console.log(result[0]);
     }catch(error){
        return Promise.reject(error);
     }
      return Promise.resolve(result[0]);
    
       
}


async function update(luas, lat, lon, harga, deskripsi, tag, alamat, id_tanah ){
 
   var account = {
       luas : luas,
       lat : lat,
       lon : lon,
       harga : harga,
       deskripsi : deskripsi,
       tag : tag,
       alamat : alamat
   };

   try{
      var result = await database(TABLE_NAME).where({uid_tanah:id_tanah}).update(account);
   }catch(error){
      return Promise.reject(error);
   }

   return Promise.resolve(result);
}

async function getTanahQuery(tag, hargamin, hargamaks, luasmin, luasmaks, alamat){
    try{
       var result = await select().database(TABLE_NAME).where((builder) => {

         if (tag)
             builder.where({tag:tag});
     
         if (hargamaks)
             builder.where('harga', '<', hargamaks);

         if (hargamin)
             builder.where('harga', '>', hargamin);
     
         if (luasmaks)
             builder.where('harga', '<', luasmaks);

         if (luasmaks)
             builder.where('harga', '>', luasmin);
     
         if (alamat)
             builder.whereNull({alamat:alamat});
     
         // so on..
     
     })
       .orderBy('waktu_daftar');
    }catch(error){
       return Promise.reject(error);
    }
 
    return Promise.resolve(result);
 }


module.exports={ insert, insertPhoto, insertSertifikat, getTanahByID, getTanahAll, getTanahByUID, update, getTanahByLoc, getTanahQuery}