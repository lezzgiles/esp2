// Routines for tag management page

function addTag() {
    var tagName = document.getElementById('tagName').value;
    if (tagName == "") {
	alert("You must enter a name for the new tag");
    } else {
	opener.esp.sendRequest('addTag',{tagName:tagName}, {
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

function setTag(tagDetails) {

    // Look to see if this tag is already in the table
    var foundIt = false;
    forEach(this.rows,function(row) {
	    if (row.tagId == tagDetails.tagId) {
		foundIt = true;
		// This is the correct row, update as necessary
		row.cells[0].childNodes[0].value = tagDetails.tagName;
		hiddenRows.showRow(row,row.cells[1],'tag',tagDetails);
	    }
		    
	});

    if (foundIt) { return; }
    
    // Not in the table, so add a row
    var tbody = this.tBodies[0];
    var tr = document.createElement('tr');
    tr.tagId = tagDetails.tagId

    // Tag name textbox
    tr.appendChild(textTd('tag',tagDetails,'Name',{},function(value) {
		if (value == "") {
		    alert("You cannot have a blank tag name");
		    return false;
		} else {
		    return true;
		}
	    }));

    // Hide tag checkbox
    tr.appendChild(hiddenRows.checkboxTd(tr,'tag',tagDetails));

    tbody.insertBefore(tr,tbody.firstChild);

    // The table is no longer sorted
    clearSorted(document.getElementById('tagTable'));
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
    opener.esp.getAll('tag');
    hiddenRows.init();
}

window.onunload = function () {
    delete opener.esp.windows.tag;
}
