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
    tr.appendChild(field.selectTd(null,null,'item','Select one',null));

    // quantity
    tr.appendChild(field.numberTd(null,null,null,{onblur:calcTotals}));

    // cost
    tr.appendChild(field.moneyTd(0,{onblur:calcTotals}));

    // total
    tr.appendChild(field.moneyTd(0,{readOnly:true}));

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
    
    opener.esp.sendRequest('addPurchase',details, {
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

function popupPurchase(row) {
    var details = row.espDetails;
    var popup = document.createElement('div');
    popup.style.background = '#d0d0ff';
    popup.style.border = 'solid black 1px';
    popup.style.padding = '5px';
    popup.appendChild(document.createTextNode('Seller:'));
    var input = document.createElement('input');
    input.type = 'text';
    input.size = 40;
    input.readOnly = true;
    input.value = details.tranParty;
    var label = document.createElement('label').appendChild(input);
    popup.appendChild(label);

    var table = document.createElement('table');
    table.border = 1;
    var tr = table.insertRow(-1);
    var th;
    var td;

    forEach( [ 'Item', 'Qty','Cost/item','Total' ], function(t) {
	    var th = document.createElement('th');
	    th.appendChild(document.createTextNode(t));
	    tr.appendChild(th);
	});

    table.appendChild(tr);

    var total = 0;

    forEach (details.itemDetails, function(itemDetails) {
	    var tr = table.insertRow(-1);
	    var td;
	    var input;

	    tr.appendChild(field.textTd(null,null,null,{readOnly:true,value:itemDetails.itemName}));
	    tr.appendChild(field.numberTd(null,null,null,{readonly:true,value:itemDetails.quantity}));
	    tr.appendChild(field.moneyTd(itemDetails.price,{readOnly:true}));
	    tr.appendChild(field.moneyTd(itemDetails.price*itemDetails.quantity,{readOnly:true}));
	    total += itemDetails.price*itemDetails.quantity;

	    table.appendChild(tr);
	});

    tr = table.insertRow(-1);
    td = document.createElement('td');
    td.colSpan = 3;
    td.style.textAlign = 'right';
    td.appendChild(document.createTextNode('Subtotal:'));
    tr.appendChild(td);
    tr.appendChild(field.moneyTd(total,{readOnly:true}));

    tr = table.insertRow(-1);
    td = document.createElement('td');
    td.colSpan = 3;
    td.style.textAlign = 'right';
    td.appendChild(document.createTextNode('Shipping:'));
    tr.appendChild(td);
    td.appendChild(input);
    tr.appendChild(field.moneyTd(details.tranShipping,{readOnly:true}));
    total += details.tranShipping;

    tr = table.insertRow(-1);
    td = document.createElement('td');
    td.colSpan = 3;
    td.style.textAlign = 'right';
    td.appendChild(document.createTextNode('Tax:'));
    tr.appendChild(td);
    tr.appendChild(field.moneyTd(details.tranTax,{readOnly:true}));
    total += details.tranTax;
    
    tr = table.insertRow(-1);
    td = document.createElement('td');
    td.colSpan = 3;
    td.style.textAlign = 'right';
    td.appendChild(document.createTextNode('Adjustments (e.g. rebates):'));
    tr.appendChild(td);
    tr.appendChild(field.moneyTd(details.tranAdjustments,{readOnly:true}));
    total += details.tranAdjustments;

    tr = table.insertRow(-1);
    td = document.createElement('td');
    td.colSpan = 3;
    td.style.textAlign = 'right';
    td.appendChild(document.createTextNode('Total:'));
    tr.appendChild(td);
    tr.appendChild(field.moneyTd(total,{readOnly:true}));

    popup.appendChild(table);
    popup.style.position = 'absolute';
    popup.style.left = findPosX(row);
    popup.style.top = findPosY(row);
    popup.onmouseout = function(event) {
	document.body.removeChild(popup);
    };
    document.body.appendChild(popup);
}

// fillTable() is called when the list of transactions changes.
// It should modify the table so that it contains the correct
// set.  It shouldn't gratuitiously delete all the rows and
// recreate them.
// It should also make sure the navigation div is properly
// filled in.
// Can assume the list of transactions is sorted.
var purchaseTablePage = 0;
function fillTable() {
    var tbody = document.getElementById('purchaseTable').tBodies[0];
    var size = document.getElementById('purchaseTableSize').value;
    var purchaseTablePageOutput = document.getElementById('purchaseTablePage');
    
    var first = purchaseTablePage*size;
    var last = purchaseTablePage*(size+1)-1;
    var list = opener.esp.db.tran;

    // Clear the table
    while(tbody.rows.length != 0) tbody.deleteRow(0);

    // Find the purchases by skipping over the previous pages,
    // then grabbing the next <size> purchases.  Then continue
    // to the end to find the total number.
    var i = 0;
    var purchaseCount = 0;
    var listPurchases = [];
    while (i < list.length) {
	if (list[i].tranType == 'Purchase') {
	    purchaseCount++;
	    if (purchaseCount > first && listPurchases.length < size) {
		listPurchases.push(list[i]);
	    }
	}
	i++;
    }

    // Display the purchases
    forEach (listPurchases, function(details) {
	    addRow(tbody,details);
	});

    // Update the status line and disable any buttons that are useless
    var last = first + listPurchases.length;   // (index of the last) + 1

    purchaseTablePageOutput.value = "Showing purchases "+(first+1)+" to "+last+" of "+purchaseCount;

    // Disable the 'first' and 'prev' buttons if we are showing the first purchase
    document.getElementById('purchaseTableFirst').disabled = (first == 0);
    document.getElementById('purchaseTablePrev').disabled = (first == 0);

    // Disable the 'next' and 'last' buttons if we are showing the last purchase
    document.getElementById('purchaseTableNext').disabled = (last == list.length);
    document.getElementById('purchaseTableLast').disabled = (last == list.length);

    // Set the definition of the last button, which depends on the number of transactions
    document.getElementById('purchaseTableLast').onclick = function() {
	purchaseTablePage=Math.floor(list.length/size);
	fillTable();
    };
    
}

function addRow(tbody,details) {
    var tr = tbody.insertRow(-1);
    tr.tranId = details.tranId;
    tr.espDetails = details;
    
    // Date
    var td = document.createElement('td');
    // Convert the datetime to a local datetime
    // A date/time as returned by sqlite is YYYY-MM-DD hh:mm:ss
    // This is a string that contains six numbers, so do a regex match
    var t = details.tranDate.match(/[0-9]+/g);
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
    td.appendChild(document.createTextNode(details.tranParty));
    tr.appendChild(td);

    // Cost
    td = document.createElement('td');
    // Add up all the costs
    var total = 0;
    total += details.tranShipping;
    total += details.tranTax;
    total += details.tranAdjustments;
    forEach(details.itemDetails, function(item) {
	    total += item.quantity*item.price;
	});
    td.appendChild(document.createTextNode(cents2dollars(total)));
    tr.appendChild(td);
    
    // Set up the timer for the purchase popup
    var popupTimer;
    tr.onmouseover = function() {
	popupTimer=setTimeout(function() { popupPurchase(tr) },1000);
    };
    tr.onmousemove = function() {
	clearTimeout(popupTimer);
	popupTimer=setTimeout(function() { popupPurchase(tr) },1000);
    };
    tr.onmouseout = function() {
	clearTimeout(popupTimer);
    };
		    
    //tbody.insertBefore(tr,tbody.rows[0]);
}

window.onload = function() {
    document.getElementById('shipping').onblur = calcTotals;
    document.getElementById('tax').onblur = calcTotals;
    document.getElementById('adjustments').onblur = calcTotals;
    document.getElementById('addAnother').onclick = addPurchaseItemRow;
    document.getElementById('addPurchaseSubmit').onclick = addPurchaseSubmit;

    document.getElementById('purchaseTableFirst').onclick = function() { purchaseTablePage=0; fillTable(); };
    document.getElementById('purchaseTablePrev').onclick = function() { purchaseTablePage--; fillTable(); };
    document.getElementById('purchaseTableNext').onclick = function() { purchaseTablePage++; fillTable(); };

    document.getElementById('purchaseTableSize').onchange = fillTable;
    document.getElementById('purchaseTable').setRow = function() { };
    addPurchaseItemRow();
    opener.esp.getAll('tran', { success: fillTable });
}

window.onunload = function() {
    delete opener.esp.windows.purchase;
}