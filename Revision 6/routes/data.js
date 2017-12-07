var fs = require('fs'); // File reading and writing
var path = require('path'); // Handles path format

exports.getData = function(callback) {
    fs.readFile(path.join(path.join(__dirname,'../model'), 'friendLoc.json'), 
            function(err, data) {
                if (err) throw err;
                obj = JSON.parse(data);
                callback(obj);
            });
};

