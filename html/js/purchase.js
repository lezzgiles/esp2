function calcTotals() {
    self.moneyFormat();
    // Calculate totals
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
    totalTd.appendChild(totalText);
    tr.appendChild(totalTd);

    // delete button
    var deleteTd = document.createElement('td');
    var deleteButton = document.createElement('img');
    deleteButton.src = 'delete.gif';
    deleteButton.onclick = function() {
	table.deleteChild(tr);
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
}

window.onunload = function() {
    delete opener.esp.windows.purchase;
}