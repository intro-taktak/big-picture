var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var http = require('http');

var database;
var databaseURL = 'mongodb://localhost:27017/data/db';

/* GET home page. */
router.get('/write', function (req, res, next) {
    res.render('survey', { title: 'big-picture' });
    mongoClient.connect(databaseURL, { useUnifiedTopology: true }, function (err, db) {//mongoDB 연결
        if (err) {
            console.log('db connect error');
            return;
        }

        console.log('db was connected : ' + databaseURL);
        database = db;
    });
});

router.post('/write', async function (req, res, next) {
    let body = req.body;
    var surveys = database.db('test').collection('surveys');
    surveys.insertOne(body);// 데이터베이스에 insert한다.
    res.redirect('https://big-picture-mwng.run.goorm.io/'); //글쓰기 후 메인페이지로 리다이렉트
});

module.exports = router;