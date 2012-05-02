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
	opener.setOptions(select,type);
    },
}
