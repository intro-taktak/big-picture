const express = require('express'),
    router = express.Router(),
    mongoClient = require('mongodb').MongoClient,
    http = require('http'),
    databaseURL = 'mongodb://localhost:27017/data/db';


var database;

mongoClient.connect(//mongoDB 연결
    databaseURL, 
    { useUnifiedTopology: true }, (err, db) => {
        if (err) {
            console.log('db connect error');
            return;
        }

        console.log('db was connected : ' + databaseURL);
        database = db;
        
        database.db('test').collection('surveys').find().toArray((err, data)=>{ //surveys collection find
            if(err) throw err;
        })
        
    });


/* GET home page. */
router.get('/', function(req, res, next) {
        
    var list = database.db('test').collection('surveys').find();
    
    list.toArray(function (err, docs) {
        res.render('index', { list: docs }); //index를 렌더하며 파라메터에 survey 리스트를 같이 보낸다.
    });
    
});

module.exports = router;
