// Routines for changePassword page

function clickChangePassword() {
    var userName = window.opener.username;
    var oldPassword = document.getElementById('oldPasswordText').value;
    var newPassword = document.getElementById('newPasswordText').value;
    var newPassword2 = document.getElementById('newPassword2Text').value;

    if (oldPassword != window.opener.password) {
	alert("Password is wrong");
	return;
    }
    if (newPassword == "") {
	alert("You must enter a password");
	return;
    }
    if (newPassword != newPassword2) {
	alert("Passwords do not match");
	return;
    }
    
    opener.changeMyPassword({oldPassword:oldPassword,newPassword:newPassword},{
	    success: function() { window.close(); },
	    error: function(msg) { alert(msg); },
	});
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

	    } else if (result[0] == 'changeMyPassword')  {
		var newPassword = result[1];

		window.opener.password = newPassword;
		alert("Password changed");
		window.close();
	    }

        }
	return true;
    }
}

// Set up the page after the html is fully loaded
window.onload = function () {
    document.getElementById('changePasswordSubmit').onclick = clickChangePassword;
}

