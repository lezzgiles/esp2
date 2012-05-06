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

    checkboxTd: function(tr,type,details) {
	var hidden = details[type+'Hidden'];
	var id = details[type+'Id'];
	var hiddenTd = document.createElement('td');
	var hiddenCheckbox = document.createElement('input');
	hiddenTd.appendChild(hiddenCheckbox);

	hiddenCheckbox.type = 'checkbox';
	hiddenCheckbox.className = 'hiddencheckbox';

	hiddenRows.showRow(tr,hiddenTd,type,details);

	if (window.opener.userType == 0) {
	    hiddenCheckbox.disabled = true;
	}
	hiddenCheckbox.onclick = function() {
	    opener.doit('setHidden',{type:type,id:id,hidden:this.checked?1:0},{});
	    return false;
	};

	return hiddenTd;
    },

    showRow: function(tr,td,type,details) {
	var showHidden = document.getElementById(type+'HideCheckbox').checked;
	if (details[type+'Hidden'] == 1) {
	    td.childNodes[0].checked = true;
	    if (showHidden) {
		tr.style.display = 'table-row';
	    } else {
		tr.style.display = 'none';
	    }
	} else {
	    td.childNodes[0].checked = false;
	    tr.style.display = 'table-row';
	}
    },
};
