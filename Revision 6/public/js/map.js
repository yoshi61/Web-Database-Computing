/* Tullie(a1646941), Andrew(a1646742), Hideki(a1658945) */
var map = null;
var markers = [{}];
var infoWindow = null;

function initialize() {
    var mapOptions = {
        zoom: 11,
        center: new google.maps.LatLng(-34.9290, 138.6010)
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);

    // Request data
    var dataURL = "http://localhost:3000/model/friendLoc.json";
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
                    position: new google.maps.LatLng(jsonData.friends[i].lng, jsonData.friends[i].lat), 
                    title: jsonData.friends[i].name,
                    map: map,
                    id: i
                });

                markers[i] = marker;

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

function openInfoWindowById(id) {
    console.log("HELLO " + id);

}

function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCOHJTwnDGuYLM3kLve6YMGgZGeDT78ofA&v=3.exp&' + 'callback=initialize';
    document.body.appendChild(script);
}

window.onload = loadScript;
