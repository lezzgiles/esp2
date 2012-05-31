// Routines for login page

// esp-specific data
esp = {
    windows: {},
};

///////////////////////////////////////////////////////////////////////////////
function tell(type,details) {
    forEach (esp.windows, function(window) {
	    if (!window.document) { return; }
	    forEach(window.document.getElementsByName(type+'Table'), function(table) {
		    table.setRow(details);
		});
	});
}
function tellLocation(locationDetails) {
    forEach (esp.windows, function(window) {
	    if (!window.document) { return; }
	    forEach(window.document.getElementsByName('locationTable'), function(table) {
		    table.setRow(locationDetails);
		});
	});
}

function tellTag(tagDetails) {
    forEach (esp.windows, function(window) {
	    if (!window.document) { return; }
	    forEach(window.document.getElementsByName('tagTable'), function(table) {
		    table.setRow(tagDetails);
		});
	});
}

function tellUser(userDetails) {
    forEach (esp.windows, function(window) {
	    if (!window.document) { return; }
	    forEach(window.document.getElementsByName('userTable'), function(table) {
		    table.setRow(userDetails);
		});
	});
}

function tellItem(itemDetails) {
    forEach (esp.windows, function(window) {
	    if (!window.document) { return; }
	    forEach(window.document.getElementsByName('itemTable'), function(table) {
		    table.setRow(itemDetails);
		});
	});
}

function tellBin(binDetails) {
    forEach (esp.windows, function(window) {
	    if (!window.document) { return; }
	    forEach(window.document.getElementsByName('binTable'), function(table) {
		    table.setRow(binDetails);
		});
	});
}

function tellTran(tranDetails) {
    forEach (esp.windows, function(window) {
	    if (!window.document) { return; }
	    forEach(window.document.getElementsByName('tranTable'), function(table) {
		    table.setRow(tranDetails);
		});
	});
}

function tellPurchase(purchaseDetails) {
    forEach (esp.windows, function(window) {
	    if (!window.document) { return; }
	    forEach(window.document.getElementsByName('purchaseTable'), function(table) {
		    table.setRow(purchaseDetails);
		});
	});
}

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

function addTag(tagDetails,handlers) {
    doit('addTag',tagDetails,handlers);
}

function setTagName(tagDetails,handlers) {
    doit('setTagName',tagDetails,handlers);
}

///////////////////////////////////////////////////////////////////////////////
// User handling

function getUsers() {
    if ('user' in esp) {
	forEach (esp.user, tellUser);
    } else {
	esp.user = {};
	doit('get',{type:'user'});
    }
}

// This handler is called after a doit("getUsers"), once for each user
handle.user = function (userDetails) {
    esp.user[userDetails.userId] = userDetails;
    tellUser(userDetails);
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
    if ('item' in esp) {
	forEach (esp.item, tellItem);
    } else {
	esp.item = {};
	doit('get',{type:'item'});
    }
}

// This handler is called after a doit("getItems"), once for each item
handle.item = function (itemDetails) {
    esp.item[itemDetails.itemId] = itemDetails;
    tellItem(itemDetails);
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
function setItemTags (itemDetails,handlers) { doit('setItemTags', itemDetails,handlers) }

///////////////////////////////////////////////////////////////////////////////
// Bin handling

function getBins() {
    if ('bin' in esp) {
	forEach (esp.bin, tellBin);
    } else {
	esp.bin = {};
	doit('get',{type:'bin'});
    }
}

// This handler is called after a doit("getBins"), once for each bin
handle.bin = function (binDetails) {
    esp.bin[binDetails.binId] = binDetails;
    tellBin(binDetails);
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
// Transactions

handle.tran = function(tranDetails) {
    tellTran(tranDetails);
}

function getPurchases() {
    if ('purchase' in esp) {
	forEach (esp.purchase, tellPurchase);
    } else {
	//esp.purchase = {};
	doit('get',{type:'purchase'});
    }
}

function addPurchase(purchaseDetails,handlers) {
    doit('addPurchase',purchaseDetails,handlers);
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

var windowDetails = {
    location: { height: 700, width: 600, title: 'locations', userType: 1 },
    purchase: { height: 700, width: 600, title: 'purchases', userType: 1 },
    bin: { height: 700, width: 600, title: 'bins', userType: 1 },
    item: { height: 700, width: 1100, title: 'items', userType: 1 },
    admin: { height: 700, width: 1100, title: 'admin', userType: 2 },
    tag: { height: 700, width: 1100, title: 'tag', userType: 1 },
    changeMyPassword: { height: 240, width: 600, title: 'Change my password', userType: 0 },
}

function clickLogout() {
    document.getElementById('password').value = '';
    database = '';
    username = '';
    password = '';
    forEach (Object.keys(windowDetails), function(w) { document.getElementById(w+'Button').disabled = true });

    document.getElementById('loginButton').disabled = false;
    document.getElementById('logoutButton').disabled = true;

    document.getElementById('database').disabled = false;
    document.getElementById('username').disabled = false;
    document.getElementById('password').disabled = false;

    forEach(esp.windows,function(w) { w.close() });

    // Empty the database
    esp = { windows: {} };
}

handle.login = function(myUserType) {
    userType = myUserType;
    // Login worked - enable the buttons
    forEach (Object.keys(windowDetails), function(w) {
	    if (windowDetails[w].userType <= userType) {
		document.getElementById(w+'Button').disabled = false;
	    }
	});

    document.getElementById('loginButton').disabled = true;
    document.getElementById('logoutButton').disabled = false;
    
    document.getElementById('database').disabled = true;
    document.getElementById('username').disabled = true;
    document.getElementById('password').disabled = true;

    document.getElementById('loggedInMessage').value = "Logged in to "+database+" as "+username;
}

window.onload = function() {
    var specs = "titlebar=no,location=no,menubar=no,status=yes,toolbar=no,scrollbars=yes";
    document.getElementById('loginButton').onclick = clickLogin;
    document.getElementById('logoutButton').onclick = clickLogout;
    forEach (Object.keys(windowDetails), function(w) { 
	    document.getElementById(w+'Button').onclick = function() {
		if (esp.windows[w]) {
		    esp.windows[w].focus();
		} else {
		    esp.windows[w] = window.open(w+".html",windowDetails[w].title,specs+',height='+windowDetails[w].height+',width='+windowDetails[w].width);
		}
	    }
	});
    document.getElementById('debugButton').onclick = function() {
	esp.windows.debug = window.open("debug.html","debug",specs+',height=520,width=650');
    }
}
