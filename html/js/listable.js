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
    },
    setupSelect: function(select,type) {
		    select.onkeyup = blurOnReturnKey;
		    select.onfocus = function() {
			listable.expandList(this,type);
		    };
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
	    opener.doit('get',{type:type},{
		    success: function() {
			listable.expandList(select,type);
		    },
		});
    }
}
}
