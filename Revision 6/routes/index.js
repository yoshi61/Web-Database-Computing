var express = require('express');
var data = require('./data');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('myPage', { title: 'AAAAAAAA', name: 'BBBBBB' });
});

/* GET friend locations */
router.get('/model/friendLoc.json', function(req, res) {
    data.getData(function(jsonData) {
        res.send(jsonData);
    });
});

module.exports = router;
