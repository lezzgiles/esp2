// Routines for location management page

function addLocation() {
    locationName = document.getElementById('locationName').value;
    if (locationName == "") {
	alert("You must enter a name for the new location");
    } else {
	opener.addLocation({locationName:locationName}, {
	    success:function() {
	        document.getElementById('locationName').value = "";
	        document.getElementById('locationName').focus();
	    },
	    error:function(message) {
		alert(message);
                document.getElementById('locationName').focus();
            },
	});
    }
}

function setLocationHidden(id) {
    return function() {
	opener.setLocationHidden({locationId:id,locationHidden:this.checked?1:0},{});
	return false;
    };
}

function setLocationName(id) {
    return function() {
	if (this.value == "") {
	    alert("You cannot have a blank location name");
	} else {
	    opener.setLocationName({locationId:id,locationName:this.value},{});
	}
	return false;
    }
}

setLocation = function(locationDetails) {

    // Look to see if this location is already in the table
    var foundIt = false;
    forEach(this.rows,function(row) {
	    if (row.locationId == locationDetails.locationId) {
		foundIt = true;
		// This is the correct row, update as necessary
		row.cells[0].childNodes[0].value = locationDetails.locationName;
		var showHidden = document.getElementById('locationHideCheckbox').checked;
		if (locationDetails.locationHidden == 1) {
		    row.cells[1].childNodes[0].checked = true;
		    if (showHidden) {
			row.style.display = 'table-row';
		    } else {
			row.style.display = 'none';
		    }
		} else {
		    row.cells[1].childNodes[0].checked = false;
		    row.style.display = 'table-row';
		}
	    }
		    
	});

    if (foundIt) { return; }
    
    // Not in the table, so add a row
    var tbody = this.tBodies[0];
    var tr = document.createElement('tr');
    tr.locationId = locationDetails.locationId

    // Location name textbox
    var nameTd = document.createElement('td');
    var locationNameText = document.createElement('input');
    locationNameText.type = 'text';
    locationNameText.value = locationDetails.locationName;
    if (window.opener.userType == 0) {
	locationNameText.disabled = true;
    }
    locationNameText.onkeyup = blurOnReturnKey;
    locationNameText.onchange = setLocationName(locationDetails.locationId);
    nameTd.appendChild(locationNameText);
    nameTd.setAttribute('sorttable_customkey', locationDetails.locationName);
    tr.appendChild(nameTd);

    // Hide location checkbox
    var hiddenTd = document.createElement('td');
    var hiddenCheckbox = document.createElement('input');
    hiddenCheckbox.type = 'checkbox';
    hiddenCheckbox.className = 'hiddencheckbox';
    var showHidden = document.getElementById('locationHideCheckbox').checked;
    if (locationDetails.locationHidden == 1) {
	hiddenCheckbox.checked = true;
	if (showHidden) {
	    tr.style.display = 'table-row';
	} else {
	    tr.style.display = 'none';
	}
    }
    if (window.opener.userType == 0) {
	hiddenCheckbox.disabled = true;
    }
    hiddenCheckbox.onclick = setLocationHidden(locationDetails.locationId);
    hiddenTd.appendChild(hiddenCheckbox);
    tr.appendChild(hiddenTd);

    tbody.insertBefore(tr,tbody.firstChild);

    // The table is no longer sorted
    clearSorted(document.getElementById('locationNameHeader'));
}

// Set up the page after the html is fully loaded
window.onload = function () {
    if (window.opener.userType == 0) {
	// readonly
	document.getElementById('addLocation').style.display = 'none';
    }
    document.getElementById('locationName').onchange = addLocation;
    document.getElementById('locationName').onkeyup = blurOnReturnKey;
    document.getElementById('locationTable').setRow = setLocation;
    opener.getLocations();
    hiddenRows.init();
}
