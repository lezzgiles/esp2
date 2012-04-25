// Routines for admin page

function clickSubmitAdd() {
    userName = document.getElementById('userNameText').value;
    userPassword = document.getElementById('userPasswordText').value;
    userPassword2 = document.getElementById('userPasswordText2').value;
    userType = document.getElementById('userTypeSelect').value;
    if (userName == "") {
	alert("You must enter a name for the new user");
	return;
    }
    if (userPassword == "") {
	alert("You must enter a password for the new user");
	return;
    }
    if (userPassword != userPassword2) {
	alert("Passwords do not match");
	return;
    }

    doit('addUser',{newName:userName,newPassword:userPassword,newType:userType})
}

handle.user = function(userId,userName,userType,userHidden) {
    var usersTable = document.getElementById('usersTable');
    var tbody = usersTable.tBodies[0];
    var tr = document.createElement('tr');

    // The username text field
    var nameTd = document.createElement('td');
    var userNameText = document.createElement('input');
    userNameText.type = 'text';
    userNameText.value = userName;
    userNameText.id = 'userNameText'+userId;
    userNameText.onkeyup = blurOnReturnKey;
    userNameText.onchange = changeUserName(userId,userNameText);
    nameTd.appendChild(userNameText);
    nameTd.setAttribute('sorttable_customkey', userName);
    tr.appendChild(nameTd);

    // The type select
    var typeTd = document.createElement('td');
    var typeSelect = document.createElement('select');

    var adminOption = document.createElement('option');
    adminOption.text = 'admin';
    adminOption.value = 2;
    if (userType == 2) { adminOption.selected = true; }
    typeSelect.add(adminOption);

    var normalOption = document.createElement('option');
    normalOption.text = 'normal';
    normalOption.value = 1;
    if (userType == 1) { normalOption.selected = true; }
    typeSelect.add(normalOption);

    var readonlyOption = document.createElement('option');
    readonlyOption.text = 'readonly';
    readonlyOption.value = 0;
    if (userType == 0) { readonlyOption.selected = true; }
    typeSelect.add(readonlyOption);

    typeSelect.id = 'typeSelect'+userId;
    typeSelect.onchange = typeSelectChange(userId,typeSelect);
    typeTd.appendChild(typeSelect);
    tr.appendChild(typeTd);

    // The hidden checkbox
    var hiddenTd = document.createElement('td');
    var hiddenCheckbox = document.createElement('input');
    hiddenCheckbox.type = 'checkbox';
    hiddenCheckbox.className = 'hiddencheckbox';
    if (userHidden == 1) {
	hiddenCheckbox.checked = true;
	tr.style.display = 'none';
    } 
    hiddenCheckbox.id = 'userHiddenCheckbox'+userId;
    hiddenCheckbox.onclick = userHiddenCheckboxClick(userId);
    hiddenTd.appendChild(hiddenCheckbox);
    tr.appendChild(hiddenTd);

    // The change password button
    var changePasswordTd = document.createElement('td');
    var changePasswordButton = document.createElement('input');
    changePasswordButton.type = 'button';
    changePasswordButton.value = 'Change password';
    changePasswordButton.onclick = changePasswordButtonClick(userId,userName);
    changePasswordTd.appendChild(changePasswordButton);
    tr.appendChild(changePasswordTd);
    
    tbody.insertBefore(tr,tbody.firstChild);

    // The table is no longer sorted
    clearSorted(document.getElementById('userNameHeader'));
}

function userHiddenCheckboxClick(id) { return function() {
	doit("hiddenUser",{userId:id});
	return false;
    }
}

handle.userHidden = function(userId,userHidden) {
		document.getElementById('userHiddenCheckbox'+userId).checked = (userHidden == 1);
}

function changePasswordButtonClick(id,name) { return function() {
	changePasswordUserId=id;
	changePasswordUserName=name;
	window.open("changePassword.html",'',"titlebar=no,location=no,menubar=no,status=yes,toolbar=no");
    }
}

function typeSelectChange(id,typeSelect) { return function() {
	doit("userType",{userId:id,userType:typeSelect[typeSelect.selectedIndex].value});
	return false;
    }
}

handle.userType = function(userId,userType) {
    typeSelect = document.getElementById('typeSelect'+userId);
    for each (var opt in typeSelect.options) {
	    if (userType == opt.value) {
		opt.selected = true;
	    } else {
		opt.selected = false;
	    }
	}
}    

function changeUserName(id,text) { return function() {
	if (text.value == "") {
	    alert("You cannot have a blank username");
	} else {
	    doit('changeUserName',{userId:id,newName:text.value});
	}
	return false;
    }
}

handle.userName = function(userId,newName) {
    var userNameText = document.getElementById('userNameText'+userId);
    userNameText.value = newName;
    userNameText.parentNode.setAttribute('sorttable_customkey', newName);

    // The table is no longer sorted
    clearSorted(document.getElementById('userNameHeader'));
}

// Set up the page after the html is fully loaded
window.onload = function () {
    document.getElementById('addUserSubmit').onclick = clickSubmitAdd;
    doit("getUsers",{});
    hiddenRows.init();
}

