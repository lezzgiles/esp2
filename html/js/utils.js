// General utilities

///////////////////////////////////////////////////////////////////////////////
// Money formatting
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
   var decAmount = 0;
   var dolAmount = 0;
   var decFlag = false;
   var negFlag = 1;
   
   // ignore all but digits and decimal points.
   for(i=0; i < newValue.length; i++) {
      var aChar = newValue.substring(i,i+1);
      if(aChar >= "0" && aChar <= "9") {
	  var aInt = parseInt(aChar);
	  if(decFlag) {
	      decAmount = decAmount*10 + aInt;
	  } else {
	      dolAmount = dolAmount*10 + aInt;
	  }
      } else if (aChar == ".") {
	  if (decFlag) {
	      dolAmount = 0;
	      break;
	  }
	  decFlag=true;
      } else if (aChar == '-') {
	  negFlag = -1;
      }
   }
   return negFlag * (dolAmount*100+decAmount);
}

function cents2dollars(value)
{
    return (value/100).toFixed(2);
}

///////////////////////////////////////////////////////////////////////////////
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

///////////////////////////////////////////////////////////////////////////////

HTMLSelectElement.prototype.selectedValues = function() {
    var selected = {};
    forEach(this.options,function(option) {
	    if (option.selected) { selected[option.value] = true }
	});
    return selected;
}

HTMLInputElement.prototype.selectedValues = function() {
    var selected = {};
    if ('espValues' in this) {
	this.espValues.map(function(pair) { selected[pair[1]] = true });
    }
    return selected;
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// Stop the return key from submitting a form.  Probably not necessary
// in this version of esp since there are no forms, but keep anyway.
function stopRKey(evt) {
   var evt = (evt) ? evt : ((event) ? event : null);
   var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
   if ((evt.keyCode == 13) && (node.type=="text")) {return false;}
}
document.onkeypress = stopRKey;

///////////////////////////////////////////////////////////////////////////////

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

// Options can be:
// - timeout: timeout in seconds
// - timeoutHandler: handler called if there is a timeout
// - errorHandler
// - progressHandler
// - parameters: data sent with request
// - callback: handler called on success
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
    //if (options.parameters) target += "?" + HTTP.encodeFormData(options.parameters);
    request.open("POST", target);
    request.send(JSON.stringify(options.parameters));
}

////////////////////////////////////////////////////

// Sends a request, calls handler on success
function doit (command,parameters,handler) {
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

    debug.write('Sending: '+JSON.stringify(parameters));

    HTTP.get("/esp-cgi/esp",handler,{parameters:parameters});
}

///////////////////////////////////////////////////////////////////////////////
function blurOnReturnKey(evt) {
   var evt = (evt) ? evt : ((event) ? event : null);
   var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
    if (evt.keyCode == 13) { node.blur(); return false;}
}

///////////////////////////////////////////////////////////////////////////////
// Add map() to Array

if (!Array.prototype.map)
{
  Array.prototype.map = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        res[i] = fun.call(thisp, this[i], i, this);
    }

    return res;
  };
}

///////////////////////////////////////////////////////////////////////////////
// find x and y coordinates of current HTML element
function findPosX(obj)
  {
    var curleft = 0;
    if(obj.offsetParent)
        while(1) 
        {
          curleft += obj.offsetLeft;
          if(!obj.offsetParent)
            break;
          obj = obj.offsetParent;
        }
    else if(obj.x)
        curleft += obj.x;
    return curleft;
  }

  function findPosY(obj)
  {
    var curtop = 0;
    if(obj.offsetParent)
        while(1)
        {
          curtop += obj.offsetTop;
          if(!obj.offsetParent)
            break;
          obj = obj.offsetParent;
        }
    else if(obj.y)
        curtop += obj.y;
    return curtop;
  }


// end script-->

