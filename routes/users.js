var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var http = require('http');

var database;
var databaseURL = 'mongodb://localhost:27017/data/db';

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/login', function (req, res, next) {
    res.render('login', { title: 'login' });
    mongoClient.connect(databaseURL, { useUnifiedTopology: true }, function (err, db) {
        if (err) {
            console.log('db connect error');
            return;
        }

        console.log('db was connected : ' + databaseURL);
        database = db;
    });
});

router.get('/register', function (req, res, next) {
    res.render('register', { title: 'register' });
    mongoClient.connect(databaseURL, { useUnifiedTopology: true }, function (err, db) {
        if (err) {
            console.log('db connect error');
            return;
        }

        console.log('db was connected : ' + databaseURL);
        database = db;
    });
});

router.post('/login', async function (req, res, next) {
    let body = req.body;
    var users = database.db('test').collection('user');
    var result = users.find({ email: body.userEmail, password: body.userPassword });

    result.toArray(function (err, docs) {
        if (err) {
            return;
        }

        if (docs.length > 0) {
            console.log('find user [ ' + docs + ' ]');
            res.redirect('https://big-picture-mwng.run.goorm.io/');
        } else {
            console.log('can not find user [ ' + docs + ' ]');
            res.redirect('https://big-picture-mwng.run.goorm.io/users/login');
        }
    });
});

router.post('/register', async function (req, res, next) {
        let body = req.body;
        var users = database.db('test').collection('user');
        users.insertOne({
            email: body.userEmail,
            password: body.userPassword,
        });
        res.redirect('https://big-picture-mwng.run.goorm.io/users/login');
    }
);

module.exports = router;