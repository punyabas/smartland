
const express = require('express');
const bodyParser = require('body-parser');
const app = express();




const akun = require('./controllers/akunController');
const tanah = require('./controllers/tanahController');


app.use(bodyParser.json());
// Parse json data
app.use(bodyParser.json());
// For multi form data
;

app.use(function(req, res, next){
  res.setHeader('X-Powered-By', '');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use('/public', express.static(__dirname + '/public'));

app.use('/tanah', tanah);
app.use('/akun', akun);

app.use('*', function(req, res, next){
  res.status(404).send('Not found');
});


app.use(function(err, req, res, next){
  console.log(err);
  res.status(500).send({
    success: false,
    error: 'internal server error'
  });
});

var server = app.listen(process.env.PORT || 3030, function(){
  console.log('app ready');
});

