function calcTotals() {
    // Fix the formatting of this cell, if this was called in response to
    // an onblur event
    if (this.value && this.className == 'money') moneyFormat(this);

    // Calculate totals
    // Go through the whole table
    var subtotal = 0;
    var total = 0;
    var table = document.getElementById('addPurchaseTable');
    forEach (table.tBodies[0].rows, function (row) {
	    var qty = row.cells[1].childNodes[0].value;
	    var costPerItem = dollars2cents(row.cells[2].childNodes[0]);
	    var rowTotal = qty*costPerItem;
	    row.cells[3].childNodes[0].value = cents2dollars(rowTotal);
	    subtotal += rowTotal;
	});
    document.getElementById('subtotal').value = cents2dollars(subtotal);
    total += subtotal;
    total += dollars2cents(document.getElementById('shipping'));
    total += dollars2cents(document.getElementById('tax'));
    total += dollars2cents(document.getElementById('adjustments'));
    document.getElementById('total').value = cents2dollars(total);
}

function addPurchaseItemRow() {
    var table = document.getElementById('addPurchaseTable');
    var tr = document.createElement('tr');
    table.tBodies[0].appendChild(tr);

    // item select list
    tr.appendChild(selectTd(null,null,'item','Select one',null));

    // quantity
    var quantityTd = document.createElement('td');

    var quantityText = document.createElement('input');
    quantityText.type = 'text';
    quantityText.size = 5;
    quantityText.value = '1';
    quantityText.style.textAlign = 'right';
    quantityText.onblur = calcTotals;
    quantityTd.appendChild(quantityText);
    tr.appendChild(quantityTd);

    // cost
    var costTd = document.createElement('td');
    var costText = document.createElement('input');
    costText.type = 'text';
    costText.size = 5;
    costText.value = '0.00';
    costText.className = 'money';
    costText.onblur = calcTotals;
    costTd.appendChild(costText);
    tr.appendChild(costTd);

    // total
    var totalTd = document.createElement('td');
    var totalText = document.createElement('input');
    totalText.type = 'text';
    totalText.size = 5;
    totalText.value = '0.00';
    totalText.className = 'money';
    totalText.readOnly = true;
    totalTd.appendChild(totalText);
    tr.appendChild(totalTd);

    // delete button
    var deleteTd = document.createElement('td');
    var deleteButton = document.createElement('img');
    deleteButton.src = 'delete.gif';
    deleteButton.onclick = function() {
	for (var i=0; i<table.rows.length; i++) {
	    if (table.rows[i] == tr) {
		table.deleteRow(i);
		break;
	    }
	}
	calcTotals();
    };
    deleteTd.appendChild(deleteButton);
    tr.appendChild(deleteTd);

}

function addPurchaseSubmit() {
    // Can't be too careful so just make sure the totals are calculated
    calcTotals();
    
    // Collect the details and verify as we go
    var details = {};
    details.seller = document.getElementById('seller').value;
    if (!details.seller) {
	alert("Must enter a seller name");
	return false;
    }
    details.shipping = dollars2cents(document.getElementById('shipping'));
    details.tax = dollars2cents(document.getElementById('tax'));
    details.adjustments = dollars2cents(document.getElementById('adjustments'));
    details.items = [];
    var tbody = document.getElementById('addPurchaseTable').tBodies[0];
    for (var i=0; i < tbody.rows.length; i++) {
	var row = tbody.rows[i];
	var item = {};
	item.itemId = row.cells[0].childNodes[0].value;
	if (item.itemId == "") {
	    alert("You must pick an item for each row");
	    return false;
	}
	item.qty = row.cells[1].childNodes[0].value;
	if (item.qty == 0) {
	    alert("Cannot enter a purchase with a zero quantity for an item");
	    return false;
	}
	item.price = dollars2cents(row.cells[2].childNodes[0]);
	details.items.push(item);
    }
    
    opener.addPurchase(details, {
	    success: function() {
		document.getElementById('seller').value = "";
		document.getElementById('tax').value = '0.00';
		document.getElementById('shipping').value = '0.00';
		document.getElementById('adjustments').value = '0.00';
		var tbody = document.getElementById('addPurchaseTable').tBodies[0];
		while (tbody.rows.length != 0) tbody.deleteRow(0);
		addPurchaseItemRow();
		calcTotals();
	    },
		error:function(msg) {
		alert(msg);
	    },
		});
}

function setPurchase(tranDetails) {
    // Ignore if this is not a purchase
    if (tranDetails.tranType != 'Purchase') return;

    // Look to see if this bin is already in the table
    var foundIt = false;
    forEach(this.rows,function(row) {
	    if (row.tranId == tranDetails.tranId) {
		// This is the correct row, so nothing needs to be done.
		// We don't update transactions.
		foundIt = true;
	    }
		    
	});

    if (foundIt) { return; }

    // Add the transaction to the top of the table
    var tbody = this.tBodies[0];
    var tr = document.createElement('tr');
    tr.tranId = tranDetails.tranId;
    
    // Simple table - no need to make anything modifiable

    // Date
    var td = document.createElement('td');
    // Convert the datetime to a local datetime
    // A date/time as returned by sqlite is YYYY-MM-DD hh:mm:ss
    // This is a string that contains six numbers, so do a regex match
    var t = tranDetails.tranDate.match(/[0-9]+/g);
    var d = new Date();
    d.setUTCFullYear(t[0]);
    d.setUTCMonth(t[1]-1);
    d.setUTCDate(t[2]);
    d.setUTCHours(t[3]);
    d.setUTCMinutes(t[4]);
    d.setUTCSeconds(t[5]);
    td.appendChild(document.createTextNode(d.toLocaleString()));
    tr.appendChild(td);

    // Seller
    td = document.createElement('td');
    td.appendChild(document.createTextNode(tranDetails.tranParty));
    tr.appendChild(td);

    // Cost
    td = document.createElement('td');
    // Add up all the costs
    var total = 0;
    total += tranDetails.tranShipping;
    total += tranDetails.tranTax;
    total += tranDetails.tranAdjustments;
    forEach(tranDetails.itemDetails, function(item) {
	    total += item.quantity*item.price;
	});
    td.appendChild(document.createTextNode(cents2dollars(total)));
    tr.appendChild(td);

    tbody.insertBefore(tr,tbody.firstChild);
}

window.onload = function() {
    document.getElementById('shipping').onblur = calcTotals;
    document.getElementById('tax').onblur = calcTotals;
    document.getElementById('adjustments').onblur = calcTotals;
    document.getElementById('addAnother').onclick = addPurchaseItemRow;
    document.getElementById('addPurchaseSubmit').onclick = addPurchaseSubmit;
    document.getElementById('purchaseTable').setRow = setPurchase;
    addPurchaseItemRow();
}

window.onunload = function() {
    delete opener.esp.windows.purchase;
}