// Routines for bin management page

function addBin() {
    var binName = document.getElementById('binName').value;
    var binSlots = document.getElementById('binSlots').value;
    var binLocationSelect = document.getElementById('binLocation');
    var binLocation = binLocationSelect.options[binLocationSelect.selectedIndex].value;
    if (binName == "") {
	alert("You must enter a name for the new bin");
    } else if (binSlots == "") {
	alert("You must enter the number of items that can be stored in the new bin.  Enter 0 for no limit.");
    } else {
	opener.esp.sendRequest('addBin',{binName:binName,binSlots:binSlots,locationId:binLocation}, {
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

function setBin(binDetails) {

    // Look to see if this bin is already in the table
    var foundIt = false;
    forEach(this.rows,function(row) {
	    if (row.binId == binDetails.binId) {
		foundIt = true;
		// This is the correct row, update as necessary
		row.cells[0].childNodes[0].value = binDetails.binName;
		row.cells[1].childNodes[0].value = binDetails.binSlots;
		field.updateSelectTd(row.cells[2],binDetails.locationName,binDetails.locationId);
		hiddenRows.showRow(row,row.cells[3],'bin',binDetails);
	    }
	});

    if (foundIt) { return; }

    var tbody = this.tBodies[0];
    var tr = document.createElement('tr');
    tr.binId = binDetails.binId

    // Bin name textbox
    tr.appendChild(field.textTd('bin',binDetails,'Name',{},function(value) {
		if (value == "") {
		    alert("You cannot have a blank bin name");
		    return false;
		} else {
		    return true;
		}
	    }));

    // Bin slots textbox
    tr.appendChild(field.textTd('bin',binDetails,'Slots',{size:5},function(value) {
		if (value == "") {
		    // TODO - check that slots is a number
		    alert("You cannot have a blank bin name");
		    return false;
		} else {
		    return true;
		}
	    }));

    // Location select
    tr.appendChild(field.selectTd('bin',binDetails,'Location',binDetails.locationName,binDetails.locationId));

    // Hide bin checkbox
    tr.appendChild(hiddenRows.checkboxTd(tr,'bin',binDetails));

    tbody.insertBefore(tr,tbody.firstChild);

    // The table is no longer sorted
    clearSorted(document.getElementById('binTable'));
}

// Set up the page after the html is fully loaded
window.onload = function () {
    if (window.opener.userType == 0) {
	// readonly
	document.getElementById('addBin').style.display = 'none';
    }
    document.getElementById('addBinSubmit').onclick = addBin;
    document.getElementById('binTable').setRow = setBin;
    opener.esp.getAll('bin');
    hiddenRows.init();
    listable.init();
}

window.onunload = function () {
    delete opener.esp.windows.bin;
}