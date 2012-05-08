// Routines for item page

function addItem() {
    var itemMfr = document.getElementById('itemMfr').value;
    var itemBrand = document.getElementById('itemBrand').value;
    var itemType = document.getElementById('itemType').value;
    var itemDesc = document.getElementById('itemDesc').value;
    var itemSize = document.getElementById('itemSize').value;
    var itemTags = Object.keys(document.getElementById('itemTags').selectedValues()).join();
    if (itemMfr == "") {
	alert("You must enter a manufacturer name for the new item");
    } else if (itemDesc == "") {
	alert("You must enter a description for the new item");
	return;
    } else {
	opener.addItem({newMfr:itemMfr,newBrand:itemBrand,newDesc:itemDesc,newSize:itemSize,newType:itemType,newTags:itemTags},{});
    }
}

function setItemTags(id) {
    return function() {
	var itemTags = Object.keys(this.selectedValues()).join();
	opener.setItemTags({itemId:id,itemTags:itemTags},{});
    }
}

function setItem(itemDetails) {

    // Look to see if this item is already in the table
    var foundIt = false;
    forEach(this.rows,function(row) {
	    if (row.itemId == itemDetails.itemId) {
		foundIt = true;
		// This is the correct row, update as necessary
		row.cells[0].childNodes[0].value = itemDetails.itemMfr;
		row.cells[1].childNodes[0].value = itemDetails.itemBrand;
		row.cells[2].childNodes[0].value = itemDetails.itemType;
		row.cells[3].childNodes[0].value = itemDetails.itemDesc;
		row.cells[4].childNodes[0].value = itemDetails.itemSize;
		var tagsSelect = row.cells[5].childNodes[0];
		// Remove all the old options
		while (tagsSelect.options.length > 0) { tagsSelect.remove(0) }
		// Create new options
		forEach (itemDetails.itemTags,function(tagLink) {
			var tagOption = document.createElement('option');
			tagOption.text = tagLink.tagName;
			tagOption.value = tagLink.tagId;
			tagOption.selected = true;
			tagsSelect.add(tagOption);
		    });
		hiddenRows.showRow(row,row.cells[6],'item',itemDetails);
	    }
		    
	});

    if (foundIt) { return; }

    // Not in the table, so add a row
    var tbody = this.tBodies[0];
    var tr = document.createElement('tr');
    tr.itemId = itemDetails.itemId;

    // The itemMfr text field
    // TODO set size to 10
    tr.appendChild(textTd('item',itemDetails,'Mfr',{size:10},function(value) {
		if (value == "") {
		    alert("You cannot have a blank manufacturer name");
		    return false;
		} else {
		    return true;
		}
	    }));

    // The itemBrand text field
    tr.appendChild(textTd('item',itemDetails,'Brand',{size:10}));

    // The itemType text field
    tr.appendChild(textTd('item',itemDetails,'Type',{size:10}));

    // The itemDesc text field
    tr.appendChild(textTd('item',itemDetails,'Desc',{},function(value) {
		if (value == "") {
		    alert("You cannot have a blank item description");
		    return false;
		} else {
		    return true;
		}
	    }));

    // The itemSize text field
    tr.appendChild(textTd('item',itemDetails,'Size',{size:10}));

    // itemTags select

    var tagsTd = document.createElement('td');
    //    var tagsSelect = document.createElement('select');
    //    tagsSelect.multiple = true;
    //    //tagsSelect.size = 1;
    //    forEach (itemDetails.itemTags,function(tagLink) {
    //	    var tagOption = document.createElement('option');
    //	    tagOption.text = tagLink.tagName;
    //	    tagOption.value = tagLink.tagId;
    //	    tagOption.selected = true;
    //	    tagsSelect.add(tagOption);
    //	});
    //    tagsSelect.name = 'tagsSelect';
    //    tagsSelect.className = 'listof=tags';
    //    tagsSelect.disabled = (window.opener.userType == 0);
    //    tagsSelect.onblur = setItemTags(itemDetails.itemId);
    //    listable.setupSelect(tagsSelect,'tag');
    tagsTd.appendChild(mselect.mselect('item',itemDetails,'itemTags',{}));
    tr.appendChild(tagsTd);

    // The hidden checkbox
    tr.appendChild(hiddenRows.checkboxTd(tr,'item',itemDetails));

    tbody.insertBefore(tr,tbody.firstChild);

    // The table is no longer sorted
    clearSorted(document.getElementById('itemTable'));
}

// Set up the page after the html is fully loaded
window.onload = function () {
    document.getElementById('addItemSubmit').onclick = addItem;
    document.getElementById('itemTable').setRow = setItem;
    opener.getItems();
    hiddenRows.init();
    listable.init();
}

window.onunload = function () {
    delete opener.esp.windows.item;
}