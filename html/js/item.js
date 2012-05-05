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

function setItemHidden(id) {
    return function() {
	opener.setItemHidden({itemId:id,itemHidden:this.checked?1:0},{});
	return false;
    };
}

function setItemField(id,fieldName,longName,mustBeSet) {
    return function() {
	if (mustBeSet && this.value == "") {
	    alert("You cannot have a blank "+longName);
	} else {
	    var args;
	    args.itemId = id;
	    args.fieldName = fieldName;
	    args[fieldName] = this.value;
	    opener.setItemField(args,{});
	}
	return false;
    }
}

function setItemTags(id) {
    return function() {
	var itemTags = Object.keys(this.selectedValues()).join();
	opener.setItemTags({itemId:id,itemTags:itemTags},{});
    }
}

setItem = function(itemDetails) {

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
		var showHidden = document.getElementById('itemHideCheckbox').checked;
		if (itemDetails.itemHidden == 1) {
		    row.cells[6].childNodes[0].checked = true;
		    if (showHidden) {
			row.style.display = 'table-row';
		    } else {
			row.style.display = 'none';
		    }
		} else {
		    row.cells[6].childNodes[0].checked = false;
		    row.style.display = 'table-row';
		}
	    }
		    
	});

    if (foundIt) { return; }

    // Not in the table, so add a row
    var tbody = this.tBodies[0];
    var tr = document.createElement('tr');
    tr.itemId = itemDetails.itemId;

    // The itemMfr text field
    var mfrTd = document.createElement('td');
    var itemMfrText = document.createElement('input');
    itemMfrText.type = 'text';
    itemMfrText.size = 10;
    itemMfrText.value = itemDetails.itemMfr;
    itemMfrText.onkeyup = blurOnReturnKey;
    itemMfrText.onchange = setItemField(itemDetails.itemId,'itemMfr','manufacturer',true);
    mfrTd.appendChild(itemMfrText);
    mfrTd.setAttribute('sorttable_customkey', itemDetails.itemMfr);
    tr.appendChild(mfrTd);

    // The itemBrand text field
    var brandTd = document.createElement('td');
    var itemBrandText = document.createElement('input');
    itemBrandText.type = 'text';
    itemBrandText.size = 10;
    itemBrandText.value = itemDetails.itemBrand;
    itemBrandText.onkeyup = blurOnReturnKey;
    itemBrandText.onchange = setItemField(itemDetails.itemId,'itemBrand','manufacturer',true);
    brandTd.appendChild(itemBrandText);
    brandTd.setAttribute('sorttable_customkey', itemDetails.itemBrand);
    tr.appendChild(brandTd);

    // The itemType text field
    var typeTd = document.createElement('td');
    var itemTypeText = document.createElement('input');
    itemTypeText.type = 'text';
    itemTypeText.size = 10;
    itemTypeText.value = itemDetails.itemType;
    itemTypeText.onkeyup = blurOnReturnKey;
    itemTypeText.onchange = setItemField(itemDetails.itemId,'itemType','manufacturer',true);
    typeTd.appendChild(itemTypeText);
    typeTd.setAttribute('sorttable_customkey', itemDetails.itemType);
    tr.appendChild(typeTd);

    // The itemDesc text field
    var descTd = document.createElement('td');
    var itemDescText = document.createElement('input');
    itemDescText.type = 'text';
    itemDescText.value = itemDetails.itemDesc;
    itemDescText.onkeyup = blurOnReturnKey;
    itemDescText.onchange = setItemField(itemDetails.itemId,'itemDesc','manufacturer',true);
    descTd.appendChild(itemDescText);
    descTd.setAttribute('sorttable_customkey', itemDetails.itemDesc);
    tr.appendChild(descTd);

    // The itemSize text field
    var sizeTd = document.createElement('td');
    var itemSizeText = document.createElement('input');
    itemSizeText.type = 'text';
    itemSizeText.size = 10;
    itemSizeText.value = itemDetails.itemSize;
    itemSizeText.onkeyup = blurOnReturnKey;
    itemSizeText.onchange = setItemField(itemDetails.itemId,'itemSize','manufacturer',true);
    sizeTd.appendChild(itemSizeText);
    sizeTd.setAttribute('sorttable_customkey', itemDetails.itemSize);
    tr.appendChild(sizeTd);

    // itemTags select
    var tagsTd = document.createElement('td');
    var tagsSelect = document.createElement('select');
    tagsSelect.multiple = true;
    //tagsSelect.size = 1;
    forEach (itemDetails.itemTags,function(tagLink) {
	    var tagOption = document.createElement('option');
	    tagOption.text = tagLink.tagName;
	    tagOption.value = tagLink.tagId;
	    tagOption.selected = true;
	    tagsSelect.add(tagOption);
	});
    tagsSelect.name = 'tagsSelect';
    tagsSelect.className = 'listof=tags';
    tagsSelect.disabled = (window.opener.userType == 0);
    tagsSelect.onblur = setItemTags(itemDetails.itemId);
    listable.setupSelect(tagsSelect,'tag');
    tagsTd.appendChild(tagsSelect);
    tr.appendChild(tagsTd);

    // The hidden checkbox
    var hiddenTd = document.createElement('td');
    var hiddenCheckbox = document.createElement('input');
    hiddenCheckbox.type = 'checkbox';
    hiddenCheckbox.className = 'hiddencheckbox';
    var showHidden = document.getElementById('itemHideCheckbox').checked;
    if (itemDetails.itemHidden == 1) {
	hiddenCheckbox.checked = true;
	if (showHidden) {
	    tr.style.display = 'table-row';
	} else {
	    tr.style.display = 'none';
	}
    } 
    hiddenCheckbox.id = 'itemHiddenCheckbox'+itemDetails.itemId;
    hiddenCheckbox.onclick = setItemHidden(itemDetails.itemId);
    hiddenTd.appendChild(hiddenCheckbox);
    tr.appendChild(hiddenTd);

    tbody.insertBefore(tr,tbody.firstChild);

    // The table is no longer sorted
    clearSorted(document.getElementById('itemMfrHeader'));
    clearSorted(document.getElementById('itemBrandHeader'));
    clearSorted(document.getElementById('itemTypeHeader'));
    clearSorted(document.getElementById('itemDescHeader'));
    clearSorted(document.getElementById('itemSizeHeader'));
}

// Set up the page after the html is fully loaded
window.onload = function () {
    document.getElementById('addItemSubmit').onclick = addItem;
    document.getElementById('itemTable').setRow = setItem;
    opener.getItems();
    hiddenRows.init();
    listable.init();
}
