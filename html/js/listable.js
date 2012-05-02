// Drive a select from a list of location
// When the list gets focus, populate the list.  If the locations
// have not yet been fetched, then fetch them and populate the list
// on successful return.
// - If the current selected value is zero, simply let the first item
//   be the selected one, and remove the first item.
// - If the current selected value is non-zero, make sure that stays
//   selected, if possible.
// - hide hidden locations.


// This is always called from a child window, so the top window is opener.

listable = {
    init: function() {
	forEach(document.getElementsByTagName('select'), function(select) {
		if (select.className.search(/\blistable\b/) != -1) {
		    select.onkeyup = blurOnReturnKey;
		    select.onfocus = function() {
			listable.expandList(this,'location');
		    };
		}
	    });
    },
    expandList: function(select,type) {
	if (type in opener.esp) {
	    // Save the current option so it can be restored after
	    // recreating the options.
	    var currentOptionValue = select.options[select.selectedIndex].value;
	
	    // Remove all options
	    while (select.options.length > 0) { select.remove(0); }

	    var firstOption = null;
	    forEach(opener.esp[type],function(details) {
		    if (details[type+'Hidden'] == 0) {
			var option = document.createElement('option');
			option.text = details[type+'Name'];
			option.value = details[type+'Id'];
			select.add(option,firstOption);
			firstOption = option;
			option.selected = (option.value == currentOptionValue);
		    }
		});

	} else {
	    opener.esp[type] = {}
	    opener.doit("getLocations",{},{
		    success: function() {
			listable.expandList(select,type);
		    },
		});
    }
}
}
