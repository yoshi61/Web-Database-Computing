/* Tullie(a1646941), Andrew(a1646742), Hideki(a1658945) */


// Get list object
var listContainer = document.getElementById("side-list");

// Request friend data
var dataURL = "http://localhost:3000/model/friendLoc.json";
var friendsReq = new XMLHttpRequest();
friendsReq.onreadystatechange = function() {
    if (friendsReq.readyState == 4 && friendsReq.status == 200) {

        // Parse json
        var jsonData = JSON.parse(friendsReq.responseText);
        for (var i = 0; i < jsonData.friends.length; i++) {
            console.log("Add friend entry");

            // List row
            var listElement = document.createElement("li");
            listContainer.appendChild(listElement);
            var listClassAtt = document.createAttribute("class");
            listClassAtt.value = "side-list-element"; 
            listElement.setAttributeNode(listClassAtt); // class="side-list-element"

            // Title
            var elementTitle = document.createElement("h4");
            elementTitle.appendChild(document.createTextNode(jsonData.friends[i].name));
            listElement.appendChild(elementTitle);
            var titleClassAtt = document.createAttribute("class");
            titleClassAtt.value = "friend-title";
            elementTitle.setAttributeNode(titleClassAtt); // class="friend-title"
            
            // Detail
            var detailSpan = document.createElement("span");
            detailSpan.appendChild(document.createTextNode(jsonData.friends[i].lng + ", " + jsonData.friends[i].lat));
            listElement.appendChild(detailSpan);
            var detailClassAtt = document.createAttribute("class");
            detailClassAtt.value = "friend-detail"; 
            detailSpan.setAttributeNode(detailClassAtt); // class="friend-detail" 
        }
    }
}
friendsReq.open("GET", dataURL, true);
friendsReq.send();
        

