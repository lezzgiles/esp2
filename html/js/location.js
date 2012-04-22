// Routines for location management page

function blurOnReturnKey(evt) {
   var evt = (evt) ? evt : ((event) ? event : null);
   var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
    if (evt.keyCode == 13) { node.blur(); return false;}
}
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

function handleResults(results) {
    if (results == null) {
	alert("Request failed for an unknown reason");
	return false;
    } else {
	results = eval(results);
	for each (var result in results) {
	    if (result[0] == 'alert') {
		alert(result[1]);

	    } else if (result[0] == 'location')  {
		var locationId = result[1];
		var locationName = result[2];
		var locationObsolete = result[3];

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

		var obsoleteTd = document.createElement('td');
		var obsoleteCheckbox = document.createElement('input');
		obsoleteCheckbox.type = 'checkbox';
		obsoleteCheckbox.checked = (locationObsolete == 1);
		obsoleteCheckbox.id = 'obsoleteCheckbox'+locationId;
		obsoleteCheckbox.onclick = obsoleteCheckboxClick(locationId);
		obsoleteTd.appendChild(obsoleteCheckbox);
		tr.appendChild(obsoleteTd);

		tbody.insertBefore(tr,tbody.firstChild);

		// The table is no longer sorted
		clearSorted(document.getElementById('locationNameHeader'));

	    } else if (result[0] == 'locationObsolete') {
		var locationId = result[1];
		var locationObsolete = result[2];
		document.getElementById('obsoleteCheckbox'+locationId).checked = (locationObsolete == 1);

	    } else if (result[0] == 'locationName') {
		var locationId = result[1];
		var newName = result[2];
		var locationNameText = document.getElementById('locationNameText'+locationId);
		locationNameText.value = newName;
		locationNameText.parentNode.setAttribute('sorttable_customkey', newName);

		// The table is no longer sorted
		clearSorted(document.getElementById('locationNameHeader'));
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

function obsoleteCheckboxClick(id) { return function() {
	doit("obsoleteLocation",{locationId:id});
	return false;
    }
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

// Set up the page after the html is fully loaded
window.onload = function () {
    document.getElementById('locationName').onchange = clickSubmitAdd;
    document.getElementById('locationName').onkeyup = blurOnReturnKey;
    doit("getLocations",{});
}

