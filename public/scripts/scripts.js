var localUser = localStorage.getItem("currentUser");

	var crashesGeoJSON;

if(!localUser){
	document.getElementById("headerLoggedIn").classList.add("hidden");
}
else{
	document.getElementById("headerLoggedIn").classList.remove("hidden");
}

if (document.title == "BAC - User Details") {
	var up = document.getElementById("updatedUser");
	if (up.innerHTML != "") {
		localStorage.setItem("currentUser", up.innerHTML);
		var localUser = localStorage.getItem("currentUser");
	}
}

if (document.title == "BAC - Index") { //handles login checking and redirection
	if (localUser) {
		var found = false;
		document.getElementById("userBox").innerHTML.slice(0, -1).split(",").forEach(function (a) {
			if (a == localUser) {
				found = true;
				window.location.replace("/search");
			}
		});
		if (!found) {
			document.getElementById("headerLogout").innerHTML = "";
			localStorage.clear();
			localUser = localStorage.getItem("currentUser");
		}
	} else {
		document.getElementById("headerLogout").innerHTML = "";
	}
}

if (document.title == "BAC - Search") {



	mapboxgl.accessToken = 'pk.eyJ1IjoibXVyZXl0YXNyb2MiLCJhIjoiY2p2aWU1azdwMDR5dzQzcWczeWN4NnB6MiJ9.rF3IVpExuuMrG-PFLfsaJQ';
	var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/dark-v10',
	center: [-74.0060, 40.7128],
	zoom: 9
	});

	map.on('load', function() {
	// Add a geojson point source.
	// Heatmap layers also work with a vector tile source.



	map.addSource('earthquakes', {
	"type": "geojson",
	"data": crashesGeoJSON
	});

	map.addLayer({
	"id": "earthquakes-heat",
	"type": "heatmap",
	"source": "earthquakes",
	"maxzoom": 9,
	"paint": {
	// Increase the heatmap weight based on frequency and property magnitude
	"heatmap-weight": [
	"interpolate",
	["linear"],
	["get", "mag"],
	0, 0,
	6, 1
	],
	// Increase the heatmap color weight weight by zoom level
	// heatmap-intensity is a multiplier on top of heatmap-weight
	"heatmap-intensity": [
	"interpolate",
	["linear"],
	["zoom"],
	0, 1,
	9, 3
	],
	// Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
	// Begin color ramp at 0-stop with a 0-transparancy color
	// to create a blur-like effect.
	"heatmap-color": [
	"interpolate",
	["linear"],
	["heatmap-density"],
	0, "rgba(33,102,172,0)",
	0.2, "rgb(103,169,207)",
	0.4, "rgb(209,229,240)",
	0.6, "rgb(253,219,199)",
	0.8, "rgb(239,138,98)",
	1, "rgb(178,24,43)"
	],
	// Adjust the heatmap radius by zoom level
	"heatmap-radius": [
	"interpolate",
	["linear"],
	["zoom"],
	0, 2,
	9, 20
	],
	// Transition from heatmap to circle layer by zoom level
	"heatmap-opacity": [
	"interpolate",
	["linear"],
	["zoom"],
	7, 1,
	9, 0
	],
	}
	}, 'waterway-label');

	map.addLayer({
	"id": "earthquakes-point",
	"type": "circle",
	"source": "earthquakes",
	"minzoom": 7,
	"paint": {
	// Size circle radius by earthquake magnitude and zoom level
	"circle-radius": [
	"interpolate",
	["linear"],
	["zoom"],
	7, [
	"interpolate",
	["linear"],
	["get", "mag"],
	1, 1,
	6, 4
	],
	16, [
	"interpolate",
	["linear"],
	["get", "mag"],
	1, 5,
	6, 50
	]
	],
	// Color circle by earthquake magnitude
	"circle-color": [
	"interpolate",
	["linear"],
	["get", "mag"],
	1, "rgba(33,102,172,0)",
	2, "rgb(103,169,207)",
	3, "rgb(209,229,240)",
	4, "rgb(253,219,199)",
	5, "rgb(239,138,98)",
	6, "rgb(178,24,43)"
	],
	"circle-stroke-color": "white",
	"circle-stroke-width": 1,
	// Transition from heatmap to circle layer by zoom level
	"circle-opacity": [
	"interpolate",
	["linear"],
	["zoom"],
	7, 0,
	8, 1
	]
	}
	}, 'waterway-label');
	});



	var userBox = document.getElementById("userBox").innerHTML;
	if (!localUser && userBox != "") {
		localStorage.setItem('currentUser', userBox);
		localUser = localStorage.getItem("currentUser");
		document.getElementById("headerLoggedIn").classList.remove("hidden");;
	}
	else if (!localUser) {
		//window.location.replace("/");
	}


	$("searchbc").click(function(){

		$.ajax({url: "/getdata?keyword="+$("searchterm").value+"&keywordtype="+$("searchoptions").value, success: function(result){
		    var bumps=result["bumps"];
				var crashes=result["crashes"];
				map.getSource('earthquakes').setData(crashes);
		  }});
	})


}

if(document.title == "BAC - Saved Data"){



		mapboxgl.accessToken = 'pk.eyJ1IjoibXVyZXl0YXNyb2MiLCJhIjoiY2p2aWU1azdwMDR5dzQzcWczeWN4NnB6MiJ9.rF3IVpExuuMrG-PFLfsaJQ';
		var map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/dark-v10',
		center: [-74.0060, 40.7128],
		zoom: 9
		});

		map.on('load', function() {
		// Add a geojson point source.
		// Heatmap layers also work with a vector tile source.



		map.addSource('earthquakes', {
		"type": "geojson",
		"data": crashesGeoJSON
		});

		map.addLayer({
		"id": "earthquakes-heat",
		"type": "heatmap",
		"source": "earthquakes",
		"maxzoom": 9,
		"paint": {
		// Increase the heatmap weight based on frequency and property magnitude
		"heatmap-weight": [
		"interpolate",
		["linear"],
		["get", "mag"],
		0, 0,
		6, 1
		],
		// Increase the heatmap color weight weight by zoom level
		// heatmap-intensity is a multiplier on top of heatmap-weight
		"heatmap-intensity": [
		"interpolate",
		["linear"],
		["zoom"],
		0, 1,
		9, 3
		],
		// Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
		// Begin color ramp at 0-stop with a 0-transparancy color
		// to create a blur-like effect.
		"heatmap-color": [
		"interpolate",
		["linear"],
		["heatmap-density"],
		0, "rgba(33,102,172,0)",
		0.2, "rgb(103,169,207)",
		0.4, "rgb(209,229,240)",
		0.6, "rgb(253,219,199)",
		0.8, "rgb(239,138,98)",
		1, "rgb(178,24,43)"
		],
		// Adjust the heatmap radius by zoom level
		"heatmap-radius": [
		"interpolate",
		["linear"],
		["zoom"],
		0, 2,
		9, 20
		],
		// Transition from heatmap to circle layer by zoom level
		"heatmap-opacity": [
		"interpolate",
		["linear"],
		["zoom"],
		7, 1,
		9, 0
		],
		}
		}, 'waterway-label');

		map.addLayer({
		"id": "earthquakes-point",
		"type": "circle",
		"source": "earthquakes",
		"minzoom": 7,
		"paint": {
		// Size circle radius by earthquake magnitude and zoom level
		"circle-radius": [
		"interpolate",
		["linear"],
		["zoom"],
		7, [
		"interpolate",
		["linear"],
		["get", "mag"],
		1, 1,
		6, 4
		],
		16, [
		"interpolate",
		["linear"],
		["get", "mag"],
		1, 5,
		6, 50
		]
		],
		// Color circle by earthquake magnitude
		"circle-color": [
		"interpolate",
		["linear"],
		["get", "mag"],
		1, "rgba(33,102,172,0)",
		2, "rgb(103,169,207)",
		3, "rgb(209,229,240)",
		4, "rgb(253,219,199)",
		5, "rgb(239,138,98)",
		6, "rgb(178,24,43)"
		],
		"circle-stroke-color": "white",
		"circle-stroke-width": 1,
		// Transition from heatmap to circle layer by zoom level
		"circle-opacity": [
		"interpolate",
		["linear"],
		["zoom"],
		7, 0,
		8, 1
		]
		}
		}, 'waterway-label');
		});



	if(!localUser){
		window.location.replace("/");
	}
}


if (localUser) { //if user is already logged in
	document.getElementById("headerDivider").innerHTML = "|";
	document.getElementById("headerLogout").innerHTML = "Log Out";
	if (document.title == "BAC - User Details") {
		document.getElementById("headerGreeter").innerHTML = "Logged in as " + localUser;
	} else {
		document.getElementById("headerGreeter").innerHTML = "Logged in as " + localUser + " | ";
	}
	document.getElementById("headerEdit").innerHTML = "Edit Account Info";
	document.getElementById("headerEdit").href = "/users/" + localUser + "/edit";

} else {
	if (document.title != "BAC - Index") {
		document.getElementById("headerLogout").innerHTML = "Log In";
	}
	document.getElementById("headerLogout").href = "/";
	document.getElementById("headerGreeter").innerHTML = "";
	document.getElementById("headerEdit").innerHTML = "";
}

document.getElementById("headerLogout").addEventListener("click", function () {
	localStorage.clear();
	window.location.replace("/");
});

if (document.title == "BAC - User Details") {
	document.getElementById("headerEdit").innerHTML = "";
	document.getElementById("headerEdit").href = "/";
}
