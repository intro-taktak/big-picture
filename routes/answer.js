const express = require('express'),
    router = express.Router(),
    mongoClient = require('mongodb').MongoClient,
    http = require('http'),
    databaseURL = 'mongodb://localhost:27017/data/db';

var database;

mongoClient.connect(
    databaseURL, 
    { useUnifiedTopology: true }, (err, db) => {
        if (err) {
            console.log('db connect error');
            return;
        }

        console.log('db was connected : ' + databaseURL);
        database = db;
        
        database.db('test').collection('surveys').find().toArray((err, data)=>{
            if(err) throw err;
        })
        
    });


/* GET home page. */
router.get('/:qid', function (req, res, next) {
    /*res.render('answer', { title: 'big-picture' });*/
    
    var ObjectId = require('mongodb').ObjectId;
    oid = new ObjectId(req.params.qid);
    
    var surveyData = database.db('test').collection('surveys').find({_id: oid});
    surveyData.toArray(function (err, docs){
        res.render('answer', {list: docs});
    });
});

router.post('/:qid', async function (req, res, next) {
    let body = req.body;
    console.log(req.body);
    var surveys = database.db('test').collection('answers');
    surveys.insertOne(body);
    res.redirect('https://big-picture-mwng.run.goorm.io/');
});

module.exports = router;