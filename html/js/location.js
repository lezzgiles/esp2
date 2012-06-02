// Routines for location management page

function addLocation() {
    var locationName = document.getElementById('locationName').value;
    if (locationName == "") {
	alert("You must enter a name for the new location");
    } else {
	opener.esp.sendRequest('addLocation',{locationName:locationName}, {
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

function setLocation(locationDetails) {

    // Look to see if this location is already in the table
    var foundIt = false;
    forEach(this.rows,function(row) {
	    if (row.locationId == locationDetails.locationId) {
		foundIt = true;
		// This is the correct row, update as necessary
		row.cells[0].childNodes[0].value = locationDetails.locationName;
		hiddenRows.showRow(row,row.cells[1],'location',locationDetails);
	    }
		    
	});

    if (foundIt) { return; }
    
    // Not in the table, so add a row
    var tbody = this.tBodies[0];
    var tr = document.createElement('tr');
    tr.locationId = locationDetails.locationId

    // Location name textbox
    tr.appendChild(textTd('location',locationDetails,'Name',{},function(value) {
		if (value == "") {
		    alert("You cannot have an empty location name");
		    return false;
		} else {
		    return true;
		}
	    }));

    // Hide location checkbox
    tr.appendChild(hiddenRows.checkboxTd(tr,'location',locationDetails));

    tbody.insertBefore(tr,tbody.firstChild);

    // The table is no longer sorted
    clearSorted(document.getElementById('locationTable'));
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
    opener.esp.getAll('location');
    hiddenRows.init();
}

window.onunload = function () {
    delete opener.esp.windows.location;
}