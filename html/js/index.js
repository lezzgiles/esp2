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
	doit('get',{type:'location'});
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
    locationDetails.type = 'location';
    doit('setHidden',locationDetails,handlers);
}

function setLocationName(locationDetails,handlers) {
    doit('setLocationName',locationDetails,handlers);
}

///////////////////////////////////////////////////////////////////////////////
// Tag handling

function getTags() {
    if ('tag' in esp) {
	forEach (esp.tag, tellTag);
    } else {
	esp.tag = {};
	doit('get',{type:'tag'});
    }
}

// This handler is called after a doit("getTags"), once for each tag
handle.tag = function (tagDetails) {
    esp.tag[tagDetails.tagId] = tagDetails;
    tellTag(tagDetails);
}

function tellTag(tagDetails) {
    forEach (esp.windows, function(window) {
	    if (!window.document) { return; }
	    forEach(window.document.getElementsByName('tagTable'), function(table) {
		    table.setRow(tagDetails);
		});
	});
}

function addTag(tagDetails,handlers) {
    doit('addTag',tagDetails,handlers);
}

function setTagHidden(tagDetails,handlers) {
    tagDetails.type = 'tag';
    doit('setHidden',tagDetails,handlers);
}

function setTagName(tagDetails,handlers) {
    doit('setTagName',tagDetails,handlers);
}

///////////////////////////////////////////////////////////////////////////////
// User handling

function getUsers() {
    if ('users' in esp) {
	forEach (esp.users, tellUser);
    } else {
	esp.users = {};
	doit('get',{type:'user'});
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
    userDetails.type = 'user';
    doit('setHidden',userDetails,handlers);
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
// Item handling

function getItems() {
    if ('items' in esp) {
	forEach (esp.items, tellItem);
    } else {
	esp.items = {};
	doit('get',{type:'item'});
    }
}

// This handler is called after a doit("getItems"), once for each item
handle.item = function (itemDetails) {
    esp.items[itemDetails.itemId] = itemDetails;
    tellItem(itemDetails);
}

function tellItem(itemDetails) {
    forEach (esp.windows, function(window) {
	    if (!window.document) { return; }
	    forEach(window.document.getElementsByName('itemTable'), function(table) {
		    table.setRow(itemDetails);
		});
	});
}

function addItem(itemDetails,handlers) {
    doit('addItem',itemDetails,handlers);
}

function setItemHidden(itemDetails,handlers) {
    itemDetails.type = 'item';
    doit('setHidden',itemDetails,handlers);
}

function setItemMfr  (itemDetails,handlers) { doit('setItemMfr',itemDetails,handlers) }
function setItemBrand(itemDetails,handlers) { doit('setItemBrand',itemDetails,handlers) }
function setItemType (itemDetails,handlers) { doit('setItemType', itemDetails,handlers) }
function setItemDesc (itemDetails,handlers) { doit('setItemDesc', itemDetails,handlers) }
function setItemSize (itemDetails,handlers) { doit('setItemSize', itemDetails,handlers) }

///////////////////////////////////////////////////////////////////////////////
// Bin handling

function getBins() {
    if ('bins' in esp) {
	forEach (esp.bins, tellBin);
    } else {
	esp.bins = {};
	doit('get',{type:'bin'});
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
    binDetails.type = 'bin';
    doit('setHidden',binDetails,handlers);
}

function setBinName(binDetails,handlers) {
    doit('setBinName',binDetails,handlers);
}
function setBinLocation(binDetails,handlers) {
    doit('setBinLocation',binDetails,handlers);
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
    document.getElementById('itemButton').disabled = 'disabled';
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
    document.getElementById('itemButton').disabled = '';
    document.getElementById('tagButton').disabled = '';
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
    document.getElementById('itemButton').onclick = function() {
	esp.windows.bin = window.open("item.html","items",specs);
    }
    document.getElementById('adminButton').onclick = function() {
	esp.windows.admin = window.open("admin.html","admin",specs);
    }
    document.getElementById('tagButton').onclick = function() {
	esp.windows.tag = window.open("tag.html","tag",specs);
    }
    document.getElementById('changeMyPasswordButton').onclick = function() {
	esp.windows.changeMyPassword = window.open("changeMyPassword.html","changeMyPassword",specs+',height=240');
    }
    document.getElementById('debugButton').onclick = function() {
	esp.windows.debug = window.open("debug.html","debug",specs+',height=520,width=970');
    }
}
