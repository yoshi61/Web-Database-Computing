var db = require('www');

// modified to use database
exports.getData = function(userFBID, callback) {
    db.dbConnectionPool.getConnection(
	    function(err, connection) {
		if (err) {
		    // on err return empty friends
		    callback({"friends": []});
		}
		else
		    console.log('connected to database');
		    // get friend data
		connection.query(
                     'SELECT user.name,
                     place.lat, place.lng
                     FROM user INNER JOIN friend AS f
                     ON friend.fbid1='+userFBID+
                     'INNER JOIN visits AS v
                     ON visits.fbid=f.fbid2
                     INNER JOIN place
                     ON v.placeID=place.placeID',
		     function(err, rows) {
			 callback(err, rows);
			 connection.release();
		     }

    /*
    fs.readFile(path.join(exports.dataDir,'data.json'),
		function(err, data) {
		    if (err) throw err;
		    var obj = JSON.parse(data);
		    callback(obj);
		});
};
    */

exports.writeData = function(jsonData, callback) {
    fs.readFile(path.join(exports.dataDir, 'data.json'), 
	  function(err, data) {
	    if (err) throw err;
	    var obj = JSON.parse(data);
	    obj.friends[obj.friends.length] = jsonData;
	    fs.writeFile(path.join(exports.dataDir,'data.json'),
			 JSON.stringify(obj), 
			 function(err) {
			     if (err) throw err;
			     callback();
			 });
		});
}
