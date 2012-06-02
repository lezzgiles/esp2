// Routines for login page

///////////////////////////////////////////////////////////////////////////////
// Manage the lists

esp = {
    windows: {},
    db: {},
    types: { location:1,tran:1,tag:1,user:1,item:1,bin:1 },

    tell: function (type,details) {
	forEach (esp.windows, function(window) {
		if (!window.document) { return; }
		forEach(window.document.getElementsByName(type+'Table'), function(table) {
			table.setRow(details);
		    });
	    });
    },

    getAll: function(type,handlers) {
	if (type in esp.db) {
	    forEach (esp.db[type], function(details) { esp.tell(type,details) });
	    
	} else {
	    esp.sendRequest('get',{type:type},handlers);
	}
    },

    // Send a request of type command with parameters.
    // handlers is a hash:
    //   command-type, e.g. login: handler for this response type
    //   success: handler for success
    //   error: handler for failure
    // for response types in esp.types, takes standard action
    sendRequest: function(command,parameters,handlers) {
	if (!handlers) handlers = {};
	doit(command,parameters,function(results) {
		debug.write('Response: '+results);
		var retval = true;
		var message;
		if (results == null) {
		    message = "Request failed for an unknown reason";
		    retval = false;
		} else {
		    results = JSON.parse(results);
		    forEach (results, function(result) {
			    var command = result.shift();
			    if (command == 'error') {
				message = result[0];
				retval = false;
			    } else if (command in handlers) {
				handlers[command](results);
			    } else if (command in esp.types) {
				if (!(command in esp.db)) esp.db[command] = [];
				esp.db[command].push(result[0]);
				esp.tell(command,result[0]);
			    } else {
				message = "Internal error - got unexpected response "+command;
				retval = false;
			    }
			});
		}

		if (retval) {
		    if ('success' in handlers) {
			handlers.success();
		    }
		} else {
		    if ('error' in handlers) {
			handlers..error(message);
		    } else {
			alert(message);
		    }
		}
	    });
    },
};

///////////////////////////////////////////////////////////////////////////////
function clickLogin() {
    database = document.getElementById('database').value;
    username = document.getElementById('username').value;
    password = document.getElementById('password').value;

    if (database == "") { alert("Must specify a database name"); return false; }
    if (username == "") { alert("Must specify a username"); return false; }
    if (password == "") { alert("Must specify a password"); return false; }

    esp.sendRequest('login',{},{
	    login: function(myUserType) {
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
	});
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
    esp.windows = {};
    esp.db = {};
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
