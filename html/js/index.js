// Routines for login page

// esp-specific data
esp = {
    windows: {},
};

///////////////////////////////////////////////////////////////////////////////
// Location handling

function getLocations() {
    if ('location' in esp) {
	forEach (esp.location, tellLocation);
    } else {
	esp.location = {};
	doit("getLocations",{});
    }
}

// This handler is called after a doit("getLocations"), once for each location
handle.location = function (locationDetails) {
    esp.location[locationDetails.locationId] = locationDetails;
    tellLocation(locationDetails);
}

function tellLocation(locationDetails) {
    forEach (esp.windows, function(window) {
	    if (!window.document) { return; }
	    forEach(window.document.getElementsByName('locationTable'), function(table) {
		    table.setRow(locationDetails);
		});
	});
}

function addLocation(locationDetails,handlers) {
    doit('addLocation',locationDetails,handlers);
}

function setLocationHidden(locationDetails,handlers) {
    doit('setLocationHidden',locationDetails,handlers);
}

function setLocationName(locationDetails,handlers) {
    doit('setLocationName',locationDetails,handlers);
}

///////////////////////////////////////////////////////////////////////////////
// User handling

function getUsers() {
    if ('users' in esp) {
	forEach (esp.users, tellUser);
    } else {
	esp.users = {};
	doit("getUsers",{});
    }
}

// This handler is called after a doit("getUsers"), once for each user
handle.user = function (userDetails) {
    esp.users[userDetails.userId] = userDetails;
    tellUser(userDetails);
}

function tellUser(userDetails) {
    forEach (esp.windows, function(window) {
	    if (!window.document) { return; }
	    forEach(window.document.getElementsByName('userTable'), function(table) {
		    table.setRow(userDetails);
		});
	});
}

function addUser(userDetails,handlers) {
    doit('addUser',userDetails,handlers);
}

function setUserHidden(userDetails,handlers) {
    doit('setUserHidden',userDetails,handlers);
}

function setUserType(userDetails,handlers) {
    doit('setUserType',userDetails,handlers);
}

function setUserName(userDetails,handlers) {
    doit('setUserName',userDetails,handlers);
}
function setUserPassword(userDetails,handlers) {
    doit('setUserPassword',userDetails,handlers);
}
function changeMyPassword(userDetails,handlers) {
    doit('changeMyPassword',userDetails,handlers);
}

///////////////////////////////////////////////////////////////////////////////
// Bin handling

function getBins() {
    if ('bins' in esp) {
	forEach (esp.bins, tellBin);
    } else {
	esp.bins = {};
	doit("getBins",{});
    }
}

// This handler is called after a doit("getBins"), once for each bin
handle.bin = function (binDetails) {
    esp.bins[binDetails.binId] = binDetails;
    tellBin(binDetails);
}

function tellBin(binDetails) {
    forEach (esp.windows, function(window) {
	    if (!window.document) { return; }
	    forEach(window.document.getElementsByName('binTable'), function(table) {
		    table.setRow(binDetails);
		});
	});
}

function addBin(binDetails,handlers) {
    doit('addBin',binDetails,handlers);
}

function setBinHidden(binDetails,handlers) {
    doit('setBinHidden',binDetails,handlers);
}

function setBinName(binDetails,handlers) {
    doit('setBinName',binDetails,handlers);
}
function setBinLocation(binDetails,handlers) {
    doit('setBinLocation',binDetails,handlers);
}
function setOptions(select,type) {
    if (type in esp) {
	// Save the current option so it can be restored after
	// recreating the options.
	var currentOptionValue = select.options[select.selectedIndex].value;
	//alert("Current option value is "+currentOptionValue+" = "+select.options[select.selectedIndex].text);
	
	// Remove all options
	while (select.options.length > 0) { select.remove(0); }

	var firstOption = null;
	forEach(esp[type],function(details) {
		if (details[type+'Hidden'] == 0) {
		    var option = document.createElement('option');
		    option.text = details[type+'Name'];
		    option.value = details[type+'Id'];
		    select.add(option,firstOption);
		    firstOption = option;
		    option.selected = (option.value == currentOptionValue);
		}
	    });

    } else {
	esp[type] = {}
	doit("getLocations",{},{
		success: function() {
		    setOptions(select,type);
		},
		    });
    }
}
///////////////////////////////////////////////////////////////////////////////
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
    document.getElementById('password').value = '';
    database = '';
    username = '';
    password = '';
    document.getElementById('locationsButton').disabled = 'disabled';
    document.getElementById('binsButton').disabled = 'disabled';
    document.getElementById('adminButton').disabled = 'disabled';
    document.getElementById('changeMyPasswordButton').disabled = 'disabled';
    document.getElementById('loginButton').disabled = '';
    document.getElementById('logoutButton').disabled = 'disabled';

    document.getElementById('database').disabled = '';
    document.getElementById('username').disabled = '';
    document.getElementById('password').disabled = '';

    forEach(esp.windows,function(w) { w.close() });

    // Empty the database
    esp = {
	windows: {},
    };
}

handle.login = function(myUserType) {
    userType = myUserType;
    // Login worked - enable the buttons
    document.getElementById('locationsButton').disabled = '';
    document.getElementById('binsButton').disabled = '';
    if (userType == 2) {
	document.getElementById('adminButton').disabled = '';
    }
    document.getElementById('changeMyPasswordButton').disabled = '';
    document.getElementById('loginButton').disabled = 'disabled';
    document.getElementById('logoutButton').disabled = '';
    
    document.getElementById('database').disabled = 'disabled';
    document.getElementById('username').disabled = 'disabled';
    document.getElementById('password').disabled = 'disabled';

    var loggedInMessage = document.getElementById('loggedInMessage');
    loggedInMessage.removeChild(loggedInMessage.childNodes[0]);
    loggedInMessage.insertBefore(document.createTextNode("Logged in to "+database+" as "+username),loggedInMessage.childNodes[0]);
}

window.onload = function() {
    var specs = "titlebar=no,location=no,menubar=no,status=yes,toolbar=no,width=600,scrollbars=yes";
    document.getElementById('loginButton').onclick = clickLogin;
    document.getElementById('logoutButton').onclick = clickLogout;
    document.getElementById('locationsButton').onclick = function() {
	esp.windows.location = window.open("location.html","locations",specs);
    }
    document.getElementById('binsButton').onclick = function() {
	esp.windows.bin = window.open("bin.html","bins",specs);
    }
    document.getElementById('adminButton').onclick = function() {
	esp.windows.admin = window.open("admin.html","admin",specs);
    }
    document.getElementById('changeMyPasswordButton').onclick = function() {
	esp.windows.changeMyPassword = window.open("changeMyPassword.html","changeMyPassword",specs+',height=240');
    }
    document.getElementById('debugButton').onclick = function() {
	esp.windows.debug = window.open("debug.html","debug",specs+',height=520,width=970');
    }
}
