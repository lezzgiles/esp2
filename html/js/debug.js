debug = {
    write: function() {
	if (opener && opener.esp) esp = opener.esp;
	if (esp.windows.debug && esp.windows.debug.document) {
	    debugTextarea = esp.windows.debug.document.getElementById('debugTextarea');
	    forEach (arguments, function(msg) {
		    debugTextarea.value += "\n";
		    debugTextarea.value += msg;
		});
	}
    },

    showObject: function(object) {
	var retval = "";
	for (property in object) {
	    retval += property+": "+object[property]+"; ";
	}
	return retval;
    }

}