field = {
    textTd: function(type,details,fieldname,attr,validate) {
	var td = document.createElement('td');
	var textInput = document.createElement('input');
	textInput.type = 'text';
	td.appendChild(textInput);
	forEach (Object.keys(attr), function(a) { textInput[a] = attr[a] });
	if (window.opener.userType == 0) {
	    textInput.disabled = true;
	}
	textInput.onkeyup = blurOnReturnKey;
	if (type) {
	    textInput.value = details[type+fieldname];
	    textInput.onchange = function() {
		if (validate && !validate(this.value)) { return }
		var newDetails = {};
		newDetails[type+'Id'] = details[type+'Id'];
		newDetails[type+fieldname] = this.value;
		opener.esp.sendRequest('set'+type.capitalize()+fieldname,newDetails,{});
	    };
	    td.setAttribute('sorttable_customkey', textInput.value);
	}
	return td;
    },
    numberTd: function(type,details,fieldname,attr,validate) {
	attr.size = 5;
	attr.className = 'numberField';
	return field.textTd(type,details,fieldname,attr,validate);
    },

    updateSelectTd: function(td,text,value) {
	var select = td.childNodes[0];
	while (select.options.length > 0) { select.remove(0) }
	var option = document.createElement('option');
	option.text = text;
	option.value = value;
	select.add(option);
	td.setAttribute('sorttable_customkey', text);
    },
    selectTd: function(type,details,fieldname,text,value) {
	var td = document.createElement('td');
	var select = document.createElement('select');
	select.className = 'listof='+fieldname.toLowerCase();
	select.disabled = (window.opener.userType == 0);
	td.appendChild(select);
	field.updateSelectTd(td,text,value);
	if (type) {
	    var id = details[type+'Id'];
	    select.onchange = function() {
		var newDetails = {};
		newDetails[type+'Id'] = id;
		newDetails[fieldname.toLowerCase()+'Id'] = this.options[this.selectedIndex].value;
		opener.esp.sendRequest('set'+type.capitalize()+fieldname,newDetails);
	    };
	    td.setAttribute('sorttable_customkey', text);
	}
	listable.setupSelect(select,fieldname.toLowerCase());
	return td;
    },

    mselect: function(type,details,fieldname,attrs) {
	var id = details[type+'Id'];
	var fieldName = type+fieldname.capitalize()+'s';
	var mselect = document.createElement('input');
	mselect.type = 'text';
	mselect.readOnly = true;
	mselect.className = 'listof='+fieldname;
	mselect.disabled = (window.opener.userType == 0);
	forEach (Object.keys(attrs), function(a) { mselect[a] = attrs[a] });
	listable.updateMselect(mselect,details[fieldName]);
	mselect.espValues = details[fieldName];
	mselect.espType = type
	mselect.espId = id;
	mselect.espFieldName = fieldName;
	listable.setupMselect(mselect,fieldname);
	return mselect;
    },

    mselectTd: function(type,details,fieldname,attrs) {
	var td = document.createElement('td');
	td.appendChild(field.mselect(type,details,fieldname,attrs));
	return td;
    },
    moneyTd: function(value,attr) {
	var td = document.createElement('td');
	var text = document.createElement('input');
	text.type = 'text';
	text.size = 5;
	text.value = cents2dollars(value);
	text.className = 'money';
	forEach (Object.keys(attr), function(a) { text[a] = attr[a] });
	td.appendChild(text);
	return td;
    },
};

