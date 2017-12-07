var map;
var markerArray=[];

function initialize() {

    var mapOptions = {
	center: new google.maps.LatLng(-34.918430, 138.582479),
	zoom: 8
    };
    map = new google.maps.Map(
			  document.getElementById("map-canvas"),
			  mapOptions);
}

function clearMarkers() {
    while(markerArray.length > 0) {
	markerArray[0].setMap(null);
	markerArray.splice(0,1);
    }
};

google.maps.event.addDomListener(window, 'load', initialize);
