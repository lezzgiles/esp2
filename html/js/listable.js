// Drive a select from a list of things
// Set the class of the list to "listof=<type>", e.g. <select class="listof=location">...
// When the list gets focus, populate the list.  If the things
// have not yet been fetched, then fetch them and populate the list
// on successful return.
// - If the current selected value is zero, simply let the first item
//   be the selected one, and remove the first item.
// - If the current selected value is non-zero, make sure that stays
//   selected, if possible.
// - hide hidden things.


// This is always called from a child window, so the top window is opener.

listable = {
    init: function() {
	forEach(document.getElementsByTagName('select'), function(select) {
		var result = /\blistof=(..*?)\b/.exec(select.className);
		if (result) {
		    var type = result[1];
		    listable.setupSelect(select,type);
		}
	    });
	forEach(document.getElementsByTagName('input'), function(mselect) {
		var result = /\blistof=(..*?)\b/.exec(mselect.className);
		if (result) {
		    var type = result[1];
		    listable.setupMselect(mselect,type);
		}
	    });
    },
    // select
    // A select with type listof=<type>
    // When clicked, it expands into a list of all <type> (not hidden)
    setupSelect: function(select,type) {
	select.onkeyup = blurOnReturnKey;
	select.onfocus = function() {
	    opener.esp.getAll(type,{
		    success: function() {
			// Save the current option values so they can be restored after
			// recreating the options.
			var selectedValues = select.selectedValues();
	
			// Remove all options
			while (select.options.length > 0) { select.remove(0); }

			var firstOption = null;
			forEach(opener.esp.db[type],function(details) {
				if (details[type+'Hidden'] == 0) {
				    var option = document.createElement('option');
				    option.text = details[type+'Name'];
				    option.value = details[type+'Id'];
				    select.add(option,firstOption);
				    firstOption = option;
				    option.selected = (option.value in selectedValues);
				}
			    });
		    },
		});
	};
    },

    // mselect
    // text input.  When clicked pops up a checklist of all <type>
    setupMselect: function(mselect,type) {
	mselect.onclick = function() {
	    opener.esp.getAll(type,{
		    success: function() {
			// Save the current option values so they can be restored after
			// recreating the options.
			var selectedValues = mselect.selectedValues()

			var popup = document.createElement('div');
			popup.style.background = '#d0d0ff';
			popup.style.border = 'solid black 1px';
			popup.style.padding = '5px';
			popup.style.textAlign = 'justify';
			if (opener.esp.db[type].length > 0) {
			    forEach (opener.esp.db[type],function(details) {
				    if (details[type+'Hidden'] == 0) {
					var label = document.createElement('label');
					var checkbox = document.createElement('input');
					checkbox.type = 'checkbox';
					checkbox.value = details[type+'Id'];
					checkbox.checked = (checkbox.value in selectedValues);
					label.appendChild(checkbox);
					label.appendChild(document.createTextNode(details[type+'Name']));
					popup.appendChild(label);
					popup.appendChild(document.createElement('br'));
				    }
				});
			} else {
			    popup.appendChild(document.createTextNode('No tags defined'));
			}

			popup.style.position = 'absolute';
			popup.style.top = findPosY(mselect)+mselect.scrollHeight;
			popup.style.left = findPosX(mselect);
			popup.onmouseout = function(event) {
			    // First check that we are really leaving the popup
			    pX = findPosX(this);
			    pY = findPosY(this);
			    if ( (event.clientX > pX+2) && (event.clientX < pX+this.scrollWidth-2) &&
				 (event.clientY > pY+2) && (event.clientY < pY+this.scrollHeight-2)
				 ) {
				// Still in the popup, ignore
				return;
			    }
			    if ('espFieldName' in mselect) {
				// This is a thing in a table, so update it
				var newDetails = {};
				newDetails[mselect.espType+'Id'] = mselect.espId
				newDetails[mselect.espFieldName] = Array();
				forEach(popup.getElementsByTagName('label'),function(label) {
					if (label.childNodes[0].checked) {
					    newDetails[mselect.espFieldName].push(label.childNodes[0].value);
					}
				    });
				opener.esp.sendRequest('set'+mselect.espFieldName.capitalize(),newDetails);
			    } else {
				// This is a list of things for a new item
				names = Array();
				mselect.espValues = Array();
				forEach(popup.getElementsByTagName('label'),function(label) {
					if (label.childNodes[0].checked) {
					    mselect.espValues.push([label.childNodes[1].nodeValue,label.childNodes[0].value]);
					    names.push(label.childNodes[1].nodeValue);
					}
				    });
				mselect.value = names.join();
			    }
			    document.body.removeChild(popup);
			};
			document.body.appendChild(popup);
		    },
		});
	};
    },
    // Update an mselect with new values
    updateMselect: function(mselect,values) {
	mselect.value = values.map(function(pair) { return pair[0] }).join();
	mselect.espValues = values;
    },
}
