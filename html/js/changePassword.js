// Routines for changePassword page

function clickChangePassword() {
    var changeUserId = window.opener.changePasswordUserId;
    var newPassword = document.getElementById('newPasswordText').value;
    var newPassword2 = document.getElementById('newPassword2Text').value;

    if (newPassword == "") {
	alert("You must enter a password");
	return;
    }
    if (newPassword != newPassword2) {
	alert("Passwords do not match");
	return;
    }

    opener.opener.esp.sendRequest('setUserPassword',{userId:changeUserId,newPassword:newPassword},{
	    success: function() { alert("Password changed"); window.close(); },
	    error: function(msg) { alert(msg); },
	});
}

// Set up the page after the html is fully loaded
window.onload = function () {
    document.getElementById('changeUserName').appendChild(document.createTextNode(window.opener.changePasswordUserName));
    document.getElementById('changePasswordSubmit').onclick = clickChangePassword;
}

