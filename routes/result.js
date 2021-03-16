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
    var answerData = database.db('test').collection('answers').find({sid: req.params.qid});
    
    // promise 비동기 처리
    var promise1 = new Promise(function(resolve, reject) {
        surveyData.toArray( function(err, docs) {
          if (err) {
            // Reject the Promise with an error
            return reject(err)
          }
    
          // Resolve (or fulfill) the promise with data
          return resolve(docs)
        })
      });
    var promise2 = new Promise(function(resolve, reject) {
        answerData.toArray( function(err, docs) {
          if (err) {
            // Reject the Promise with an error
            return reject(err)
          }
    
          // Resolve (or fulfill) the promise with data
          return resolve(docs)
        })
      });
    // 비동기 구현
    Promise.all([promise1, promise2]).then(function (values){
       console.log(values[0], values[1]); 
        res.render('result', {slist: values[0], alist: values[1]});
    });
});

module.exports = router;