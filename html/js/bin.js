// Routines for bin management page

function addBin() {
    binName = document.getElementById('binName').value;
    binSlots = document.getElementById('binSlots').value;
    binLocationSelect = document.getElementById('binLocation');
    binLocation = binLocationSelect.options[binLocationSelect.selectedIndex].value;
    if (binName == "") {
	alert("You must enter a name for the new bin");
    } else if (binSlots == "") {
	alert("You must enter the number of items that can be stored in the new bin.  Enter 0 for no limit.");
    } else {
	opener.addBin({binName:binName,binSlots:binSlots,locationId:binLocation}, {
		success:function() {
		    document.getElementById('binName').value = "";
		    document.getElementById('binName').focus();
		    select = document.getElementById('binLocation');
		    while (select.options.length > 0) { select.remove(0) }
		    var option = document.createElement('option');
		    option.text = 'Select one';
		    select.add(option);
		    select.expanded = false;
		},
		error:function(msg) {
		    alert(msg);
		    document.getElementById('binName').focus();
		},
		    });
    }
}

function setBinHidden(id) {
    return function() {
	opener.setBinHidden({binId:id,binHidden:this.checked?1:0},{});
	return false;
    }
}

function setBinName(id) {
    return function() {
	if (this.value == "") {
	    alert("You cannot have a blank bin name");
	} else {
	    opener.setBinName({binId:id,binName:this.value},{});
	}
	return false;
    }
}

function setBinSlots(id) {
    return function() {
	if (this.value == "") {
	    alert("You cannot have a blank bin size");
	} else {
	    opener.setBinSlots({binId:id,newSlots:this.value},{});
	}
	return false;
    }
}

function setLocationOptions() {
    // set the list of options for this from opener.esp.locations
}

function setBinLocation(id) {
    return function() {
	opener.setBinLocation({binId:id,locationId:this.options[this.selectedIndex].value},{});
	return false;
    }
}

function setBin(binDetails) {

    // Look to see if this bin is already in the table
    var foundIt = false;
    forEach(this.rows,function(row) {
	    if (row.binId == binDetails.binId) {
		foundIt = true;
		// This is the correct row, update as necessary
		// name
		row.cells[0].childNodes[0].value = binDetails.binName;
		// slots
		row.cells[1].childNodes[0].value = binDetails.binSlots;
		// location
		var locationSelect = row.cells[2].childNodes[0];
		// Remove all the old options
		while (locationSelect.options.length > 0) { locationSelect.remove(0) }
		// Create a new option
		var locationOption = document.createElement('option');
		locationOption.text = binDetails.locationName;
		locationOption.value = binDetails.locationId;
		locationSelect.add(locationOption);

		// hidden
		var showHidden = document.getElementById('binHideCheckbox').checked;
		if (binDetails.binHidden == 1) {
		    row.cells[3].childNodes[0].checked = true;
		    if (showHidden) {
			row.style.display = 'table-row';
		    } else {
			row.style.display = 'none';
		    }
		} else {
		    row.cells[3].childNodes[0].checked = false;
		    row.style.display = 'table-row';
		}
		
	    }
		    
	});

    if (foundIt) { return; }

    var tbody = this.tBodies[0];
    var tr = document.createElement('tr');
    tr.binId = binDetails.binId

    // Bin name textbox
    var nameTd = document.createElement('td');
    var binNameText = document.createElement('input');
    binNameText.type = 'text';
    binNameText.value = binDetails.binName;
    if (window.opener.userType == 0) {
	binNameText.disabled = true;
    }
    binNameText.onkeyup = blurOnReturnKey;
    binNameText.onchange = setBinName(binDetails.binId);
    nameTd.appendChild(binNameText);
    nameTd.setAttribute('sorttable_customkey', binDetails.binName);
    tr.appendChild(nameTd);

    // Bin slots textbox
    var slotsTd = document.createElement('td');
    var binSlotsText = document.createElement('input');
    binSlotsText.type = 'text';
    binSlotsText.size = 5;
    binSlotsText.value = binDetails.binSlots;
    if (window.opener.userType == 0) {
	binSlotsText.disabled = true;
    }
    binSlotsText.onkeyup = blurOnReturnKey;
    binSlotsText.onchange = setBinSlots(binDetails.binId);
    slotsTd.appendChild(binSlotsText);
    slotsTd.setAttribute('sorttable_customkey', binDetails.binSlots);
    tr.appendChild(slotsTd);

    // Location select
    var locationTd = document.createElement('td');
    var locationSelect = document.createElement('select');
    var locationOption = document.createElement('option');
    locationOption.text = binDetails.locationName;
    locationOption.value = binDetails.locationId;
    locationSelect.name = 'locationSelect';
    locationSelect.className = 'listof=location';
    locationSelect.add(locationOption);
    if (window.opener.userType == 0) {
	locationSelect.disabled = true;
    } else {
	locationSelect.onfocus = setLocationOptions;
    }
    locationSelect.onchange = setBinLocation(binDetails.binId);
    locationTd.appendChild(locationSelect);
    tr.appendChild(locationTd);

    // Hide bin checkbox
    var hiddenTd = document.createElement('td');
    var hiddenCheckbox = document.createElement('input');
    hiddenCheckbox.type = 'checkbox';
    hiddenCheckbox.className = 'hiddencheckbox';
    var showHidden = document.getElementById('binHideCheckbox').checked;
    if (binDetails.binHidden == 1) {
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
    hiddenCheckbox.onclick = setBinHidden(binDetails.binId);
    hiddenTd.appendChild(hiddenCheckbox);
    tr.appendChild(hiddenTd);

    tbody.insertBefore(tr,tbody.firstChild);

    // The table is no longer sorted
    clearSorted(document.getElementById('binNameHeader'));
}

// Set up the page after the html is fully loaded
window.onload = function () {
    if (window.opener.userType == 0) {
	// readonly
	document.getElementById('addBin').style.display = 'none';
    }
    document.getElementById('addBinSubmit').onclick = addBin;
    document.getElementById('binTable').setRow = setBin;
    opener.getBins();
    hiddenRows.init();
    listable.init();
}
