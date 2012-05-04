// Routines for tag management page

function addTag() {
    tagName = document.getElementById('tagName').value;
    if (tagName == "") {
	alert("You must enter a name for the new tag");
    } else {
	opener.addTag({tagName:tagName}, {
	    success:function() {
	        document.getElementById('tagName').value = "";
	        document.getElementById('tagName').focus();
	    },
	    error:function(message) {
		alert(message);
                document.getElementById('tagName').focus();
            },
	});
    }
}

function setTagHidden(id) {
    return function() {
	opener.setTagHidden({tagId:id,tagHidden:this.checked?1:0},{});
	return false;
    };
}

function setTagName(id) {
    return function() {
	if (this.value == "") {
	    alert("You cannot have a blank tag name");
	} else {
	    opener.setTagName({tagId:id,tagName:this.value},{});
	}
	return false;
    }
}

setTag = function(tagDetails) {

    // Look to see if this tag is already in the table
    var foundIt = false;
    forEach(this.rows,function(row) {
	    if (row.tagId == tagDetails.tagId) {
		foundIt = true;
		// This is the correct row, update as necessary
		row.cells[0].childNodes[0].value = tagDetails.tagName;
		var showHidden = document.getElementById('tagHideCheckbox').checked;
		if (tagDetails.tagHidden == 1) {
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
    tr.tagId = tagDetails.tagId

    // Tag name textbox
    var nameTd = document.createElement('td');
    var tagNameText = document.createElement('input');
    tagNameText.type = 'text';
    tagNameText.value = tagDetails.tagName;
    if (window.opener.userType == 0) {
	tagNameText.disabled = true;
    }
    tagNameText.onkeyup = blurOnReturnKey;
    tagNameText.onchange = setTagName(tagDetails.tagId);
    nameTd.appendChild(tagNameText);
    nameTd.setAttribute('sorttable_customkey', tagDetails.tagName);
    tr.appendChild(nameTd);

    // Hide tag checkbox
    var hiddenTd = document.createElement('td');
    var hiddenCheckbox = document.createElement('input');
    hiddenCheckbox.type = 'checkbox';
    hiddenCheckbox.className = 'hiddencheckbox';
    var showHidden = document.getElementById('tagHideCheckbox').checked;
    if (tagDetails.tagHidden == 1) {
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
    hiddenCheckbox.onclick = setTagHidden(tagDetails.tagId);
    hiddenTd.appendChild(hiddenCheckbox);
    tr.appendChild(hiddenTd);

    tbody.insertBefore(tr,tbody.firstChild);

    // The table is no longer sorted
    clearSorted(document.getElementById('tagNameHeader'));
}

// Set up the page after the html is fully loaded
window.onload = function () {
    if (window.opener.userType == 0) {
	// readonly
	document.getElementById('addTag').style.display = 'none';
    }
    document.getElementById('tagName').onchange = addTag;
    document.getElementById('tagName').onkeyup = blurOnReturnKey;
    document.getElementById('tagTable').setRow = setTag;
    opener.getTags();
    hiddenRows.init();
}
