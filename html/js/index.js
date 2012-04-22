// Routines for login page

function clickLogin() {
    database = document.getElementById('database').value;
    username = document.getElementById('username').value;
    password = document.getElementById('password').value;

    if (database == "") { alert("Must specify a database name"); return false; }
    if (username == "") { alert("Must specify a username"); return false; }
    if (password == "") { alert("Must specify a password"); return false; }
    doit('login',{});
    
}

function clickLogout() {
    document.getElementById('database').value = ''
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    database = '';
    username = '';
    password = '';
    document.getElementById('locationsButton').disabled = 'disabled';
    document.getElementById('adminButton').disabled = 'disabled';
    document.getElementById('changeMyPasswordButton').disabled = 'disabled';
    document.getElementById('loginButton').disabled = '';
    document.getElementById('logoutButton').disabled = 'disabled';
    if (locationsWindow) { locationsWindow.close(); }
    if (adminWindow) { adminWindow.close(); }
    if (accountWindow) { accountWindow.close(); }
}

function handleResults(results) {
    if (results == null) {
	alert("Request failed for an unknown reason");
	return false;
    } else {
	results = eval(results);
	for each (var result in results) {
	    if (result[0] == 'alert') {
		alert(result[1]);
	    } else if (result[0] == 'login') {
		userType = result[1];

		// Login worked - enable the buttons
		document.getElementById('locationsButton').disabled = '';
		if (userType == 2) {
		    document.getElementById('adminButton').disabled = '';
		}
		document.getElementById('changeMyPasswordButton').disabled = '';
		document.getElementById('loginButton').disabled = 'disabled';
		document.getElementById('logoutButton').disabled = '';

		var loggedInMessage = document.getElementById('loggedInMessage');
		loggedInMessage.removeChild(loggedInMessage.childNodes[0]);
		loggedInMessage.insertBefore(document.createTextNode("Logged in to "+database+" as "+username),loggedInMessage.childNodes[0]);
	    }
	}
	return true;
    }
}

window.onload = function() {
    document.getElementById('loginButton').onclick = clickLogin;
    document.getElementById('logoutButton').onclick = clickLogout;
    document.getElementById('locationsButton').onclick = function() {
	locationsWindow = window.open("/locations.html","locations","titlebar=no,location=no,menubar=no,status=yes,toolbar=no");
    }
    document.getElementById('adminButton').onclick = function() {
	adminWindow = window.open("/admin.html","admin","titlebar=no,location=no,menubar=no,status=yes,toolbar=no");
    }
    document.getElementById('changeMyPasswordButton').onclick = function() {
	changeMyPasswordWindow = window.open("/changeMyPassword.html","changeMyPassword","titlebar=no,location=no,menubar=no,status=yes,toolbar=no");
    }
}