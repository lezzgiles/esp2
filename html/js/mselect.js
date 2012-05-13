// Multi-select, like a select multiple only looks nice, uses
// checkboxes to select the items you want.

// An mselect normally is just an input text field, with the comma-separated
// list of values.  The list is passed in as a list of [ text,value ] and is
// stored attached to the input text.
MSelect = {
    mselect: function(type,details,field,attrs) {
	var id = details[type+'Id'];
	var fieldName = type+field.capitalize()+'s';
	var mselect = document.createElement('input');
	mselect.type = 'input';
	mselect.className = 'listof='+field;
	mselect.disabled = (window.opener.userType == 0);
	forEach (Object.keys(attrs), function(a) { mselect[a] = attrs[a] });
	MSelect.update(mselect,details[fieldName]);
	mselect.espValues = details[fieldName];
	mselect.espType = type
	mselect.espId = id;
	mselect.espFieldName = fieldName;
	listable.setupMselect(mselect,field);
	return mselect;
    },

    update: function(mselect,values) {
	mselect.value = values.map(function(pair) { return pair[0] }).join();
	mselect.espValues = values;
    },

    // Return a list of ids that are selected, as a hash { id => true }
    selectedValues: function(mselect) {
	var selected = {};
	if ('espValues' in mselect) {
	    mselect.espValues.map(function(pair) { selected[pair[1]] = true });
	}
	return selected;
    },
}
