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
    
    opener.esp.sendRequest('changeMyPassword',{oldPassword:oldPassword,newPassword:newPassword},{
	    changeMyPassword: function(results) {
		var newPassword = result[1];
		window.opener.password = newPassword;
		alert("Password changed");
	    },
	    success: function() { window.close(); },
	    error: function(msg) { alert(msg); },
	});
}

// Set up the page after the html is fully loaded
window.onload = function () {
    document.getElementById('changePasswordSubmit').onclick = clickChangePassword;
}

