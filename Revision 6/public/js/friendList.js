/* Tullie(a1646941), Andrew(a1646742), Hideki(a1658945) */

// Get list object
var $listContainer = $("#side-list");

// Request friend data
var dataURL = "http://localhost:3000/model/friendLoc.json";
var friendsReq = new XMLHttpRequest();
friendsReq.onreadystatechange = function() {
    if (friendsReq.readyState == 4 && friendsReq.status == 200) {

        // Parse json
        var jsonData = JSON.parse(friendsReq.responseText);
        for (var i = 0; i < jsonData.friends.length; i++) {

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
        }
    }
}
friendsReq.open("GET", dataURL, true);
friendsReq.send();
        
