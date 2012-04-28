// General utilities
function moneyFormat(textObj) {
   var newValue = textObj.value;
   var decAmount = "";
   var dolAmount = "";
   var decFlag = false;
   var aChar = "";
   
   // ignore all but digits and decimal points.
   for(i=0; i < newValue.length; i++) {
      aChar = newValue.substring(i,i+1);
      if(aChar >= "0" && aChar <= "9") {
         if(decFlag) {
           decAmount = "" + decAmount + aChar;
         }
         else {
            dolAmount = "" + dolAmount + aChar;
         }
      }
      if(aChar == ".") {
         if(decFlag) {
            dolAmount = "";
            break;
         }
         decFlag=true;
      }
   }
   
   // Ensure that at least a zero appears for the dollar amount.

   if(dolAmount == "") {
      dolAmount = "0";
   }
   // Strip leading zeros.
   if(dolAmount.length > 1) {
      while(dolAmount.length > 1 && dolAmount.substring(0,1) == "0") {
         dolAmount = dolAmount.substring(1,dolAmount.length);
      }
   }
   
   // Round the decimal amount.
   if(decAmount.length > 2) {
      if(decAmount.substring(2,3) > "4") {
         decAmount = parseInt(decAmount.substring(0,2)) + 1;
         if(decAmount < 10) {
            decAmount = "0" + decAmount;
         }
         else {
            decAmount = "" + decAmount;
         }
      }
      else {
         decAmount = decAmount.substring(0,2);
      }
      if (decAmount == 100) {
         decAmount = "00";
         dolAmount = parseInt(dolAmount) + 1;
      }
   }
   
   // Pad right side of decAmount
   if(decAmount.length == 1) {
      decAmount = decAmount + "0";
   }
   if(decAmount.length == 0) {
      decAmount = decAmount + "00";
  }
   
   // Check for negative values and reset textObj
   if(newValue.substring(0,1) != '-' ||
         (dolAmount == "0" && decAmount == "00")) {
      textObj.value = dolAmount + "." + decAmount;

   }
   else{
      textObj.value = '-' + dolAmount + "." + decAmount;
   }
}

// Returns the cents for a text object value
function dollars2cents(textObj)
{
   var newValue = textObj.value;
   var decAmount = "";
   var dolAmount = "";
   var decFlag = false;
   var aChar = "";
   
   // ignore all but digits and decimal points.
   for(i=0; i < newValue.length; i++) {
      aChar = newValue.substring(i,i+1);
      if(aChar >= "0" && aChar <= "9") {
         if(decFlag) {
           decAmount = "" + decAmount + aChar;
         }
         else {
            dolAmount = "" + dolAmount + aChar;
         }
      }
      if(aChar == ".") {
         if(decFlag) {
            dolAmount = "";
            break;
         }
         decFlag=true;
      }
   }
    if (dolAmount == "") { dolAmount = 0; }
    if (decAmount == "") { decAmount = 0; }
    return parseInt(dolAmount)*100+parseInt(decAmount);
}

function cents2dollars(value)
{
    return (value/100).toFixed(2);
}

function incdec(inc,incMax,dec)
{
    incField = document.getElementById(inc);
    decField = document.getElementById(dec);
    incValue = incField.value;
    decValue = decField.value;
    incValue++;
    if (incMax != 0 && incValue > incMax) return;
    decValue--;
    if (decValue < 0) return;
    incField.value = incValue;
    decField.value = decValue;
}

function incincdec(inc1,incMax,inc2,dec)
{
    incField1 = document.getElementById(inc1);
    incField2 = document.getElementById(inc2);
    decField = document.getElementById(dec);
    incValue1 = incField1.value;
    incValue2 = incField2.value;
    decValue = decField.value;
    //alert('incValue1 '+incField1.id+' '+incValue1+'\\nincValue2 '+incField2.id+' '+incValue2+'\\ndecValue '+decField.id+' '+decValue+'\\nincMax '+incMax);
    incValue1++;
    incValue2++;
    decValue--;
    if (incMax != 0 && incValue1 > incMax) return;
    if (decValue < 0) return;
    incField1.value = incValue1;
    incField2.value = incValue2;
    decField.value = decValue;
}

function decdecinc(dec1,dec2,inc)
{
    decField1 = document.getElementById(dec1);
    decField2 = document.getElementById(dec2);
    incField = document.getElementById(inc);
    decValue1 = decField1.value;
    decValue2 = decField2.value;
    incValue = incField.value;
    decValue1--;
    decValue2--;
    incValue++;
    if (decValue1 < 0 || decValue2 < 0) return;
    decField1.value = decValue1;
    decField2.value = decValue2;
    incField.value = incValue;
}

function incDecField(id,max,otherId)
{
    retval = "<INPUT TYPE=TEXT CLASS=number NAME="+id+" READONLY ID="+id+" VALUE=0 SIZE=2 />";
    retval = retval + "<INPUT TYPE=button onClick='incdec(\""+id+"\","+max+",\""+otherId+"\");' VALUE=+>";
    retval = retval + "<INPUT TYPE=button onClick='incdec(\""+otherId+"\",0,\""+id+"\");' VALUE=->";
    return retval;
}

function incIncDecField(id,max,inc2,dec)
{
    retval = "<INPUT TYPE=TEXT CLASS=number NAME="+id+" READONLY ID="+id+" VALUE=0 SIZE=2 />";
    retval = retval + "<INPUT TYPE=button onClick='incincdec(\""+id+"\","+max+",\""+inc2+"\",\""+dec+"\");' VALUE=+>";
    retval = retval + "<INPUT TYPE=button onClick='decdecinc(\""+id+"\",\""+inc2+"\",\""+dec+"\");' VALUE=->";
    return retval;
}

function checkField(fieldName,msg)
{
     field = document.getElementById(fieldName);
     if (field.value == "") {
         alert(msg);
         return false;
     }
     return true;
}

function stopRKey(evt) {
   var evt = (evt) ? evt : ((event) ? event : null);
   var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
   if ((evt.keyCode == 13) && (node.type=="text")) {return false;}
}

// copyright 1999 Idocs, Inc. http://www.idocs.com
// Distribute this script freely but keep this notice in place
function numbersonly(myfield, e, dec)
{
var key;
var keychar;

if (window.event)
   key = window.event.keyCode;
else if (e)
   key = e.which;
else
   return true;
keychar = String.fromCharCode(key);

// control keys
if ((key==null) || (key==0) || (key==8) || 
    (key==9) || (key==13) || (key==27) )
   return true;

// numbers
else if ((("0123456789").indexOf(keychar) > -1))
   return true;

// decimal point jump
else if (dec && (keychar == "."))
   {
   myfield.form.elements[dec].focus();
   return false;
   }
else
   return false;
}

document.onkeypress = stopRKey;

////////////////////////////////////////////////////
// Ajax stuff

var HTTP = {};

HTTP._factories = [
    function() { return new XMLHttpRequest(); },
    function() { return new ActiveXObject("Microsoft.XMLHTTP"); },
    function() { return new ActiveXObject("MSXML2.XMLHTTP.3.0."); },
    function() { return new ActiveXObject("MSXML2.XMLHTTP"); },
];    

// When we find a factory that works, store it here.
HTTP._factory = null;

// Create and return a new XMLHttpRequest object
HTTP.newRequest = function() {
    if (HTTP._factory != null) return HTTP._factory();

    for (var i=0; i<HTTP._factories.length; i++) {
	try {
	    var factory = HTTP._factories[i];
	    var request = factory();
	    if (request != null) {
		HTTP._factory = factory;
		return request;
	    }
	}
	catch (e) {
	    continue;
	}
    }

    // If we get here, none of the factories worked
    HTTP._factory = function() {
	throw new Error("XMLHttpRequest not supported");
    }
    HTTP._factory();
};

HTTP._getResponse = function(request) {
    // Check the content type returned by the server
    switch (request.getResponseHeader("Content-Type")) {
    case "text/html":
	return request.responseXML;
    case "text/json":
    case "text/javascript":
    case "application/javascript":
    case "application/x-javascript":
	return eval('('+request.responseText+')');
    default:
	return request.responseText;
    }
};

HTTP.encodeFormData = function(data) {
    var pairs = [];
    var regexp = /%20/g;

    for (var name in data) {
	var value = data[name].toString();
	var pair = encodeURIComponent(name).replace(regexp,"+") + "=" +
	    encodeURIComponent(value).replace(regexp,"+");
	pairs.push(pair);
    }
    return pairs.join('&');
}

HTTP.get = function(url,callback,options) {
    var request = HTTP.newRequest();
    var n = 0;
    var timer;
    if (options.timeout)
	timer = setTimeout(function() {
	    request.abort();
	    if (options.timeoutHandler) options.timeoutHandler(url);
	}, options.timeout);

    request.onreadystatechange = function() {
	if (request.readyState == 4) {
	    if (timer) clearTimeout(timer);
	    if (request.status == 200) {
		callback(HTTP._getResponse(request));
	    } else {
		if (options.errorHandler)
		    options.errorHandler(request.status,request.statusText);
		else
		    callback(null);

	    }
	} else if (options.progressHandler) {
	    options.progressHandler(++n);
	}
    }
	
    var target = url;
    if (options.parameters) target += "?" + HTTP.encodeFormData(options.parameters);
    request.open("GET", target);
    request.send(null);
}

////////////////////////////////////////////////////

// Takes an optional argument, a dictionary of functions:
// key success - called if successful
// key error - called if error

function showContents(obj) {
    var retval = "";
    forEach(Object.keys(obj),function(k) {
	    retval = retval+k+': '+obj[k]+'; ';
	});
    return retval;
}

function doit (command,parameters) {
    //   alert('Sending: '+command+'; '+showContents(parameters));
    if (window.opener) {
	database = window.opener.database;
	username = window.opener.username;
	password = window.opener.password;
    }

    // This setting is picked up by the api script
    var apiVersion = 1;

    parameters['command'] = command;
    parameters['database'] = database;
    parameters['username'] = username;
    parameters['apiVersion'] = apiVersion;
    parameters['password'] = password;

    var myHandler;

    if (arguments.length == 3) {
	var handlerFuncs = arguments[2];
	myHandler = function(results) {
	    handleResults(results,handlerFuncs);
	};
    } else {
	myHandler = handleResults;
    }

    HTTP.get("/esp-cgi/esp",myHandler,{parameters:parameters});
}

handle = {};

function handleResults(results) {
    //alert(results);
    var retval = true;
    var message;
    if (results == null) {
	message = "Request failed for an unknown reason";
	retval = false;
    } else {
	results = eval(results);
	forEach (results, function(result) {
	    var command = result.shift();
	    if (command == 'error') {
		message = result[0];
		retval = false;
	    } else if (command in handle) {
		handle[command](result[0]);
	    } else {
		message = "Internal error - got unexpected response "+command;
	    }
	});
    }
    if (arguments.length == 2) {
	if (retval) {
	    if ('success' in arguments[1]) { arguments[1].success(); }
	} else {
	    if ('error' in arguments[1]) { arguments[1].error(message); }
	}
    }
}

function blurOnReturnKey(evt) {
   var evt = (evt) ? evt : ((event) ? event : null);
   var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
    if (evt.keyCode == 13) { node.blur(); return false;}
}

// end script-->

