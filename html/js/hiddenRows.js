hiddenRows = {
    init: function() {
	forEach(document.getElementsByTagName('input'), function(input) {
	    if (input.type == 'checkbox' && input.className.search(/\bhideCheckbox\b/) != -1) {
		var table = document.getElementById(input.id.replace('HideCheckbox','Table'));
		input.onchange = function() {
		    hiddenRows.hide(input,table);
		}
	    }
	});
    },
    hide: function(checkbox,table) {
        var showHidden = checkbox.checked;
	var tbody = table.tBodies[0];

	forEach (tbody.rows, function(tr) {
	    if (showHidden) {
		tr.style.display = 'table-row';
	    } else {
		// find all checkbox nodes with class hideable
		forEach (tr.getElementsByTagName('input'), function(elt) {
		    if (elt.type != 'checkbox') { return }
		    if (elt.className.search(/\bhiddencheckbox\b/) == -1) { return }
		    if (elt.checked == true) {
			tr.style.display = 'none';
		    } else {
			tr.style.display = 'table-row';
		    }
		});
	    }
	});
    },
};
