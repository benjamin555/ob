function post(url, data, successCallback, errorCallback) {
	var postStr = JSON.stringify(data);
	$.ajax({
		type:"POST",
		timeout:120000,
		"url":url,
		contentType:"application/json",
		"data":postStr,
		dataType:"json",
		success:successCallback,
		processData:false,
		error:errorCallback
	});
}

function get(url, successCallback, errorCallback) {
	$.ajax({
		type:"GET",
		timeout:120000,
		"url":url,
		success:successCallback,
		processData:false,
		error:errorCallback
	});
}

function syncPost(url, data, successCallback, errorCallback) {
	var postStr = JSON.stringify(data);
	$.ajax({
		type:"POST",
		timeout:5000,
		"url":url,
		contentType:"application/json",
		"data":postStr,
		dataType:"json",
		success:successCallback,
		processData:false,
		error:errorCallback,
		async:false
	});
}

function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function disableBackspace() {
	function ban(e){
	    var ev = e || window.event;
	    var obj = ev.target || ev.srcElement;
	    var t = obj.type || obj.getAttribute('type');
	    var vReadOnly = obj.readOnly;
	    var vDisabled = obj.disabled;
	    vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
	    vDisabled = (vDisabled == undefined) ? true : vDisabled;
	    var flag1= ev.keyCode == 8 && (t=="password" || t=="text" || t=="textarea")&& (vReadOnly==true || vDisabled==true);
	    var flag2= ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea" ;
	    if(flag2 || flag1)return false;
	}
	if( $.browser.mozilla || $.browser.opera )
		document.onkeypress = ban;
	else
		document.onkeydown = ban;
}

function getTimeDesc(seconds) {
	var desc = ["天","小时","分钟","秒"];
	var val = [];
	var beg = "", end = "";
	var d = Math.floor(seconds / 86400);
	val.push(d);
	var seconds = seconds % 86400;
	var h = Math.floor(seconds / 3600);
	val.push(h);
	var seconds = seconds % 3600;
	var m = Math.floor(seconds / 60);
	val.push(m);
	val.push(seconds % 60);
	var i = 0, j = 3;
	while (i < 4) {
		if (val[i] > 0) {
			beg += val[i] + desc[i];
			break;
		}
		i++;
	}
	while (i < j) {
		if (val[j] > 0) {
			end += val[j] + desc[j];
			break;
		}
		j--;
	}
	i++;
	while (i < j) {
		beg += val[i] + desc[i];
		i++;
	}
	return beg + end;
}

function getToday() {
	var dt = new Date();
	var m = dt.getMonth() + 1;
	var d = dt.getDate();
	return dt.getFullYear() + "-" + (m<10?'0':'') + m + "-" + (d<10?'0':'') + d; 
}

function formatDate(dt) {
	return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
}

function addDays(dt, days) {
	var y = dt.getFullYear();
	var m = dt.getMonth();
	var d = dt.getDate();
	return new Date(y, m, d + days);
}

function isInteger(v) {
	return /^-?[0-9]+$/.test(v);
}
function isFloat(v) {
	return /^-?[0-9]+(.[0-9]+)?$/.test(v);
}


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}


function setCookie(name,value,days)
{
	if (days) {
	    var exp  = new Date();
	    exp.setTime(exp.getTime() + days*24*60*60*1000);
	    document.cookie = name + "=" + escape (value) + ";expires=" + exp.toGMTString();
	} else {
		document.cookie = name + "=" + escape (value);
	}
}
function getCookie(name)
{
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
     if(arr != null) 
    	 return unescape(arr[2]);
     else
    	 return null;

}
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null) 
    	document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}
function save(key, value) {
	try {
		if(window.localStorage){
			localStorage.setItem(key, value);
		} else
			setCookie(key, value, 365);
	} catch (e) {
		if (console && console.error)
			console.error(e);
	}
}
function load(key) {
	try {
		if(window.localStorage)
			return localStorage.getItem(key);
		else
			return getCookie(key);
	} catch (e) {
		if (console && console.error)
			console.error(e);
		return null;
	}
}
function sessionSave(key, value) {
	try {
		if(window.sessionStorage){
			sessionStorage.setItem(key, value);
		} else
			setCookie(key, value);
	} catch (e) {
		if (console && console.error)
			console.error(e);
	}
}
function sessionLoad(key) {
	try {
		if(window.sessionStorage)
			return sessionStorage.getItem(key);
		else
			return getCookie(key);
	} catch (e) {
		if (console && console.error)
			console.error(e);
		return null;
	}
}
function sessionRemove(key) {
	try {
		if(window.sessionStorage)
			window.sessionStorage.removeItem(key);
		else
			delCookie(key);
	} catch (e) {
		if (console && console.error)
			console.error(e);
	}
}

