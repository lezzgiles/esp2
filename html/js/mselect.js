// Multi-select, like a select multiple only looks nice, uses
// checkboxes to select the items you want.

// An mselect normally is just an input text field, with the comma-separated
// list of values.  The list is passed in as a list of [ text,value ] and is
// stored attached to the input text.
mselect = {
    mselect: function(type,details,field,attrs) {
	var textInput = document.createElement('input');
	textInput.type = 'input';
	forEach (Object.keys(attrs), function(a) { textInput[a] = attrs[a] });
	textInput.value = details[field].map(function(pair) { return pair[0] }).join();
	textInput.espValues = details[field];
	textInput.onfocus = function() {
	    popup = document.createElement('div');
	    popup.id = 'popup';
	    popup.style.width = 200;
	    popup.style.background = '#d0d0ff';
	    popup.style.border = 'solid black 1px';
	    popup.style.padding = '5px';
	    popup.appendChild(document.createTextNode("Some random text"));
	    popup.style.position = 'absolute';
	    popup.style.top = findPosY(this)+this.scrollHeight;
	    popup.style.left = findPosX(this);
	    document.body.appendChild(popup);
	};
	textInput.onblur = function() {
	    document.body.removeChild(document.getElementById('popup'));
	};
	return textInput;
    },
}