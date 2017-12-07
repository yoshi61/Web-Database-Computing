var express = require('express');
var FB = require('fb');
var data = require('./data');
var config = require('../config');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('myPage', { title: 'AAAAAAAA', name: 'BBBBBB' });
});

/* GET friend locations */
router.get('/model/friendLoc.json', function(req, res) {
 
     // Request friends from facebook
     var accessToken = req.session.accessToken;
     if (!accessToken) {
         console.log('access token not available');
         res.send(404);
     } else {
         FB.api("/me/friends", 
             { access_token: accessToken },
             function(response) {
                 if (response && !response.error) {
                     console.log('received:' + JSON.stringify(response.data));
 
                     // For each friend in the response get the location data
                     processFriends(response.data, accessToken,
                         function(locationData) {
                             console.log('finished processing friends' + JSON.stringify(locationData));
                             res.send(JSON.stringify(locationData));
                         });
                 } else {
                     console.log(response.error);
                     res.send(500);
                 }
             });
     }
});

function processFriends(friends, accessToken, callback) { 
    console.log('processing friends ' + friends);
    var friendCount = friends.length;
    var friendsProcessed = 0;
    var locationData = { friends: [] };
    var friendIndex = 0; 
    while(friendIndex < friendCount) {
        var friend = friends[friendIndex];

        // Get friend locations and add to the location Data
        getFriendLocations(friend, accessToken,
                function(name, locations) {
                    var placeIndex = 0;
                    var placeCount = locations.length;
                    while(placeIndex < placeCount) {
                        place = locations[placeIndex].place.location; 
                        console.log('adding place: ' + JSON.stringify(place));
                        var markerInfo = { 
                            name: name, 
                            lat:place.latitude, 
                            lng:place.longitude
                        }; 
                        locationData.friends.push(markerInfo);
                        placeIndex++; 
                    }
                    friendsProcessed++;
                    if (friendsProcessed == friendCount) {
                        callback(locationData); 
                    }
                });
        friendIndex++; 
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
                } else {
                    console.log(response.error); 
                    res.send(500);
                } 
            });
}

/* POST FB authorization data */
router.post('/auth', function(req, res) {

    console.log("POST request received");

    // Received short-lived token now exchange for 
    // long term access token
    FB.api('oauth/access_token', {
        grant_type: 'fb_exchange_token',
        client_id: config.facebook.appId,
        client_secret: config.facebook.appSecret,
        fb_exchange_token: req.body.authResponse.accessToken
    },
    function(response) {
        if (!response || response.error) {
            console.log(!response ? 'error occured' : response.error);
            return;
        }
        console.log('Long term token obtained');
        req.session.accessToken = response.access_token; 
        req.session.expires = response.expires ? res.expires : 0; 
        res.send(200);
    });
});

module.exports = router;
