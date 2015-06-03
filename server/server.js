var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 3006));

app.use('/', express.static(path.join(__dirname, './../build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/basket.json', function(req, res){
  fs.readFile('basket.json', function(err, data){
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

app.post('/basket.json', function(req, res){
  var that = this;
  this.count = null;
  fs.readFile('auto-increment.json', function(err, data){
    that.count = JSON.parse(data).count;
    fs.writeFile('auto-increment.json', JSON.stringify({"count": that.count + 1}));
    fs.readFile('basket.json', function(err, data){
      var basket = JSON.parse(data);
      req.body.id = that.count + 1;
      basket.push(req.body);
      fs.writeFile('basket.json', JSON.stringify(basket, null, 4), function(err) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache');
        res.send(JSON.stringify(basket));
      });
    });
  });
});

app.delete('/basket.json', function(req, res){
  fs.readFile('basket.json', function(err, data){
    var basket = JSON.parse(data);
    var elementPos = basket.map(function(item) { 
      return item.id; 
    }).indexOf(parseInt(req.body.id));
    basket.splice(elementPos, 1);
    fs.writeFile('basket.json', JSON.stringify(basket, null, 4), function(err) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache');
      res.send(JSON.stringify(basket));
    });
  });
});

app.listen(app.get('port'), function(){
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});