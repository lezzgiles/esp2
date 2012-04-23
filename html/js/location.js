// Routines for location management page

function clickSubmitAdd() {
    locationName = document.getElementById('locationName').value;
    if (locationName == "") {
	alert("You must enter a name for the new location");
    } else {
	doit('addLocation',{locationName:locationName},
	     function() { document.getElementById('locationName').value = ""; },
	     function() { document.getElementById('locationName').focus(); }
	    );
    }
}

handle.location = function(locationId,locationName,locationHidden) {
    var locationsTable = document.getElementById('locationsTable');
    var tbody = locationsTable.tBodies[0];
    var tr = document.createElement('tr');

    var nameTd = document.createElement('td');
    var locationNameText = document.createElement('input');
    locationNameText.type = 'text';
    locationNameText.value = locationName;
    locationNameText.id = 'locationNameText'+locationId;
    locationNameText.onkeyup = blurOnReturnKey;
    locationNameText.onchange = changeLocationName(locationId,locationNameText);
    nameTd.appendChild(locationNameText);
    nameTd.setAttribute('sorttable_customkey', locationName);
    tr.appendChild(nameTd);

    var hiddenTd = document.createElement('td');
    var hiddenCheckbox = document.createElement('input');
    hiddenCheckbox.type = 'checkbox';
    hiddenCheckbox.checked = (locationHidden == 1);
    hiddenCheckbox.id = 'hiddenCheckbox'+locationId;
    hiddenCheckbox.onclick = hiddenCheckboxClick(locationId);
    hiddenTd.appendChild(hiddenCheckbox);
    tr.appendChild(hiddenTd);

    tbody.insertBefore(tr,tbody.firstChild);

    // The table is no longer sorted
    clearSorted(document.getElementById('locationNameHeader'));
}

function hiddenCheckboxClick(id) { return function() {
	doit("hiddenLocation",{locationId:id});
	return false;
    }
}

handle.locationHidden = function(locationId,locationHidden) {
    var locationId = result[1];
    var locationHidden = result[2];
    document.getElementById('hiddenCheckbox'+locationId).checked = (locationHidden == 1);
}

function changeLocationName(id,text) { return function() {
	if (text.value == "") {
	    alert("You cannot have a blank location name");
	} else {
	    doit('changeLocationName',{locationId:id,newName:text.value});
	}
	return false;
    }
}

handle.locationName = function(locationId,newName) {
    var locationNameText = document.getElementById('locationNameText'+locationId);
    locationNameText.value = newName;
    locationNameText.parentNode.setAttribute('sorttable_customkey', newName);

    // The table is no longer sorted
    clearSorted(document.getElementById('locationNameHeader'));
}

// Set up the page after the html is fully loaded
window.onload = function () {
    document.getElementById('locationName').onchange = clickSubmitAdd;
    document.getElementById('locationName').onkeyup = blurOnReturnKey;
    doit("getLocations",{});
}

