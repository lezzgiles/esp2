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
    totalText.readonly = 'readonly';
    totalText.className = 'money';
    totalText.readonly = true;
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
}

window.onload = function() {
    document.getElementById('shipping').onblur = calcTotals;
    document.getElementById('tax').onblur = calcTotals;
    document.getElementById('adjustments').onblur = calcTotals;
    document.getElementById('addAnother').onclick = addPurchaseItemRow;
    document.getElementById('addPurchaseSubmit').onclick = addPurchaseSubmit;
    addPurchaseItemRow();
}

window.onunload = function() {
    delete opener.esp.windows.purchase;
}