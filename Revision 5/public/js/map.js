/* Tullie(a1646941), Andrew(a1646742), Hideki(a1658945) */

function initialize() {
    var mapOptions = {
        zoom: 11,
        center: new google.maps.LatLng(-34.9290, 138.6010)
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);

    // Request data
    var dataURL = "http://localhost:3000/model/friendLoc.json";
    var friendsReq = new XMLHttpRequest();
    friendsReq.onreadystatechange = function() {
        if (friendsReq.readyState == 4 && friendsReq.status == 200) {

            // Parse json
            var jsonData = JSON.parse(friendsReq.responseText);
            for (var i = 0; i < jsonData.friends.length; i++) {

                // Create marker from json data
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(jsonData.friends[i].lng, jsonData.friends[i].lat), 
                    title: jsonData.friends[i].name,
                    map: map
                });

                // Add marker click listener
                google.maps.event.addListener(marker, 'click', function() { 
                    console.log('marker pressed');
                });
            }
        }
    }
    friendsReq.open("GET", dataURL, true);
    friendsReq.send();
}

function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCOHJTwnDGuYLM3kLve6YMGgZGeDT78ofA&v=3.exp&' + 'callback=initialize';
    document.body.appendChild(script);
}

window.onload = loadScript;
