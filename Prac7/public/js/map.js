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
