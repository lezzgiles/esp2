// Routines for bin management page

function clickSubmitAdd() {
    binName = document.getElementById('binName').value;
    binSlots = document.getElementById('binSlots').value;
    if (binName == "") {
	alert("You must enter a name for the new bin");
	return;
    }
    if (binSlots == "") {
	alert("You must enter the number of items that can be stored in the new bin.  Enter 0 for no limit.");
	return;
    }
    doit('addBin',{binName:binName,binSlots:binSlots}, {
	success:function() {
	    document.getElementById('binName').value = "";
	    document.getElementById('binName').focus();
	},
	error:function() {
            document.getElementById('binName').focus();
        },
    });
}

handle.bin = function(binId,binName,binSlots,binHidden) {
    var binsTable = document.getElementById('binsTable');
    var tbody = binsTable.tBodies[0];
    var tr = document.createElement('tr');

    // Bin name textbox
    var nameTd = document.createElement('td');
    var binNameText = document.createElement('input');
    binNameText.type = 'text';
    binNameText.value = binName;
    if (window.opener.userType == 0) {
	binNameText.disabled = true;
    }
    binNameText.id = 'binNameText'+binId;
    binNameText.onkeyup = blurOnReturnKey;
    binNameText.onchange = changeBinName(binId,binNameText);
    nameTd.appendChild(binNameText);
    nameTd.setAttribute('sorttable_customkey', binName);
    tr.appendChild(nameTd);

    // Bin slots textbox
    var slotsTd = document.createElement('td');
    var binSlotsText = document.createElement('input');
    binSlotsText.type = 'text';
    binSlotsText.size = 5;
    binSlotsText.value = binSlots;
    if (window.opener.userType == 0) {
	binSlotsText.disabled = true;
    }
    binSlotsText.id = 'binSlotsText'+binId;
    binSlotsText.onkeyup = blurOnReturnKey;
    binSlotsText.onchange = changeBinSlots(binId,binSlotsText);
    slotsTd.appendChild(binSlotsText);
    slotsTd.setAttribute('sorttable_customkey', binSlots);
    tr.appendChild(slotsTd);

    // Hide bin checkbox
    var hiddenTd = document.createElement('td');
    var hiddenCheckbox = document.createElement('input');
    hiddenCheckbox.type = 'checkbox';
    hiddenCheckbox.className = 'hiddencheckbox';
    if (binHidden == 1) {
	hiddenCheckbox.checked = true;
	tr.style.display = 'none';
    }
    if (window.opener.userType == 0) {
	hiddenCheckbox.disabled = true;
    }
    hiddenCheckbox.id = 'hiddenCheckbox'+binId;
    hiddenCheckbox.onclick = hiddenCheckboxClick(binId);
    hiddenTd.appendChild(hiddenCheckbox);
    tr.appendChild(hiddenTd);

    tbody.insertBefore(tr,tbody.firstChild);

    // The table is no longer sorted
    clearSorted(document.getElementById('binNameHeader'));
}

function hiddenCheckboxClick(id) { return function() {
	doit("hiddenBin",{binId:id});
	return false;
    }
}

handle.binHidden = function(binId,binHidden) {
    checkbox = document.getElementById('hiddenCheckbox'+binId);
    if (binHidden == 1) {
	checkbox.checked = true;
    } else {
	checkbox.checked = false;
    }
}

function changeBinName(id,text) { return function() {
	if (text.value == "") {
	    alert("You cannot have a blank bin name");
	} else {
	    doit('changeBinName',{binId:id,newName:text.value});
	}
	return false;
    }
}

handle.binName = function(binId,newName) {
    var binNameText = document.getElementById('binNameText'+binId);
    binNameText.value = newName;
    binNameText.parentNode.setAttribute('sorttable_customkey', newName);

    // The table is no longer sorted
    clearSorted(document.getElementById('binNameHeader'));
}

function changeBinSlots(id,text) { return function() {
	if (text.value == "") {
	    alert("You cannot have a blank bin size");
	} else {
	    doit('changeBinSlots',{binId:id,newSlots:text.value});
	}
	return false;
    }
}

handle.binSlots = function(binId,newSlots) {
    var binSlotsText = document.getElementById('binSlotsText'+binId);
    binSlotsText.value = newSlots;
    binSlotsText.parentNode.setAttribute('sorttable_customkey', newSlots);

    // The table is no longer sorted
    clearSorted(document.getElementById('binNameHeader'));
}

// Set up the page after the html is fully loaded
window.onload = function () {
    if (window.opener.userType == 0) {
	// readonly
	document.getElementById('addBin').style.display = 'none';
    }
    document.getElementById('addBinSubmit').onclick = clickSubmitAdd;
    doit("getBins",{});
    hiddenRows.init();
}
