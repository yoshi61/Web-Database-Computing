function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);

    if (response.status === 'connected') {

        console.log('Respone.status == connected');
        // Logged into your app and Facebook.
        authToServer(response, function() {
            //After logged in
            addFriendsToMap();
        }); 

    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
    } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
    }
}

function addFriendsToMap() {

    // Request data
    var dataURL = "http://localhost:3000/model/friendLoc.json";
    
    // Get list object
    var $listContainer = $("#side-list");

    var friendsReq = new XMLHttpRequest();
    friendsReq.onreadystatechange = function() {
        if (friendsReq.readyState == 4 && friendsReq.status == 200) {
            // Parse json
            var jsonData = JSON.parse(friendsReq.responseText);

            // Create one infowindow for all the markers
            infoWindow = new google.maps.InfoWindow({
                content: "Placeholder"
            });

            for (var i = 0; i < jsonData.friends.length; i++) {

                // Create marker from json data
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(jsonData.friends[i].lat, jsonData.friends[i].lng), 
                    title: jsonData.friends[i].name,
                    map: map,
                    id: i
                });

                markers[i] = marker;
                var a = $("<a>", {
                    class: "side-list-link",
                    href: "#" + (i+1)
                });

                var li = $("<li>", {
                    id: (i+1),
                    class: "side-list-element"
                });

                var h4 = $("<h4>", {
                    class: "friend-title",
                    text: jsonData.friends[i].name
                });

                var span = $("<span>", {
                    class: "friend-detail",
                    text: jsonData.friends[i].lng + ", " + jsonData.friends[i].lat
                })

                $listContainer.append(a);
                a.append(li);
                li.append(h4);
                li.append(span);

            // Add event listeners to side list to trigger infowindow
            a.on('click', function() {
                var id = $(this).attr("href").replace('#', '') - 1;
                infoWindow.setContent(markers[id].title);
                infoWindow.open(map, markers[id]);
            });
                // Add marker click listener
                google.maps.event.addListener(marker, 'click', function() {

                    // Select target and open infowindow
                    window.location.href = "#" + (this.id+1);
                    infoWindow.setContent(this.title);
                    infoWindow.open(map, this);
                });
            }
        }
    }
    friendsReq.open("GET", dataURL, true);
    friendsReq.send();
}

// This function is called when someone finishes with the Login Button.  
function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function() {
    FB.init({
        appId      : "1553870174836555",
    cookie     : true,  // enable cookies to allow the server to access the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.1' // use version 2.1
});

    // Return one of three login status'
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });

};

// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we send the authorised response to the server using post
function authToServer(authResponse, callback) { 

    // Login
    FB.login(function(response) {
        if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            FB.api('/me', function(response) {
                console.log('Good to see you, ' + response.name + '.');
            });
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {scope: 'user_tagged_places,user_location'});

    var authReq = new XMLHttpRequest();

    authReq.onreadystatechange = function() {
        if (authReq.readyState == 4 && authReq.status == 200) {
            console.log('logged in with server');
            callback(); 
        }
    }

    authReq.open("POST", "http://localhost:3000/auth", true); 
    authReq.setRequestHeader('Content-Type', 'application/json');
    authReq.send(JSON.stringify(authResponse));
}

