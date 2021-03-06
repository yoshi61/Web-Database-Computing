var express = require('express');
var FB = require('fb');
var config = require('../config');
var router = express.Router();
  
router.get('/model/friendslist', function(req, res) {
	console.log('connecting to database for friend list');
	req.pool.getConnection(function(err,connection) {
		if (err) throw err;
	    
		//    get friend state
		connection.query('SELECT name, visible FROM friend INNER JOIN user on fbid=fbid2 WHERE friend.fbid1='+req.session.fbid,
				 function(err, rows, fields) {
				     if (err) throw err;
				     console.log(rows);
				     // return answer
				     connection.release();
				     res.send(JSON.stringify({friends: rows}));
				 });
	    });
    });
	    
				 
	
router.get('/model/friends.json', function(req, res) {
	console.log('friends data request received');
	var accessToken = req.session.accessToken;
	var fbid = req.session.fbid;
	if (!accessToken || !fbid) {
	    console.log('user not logged in');
	    // send user to login
	    res.send(404);
	}
	else {
	    console.log('getting friend data');
	    // create locations object
	    FB.api("/me/friends", 
		   // { access_token: accessToken, appsecret_proof: req.session.proof },
		   { access_token: accessToken },
		   function(response) {
		       if (response && !response.error) {
			   console.log('received: ' + JSON.stringify(response.data));
			   processFriends(response.data, 
					  req,
					  function(locationData) {
					      console.log('server returning data ' + 
							  JSON.stringify(locationData));
					      res.send(JSON.stringify(locationData));
					  });
		       }
		       else {
			   console.log(response.error);
			   res.send(500);
		       }
		   }
		   )
		}
    });

function processFriends(friends, req, callback) {
    console.log('processing friends ' + JSON.stringify(friends));
    var friendCount = friends.length;
    var friendsProcessed = 0;
    var locationData = { friends: [] };
    var accessToken = req.session.accessToken;
    var myID = req.session.fbid;

    // loop through all friends and process each one
    var friendIndex = 0;
    while(friendIndex < friendCount) {
	var friend = friends[friendIndex];
		processFriend(friend);
		friendIndex++;
    }

    function processFriend(friend) {
	console.log('processing friend ' + JSON.stringify(friend));

	// open database connection
	/* MODIFY CODE HERE */ // DONE ANDREW
	req.pool.getConnection(function(err, connection) {
		if (err) throw err;
		// if friend not in database
		//    add friend to database with visible show
		// if visible status of friend is show
		//    getFriendLocations
		/* MODIFY CODE HERE */ // DONE ANDREW
		// "ADD QUERY STRING HERE TO SELECT VISIBLE WHERE THE FIELD FBID1 IS EQUAL TO THE CURRENT USER's FACEBOOK ID AND FIELD FBID2 IS EQUAL TO THE CURRENT FRIEND's FACEBOOK ID"
		var qry="SELECT name, visible FROM user INNER JOIN friend ON user.fbid=friend.fbid2 WHERE fbid1="+myID+" AND friend.fbid2="+friend.id+";";
		console.log(qry);
		connection.query(qry,
				 function(err, rows, fields) {
				     if (err) throw err;
				     var visible;
				     // if friendship is not in database add friend to database
				     if (rows.length == 0) {
						 console.log('adding '+friend.name+' to friend table');
						 visible = 'show';
						 var query = "INSERT INTO friend values ("+myID+","+friend.id+",'show');";
						 console.log(query);
						 connection.query(query,
							  function(err, rows, fields) {
							      if (err) throw err;
							  });
						 query = "INSERT INTO user values ('"+friend.name+"', "+friend.id+");";
						 console.log('adding '+friend.name+' to user table');
						 connection.query(query,
							  function(err, rows, fields) {
							      if (err) throw err;
							  });
				     }
				     // already in database
				     // the parameter rows has the response from the query on 
				     // whether the friendship is 'show' or 'hide'
				     // if show, get this friend's locations
				     else
					 visible = rows[0].visible;
				     
				     if (visible == 'show') {
					 getFriendLocations(friend, 
							    accessToken, 
							    function(name, locations) {
								// add place to locations data object
								var placeIndex = 0;
								var placeCount = locations.length;
								while(placeIndex < placeCount) {
								    place = locations[placeIndex].place.location;
								    console.log('adding place: ' + JSON.stringify(place));
								    var markerInfo = { name: name ,
										       lat:place.latitude,
										       lng:place.longitude};
								    locationData.friends.push(markerInfo);
								    placeIndex++;
								}
								friendsProcessed++;
								// close database connection
								/* MODIFY CODE HERE -  CLOSE THE CONNECTION */ //DONE ANDREW
								connection.release();
								console.log('processed friend count ' + friendsProcessed);
								// if we've processed all the friends return the location data			       
								if (friendsProcessed == friendCount) {
								    callback(locationData);
								}
							    });
				     } else {
					 // friend is 'hide' so don't look up locations
					 friendsProcessed++;
					 connection.release();
					 if (friendsProcessed == friendCount) {
					     callback(locationData);
					 }
				     }
				 });
	    });

    }

}


function getFriendLocations(friend, accessToken, callback) {
    console.log('getting location information for ' + friend.name);
    FB.api("/"+friend.id+"/tagged_places",
	   { access_token: accessToken },
	   function(placesResponse) {
	       if (placesResponse && !placesResponse.error) {
		   console.log(placesResponse.data);
		   callback(friend.name, placesResponse.data);
	       }
	       else {
		   console.log(response.error);
		   res.send(500);
	       }
	   });
}


router.post('/auth', function(req, res) {
	console.log('received short-lived-token');
	// exchange for long term access token
	FB.api('oauth/access_token', 
	       { grant_type: 'fb_exchange_token',
		       client_id: config.facebook.appId,
		       client_secret: config.facebook.appSecret,
		       fb_exchange_token: req.body.authResponse.accessToken  
		       }, 
	       function (response) {
		   if(!response || response.error) {
		       console.log(!response ? 'error occurred' : response.error);
		       return;
		   }
		   console.log('long term token obtained');
		   req.session.accessToken = response.access_token;
		   req.session.expires = response.expires ? response.expires : 0;

		   FB.api('/me',
			  { access_token: req.session.accessToken },
			  function(response) {
			      if (response && !response.error) {
				  console.log('received: ' + JSON.stringify(response));		   
				  if (!req.session.fbid) {

				      req.pool.getConnection(function(err,connection) {
					      query = "INSERT INTO user values ('"+response.name+"', "+response.id+");";
					      console.log(query);
					      connection.query(query,
							       function(err, rows, fields) {
								   connection.release();
								   if (err) throw err;
							       });
					  });
				  }
				  req.session.fbid = response.id;
				  req.session.myName = response.name;
				  res.send(200);
			      }
			  });
	       });
    });

router.post('/updateFriendStatus', function(req, res) {
	console.log('updating: '+JSON.stringify(req.body));
	var data = req.body;
	req.pool.getConnection(function(err,connection) {
		var query = "SELECT fbid FROM user where user.name='"+data.name+"';";
		console.log(query);
		connection.query(query,
				 function(err, rows, fields) {
				     if (err) throw err;
				     query = "UPDATE friend SET visible='"+data.visible+"' WHERE fbid1="+req.session.fbid+" AND fbid2="+rows[0].fbid+";";
				     console.log(query);
				     connection.query(query,
						      function(err, rows, fields) {
							  connection.release();
							  if (err) throw err;
							  // we're done
							  res.send(200);
						      });
				 });
	    });
    });


module.exports = router;
