/* Tullie(a1646941), Andrew(a1646742), Hideki(a1658945) */

function popUpHelpWindow() {

	var popUpBox = document.getElementById("pop-up-div");
	var blurBox = document.getElementById("blur-box");
	if (popUpBox.style.display == "none") {
		popUpBox.style.display = "block";
		blurBox.style.display = "block";
	} else {
		popUpBox.style.display = "none";
		blurBox.style.display = "none";
	}
}

var helpButton = document.getElementById("help-button");
helpButton.addEventListener("click", function() { popUpHelpWindow() } );

var blurBox = document.getElementById("blur-box");
blurBox.addEventListener("click", function() { popUpHelpWindow() });

