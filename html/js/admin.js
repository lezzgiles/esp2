// Routines for admin page

function blurOnReturnKey(evt) {
   var evt = (evt) ? evt : ((event) ? event : null);
   var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
    if (evt.keyCode == 13) { node.blur(); return false;}
}
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

function handleResults(results) {
    if (results == null) {
	alert("Request failed for an unknown reason");
	return false;
    } else {
	results = eval(results);
	for each (var result in results) {
	    if (result[0] == 'alert') {
		alert(result[1]);

	    } else if (result[0] == 'user')  {
		var userId = result[1];
		var userName = result[2];
		var userType = result[3];
		var userObsolete = result[4];

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

		// The obsolete checkbox
		var obsoleteTd = document.createElement('td');
		var obsoleteCheckbox = document.createElement('input');
		obsoleteCheckbox.type = 'checkbox';
		obsoleteCheckbox.checked = (userObsolete == 1);
		obsoleteCheckbox.id = 'userObsoleteCheckbox'+userId;
		obsoleteCheckbox.onclick = userObsoleteCheckboxClick(userId);
		obsoleteTd.appendChild(obsoleteCheckbox);
		tr.appendChild(obsoleteTd);

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

	    } else if (result[0] == 'userType') {
		var userId = result[1];
		var userType = result[2];
		typeSelect = document.getElementById('typeSelect'+userId);
		for each (var opt in typeSelect.options) {
		    if (userType == opt.value) {
			opt.selected = true;
		    } else {
			opt.selected = false;
		    }
		}


	    } else if (result[0] == 'userObsolete') {
		var userId = result[1];
		var userObsolete = result[2];
		document.getElementById('userObsoleteCheckbox'+userId).checked = (userObsolete == 1);

	    } else if (result[0] == 'username') {
		var userId = result[1];
		var newName = result[2];
		var userNameText = document.getElementById('userNameText'+userId);
		userNameText.value = newName;
		userNameText.parentNode.setAttribute('sorttable_customkey', newName);

		// The table is no longer sorted
		clearSorted(document.getElementById('userNameHeader'));
	    }

        }
	return true;
    }
}

function clearSorted(header) {
    sortfwdind = document.getElementById('sorttable_sortfwdind');
    if (sortfwdind) { sortfwdind.parentNode.removeChild(sortfwdind); }
    sortrevind = document.getElementById('sorttable_sortrevind');
    if (sortrevind) { sortrevind.parentNode.removeChild(sortrevind); }
    header.className = header.className.replace('sorttable_sorted_reverse','');
    header.className = header.className.replace('sorttable_sorted','');
}

function userObsoleteCheckboxClick(id) { return function() {
	doit("obsoleteUser",{userId:id});
	return false;
    }
}

function changePasswordButtonClick(id,name) { return function() {
	changePasswordUserId=id;
	changePasswordUserName=name;
	window.open("/changePassword.html",'',"titlebar=no,location=no,menubar=no,status=yes,toolbar=no");
    }
}

function typeSelectChange(id,typeSelect) { return function() {
	doit("userType",{userId:id,userType:typeSelect[typeSelect.selectedIndex].value});
	return false;
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

// Set up the page after the html is fully loaded
window.onload = function () {
    document.getElementById('addUserSubmit').onclick = clickSubmitAdd;
    doit("getUsers",{});
}

