var localUser = localStorage.getItem("currentUser");

var lastKeyword = "";
var lastKeywordType = "";
var bumpsGJAllFeatures = [];
var grashesGJAllFeatures = [];

var map;

var crashesGJ;
var bumpsGJ;



if (!localUser) {
  document.getElementById("headerLoggedIn").classList.add("hidden");
} else {
  document.getElementById("headerLoggedIn").classList.remove("hidden");
  document.getElementById("savedDataLink").classList.remove("hidden");
  document.getElementById("savedDataLink").href = "/user/" + localUser + "/data";
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
    document.getElementById("userBox").innerHTML.slice(0, -1).split(",").forEach(function(a) {
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
  $('#searchB').hide();

  setupMap(function() {
    $("#loader").show()
    $.ajax({
      url: "/getdata?keyword=&keywordtype=street",
      success: function(result) {


        bumpsGJ = {
          "type": "FeatureCollection",
          "features": JSON.parse(result)["bumps"]
        };
        crashesGJ["features"] = JSON.parse(result)["crashes"];
        bumpsGJAllFeatures = bumpsGJ["features"];
        crashesGJAllFeatures = crashesGJ["features"];

        map.getSource('bumps').setData(bumpsGJ);
        map.getSource('crashes').setData(crashesGJ);
        $("#loader").hide()
        //document.getElementById("searchB").classList.remove("hidden");
        $('#searchB').fadeIn();
        document.getElementById("loader").style.float = "right";

      }
    });
  });









  var userBox = document.getElementById("userBox").innerHTML;
  if (!localUser && userBox != "") {
    localStorage.setItem('currentUser', userBox);
    localUser = localStorage.getItem("currentUser");
    document.getElementById("headerLoggedIn").classList.remove("hidden");;
  } else if (!localUser) {
    //window.location.replace("/");
  }



  $("#searchbc").click(async function() {
    //$('#save').hide()
    $("#loader").show()
    lastKeyword = $("#searchterm").val();
    lastKeywordType = $("#searchoptions").val();

    await searchData();
    //testie

    map.getSource('bumps').setData(bumpsGJ);
    map.getSource('crashes').setData(crashesGJ);
    $("#loader").hide()
    if (localUser) {
      $('#save').html('<button id="savebut" data-toggle="modal" data-target="#saveviewmodal" type="button">Save this view</button>');
      $('#save').show()
    }


  })


  $('#savebutmodal').click(function() {
    $('#save').html('<span class="red">Saving...</span>');

    $.post("/savedata", {
        id: localUser,
        keyword: lastKeyword,
        keywordtype: lastKeywordType,
        savename: $('#viewsavename').val()
      },
      function(data, status) {
        $('#save').html('<span class="green">Saved</span>');
      });
  })




}

if(document.title == "BAC - Saved Data"){

$('#searchB').hide()

		setupMap(function(){

			$("#loader").show()
		$.ajax({url: "/getdata?keyword=&keywordtype=street", success: function(result){


				bumpsGJ={"type":"FeatureCollection","features":JSON.parse(result)["bumps"]};
				crashesGJ["features"]=JSON.parse(result)["crashes"];
				bumpsGJAllFeatures=bumpsGJ["features"];
				crashesGJAllFeatures=crashesGJ["features"];

				//map.getSource('bumps').setData(bumpsGJ);
				//map.getSource('crashes').setData(crashesGJ);
				$("#loader").hide()
				//document.getElementById("searchB").classList.remove("hidden");
				$('#searchB').fadeIn();
				document.getElementById("loader").style.float="right";

			}});
		});

$('#svbutton').click(async function(){
	var savedViewsD=JSON.parse($('#savedViewsData').html());
	var viewName=$("#searchoptions").val();
	savedViewsD.forEach(function(view){
		if(view['name']==viewName){
			lastKeyword=view['keyword']
			lastKeywordType=view['keywordtype']
		}
	})

	//$('#save').hide()
	$("#loader").show()

await searchData();
//testie

		map.getSource('bumps').setData(bumpsGJ);
		map.getSource('crashes').setData(crashesGJ);
			$("#loader").hide()
			if(localUser){
				$('#save').html('<button id="savebut" data-toggle="modal" data-target="#saveviewmodal" type="button">Save this view</button>');
			$('#save').show()}


})

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

document.getElementById("headerLogout").addEventListener("click", function() {
  localStorage.clear();
  window.location.replace("/");
});

if (document.title == "BAC - User Details") {
  document.getElementById("headerEdit").innerHTML = "";
  document.getElementById("headerEdit").href = "/";
}


async function searchData() {
  if (lastKeywordType == "beforedate") {
    bumpsGJ["features"] = bumpsGJAllFeatures.filter(function(feat) {
      return (new Date(feat["date"]) < new Date(lastKeyword));
    });
    crashesGJ["features"] = crashesGJAllFeatures.filter(function(feat) {
      return (new Date(feat["date"]) < new Date(lastKeyword));
    });
  } else if (lastKeywordType == "afterdate") {
    bumpsGJ["features"] = bumpsGJAllFeatures.filter(function(feat) {
      return (new Date(feat["date"]) > new Date(lastKeyword));
    });
    crashesGJ["features"] = crashesGJAllFeatures.filter(function(feat) {
      return (new Date(feat["date"]) > new Date(lastKeyword));
    });
  } else if (lastKeywordType == "zipcode") {
    bumpsGJ["features"] = bumpsGJAllFeatures.filter(function(feat) {
      return (feat["zipcode"] == lastKeyword);
    });
    crashesGJ["features"] = crashesGJAllFeatures.filter(function(feat) {
      return (feat["zipcode"] == lastKeyword);
    });
  } else if (lastKeywordType == "street") {
    bumpsGJ["features"] = bumpsGJAllFeatures.filter(function(feat) {
      return (feat["street"].toLowerCase().includes(lastKeyword.toLowerCase()) || lastKeyword.toLowerCase().includes(feat["street"].toLowerCase()));
    });
    crashesGJ["features"] = crashesGJAllFeatures.filter(function(feat) {
      return (feat["street"].toLowerCase().includes(lastKeyword.toLowerCase()) || lastKeyword.toLowerCase().includes(feat["street"].toLowerCase()));
    });
  } else if (lastKeywordType == "borough") {
    bumpsGJ["features"] = bumpsGJAllFeatures.filter(function(feat) {
      return (feat["borough"].toLowerCase() == lastKeyword.toLowerCase());
    });
    crashesGJ["features"] = crashesGJAllFeatures.filter(function(feat) {
      return (feat["borough"].toLowerCase() == lastKeyword.toLowerCase());
    });
  }
  return;
}

async function setupMap(endstuff) {
  mapboxgl.accessToken = 'pk.eyJ1IjoibXVyZXl0YXNyb2MiLCJhIjoiY2p2aWU1azdwMDR5dzQzcWczeWN4NnB6MiJ9.rF3IVpExuuMrG-PFLfsaJQ';
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-74.0060, 40.7128],
    zoom: 9
  });

  crashesGJ = {
    "type": "FeatureCollection",
    "features": []
  };

  bumpsGJ = {
    "type": "FeatureCollection",
    "features": []
  };

  map.on('load', function() {
    // Add a geojson point source.
    // Heatmap layers also work with a vector tile source.

    map.addSource('crashes', {
      "type": "geojson",
      "data": crashesGJ
    });

    map.addSource('bumps', {
      "type": "geojson",
      "data": bumpsGJ
    });

    map.addLayer({
      'id': 'crashes',
      'type': 'circle',
      'source': 'crashes',
      'paint': {
        // make circles larger as the user zooms from z12 to z22
        'circle-radius': {
          'base': 1.75,
          'stops': [
            [12, 2],
            [22, 180]
          ]
        },
        // color circles by ethnicity, using a match expression
        // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
        'circle-color': [
          'match',
          ['get', 'severity'],
          '0', '#735000',
          '1', '#8c5000',
          '2', '#cd5000',
          '3', '#ff5000',
          '4', '#ff0000',
          /* other */
          '#735000'
        ]
      }
    });

    map.addLayer({
      'id': 'bumps',
      'type': 'circle',
      'source': 'bumps',
      'paint': {
        // make circles larger as the user zooms from z12 to z22
        'circle-radius': {
          'base': 1.75,
          'stops': [
            [12, 2],
            [22, 180]
          ]
        },
        // color circles by ethnicity, using a match expression
        // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
        'circle-color': '#00ff00'
      }
    });
    endstuff();
  });
}
