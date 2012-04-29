// Routines for changePassword page

function clickChangePassword() {
    changeUserId = window.opener.changePasswordUserId;
    newPassword = document.getElementById('newPasswordText').value;
    newPassword2 = document.getElementById('newPassword2Text').value;

    if (newPassword == "") {
	alert("You must enter a password");
	return;
    }
    if (newPassword != newPassword2) {
	alert("Passwords do not match");
	return;
    }

    opener.opener.setUserPassword({userId:changeUserId,newPassword:newPassword},{
	    success: function() { window.close(); },
	    error: function(msg) { alert(msg); },
	});
}

handle.changePassword = function(changeUsername) {
    alert("Password changed");
    window.close();
}

// Set up the page after the html is fully loaded
window.onload = function () {
    document.getElementById('changeUserName').appendChild(document.createTextNode(window.opener.changePasswordUserName));
    document.getElementById('changePasswordSubmit').onclick = clickChangePassword;
}

