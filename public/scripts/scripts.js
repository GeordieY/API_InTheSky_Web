var localUser = localStorage.getItem("currentUser");

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
	var userBox = document.getElementById("userBox").innerHTML;
	if (!localUser && userBox != "") {
		localStorage.setItem('currentUser', userBox);
		localUser = localStorage.getItem("currentUser");
		document.getElementById("headerLoggedIn").classList.remove("hidden");;
	}
	else if (!localUser) {
		//window.location.replace("/");
	}


}

if(document.title == "BAC - Saved Data"){
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
