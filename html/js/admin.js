// Routines for admin page

function addUser() {
    var userName = document.getElementById('userNameText').value;
    var userPassword = document.getElementById('userPasswordText').value;
    var userPassword2 = document.getElementById('userPasswordText2').value;
    var userType = document.getElementById('userTypeSelect').value;
    if (userName == "") {
	alert("You must enter a name for the new user");
    } else if (userPassword == "") {
	alert("You must enter a password for the new user");
    } else if (userPassword != userPassword2) {
	alert("Passwords do not match");
	return;
    } else {
	opener.addUser({newName:userName,newPassword:userPassword,newType:userType},{});
    }
}

function setUserType(id) {
    return function() {
	opener.setUserType({userId:id,userType:this.options[this.selectedIndex].value},{});
	return false;
    }
}

function changePasswordButtonClick(userDetails) { return function() {
	changePasswordUserId=userDetails.userId;
	changePasswordUserName=userDetails.userName;
	window.open("changePassword.html",'',"titlebar=no,location=no,menubar=no,status=yes,toolbar=no,width=600,height=300");
    }
}

function setUser(userDetails) {

    // Look to see if this user is already in the table
    var foundIt = false;
    forEach(this.rows,function(row) {
	    if (row.userId == userDetails.userId) {
		foundIt = true;
		// This is the correct row, update as necessary
		row.cells[0].childNodes[0].value = userDetails.userName;
		forEach (row.cells[1].childNodes[0].options,function(o) {
			o.selected = (o.value == userDetails.userType);
		    });
		hiddenRows.showRow(row,row.cells[2],'user',userDetails);
	    }
		    
	});

    if (foundIt) { return; }

    // Not in the table, so add a row
    var tbody = this.tBodies[0];
    var tr = document.createElement('tr');
    tr.userId = userDetails.userId;

    // The username text field
    tr.appendChild(textTd('user',userDetails,'Name',function(value) {
		if (value == "") {
		    alert("You cannot have a blank username");
		    return false;
		} else {
		    return true;
		}
	    }));

    // The type select
    var typeTd = document.createElement('td');
    var typeSelect = document.createElement('select');

    var adminOption = document.createElement('option');
    adminOption.text = 'admin';
    adminOption.value = 2;
    if (userDetails.userType == 2) { adminOption.selected = true; }
    typeSelect.add(adminOption);

    var normalOption = document.createElement('option');
    normalOption.text = 'normal';
    normalOption.value = 1;
    if (userDetails.userType == 1) { normalOption.selected = true; }
    typeSelect.add(normalOption);

    var readonlyOption = document.createElement('option');
    readonlyOption.text = 'readonly';
    readonlyOption.value = 0;
    if (userDetails.userType == 0) { readonlyOption.selected = true; }
    typeSelect.add(readonlyOption);

    typeSelect.id = 'typeSelect'+userDetails.userId;
    typeSelect.onchange = setUserType(userDetails.userId);
    typeTd.appendChild(typeSelect);
    tr.appendChild(typeTd);

    // The hidden checkbox
    tr.appendChild(hiddenRows.checkboxTd(tr,'user',userDetails));

    // The change password button
    var changePasswordTd = document.createElement('td');
    var changePasswordButton = document.createElement('input');
    changePasswordButton.type = 'button';
    changePasswordButton.value = 'Change password';
    changePasswordButton.onclick = changePasswordButtonClick(userDetails);
    changePasswordTd.appendChild(changePasswordButton);
    tr.appendChild(changePasswordTd);
    
    tbody.insertBefore(tr,tbody.firstChild);

    // The table is no longer sorted
    clearSorted(document.getElementById('userTable'));
}

// Set up the page after the html is fully loaded
window.onload = function () {
    document.getElementById('addUserSubmit').onclick = addUser;
    document.getElementById('userTable').setRow = setUser;
    opener.getUsers();
    hiddenRows.init();
}

window.onunload = function () {
    delete opener.esp.windows.admin;
}
