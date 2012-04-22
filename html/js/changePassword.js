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

    doit('changePassword',{changeUserId:changeUserId,newPassword:newPassword});
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

	    } else if (result[0] == 'changePassword')  {
		var changeUsername = result[1];
		alert("Password changed");
		window.close();
	    }

        }
	return true;
    }
}

// Set up the page after the html is fully loaded
window.onload = function () {
    document.getElementById('changeUserName').appendChild(document.createTextNode(window.opener.changePasswordUserName));
    document.getElementById('changePasswordSubmit').onclick = clickChangePassword;
}

