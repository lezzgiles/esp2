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

function setUserHidden(id) {
    return function() {
	opener.setUserHidden({userId:id,userHidden:this.checked?1:0},{});
	return false;
    };
}

function setUserName(id) {
    return function() {
	if (this.value == "") {
	    alert("You cannot have a blank username");
	} else {
	    opener.setUserName({userId:id,userName:this.value},{});
	}
	return false;
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

setUser = function(userDetails) {

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
		var showHidden = document.getElementById('userHideCheckbox').checked;
		if (userDetails.userHidden == 1) {
		    row.cells[2].childNodes[0].checked = true;
		    if (showHidden) {
			row.style.display = 'table-row';
		    } else {
			row.style.display = 'none';
		    }
		} else {
		    row.cells[2].childNodes[0].checked = false;
		    row.style.display = 'table-row';
		}
	    }
		    
	});

    if (foundIt) { return; }

    // Not in the table, so add a row
    var tbody = this.tBodies[0];
    var tr = document.createElement('tr');
    tr.userId = userDetails.userId;

    // The username text field
    var nameTd = document.createElement('td');
    var userNameText = document.createElement('input');
    userNameText.type = 'text';
    userNameText.value = userDetails.userName;
    userNameText.onkeyup = blurOnReturnKey;
    userNameText.onchange = setUserName(userDetails.userId);
    nameTd.appendChild(userNameText);
    nameTd.setAttribute('sorttable_customkey', userDetails.userName);
    tr.appendChild(nameTd);

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
    var hiddenTd = document.createElement('td');
    var hiddenCheckbox = document.createElement('input');
    hiddenCheckbox.type = 'checkbox';
    hiddenCheckbox.className = 'hiddencheckbox';
    var showHidden = document.getElementById('userHideCheckbox').checked;
    if (userDetails.userHidden == 1) {
	hiddenCheckbox.checked = true;
	if (showHidden) {
	    tr.style.display = 'table-row';
	} else {
	    tr.style.display = 'none';
	}
    } 
    hiddenCheckbox.id = 'userHiddenCheckbox'+userDetails.userId;
    hiddenCheckbox.onclick = setUserHidden(userDetails.userId);
    hiddenTd.appendChild(hiddenCheckbox);
    tr.appendChild(hiddenTd);

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
    clearSorted(document.getElementById('userNameHeader'));
}

// Set up the page after the html is fully loaded
window.onload = function () {
    document.getElementById('addUserSubmit').onclick = addUser;
    document.getElementById('userTable').setRow = setUser;
    opener.getUsers();
    hiddenRows.init();
}

