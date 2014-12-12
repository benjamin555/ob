(function() {
var tuiText = {
		ok: "Ok", 
		cancel: "Cancel", 
		apply: "Apply", 
		asc: "Asc", 
		desc: "Desc", 
		today: "Today", 
		select: "Select",
		all: "All",
		clear: "Clear"};

var popedPanel = null;
var currentDialogMask = null;
var currentDialog = null;

Array.prototype.indexOf = function (v) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] === v) 
			return i;
	}
	return -1;
};

function logError(msg) {
	try {
		if (typeof console === "object" && typeof console.error === "function") {
			console.error(msg);
		}
	} catch (e) {
	}
}

function parseDate(dt) {
	var matches = /^(\d{4})-(1[0-2]|0?[1-9])-(0?[1-9]|[12][0-9]|3[01])(?:\s+(0?[0-9]|1[0-9]|2[0-3])(?::([0-5]?[0-9])(?::([0-5]?[0-9]))?)?)?$/g.exec(dt);
	if (!(matches instanceof Array))
		return null;
	var p = matches.indexOf(undefined);
	if (p >= 0) {
		while (p < matches.length) {
			matches[p] = 0;
			p++;
		}
	}
	return new Date(matches[1],parseInt(matches[2]) - 1,matches[3],matches[4],matches[5],matches[6]);
}

// Get current computed style
function getCurrentStyle(node) {
    var style = null;
    try {
    	if(window.getComputedStyle) {
            style = window.getComputedStyle(node, null);
        }else{
            style = node.currentStyle;
        }
    } catch (e) {
    	return null;
    }
    return style;
}

function addEventListener(element, event, fn, capture) {
	if (element.addEventListener) {
		element.addEventListener(event, fn, capture ? true : false);
	} else if (element.attachEvent) {
		element.attachEvent("on" + event, fn);
	}
}
function removeEventListener(element, event, fn, capture) {
	if (element.removeEventListener) {
		element.removeEventListener(event, fn, capture ? true : false);
	} else if (element.attachEvent) {
		element.detachEvent("on" + event, fn);
	}
}



function getIEVersion() {
	var rv = -1; // Return value assumes failure.
	if (navigator.appName == "Microsoft Internet Explorer" || 
			navigator.appName == "Netscape") {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}
	if (rv == -1 && navigator.appName == "Netscape") {
		var ua = navigator.userAgent;
		var re = new RegExp("Trident/([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);	
		if (rv >= 7.0)
			rv = 11.0;
	}
	return rv;
}
var ieVer = getIEVersion();
var isIE8 = (ieVer != -1 && ieVer < 9);
var isIE7 = (ieVer != -1 && ieVer < 8);


if (ieVer < 9) {
	addEventListener(document, "keydown", function (e){
		var ev = e || window.event;
		if (ev.keyCode == 27 && currentDialog) {
			currentDialog.close();
		}
	});
} else {
	addEventListener(top, "keydown", function (e){
		var ev = e || window.event;
		if (ev.keyCode == 27 && currentDialog) {
			currentDialog.close();
		}
	});
}

function userAgentLike(key) {
	return navigator.userAgent.indexOf(key, 0) >= 0;
}

// Get object position related of the offsetParent or of the body if offsetParent is null.
function getOffsetPosition(obj, offsetParent) {
	var curleft = obj.offsetLeft;
	var curtop = obj.offsetTop;
	obj = obj.offsetParent;
	while (obj) {
		if (obj === offsetParent)
			break;
		if (obj.clientLeft) {
			curleft += obj.offsetLeft + obj.clientLeft;
		} else {
			curleft += obj.offsetLeft;
		}
		if (obj.clientTop) {
			curtop += obj.offsetTop + obj.clientTop;
		} else {
			curtop += obj.offsetTop;
		}
		obj = obj.offsetParent;
	}
	return [curleft, curtop];
}

function getProperlyParent(bindObj, defaultParent) {
	var obj = bindObj.parentElement;
	while (obj) {
		if (getCurrentStyle(obj).position.toLowerCase() === "fixed")
			return obj;
		obj = obj.parentElement;
	}
	return defaultParent;
}

function setFloat(obj, value) {
	if (isIE8)
		obj.style.styleFloat = value;
	else
		obj.style.cssFloat = value;
}

function addClass(obj, cls) {
	if (!cls || typeof cls !== "string")
		return;
	if (obj && obj.nodeType === 1) {
		var classes;
		if (typeof obj.className === "string" && obj.className) {
			classes = obj.className.split(/\s+/);
		} else {
			classes = [];
		}
		var newCls = cls.split(/\s+/);
		for (var i = 0; i < newCls.length; i++) {
			if (classes.indexOf(newCls[i]) < 0)
				classes.push(newCls[i]);
		}
		var pos = -1;
		while ((pos = classes.indexOf("")) >= 0) {
			classes.splice(pos, 1);
		}
		if (classes.length > 0) {
			var clsStr = "";
			for (var i = 0; i < classes.length; i++)
				clsStr += (" " + classes[i] + " ");
			obj.className = clsStr;
		} else {
			obj.removeAttribute("class");
		}
	}
}

function removeClass(obj, cls) {
	if (!cls || typeof cls !== "string")
		return;
	if (obj && obj.nodeType === 1) {
		var classes;
		if (typeof obj.className === "string" && obj.className) {
			classes = obj.className.split(/\s+/);
		} else {
			classes = [];
		}
		var newCls = cls.split(/\s+/);
		var pos = -1;
		for (var i = 0; i < newCls.length; i++) {
			pos = classes.indexOf(newCls[i]);
			if (pos >= 0) {
				classes.splice(pos, 1);
			}
		}
		while ((pos = classes.indexOf("")) >= 0) {
			classes.splice(pos, 1);
		}
		if (classes.length > 0) {
			var clsStr = "";
			for (var i = 0; i < classes.length; i++)
				clsStr += (" " + classes[i] + " ");
			obj.className = clsStr;
		} else {
			obj.removeAttribute("class");
		}
	}	
}

function isInteger(obj) {
	if (typeof obj === "number")
		return true;
	else if (typeof obj === "string") {
		return /^\d+$/.test(obj);
	} else
		return false;
}

/*
 * makeToolbar
 */
function makeToolbar(container, func) {
	if (typeof container === "string")
		container = document.getElementById(container);
	if (!container || container._env)
		return;
	container._env = {};
	var env = container._env;
	if (typeof func === "function")
		env.func = func;
	else
		env.func = null;
	container.className = "thor-toolbar";
	container.setAttribute("unselectable", "on");
	addEventListener(container, "mousedown", closeAllPanel);
	env.image = container.getAttribute("data-image");
	env.disableImage = container.getAttribute("data-disable-image");
	env.imageSize = container.getAttribute("data-image-size");
	
	function addImage(obj, imageId) {
		var img = document.createElement("SPAN");
		var nodes = [];
		for (var i = 0; i < obj.childNodes.length; i++) {
			if (obj.childNodes[i].nodeName.toUpperCase() == "#TEXT") {
				var txtSpan = document.createElement("SPAN");
				txtSpan.innerHTML = obj.childNodes[i].nodeValue;
				txtSpan.style.verticalAlign = "middle";
				nodes.push(txtSpan);
			} else
				nodes.push(obj.childNodes[i]);
		}
		obj.innerHTML = "";
		for (var i = 0; i < nodes.length; i++) {
			obj.appendChild(nodes[i]);
		}
		obj.insertBefore(img, obj.firstChild);
		img.style.display = "inline-block";
		img.style.width = env.imageSize + "px";
		img.style.height = env.imageSize + "px";
		img.style.verticalAlign = "middle";
		img.style.backgroundImage = "url(" + env.image + ")";
		img.style.backgroundPosition = (-env.imageSize * imageId) + "px 0px";
		obj.icon = img;
	}
	
	for (var i = 0; i < container.childNodes.length; i++) {
		var obj = container.childNodes[i];
		if (obj.nodeName !== "SPAN" && obj.nodeName !== "A")
			continue;
		var objType = obj.getAttribute("data-type");
		if (objType == "" || objType == undefined || objType === "button") {
			makeButton(obj, function(){
				if (env.func)
					env.func(this);
			}, "toolbar");
			var imageId = obj.getAttribute("data-image");
			if (isInteger(imageId)) {
				addImage(obj, parseInt(imageId));
			}
			obj.setButtonEnabled = function (enabled) {
				if (this.icon) {
					if (enabled)
						this.icon.style.backgroundImage = "url(" + env.image + ")";
					else
						this.icon.style.backgroundImage = "url(" + env.disableImage + ")";
				}
				this.setEnabled(enabled);
			};
		} else if (objType === "toggle") {
			makeButton(obj, function() {
				var pushed = this.getPushed();
				this.setPushed(!pushed);
				if (this.icon) {
					var imageId;
					if (!pushed) {
						imageId = this.getAttribute("data-toggle-image");
						if (isInteger(imageId)) {
							this.icon.style.backgroundPosition = (-env.imageSize * imageId) + "px 0px";
						}
					} else {
						imageId = this.getAttribute("data-image");
						this.icon.style.backgroundPosition = (-env.imageSize * imageId) + "px 0px";
					}
				}
				if (env.func)
					env.func(this);
			}, "toolbar");
			var imageId = obj.getAttribute("data-image");
			if (isInteger(imageId)) {
				addImage(obj, parseInt(imageId));
			}
			obj.setButtonEnabled = function (enabled) {
				if (this.icon) {
					if (enabled)
						this.icon.style.backgroundImage = "url(" + env.image + ")";
					else
						this.icon.style.backgroundImage = "url(" + env.disableImage + ")";
				}
				this.setEnabled(enabled);
			};
		} else if (objType === "split") {
			obj.className = "thor-toolbar-split";
			obj.style.height = env.imageSize + "px";
			obj.innerHTML = "";
		}
	}
	
	container.removeItem = function (key) {
		if (typeof key === "string") {
			var item = document.getElementById(key);
			if (item)
				container.removeChild(item);
		} else if (typeof key === number && key >= 0 && key < container.childNodes.length) {
			container.removeChild(container.childNodes[key]);
		} 
	};
	container.hideItem = function (key) {
		if (typeof key === "string") {
			var item = document.getElementById(key);
			if (item)
				item.style.display = "none";
		} else if (typeof key === number && key >= 0 && key < container.childNodes.length) {
			container.childNodes[key].style.display = "none"; 
		} 
	};
	container.showItem = function (key) {
		if (typeof key === "string") {
			var item = document.getElementById(key);
			if (item)
				item.style.display = "inline-block";
		} else if (typeof key === number && key >= 0 && key < container.childNodes.length) {
			container.childNodes[key].style.display = "inline-block"; 
		} 
	};
	return container;
}

/*
 * BUTTON
 */
function makeButton(container, func, style) {
	if (typeof container === "string")
		container = document.getElementById(container);
	if (!container || container._env)
		return;
	container._env = {};
	var env = container._env;
	if (typeof func === "function")
		env.func = func;
	else
		env.func = null;
	env.enabled = true;
	env.pushed = false;

	if (typeof style === "string")
		env.buttonName = "thor-button-" + style;
	else
		env.buttonName = "thor-button-default";

	container.setAttribute("unselectable", "on");
	addClass(container, env.buttonName);
	
	if (ieVer != -1) {
		var mouseDownFunc = function(){
			setActiveStyle();
			container.setCapture();
		};
		var mouseUpFunc = function() {
			setStyle();
			container.releaseCapture();
		};
		addEventListener(container, "mousedown", mouseDownFunc);
		addEventListener(container, "mouseup", mouseUpFunc);
	}

	if (env.enabled)
		container.onclick = env.func;
	
	function setStyle() {
		container.className = "thor-button " + env.buttonName +
			(env.pushed ? "-pushed" : "") + 
			(env.enabled ? "" : "-disabled");
	}
	
	function setActiveStyle() {
		container.className = "thor-button "  + env.buttonName +
			(env.pushed ? "-pushed" : "") + 
			(env.enabled ? "" : "-disabled") + "-active" + " " + env.buttonName +
			(env.pushed ? "-pushed" : "") + 
			(env.enabled ? "" : "-disabled");
	}

	container.setEnabled = function (enabled) {
		if (enabled === true) {
			env.enabled = true;
			container.onclick = env.func;
		} else {
			env.enabled = false;
			container.onclick = null;
		}
		setStyle();
	};
	container.getEnabled = function () {
		return env.enabled;
	};
	container.setPushed = function (pushed) {
		if (pushed === true) {
			env.pushed = true;
		} else {
			env.pushed = false;
		}
		setStyle();
	};
	container.getPushed = function () {
		return env.pushed;
	};
	setStyle();
	return container;
}


/*
 * DATE PICKER
 */
function makeDatePicker(container) {
	if (typeof container === "string")
		container = document.getElementById(container);
	if (!(container && (container.tagName === "DIV" || container.tagName === "SPAN")) || container._env)
		return;

	container.onpicked = null;

	var weekName = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
	var doc = container.ownerDocument;
	container._env = {};
	var env = container._env;
	var table = doc.createElement("TABLE");
	table.className = "thor-datepicker-table";
	table.setAttribute("cellspacing", 0);
	table.setAttribute("cellpadding", 0);
	table.onselectstart = new Function("return false;");
	var yearRow = table.insertRow(-1);
	var leftArrow = yearRow.insertCell(-1);
	leftArrow.align = "center";
	leftArrow.className = "thor-datepicker-day thor-datepicker-prev-month";
	leftArrow.onclick = prevMonth;
	var leftYear = yearRow.insertCell(-1);
	leftYear.align = "center";
	leftYear.className = "thor-datepicker-day thor-datepicker-prev-year";
	leftYear.onclick = prevYear;
	var yearCell = yearRow.insertCell(-1);
	yearCell.colSpan = 3;
	yearCell.align = "center";
	yearCell.className = "thor-datepicker-year";
	var rightYear = yearRow.insertCell(-1);
	rightYear.align = "center";
	rightYear.className = "thor-datepicker-day thor-datepicker-next-year";
	rightYear.onclick = nextYear;
	var rightArrow = yearRow.insertCell(-1);
	rightArrow.align = "center";
	rightArrow.className = "thor-datepicker-day thor-datepicker-next-month";
	rightArrow.onclick = nextMonth;
	var weekRow = table.insertRow(-1);
	for (var i = 0; i < 7; i++) {
		var cell = weekRow.insertCell(-1);
		cell.align = "center";
		cell.className = "thor-datepicker-week";
		cell.innerHTML = weekName[i];
	}
	for (var i = 0; i < 6; i++) {
		var dayLine = table.insertRow(-1);
		for (var j = 0; j < 7; j++) {
			var cell = dayLine.insertCell(-1);
			cell.align = "center";
		}
	}
	container.innerHTML = "";
	container.appendChild(table);
	function getFirstDay(date) {
		var y = date.getFullYear();
		var m = date.getMonth();
		return new Date(y, m, 1);
	}
	function getDaysOfMonth(date) {
		var y = date.getFullYear();
		var m = date.getMonth();
		var d1 = new Date(y, m, 1);
		if (m === 11) {
			y++;
			m = 0;
		} else {
			m++;
		}
		var d2 = new Date(y, m, 1);
		return (d2 - d1) / 1000 / (60 * 60 * 24);
	}
	function prevMonth() {
		var y = env.year;
		var m = env.month;
		var d = env.day;
		if (m === 1) {
			y--;
			m = 12;
		} else {
			m--;
		}
		var newDate = new Date(y, m - 1, 1);
		if (d > getDaysOfMonth(newDate))
			d = getDaysOfMonth(newDate);
		onPicked(y, m, d);
	}
	function nextMonth() {
		var y = env.year;
		var m = env.month;
		var d = env.day;
		if (m === 12) {
			y++;
			m = 1;
		} else {
			m++;
		}
		var newDate = new Date(y, m - 1, 1);
		if (d > getDaysOfMonth(newDate))
			d = getDaysOfMonth(newDate);
		onPicked(y, m, d);
	}
	function prevYear() {
		var y = env.year;
		var m = env.month;
		var d = env.day;
		y--;
		var newDate = new Date(y, m - 1, 1);
		if (d > getDaysOfMonth(newDate))
			d = getDaysOfMonth(newDate);
		onPicked(y, m, d);
	}
	function nextYear() {
		var y = env.year;
		var m = env.month;
		var d = env.day;
		y++;
		var newDate = new Date(y, m - 1, 1);
		if (d > getDaysOfMonth(newDate))
			d = getDaysOfMonth(newDate);
		onPicked(y, m, d);
	}
	function onPicked(y, m, d) {
		var newDate = new Date(y, m - 1, d);
		container.setDate(newDate);
		if (typeof (container.onpicked) === "function") {
			container.onpicked(newDate);
		}
	}
	function onDayCellClick(e) {
		var ev = e || window.event;
		var src = ev.srcElement || ev.target;
		var d = parseInt(src.innerHTML);
		onPicked(env.year, env.month, d);
	}
	function onDayCellDblClick(e) {
		if (typeof (container.ondblpicked) === "function") {
			container.ondblpicked(container.getDate());
		}		
	}
	container.setDate = function (date) {
		env.year = date.getFullYear();
		env.month = date.getMonth() + 1;
		env.day = date.getDate();
		var today = new Date();
		var firstWeek = getFirstDay(date).getDay();
		var daysOfMonth = getDaysOfMonth(date);
		var day = 0;
		yearCell.innerHTML = env.year + "-" + env.month;
		for (var i = 0; i < 6; i++) {
			for (var j = 0; j < 7; j++) {
				var cell = table.rows[i + 2].cells[j];
				if (day === 0) {
					if (j === firstWeek) {
						day = 1;
						cell.innerHTML = day;
						cell.onclick = onDayCellClick;
						cell.ondblclick = onDayCellDblClick;
						cell.style.color = "";
					} else {
						var preMonthDay = new Date(getFirstDay(date).valueOf() - ((firstWeek - j) * 1000 * 24 * 60 * 60));
						cell.innerHTML = preMonthDay.getDate();
						cell.onclick = function (e) {
							var ev = e || window.event;
							var src = ev.srcElement || ev.target;
							var d = parseInt(src.innerHTML);
							var y = env.year;
							var m = env.month;
							if (m === 1) {
								y--;
								m = 12;
							} else {
								m--;
							}
							onPicked(y, m, d);
						};
						cell.style.color = "#c0c0c0";
					}
				} else {
					day++;
					if (day <= daysOfMonth) {
						cell.innerHTML = day;
						cell.onclick = onDayCellClick;
						cell.ondblclick = onDayCellDblClick;
						cell.style.color = "";
					} else {
						cell.innerHTML = (day - daysOfMonth);
						cell.onclick = function (e) {
							var ev = e || window.event;
							var src = ev.srcElement || ev.target;
							var d = parseInt(src.innerHTML);
							var y = env.year;
							var m = env.month;
							if (m === 12) {
								y++;
								m = 1;
							} else {
								m++;
							}
							onPicked(y, m, d);
						};
						cell.style.color = "#c0c0c0";
					}
				}
				if (day === env.day)
					cell.className = "thor-datepicker-select-day";
				else if (env.year == today.getFullYear() && env.month == (today.getMonth() + 1) && day == today.getDate())
					cell.className = "thor-datepicker-today";
				else if (j === 0 || j === 6)
					cell.className = "thor-datepicker-weekend";
				else
					cell.className = "thor-datepicker-day";
			}
		}
	};

	container.getDate = function () {
		var y = env.year;
		var m = env.month;
		var d = env.day;
		return new Date(y, m - 1, d);
	};

	container.setDate(new Date());
	return container;
}

/*
 * SCROLLBAR
 * (direction 0 is vertical 1 is horizontal)
 */
function makeScrollbar(container, direction, focusElement) {
	if (typeof container === "string")
		container = document.getElementById(container);	
	if (!container || container._env)
		return;
	if (container.style.position.toLowerCase() != "absolute" &&
        container.style.position.toLowerCase() != "relative" &&
        container.style.position.toLowerCase() != "fixed")
		container.style.position = "relative";

	var doc = container.ownerDocument;
	container.onselectstart = new Function("return false;");
	container._env = {};
	var env = container._env;
	env.direction = (parseInt(direction) === 1 ? 1 : 0);
	env.total = 0;
	env.value = 0;
	env.page = 1;
	if (env.direction === 0)
		container.className = "thor-vscrollbar";
	else
		container.className = "thor-hscrollbar";

	var box = doc.createElement("DIV");
	box.onselectstart = new Function("return false;");
	box.style.position = "absolute";
	if (env.direction === 0)
		box.className = "thor-scroll-thumb-v";
	else
		box.className = "thor-scroll-thumb-h";
	container.appendChild(box);

	function calculate() {
		if (env.direction === 0)
			env.value = (box.offsetTop / (container.clientHeight - box.offsetHeight)) * (env.total - env.page);
		else
			env.value = (box.offsetLeft / (container.clientWidth - box.offsetWidth)) * (env.total - env.page);
		env.value = parseInt(env.value.toFixed());
		if (env.value < 0)
			env.value = 0;
		if (env.value > env.total)
			env.value = env.total;
	}

	var scrollTimer = null;
	var scrollInterval = null;
	addEventListener(container, "mouseup", function (e) {
		if (focusElement && focusElement.tagName)
			focusElement.focus();
	});
	// Click scrollbar
	addEventListener(container, "mousedown", function (e) {
		var ev = e || window.event;
		if (focusElement && focusElement.tagName)
			focusElement.focus();
		if ((!isIE8 && ev.button !== 0) || (isIE8 && ev.button !== 1))
			return false;
		
		if (window.event)
			ev.cancelBubble = true;
		else
			ev.stopPropagation();
		
		if (box.style.display == "none")
			return false;
		var mousePos = (env.direction === 0 ? (ev.offsetY ? ev.offsetY : ev.layerY) : (ev.offsetX ? ev.offsetX : ev.layerX));
		var scrollDirect = undefined;
		function moveThumb() {
			var thumbPos = (env.direction === 0 ? box.offsetTop : box.offsetLeft);
			var thumbSize = (env.direction === 0 ? box.offsetHeight : box.offsetWidth);
			if (scrollDirect === 0) {
				if (mousePos < thumbPos) {
					env.value -= parseInt((env.page / 2).toFixed());
					if (env.value < 0)
						env.value = 0;
				}
			} else if (scrollDirect === 1) {
				if (mousePos > thumbPos + thumbSize) {
					env.value += parseInt((env.page / 2).toFixed());
					if (env.value > (env.total - env.page))
						env.value = (env.total - env.page);
				}
			} else {
				if (mousePos < thumbPos) {
					env.value -= parseInt((env.page / 2).toFixed());
					if (env.value < 0)
						env.value = 0;
					scrollDirect = 0;
				} else {
					env.value += parseInt((env.page / 2).toFixed());
					if (env.value > (env.total - env.page))
						env.value = (env.total - env.page);
					scrollDirect = 1;
				}
			}
			resize();
			if (typeof container.onscrollend === "function")
				container.onscrollend(env.value);
		}
		moveThumb();

		var releaseButton = undefined;
		releaseButton = function (e) {
			if (scrollTimer) {
				clearTimeout(scrollTimer);
				scrollTimer = null;
			}
			if (scrollInterval) {
				clearInterval(scrollInterval);
				scrollInterval = null;
			}
			removeEventListener(doc, "mouseup", releaseButton);
		};
		addEventListener(doc, "mouseup", releaseButton);
		scrollTimer = setTimeout(function () {
			scrollTimer = null;
			scrollInterval = setInterval(moveThumb, 50);
		}, 400);
		
		if (ev.preventDefault)
			ev.preventDefault();
		return false;
	});

	box.onmousedown = function (e) {
		if (focusElement && focusElement.tagName)
			focusElement.focus();
		if (typeof container.onscrollstart === "function")
			container.onscrollstart();
		
		var ev = e || window.event;
		if ((!isIE8 && ev.button !== 0) || (isIE8 && ev.button !== 1))
			return false;

		if (window.event)
			ev.cancelBubble = true;
		else
			ev.stopPropagation();
		
		var obj = ev.srcElement || ev.target;
		var mask = doc.createElement("DIV");
		mask.className = "thor-mask";
		mask.onselectstart = new Function("return false;");
		doc.body.appendChild(mask);
		var startPos = (env.direction === 0 ? obj.offsetTop : obj.offsetLeft);
		var mousePos = (env.direction === 0 ? ev.clientY : ev.clientX);
		var savedMouseMove = doc.onmousemove;
		var savedMouseUp = doc.onmouseup;
		doc.onmousemove = function (de) {
			de = de || window.event;
			var distance = (env.direction === 0 ? de.clientY : de.clientX) - mousePos;
			if (env.direction === 0) {
				if (startPos + distance < 0)
					obj.style.top = "0px";
				else if (startPos + distance > container.clientHeight - obj.offsetHeight)
					obj.style.top = (container.clientHeight - obj.offsetHeight) + "px";
				else
					obj.style.top = (startPos + distance) + "px";
			} else {
				if (startPos + distance < 0)
					obj.style.left = "0px";
				else if (startPos + distance > container.clientWidth - obj.offsetWidth)
					obj.style.left = (container.clientWidth - obj.offsetWidth) + "px";
				else
					obj.style.left = (startPos + distance) + "px";
			}
			calculate();
			if (typeof container.onscrolling === "function") {
				container.onscrolling(env.value);
			}
			if (de.preventDefault)
				de.preventDefault();
			return false;
		};
		doc.onmouseup = function (de) {
			de = de || window.event;
			doc.onmousemove = savedMouseMove;
			doc.onmouseup = savedMouseUp;
			doc.body.removeChild(mask);
			if (typeof container.onscrollend === "function")
				container.onscrollend(env.value);
			if (de.preventDefault)
				de.preventDefault();
			if (focusElement && focusElement.tagName)
				focusElement.focus();
			return false;
		};
		if (ev.preventDefault)
			ev.preventDefault();
		return false;
	};

	function resize() {
		var containerLength = (env.direction === 0 ? container.clientHeight : container.clientWidth);
		if (env.page >= env.total || env.total <= 0 || containerLength < 20) {
			box.style.display = "none";
			return;
		}
		box.style.display = "inline-block";
		if (env.direction === 0) {
			box.style.left = "0px";
			box.style.width = container.clientWidth + "px";
		} else {
			box.style.top = "0px";
			box.style.height = container.clientHeight + "px";
		}
		var length = parseInt(((env.page / env.total) * containerLength).toFixed());
		if (length < 10)
			length = 10;
		if (length > containerLength - 10)
			length = containerLength - 10;
		if (env.direction === 0)
			box.style.height = length + "px";
		else
			box.style.width = length + "px";
		var scale = (env.value / (env.total - env.page));
		if (scale < 0)
			scale = 0;
		if (scale > 1)
			scale = 1;
		var pos = (scale * (containerLength - length)).toFixed();
		if (env.direction === 0)
			box.style.top = pos + "px";
		else
			box.style.left = pos + "px";
	}

	container.setValue = function (v) {
		if (v < 0)
			v = 0;
		if (v > env.total)
			v = env.total;
		env.value = v;
		resize();
	};
	container.getValue = function() {
		return env.value;
	};
	container.setTotal = function (v) {
		if (v < 0)
			v = 0;
		env.total = v;
		if (env.value > env.total)
			env.value = env.total;
		resize();
	};
	container.setPage = function (v) {
		if (v < 0)
			v = 0;
		env.page = v;
		resize();
	};
	container.setInfo = function (total, val, page) {
		if (typeof total !== "number")
			total = 0;
		if (typeof val !== "number")
			val = 0;
		if (typeof page !== "number")
			page = 1;

		if (total < 0)
			total = 0;
		env.total = total;
		if (env.value > env.total)
			env.value = env.total;
		if (val < 0)
			val = 0;
		if (val > env.total)
			val = env.total;
		env.value = val;
		if (page < 0)
			page = 0;
		env.page = page;
		resize();
	};
	container.refresh = resize;
	resize();
}

/*
 * DATAGRID
 */
function makeGrid(container, columnInfos) {
	if (typeof container === "string")
		container = document.getElementById(container);
	if (!(container && (container.tagName === "DIV" || container.tagName === "SPAN")) || container._env)
		return;
	addClass(container, "thor-grid-container");
	container.setAttribute("unselectable", "on");
	var doc = container.ownerDocument;
	container._env = {};
	var env = container._env;
	if (columnInfos instanceof Array)
		env.colInfos = columnInfos;
	else
		env.colInfos = [];
	env.data = [];
	env.separators = [];
	env.autoWidth = true;
	env.firstLine = 0;
	env.dispLines = 0;
	env.firstColumn = 0;
	env.fixedColumn = 0;
	env.activeLine = null;
	env.sortByMultipleColumn = false;
	env.needUpdate = true;
	env.useWheele = true;
	if (container.id && container.id.length > 0)
		env.stylePrefix = "_" + container.id;
	else {
		var tmpName = "";
		do {
			tmpName = "Grid" + (Math.random() * 10000).toFixed();
		} while (doc.getElementById(tmpName) != undefined);
		container.id = tmpName;
		env.stylePrefix = "_" + container.id;
	}

	if (doc.createStyleSheet)
		env.gridStyle = doc.createStyleSheet();
	else {
		env.gridStyle = doc.createElement("STYLE");
		doc.head.appendChild(env.gridStyle);
	}
	container.onscrollend = null;
	container.onclickrow = null;
	container.ondblclickrow = null;
	container.onfilter = null;

	if (container.style.position.toLowerCase() != "absolute" &&
        container.style.position.toLowerCase() != "relative" &&
        container.style.position.toLowerCase() != "fixed")
		container.style.position = "relative";

	container.style.overflow = "hidden";

	// Create a hidden DIV to extract the style properties which assigned to it.
	var testDiv = doc.createElement("DIV");
	testDiv.style.display = "inline-block";
	testDiv.style.position = "absolute";
	testDiv.style.visibility = "hidden";
	container.appendChild(testDiv);
	// Get line height
	testDiv.className = "thor-grid-line";
	env.lineHeight = testDiv.offsetHeight;
	if (env.lineHeight <= 0)
		env.lineHeight = 30;
	// Get scrollbar width
	testDiv.className = "thor-vscrollbar";
	env.scrollbarWidth = testDiv.offsetWidth;
	// Get scrollbar height
	testDiv.className = "thor-hscrollbar";
	env.scrollbarHeight = testDiv.offsetHeight;
	// Get cell border width
	testDiv.className = "thor-grid-cell";
	var testSubDiv = doc.createElement("DIV");
	testSubDiv.style.display = "block";
	testSubDiv.style.height = "100%";
	testDiv.appendChild(testSubDiv);
	env.cellBorderWidth = testDiv.offsetWidth - testSubDiv.offsetWidth;
	env.cellBorderHeight = testDiv.offsetHeight - testSubDiv.offsetHeight;

	container.removeChild(testDiv);

	var dataTable = doc.createElement("TABLE");
	dataTable.setAttribute("cellpadding", 0);
	dataTable.setAttribute("cellspacing", 0);
	dataTable.setAttribute("border", 0);
	dataTable.className = "thor-grid";
	dataTable.style.outline = "none";
	dataTable.onselectstart = new Function('return false;');
	container.appendChild(dataTable);
	// VScroll
	var vscroll = doc.createElement("DIV");
	vscroll.style.display = "none";
	vscroll.style.position = "absolute";
	vscroll.style.borderLeft = "1px solid #f0f0f0";
	// HScroll
	var hscroll = doc.createElement("DIV");
	hscroll.style.display = "none";
	hscroll.style.position = "absolute";
	// Scroll corner block
	var corner = doc.createElement("DIV");
	corner.style.display = "none";
	corner.style.position = "absolute";
	corner.className = "thor-grid-corner";
	container.appendChild(vscroll);
	makeScrollbar(vscroll, 0, dataTable);
	vscroll.onscrolling = function (pos) {
		if (env.firstLine != pos) {
			env.firstLine = pos;
			draw();
		}
	};
	vscroll.onscrollend = function (pos) {
		env.firstLine = pos;
		draw();
		if (typeof container.onscrollend === "function")
			container.onscrollend();
	};
	
	container.appendChild(hscroll);
	makeScrollbar(hscroll, 1, dataTable);
	hscroll.onscrolling = function (pos) {
		if (env.firstColumn != pos) {
			env.firstColumn = pos;
			drawColumn();
		}
	};
	hscroll.onscrollend = function (pos) {
		env.firstColumn = pos;
		drawColumn();
	};

	container.appendChild(corner);

	var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
	addEventListener(dataTable, mousewheelevt, function (e) {
		if (!env.useWheele)
			return true;
		var evt = window.event || e;
		var delta = evt.detail ? evt.detail * (-120) : evt.wheelDelta;
		//delta returns +120 when wheel is scrolled up, -120 when scrolled down
		if (delta <= -120) {
			env.firstLine++;
			if (env.firstLine >= env.data.length - (env.dispLines - 1)) {
				env.firstLine = env.data.length - (env.dispLines - 1);
			}
		} else {
			env.firstLine--;
		}
		if (env.firstLine < 0) {
			env.firstLine = 0;
		}
		vscroll.setInfo(env.data.length, env.firstLine, env.dispLines - 1);
		draw();
		if (typeof container.onscrollend === "function")
			container.onscrollend();
		if (evt.preventDefault)
			evt.preventDefault();
		else
			return false;
	});
	dataTable.setAttribute("tabindex", 0);
	addEventListener(dataTable, "keydown", function (e) {
		var evt = window.event || e;
		//delta returns +120 when wheel is scrolled up, -120 when scrolled down
		if (evt.keyCode != 40 && evt.keyCode != 38)
			return;
		if (env.data.length <= 0)
			return;
		if (evt.keyCode == 40) { // down key
			if (typeof env.activeLine === "number") {
				env.activeLine++;
				if (env.activeLine >= env.data.length)
					env.activeLine = env.data.length - 1;
			} else {
				env.activeLine = 0;
			}
		} else if (evt.keyCode == 38) { // up key
			if (typeof env.activeLine === "number") {
				env.activeLine--;
				if (env.activeLine < 0)
					env.activeLine = 0;
			} else {
				env.activeLine = 0;
			}
		}
		if (env.activeLine < env.firstLine)
			env.firstLine = env.activeLine;
		if (env.activeLine >= env.firstLine + env.dispLines - 1)
			env.firstLine = env.activeLine - (env.dispLines - 2);
		if (env.firstLine < 0) {
			env.firstLine = 0;
		}
		vscroll.setInfo(env.data.length, env.firstLine, env.dispLines - 1);
		draw();
		if (typeof container.onscrollend === "function")
			container.onscrollend();
		if (evt.preventDefault)
			evt.preventDefault();
		else
			return false;
	});
	addEventListener(dataTable, "mousedown", function (e) {
		var evt = window.event || e;
		var obj = evt.srcElement || evt.target;
		while (typeof obj.rowIndex === "undefined") {
			obj = obj.parentElement;
			if (obj == null)
				return;
		}
		if (obj.rowIndex == 0)
			return;
		var activeLine = env.firstLine + (obj.rowIndex - 1);
		if (activeLine >= 0 && activeLine < env.data.length)
			env.activeLine = activeLine;
		draw();
	});

	function draw() {
		var idx = env.firstLine;
		var lineStyle1 = (env.firstLine % 2 == 0 ? "thor-grid-line-1" : "thor-grid-line-2");
		var lineStyle2 = (env.firstLine % 2 == 0 ? "thor-grid-line-2" : "thor-grid-line-1");
		for (var i = 1; i < env.dispLines; i++, idx++) {
			var r = dataTable.rows[i];
			if (idx == env.activeLine)
				r.className = "thor-grid-line thor-grid-active-line";
			else if (i % 2 == 1)
				r.className = "thor-grid-line " + lineStyle1;
			else
				r.className = "thor-grid-line " + lineStyle2;
			for (var j = 0; j < env.colInfos.length; j++) {
				var c = r.cells[j];
				if (idx < env.data.length) {
					var cid;
					if (typeof env.colInfos[j].cid === "number")
						cid = env.colInfos[j].cid;
					else
						cid = j;
					var content;
					if (cid < 0 || cid >= env.data[idx].length)
						content = null;
					else
						content = env.data[idx][cid];
					if (typeof env.colInfos[j].formater === "function")
						content = env.colInfos[j].formater(content,idx);
					if (typeof content === "string" || typeof content === "number" || 
							typeof content === "boolean") {
						c.firstChild.innerHTML = content;
					} else if (content && typeof content === "object" && content.nodeName) {
						c.firstChild.innerHTML = "";
						c.firstChild.appendChild(content);
					} else if (content){
						c.firstChild.innerHTML = content.toString();
					} else {
						c.firstChild.innerHTML = "";
					}
				} else {
					c.firstChild.innerHTML = "";
				}
			}
		}
	}

	function isFilterUsed(filter) {
		if (!filter)
			return false;
		for (var i = 0; i < filter.length; i++) {
			if (filter[i].checked)
				return true;
		}
		return false;
	}
	
	function setFilterIcon(info, img) {
		if (isFilterUsed(info.filter)) {
			if (info.sort == "asc") {
				img.className = "thor-grid-filter-icon thor-grid-filter-on-asc";
			} else if (info.sort == "desc") {
				img.className = "thor-grid-filter-icon thor-grid-filter-on-desc";
			} else {
				img.className = "thor-grid-filter-icon thor-grid-filter-on";
			}
		} else {
			if (info.sort == "asc") {
				img.className = "thor-grid-filter-icon thor-grid-filter-off-asc";
			} else if (info.sort == "desc") {
				img.className = "thor-grid-filter-icon thor-grid-filter-off-desc";
			} else {
				img.className = "thor-grid-filter-icon thor-grid-filter-off";
			}
		}
	}

	function calculate() {
		var colInfos;
		if (env.colInfos && env.colInfos.length > 0)
			colInfos = env.colInfos;
		else
			colInfos = [{}];
		var showVScrollBar = false;
		var showHScrollBar = false;
		var dispLines = 0;
		var needRecalculate = true;
		var allColWidth = 0;
		var totalWidth = 0;
		while (needRecalculate) {
			needRecalculate = false;
			var lineHeight = isIE7 ? env.lineHeight + env.cellBorderHeight : env.lineHeight;
			var clientHeight = showHScrollBar ? container.clientHeight - env.scrollbarHeight : container.clientHeight;
			dispLines = Math.floor(clientHeight / lineHeight);
			if (dispLines < 1)
				dispLines = 1;
			if (env.data.length > (dispLines - 1)) {
				if (showVScrollBar == false && !env.autoWidth)
					needRecalculate = true;
				showVScrollBar = true;
			} else {
				if (showVScrollBar == true && !env.autoWidth)
					needRecalculate = true;
				showVScrollBar = false;
			}
			allColWidth = 0;
			totalWidth = container.clientWidth - (showVScrollBar ? env.scrollbarWidth : 0);
			if (env.autoWidth) { // AUTO WIDHT MODE ON, SO CELL WITH WILL BE COMPUTED
				if (showHScrollBar == true)
					needRecalculate = true;
				showHScrollBar = false;
				dataTable.style.width = (totalWidth)+ "px";
				var specifiedWidth = 0;
				var undefCols = 0;
				for (var i = 0; i < colInfos.length; i++) {
					if (typeof (colInfos[i].width) === "number") {
						specifiedWidth += colInfos[i].width;
					} else {
						colInfos[i].width = undefined;
						undefCols++;
					}
				}
				totalWidth -= (env.cellBorderWidth * colInfos.length);
				if (undefCols != 0) {
					var autoWidth = Math.floor((totalWidth - specifiedWidth) / undefCols);
					if (autoWidth < 10)
						autoWidth = 10;
					specifiedWidth = 0;
					for (var i = 0; i < colInfos.length; i++) {
						if (typeof (colInfos[i].width) === "undefined")
							colInfos[i].finalWidth = autoWidth - 1;
						else
							colInfos[i].finalWidth = colInfos[i].width - 1;
						specifiedWidth += colInfos[i].finalWidth;
					}
					for (var i = 0; i < colInfos.length; i++) {
						colInfos[i].finalWidth = Math.floor(colInfos[i].finalWidth / specifiedWidth * totalWidth) - 1;
						allColWidth += colInfos[i].finalWidth;
					}
				} else {
					for (var i = 0; i < colInfos.length; i++) {
						colInfos[i].finalWidth = Math.floor(colInfos[i].width / specifiedWidth * totalWidth) - 1;
						allColWidth += colInfos[i].finalWidth;
					}
				}
			} else { // AUTO WIDTH MODE OFF
				dataTable.style.width = "";
				totalWidth -= (env.cellBorderWidth * colInfos.length);
				for (var i = 0; i < colInfos.length; i++) {
					if (typeof (colInfos[i].width) === "number") {
						colInfos[i].finalWidth = colInfos[i].width;
					} else {
						colInfos[i].width = undefined;
						colInfos[i].finalWidth = 100;
					}
					allColWidth += colInfos[i].finalWidth;
				}
				if (allColWidth <= totalWidth - 1) {
					if (showHScrollBar == true)
						needRecalculate = true;
					showHScrollBar = false;					
				} else {
					if (showHScrollBar == false)
						needRecalculate = true;
					showHScrollBar = true;					
				}
			}
		}
		if (!showHScrollBar) {
			env.firstColumn = 0;
		}
		// Build table
		if (env.dispLines != dispLines || env.needUpdate) {
			env.dispLines = dispLines;
			if (isIE8) {
				while (dataTable.rows.length > 0)
					dataTable.deleteRow(-1);
			} else {
				dataTable.innerHTML = "";
			}
			for (var i = 0; i < dispLines; i++) {
				var tr = dataTable.insertRow(-1);
				if (i == 0)
					tr.className = "thor-grid-line thor-grid-header";
				else if (i % 2 == 1)
					tr.className = "thor-grid-line thor-grid-line-1";
				else
					tr.className = "thor-grid-line thor-grid-line-2";
				for (var j = 0; j < colInfos.length; j++) {
					var td = tr.insertCell(-1);
					td.className = "thor-grid-cell " + env.stylePrefix + "_td" + j;
					if (i != 0 && typeof colInfos[j].align === "string")
						td.align = colInfos[j].align;
					var ct = doc.createElement("DIV");
					ct.className = "thor-grid-cell-content " + env.stylePrefix + "_c" + j;
					td.appendChild(ct);
				}
				if (i != 0) {
					tr.onclick = function(e) {
						var evt = window.event || e;
						var obj = evt.srcElement || evt.target;	
						while (typeof obj.rowIndex === "undefined") {
							obj = obj.parentElement;
							if (obj == null)
								return;
						}
						if (obj.rowIndex == 0)
							return;						
						if (typeof container.onclickrow === "function") {
							container.onclickrow(env.firstLine + (obj.rowIndex - 1));
						}
					};
					tr.ondblclick = function(e) {
						var evt = window.event || e;
						var obj = evt.srcElement || evt.target;
						while (typeof obj.rowIndex === "undefined") {
							obj = obj.parentElement;
							if (obj == null)
								return;
						}
						if (obj.rowIndex == 0)
							return;						
						if (typeof container.ondblclickrow === "function") {
							container.ondblclickrow(env.firstLine + (obj.rowIndex - 1));
						}
					};					
				}
			}
			env.needUpdate = false;
		}
		
		// SETUP HEADER
		setupHeader();
		
		if (showVScrollBar) {
			vscroll.style.display = "block";
			vscroll.style.left = (container.clientWidth - env.scrollbarWidth - 1) + "px";
			vscroll.style.top = "1px";
			vscroll.style.height = (showHScrollBar ? container.clientHeight - env.scrollbarHeight - 1 : container.clientHeight) + "px";
		} else
			vscroll.style.display = "none";
		
		if (showHScrollBar) {
			hscroll.style.display = "block";
			hscroll.style.left = "1px";
			hscroll.style.top = (container.clientHeight - env.scrollbarHeight) + "px";
			hscroll.style.width = (showVScrollBar ? container.clientWidth - env.scrollbarWidth - 1 : container.clientWidth) + "px";
		} else
			hscroll.style.display = "none";

		if (showVScrollBar && showHScrollBar) {
			corner.style.display = "block";
			corner.style.left =  (container.clientWidth - env.scrollbarWidth - 1) + "px";
			corner.style.top = (container.clientHeight - env.scrollbarHeight - 1) + "px";
			corner.style.width = env.scrollbarWidth + "px";
			corner.style.height = env.scrollbarHeight + "px";
		} else
			corner.style.display = "none";
		
		totalWidth = container.clientWidth - (showVScrollBar ? env.scrollbarWidth : 0);
		var scrollColumn = 0;
		var i = env.fixedColumn;
		allColWidth += env.cellBorderWidth * colInfos.length;
		while (allColWidth > totalWidth && i < colInfos.length) {
			allColWidth -= (colInfos[i++].finalWidth + env.cellBorderWidth);
			scrollColumn++;
		}
		hscroll.setInfo(scrollColumn + 1, env.firstColumn, 1);
		vscroll.setPage(env.dispLines - 1);
		// SETUP COLUMN
		drawColumn();
		// DRAW TABLE CONTENT
		draw();
	}
	
	function setupHeader() {
		var colInfos;
		if (env.colInfos && env.colInfos.length > 0)
			colInfos = env.colInfos;
		else
			colInfos = [{}];
		for (var j = 0; j < colInfos.length; j++) {
			var ct = dataTable.rows[0].cells[j].firstChild;
			ct.innerHTML = "";
			var txt = doc.createElement("DIV");
			txt.className = "thor-grid-filter-title";
			if (colInfos[j].name)
				txt.innerHTML = colInfos[j].name;
			else
				txt.innerHTML = "";
			setFloat(txt, "left");
			if (colInfos[j].finalWidth > 0)
				txt.style.width = (colInfos[j].finalWidth) + "px";
			else
				txt.style.width = (0) + "px";
			ct.appendChild(txt);
			if ((colInfos[j].filter && colInfos[j].filter.length > 0) || 
					typeof colInfos[j].sort === "string") {
				var cell = dataTable.rows[0].cells[j];
				removeClass(cell, "thor-grid-head-sort-filter thor-grid-head-filter thor-grid-head-sort");
				if (isFilterUsed(colInfos[j].filter)) {
					if (colInfos[j].sort == "asc") {
						addClass(cell, "thor-grid-head-sort-filter");
					} else if (colInfos[j].sort == "desc") {
						addClass(cell, "thor-grid-head-sort-filter");
					} else {
						addClass(cell, "thor-grid-head-filter");
					}
				} else {
					if (colInfos[j].sort == "asc") {
						addClass(cell, "thor-grid-head-sort");
					} else if (colInfos[j].sort == "desc") {
						addClass(cell, "thor-grid-head-sort");
					}
				}				
				
				var img = doc.createElement("DIV");
				setFilterIcon(colInfos[j], img);
				setFloat(img, "right");
				container.appendChild(img);
				var imgWidth = img.offsetWidth;
				container.removeChild(img);
				ct.appendChild(img);
				img.col = j;
				img.onmousedown = function (e) {
					var ev = e || window.event;
					var obj = ev.srcElement || ev.target;
//					if (env.filterPanel)
//						env.filterPanel.close();
					showFilter(obj.col, obj);
					if (window.event)
						ev.cancelBubble = true;
					else
						ev.stopPropagation();

					if (ev.preventDefault)
						ev.preventDefault();
					else
						return false;
				};
				if (colInfos[j].finalWidth - imgWidth > 0)
					txt.style.width = (colInfos[j].finalWidth - imgWidth) + "px";
				else
					img.style.display = "none";
			}
		}
	}
	
	function drawColumn() {
		var colInfos;
		if (env.colInfos && env.colInfos.length > 0)
			colInfos = env.colInfos;
		else
			colInfos = [{}];
		// SETUP COLUMN WIDTH
		var cssText = "";
		for (var i = 0; i < colInfos.length; i++) {
			var wd = colInfos[i].finalWidth;
			cssText += ("." + env.stylePrefix + "_c" + i + 
					"{vertical-align:middle;width:" + wd + "px;} ");
		}
		// SCROLL COLUMN
		for (var i = 0; i < colInfos.length; i++) {
			if (i >= env.fixedColumn && i < env.fixedColumn + env.firstColumn && !env.autoWidth) {
				cssText += ("." + env.stylePrefix + "_td" + i + "{display:none;} ");
			} else {
				cssText += ("." + env.stylePrefix + "_td" + i + "{} ");
			}
		}
		if (doc.createStyleSheet) // IE
			env.gridStyle.cssText = cssText;
		else
			env.gridStyle.innerHTML = cssText;
		hscroll.setValue(Math.round(hscroll.getValue()));
		makeSeparators();
	}
	function makeSeparators() {
		for (var i = 0; i < env.separators.length; i++) {
			container.removeChild(env.separators[i]);
		}
		env.separators.length = 0;
		var titleHeader = dataTable.rows[0];
		for (var i = 0; i < env.colInfos.length; i++) {
			if (env.colInfos[i].fixed == true)
				continue;
			var sep = doc.createElement("DIV");
			sep.style.display = "block";
			sep.style.position = "absolute";
			var l = getOffsetPosition(titleHeader.cells[i], container)[0];
			l += (titleHeader.cells[i].offsetWidth - 3);
			sep.style.left = l + "px";
			sep.style.top = "0px";
			sep.style.width = "6px";
			sep.style.backgroundColor = "white";
			sep.style.opacity = "0";
			sep.style.filter = "alpha(opacity=0)";
			sep.style.height = titleHeader.cells[i].offsetHeight + "px";
			sep.style.cursor = "e-resize";
			sep.className = "thor-noselect";
			sep.setAttribute("unselect", "on");
			sep._index = i;
			sep.onselectstart = new Function("return false;");
			// Because chrome doesn't support setCapture() so I only can capture 
			// document 'mousemove' and 'mouseup' events to finish this job.
			sep.onmousedown = function (e) {
				var ev = e || window.event;
				if (isIE8) {
					if (ev.button !== 1)
						return false;
				} else {
					if (ev.button !== 0)
						return false;
				}
				if (ev.preventDefault)
					ev.preventDefault();
				var obj = ev.srcElement || ev.target;
				var mask = doc.createElement("DIV");
				mask.style.display = "block";
				mask.style.position = "fixed";
				mask.style.left = "0px";
				mask.style.top = "0px";
				mask.style.width = "100%";
				mask.style.height = "100%";
				mask.style.cursor = "e-resize";
				mask.onselectstart = new Function("return false;");
				mask.style.backgroundColor = "white";
				mask.style.opacity = "0";
				mask.style.filter = "alpha(opacity=0)";
				doc.body.appendChild(mask);
				var index = obj._index;
				var startPos = obj.offsetLeft;
				var startX = ev.clientX;
				obj.style.height = container.clientHeight + "px";
				obj.style.backgroundColor = "black";
				obj.style.opacity = "0.5";
				obj.style.filter = "alpha(opacity=50)";
				obj.style.width = "3px";

				var savedMouseMove = doc.onmousemove;
				var savedMouseUp = doc.onmouseup;

				// SPECIFY MIN-WIDTH
				var minOffsetX = getOffsetPosition(titleHeader.cells[index], container)[0];
				// SPECIFY MAX-WIDTH
				var maxOffsetX = minOffsetX + container.clientWidth  - 20; 
				minOffsetX += 10;

				doc.onmousemove = function (de) {
					de = de || window.event;
					if (de.preventDefault)
						de.preventDefault();
					var distance = de.clientX - startX;
					if (startPos + distance < minOffsetX)
						obj.style.left = (minOffsetX) + "px";
					else if (startPos + distance > maxOffsetX)
						obj.style.left = (maxOffsetX) + "px";
					else
						obj.style.left = (startPos + distance) + "px";
					return false;
				};
				doc.onmouseup = function (de) {
					de = de || window.event;
					if (de.preventDefault)
						de.preventDefault();
					obj.style.height = titleHeader.cells[index].offsetHeight + "px";
					obj.style.backgroundColor = "";
					obj.style.opacity = "0";
					obj.style.filter = "alpha(opacity=0)";
					obj.style.width = "6px";
					doc.onmousemove = savedMouseMove;
					doc.onmouseup = savedMouseUp;
					var distance = obj.offsetLeft - startPos;
					if (typeof env.colInfos[index].width === "number") {
						env.colInfos[index].width += distance;
					} else {
						env.colInfos[index].width = (env.colInfos[index].finalWidth + distance);
					}
					doc.body.removeChild(mask);
					calculate();
					if (typeof container.onresizecolumn === "function")
						container.onresizecolumn(index);
					
					var currentTime = new Date().getTime();
					if (env.colInfos[index].lastClickTime) {
						if (currentTime - env.colInfos[index].lastClickTime < 500) {
							container.autoFitColumn(index);
						}
					} 
					env.colInfos[index].lastClickTime = currentTime;
				};
				return false;
			};
			env.separators.push(sep);
			container.appendChild(sep);
		}
	}
	
	function showFilter(index, srcObj) {
		if (typeof index !== "number" || index < 0 || index >= env.colInfos.length)
			return;
		var info = env.colInfos[index];
		if (!(info.filter instanceof Array) && typeof info.sort !== "string")
			return;
		var filterCell = dataTable.rows[0].cells[index];
		var filterPanel = doc.createElement("DIV");
		filterPanel.className = "thor-grid-filter-panel";
		filterPanel.style.position = "absolute";
		filterPanel.style.left = "0px";
		filterPanel.style.top = "0px";
		var filterTable = doc.createElement("TABLE");
		filterTable.className = "thor-grid-filter-table";
		filterTable.setAttribute("cellpadding", 0);
		filterTable.setAttribute("cellspacing", 0);
		filterPanel.appendChild(filterTable);
		//filterPanel.style.visibility = "hidden";
		function hideAllDate() {
			for (var i = 0; i < filterTable.rows.length; i++) {
				var o = filterTable.rows[i].cells[1];
				if (o.className === "thor-grid-filter-content-cell") {
					if (o.childNodes.length === 2 && o.childNodes[1].getDate)
						o.childNodes[1].style.display = "none";
				}
			}
		}
		function addFilterItem(item) {
			if (item.type !== "option" && item.type !== "date" && item.type !== "text") {
				return;
			}
			// type, caption, value, checked
			var row = filterTable.insertRow(-1);
			row.className = "thor-grid-filter-row";

			var checkCell = row.insertCell(-1);
			checkCell.className = "thor-grid-filter-check-cell";
			var ckCtrl = doc.createElement("INPUT");
			ckCtrl.type = "checkbox";
			ckCtrl.style.outline = "none";
			ckCtrl.setAttribute("tabindex", 0);
			checkCell.appendChild(ckCtrl);
			//addEventListener(ckCtrl, "blur", whetherBlur);

			var contentCell = row.insertCell(-1);
			contentCell.className = "thor-grid-filter-content-cell";

			function showContent(content) {
				hideAllDate();
				content.childNodes[1].style.display = "block";
			}

			if (item.type === "option") {
				contentCell.innerHTML = item.caption;
				if (item.checked) {
					ckCtrl.checked = true;
				}
				contentCell.onclick = function () {
					ckCtrl.checked = true;
					hideAllDate();
				};
			} else if (item.type === "date") {
				var captionCell = doc.createElement("DIV");
				captionCell.style.width = "100%";
				captionCell.style.display = "block";
				captionCell.className = "thor-grid-filter-caption";
				captionCell.innerHTML = item.caption;
				var dateCell = doc.createElement("DIV");
				dateCell.style.display = "block";
				dateCell.className = "thor-grid-filter-datebox";
				makeDatePicker(dateCell);
				if (item.checked) {
					if (item.value instanceof Date)
						dateCell.setDate(item.value);
					ckCtrl.checked = true;
					var date = dateCell.getDate();
					captionCell.innerHTML = item.caption + " (" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + ")";
				}
				dateCell.onpicked = function (date) {
					ckCtrl.checked = true;
					captionCell.innerHTML = item.caption + " (" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + ")";
				};
				captionCell.onclick = function () {
					showContent(contentCell);
					ckCtrl.checked = true;
					var date = dateCell.getDate();
					captionCell.innerHTML = item.caption + " (" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + ")";
				};
				ckCtrl.onclick = function () {
					if (ckCtrl.checked) {
						showContent(contentCell);
						var date = dateCell.getDate();
						captionCell.innerHTML = item.caption + " (" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + ")";
					} else {
						captionCell.innerHTML = item.caption;
						dateCell.style.display = "none";
					}
				};
				contentCell.appendChild(captionCell);
				contentCell.appendChild(dateCell);
			} else if (item.type === "text") {
				var captionCell = doc.createElement("DIV");
				captionCell.style.width = "100%";
				captionCell.style.display = "block";
				captionCell.className = "thor-grid-filter-caption";
				captionCell.innerHTML = item.caption;
				var txt = doc.createElement("INPUT");
				txt.type = "text";
				txt.className = "thor-grid-filter-textbox";
				txt.style.display = "block";
//				addEventListener(txt, "blur", whetherBlur);
				if (item.checked) {
					ckCtrl.checked = true;
					if (item.value)
						txt.value = item.value;
				}
				if (getIEVersion() > 0) {
					txt.onkeyup = function () {
						if (txt.value.length == 0)
							ckCtrl.checked = false;
						else
							ckCtrl.checked = true;
					};
				} else {
					txt.oninput = function () {
						if (txt.value.length == 0)
							ckCtrl.checked = false;
						else
							ckCtrl.checked = true;
					};
				}
				captionCell.onclick = function () {
					showContent(contentCell);
					ckCtrl.checked = true;
				};
				ckCtrl.onclick = function () {
					if (ckCtrl.checked) {
						showContent(contentCell);
					}
				};
				contentCell.appendChild(captionCell);
				contentCell.appendChild(txt);
			}			
		}
		try {
			var ascCell = null;
			var descCell = null;
			function selectSort(e) {
				var ev = e || window.event;
				if (isIE8) {
					if (ev.button !== 1)
						return false;
				} else {
					if (ev.button !== 0)
						return false;
				}
				var obj = ev.srcElement || ev.target;				
				if (obj === ascCell || obj.parentElement === ascCell) {
					if (ascCell.className == "thor-grid-switcher-on") {
						ascCell.className = "thor-grid-switcher-off";
					} else {
						ascCell.className = "thor-grid-switcher-on";
						descCell.className = "thor-grid-switcher-off";
					}
				} else if (obj === descCell || obj.parentElement === descCell) {
					if (descCell.className == "thor-grid-switcher-on") {
						descCell.className = "thor-grid-switcher-off";
					} else {
						descCell.className = "thor-grid-switcher-on";
						ascCell.className = "thor-grid-switcher-off";
					}					
				}
			}
			if (typeof info.sort === "string") {
				var row = filterTable.insertRow(-1);
				row.className = "thor-grid-filter-row";
				row.style.height = "50px";
				var checkCell = row.insertCell(-1);
				checkCell.className = "thor-grid-filter-check-cell";

				var contentCell = row.insertCell(-1);
				contentCell.className = "thor-grid-filter-content-cell";
				contentCell.style.borderBottom = "1px dotted #c0c0c0";
				var switcherTable = doc.createElement("TABLE");
				switcherTable.className = "thor-grid-switcher-table";
				switcherTable.setAttribute("cellspacing", "0");
				switcherTable.setAttribute("cellpadding", "0");
				switcherTable.setAttribute("border", "0");
				var switcherRow = switcherTable.insertRow(-1);
				ascCell = switcherRow.insertCell(-1);
				if (info.sort == "asc")
					ascCell.className = "thor-grid-switcher-on";
				else
					ascCell.className = "thor-grid-switcher-off";
				ascCell.innerHTML = "<span class='thor-grid-sort-asc-icon'></span>" + tuiText.asc;
				
				descCell = switcherRow.insertCell(-1);
				if (info.sort == "desc")
					descCell.className = "thor-grid-switcher-on";
				else
					descCell.className = "thor-grid-switcher-off";
				descCell.innerHTML = "<span class='thor-grid-sort-desc-icon'></span>" + tuiText.desc;
				
				contentCell.appendChild(switcherTable);
				addEventListener(ascCell, "mousedown", selectSort);
				addEventListener(descCell, "mousedown", selectSort);
			}
			if (info.filter) {
				for (var i = 0; i < info.filter.length; i++) {
					addFilterItem(info.filter[i]);
				}
			}
			var row = filterTable.insertRow(-1);
			row.className = "thor-grid-filter-row";
			row.style.height = "50px";
			var checkCell = row.insertCell(-1);
			checkCell.className = "thor-grid-filter-check-cell";

			var contentCell = row.insertCell(-1);
			contentCell.className = "thor-grid-filter-content-cell";
			contentCell.style.borderTop = "1px dotted #c0c0c0";
			contentCell.align = "right";
			var btn = doc.createElement("SPAN");
			btn.innerHTML = tuiText.apply;
			makeButton(btn, function () {
				var filterBegin = 0;
				if (typeof info.sort === "string") {
					if (ascCell.className == "thor-grid-switcher-on") {
						info.sort = "asc";
					} else if (descCell.className == "thor-grid-switcher-on") {
						info.sort = "desc";
					} else {
						info.sort = "";
					}
					if (info.sort != "" && !env.sortByMultipleColumn) {
						for (var i = 0; i < env.colInfos.length; i++) {
							if (env.colInfos[i] !== info) {
								if (typeof env.colInfos[i].sort === "string") {
									env.colInfos[i].sort = "";
								}
							}
						}
					}
					filterBegin++;
				}
				if (info.filter) {
					for (var i = 0; i < info.filter.length; i++) {
						info.filter[i].checked = filterTable.rows[filterBegin + i].cells[0].firstChild.checked;
						if (info.filter[i].checked) {
							if (info.filter[i].type == "text") {
								info.filter[i].value = filterTable.rows[filterBegin + i].cells[1].childNodes[1].value;
							} else if (info.filter[i].type == "date") {
								info.filter[i].value = filterTable.rows[filterBegin + i].cells[1].childNodes[1].getDate();
							}
						}
					}
				}
				filterPanel.close();
				if (typeof container.onfilter === "function")
					container.onfilter(index);
			}, "small");
			contentCell.appendChild(btn);
		} catch (e) {
			logError(e);
			return;
		}
		
		var properlyParent = getProperlyParent(filterCell, doc.body);
		properlyParent.appendChild(filterPanel);
		hideAllDate();
		popupPanel(filterPanel, filterCell, properlyParent).onclose = function() {
			properlyParent.removeChild(filterPanel);
			setupHeader();
		};
	}
	container.setMultiSort = function (multiSort) {
		env.sortByMultipleColumn = (multiSort == true);
	};
	container.setAutoWidth = function (autoWidth) {
		env.autoWidth = (autoWidth == true);
		calculate();
	};
	container.getAutoWidth = function () {
		return env.autoWidth;
	};
	container.setFixedColumn = function (fixedColumn) {
		if (typeof fixedColumn === "number" && fixedColumn >=0 && fixedColumn <= env.colInfos.length) {
			env.fixedColumn = Math.floor(fixedColumn);
			env.firstColumn = 0;
			calculate();
			hscroll.setValue(0);
		}
	};
	container.getFixedColumn = function () {
		return env.fixedColumn;
	};
	container.isScrollToEnd = function () {
		return (env.firstLine + env.dispLines - 1 >= env.data.length);
	};
	container.getColCount = function () {
		return env.colInfos.length;
	};
	container.getRowCount = function () {
		return env.data.length;
	};
	container.setColumnInfos = function(columnInfos) {
		if (columnInfos instanceof Array) {
			env.colInfos = columnInfos;
			env.needUpdate = true;
			calculate();
		}
	};
	container.getColumnInfos = function() {
		return env.colInfos;
	};
	container.setColumnWidth = function (index, width) {
		if (typeof (index) !== "number")
			return;
		if (index >= 0 && index < container.getColCount())
			env.colInfos[index].width = width;
		calculate();
	};
	container.getColumnInfo = function (index) {
		if (typeof (index) !== "number")
			return null;
		if (index >= 0 && index < container.getColCount())
			return env.colInfos[index];
		else
			return null;
	};
	
	container.addColumn = function (info) {
		if (!info)
			return;
		if (!(typeof (info.index) === "number" && info.index >= 0 && info.index <= env.colInfos.length)) {
			info.index = env.colInfos.length;
		}
		env.colInfos.splice(info.index, 0, info);
		for (var i = 0; i < env.colInfos.length; i++)
			env.colInfos[i].index = i;
		env.needUpdate = true;
		calculate();
	};
	container.removeColumn = function (index) {
		if (typeof (index) !== "number")
			return;
		env.colInfos.splice(index, 1);
		for (var i = 0; i < env.colInfos.length; i++)
			env.colInfos[i].index = i;
		env.needUpdate = true;
		calculate();
	};
	container.removeAllColumns = function () {
		env.colInfos = [];
		env.needUpdate = true;
		calculate();
	};
	container.addRow = function (data, index) {
		if (typeof index !== "number")
			index = env.data.length;
		if (index < 0)
			index = 0;
		if (index > env.data.length)
			index = env.data.length;
		env.data.splice(index, 0, data);

		if (typeof env.activeLine === "number") {
			if (index <= env.activeLine)
				env.activeLine++;
		}

		if (env.data.length == env.dispLines)
			calculate();
		else if (index >= env.firstLine && index <= env.firstLine + env.dispLines - 1)
			draw();
		vscroll.setInfo(env.data.length, env.firstLine, env.dispLines - 1);
		return index;
	};
	container.showRow = function (index) {
		if (index < env.firstLine) {
			env.firstLine = index;
		} else if (index >= env.firstLine + env.dispLines - 1) {
			env.firstLine = index - env.dispLines + 2;
		}
		vscroll.setInfo(env.data.length, env.firstLine, env.dispLines - 1);
		draw();
	};
	container.addRows = function (dataArray) {
		env.data = env.data.concat(dataArray);
		calculate();
		vscroll.setInfo(env.data.length, env.firstLine, env.dispLines - 1);
	};
	container.removeRow = function (index) {
		if (typeof (index) !== "number")
			throw new Error("Invalid row index.");
		if (index < 0 || index >= container.getRowCount())
			throw new Error("Invalid row index.");
		var row = env.data.splice(index, 1);
		var needUpdate = (index <= env.firstLine);
		if (env.firstLine + env.dispLines - 1 > env.data.length) {
			env.firstLine = env.data.length - (env.dispLines - 1);
			if (env.firstLine < 0)
				env.firstLine = 0;
		}
		if (typeof env.activeLine === "number") {
			if (index == env.activeLine)
				env.activeLine = null;
			else if (index < env.activeLine)
				env.activeLine--;
		}

		if (env.data.length == env.dispLines - 1)
			calculate();
		else if (needUpdate || (index >= env.firstLine && index <= env.firstLine + env.dispLines - 1)) {
			draw();
		}
		vscroll.setInfo(env.data.length, env.firstLine, env.dispLines - 1);
		return row[0];
	};

	container.getRow = function (index) {
		if (typeof (index) === "number" && index >= 0 && index < env.data.length)
			return env.data[index];
	};
	
	container.setRow = function (index, rowData) {
		if (typeof (index) === "number" && index >= 0 && index < env.data.length)
			env.data[index] = rowData;
		draw();
	};

	container.setActiveRow = function (index) {
		if (typeof index !== "number" || index < 0 || index >= container.getRowCount())
			throw new Error("Invalid row index.");
		env.activeLine = index;
		draw();
	};
	container.getActiveRow = function () {
		if (typeof env.activeLine === "number")
			return env.data[env.activeLine];
		else
			return null;
	};
	container.getActiveRowId = function () {
		if (typeof env.activeLine === "number")
			return env.activeLine;
		else
			return -1;
	};
	container.clear = function () {
		env.data = [];
		env.activeLine = null;
		calculate();
		env.firstLine = 0;
		vscroll.setInfo(env.data.length, env.firstLine, env.dispLines - 1);
	};
	container.setData = function (dataArray, keepFirstLine) {
		var firstLine = env.firstLine;
		container.clear();
		container.addRows(dataArray);
		if (keepFirstLine) {
			env.firstLine = firstLine;
			vscroll.setInfo(env.data.length, env.firstLine, env.dispLines - 1);
			draw();
		}
	};
	container.autoHeight = function () {
		if (ieVer != -1 && ieVer <= 7) {
			container.style.height = (dataTable.rows[0].offsetHeight - 2) * (env.data.length + 1) + "px";
		} else {
			container.style.height = dataTable.rows[0].offsetHeight * (env.data.length + 1) + "px";
		}
		calculate();
	};
	container.useWheele = function (useWheele) {
		env.useWheele = !!useWheele;
	};
	container.autoFitColumn = function (colIndex, expandedOnly) {
		if (typeof (colIndex) !== "number")
			return;
		if (colIndex < 0 && colIndex >= container.getColCount())
			return;
		var maxWidth = 0;
		if (expandedOnly)
			maxWidth = env.colInfos[colIndex].finalWidth - 2 || 0;
		for (var i = 1; i < dataTable.rows.length; i++) {
			var ct = dataTable.rows[i].cells[colIndex].firstChild;
			ct.style.display = "inline-block";
			ct.style.width = "auto";
			if (maxWidth < ct.offsetWidth)
				maxWidth = ct.offsetWidth;
			ct.style.width = "";
			ct.style.display = "";
		}
		if (maxWidth != 0)
			container.setColumnWidth(colIndex, maxWidth + 2);
	};
	container.update = draw;
	container.refresh = calculate;
	container.showLoading = function () {
		if (!env.loading) {
			env.loadingTimer = setTimeout(function(){
				var loading = doc.createElement("DIV");
				loading.onselectstart = new Function("return false;");
				loading.className = "thor-grid-processing";
				var loadingImg = doc.createElement("DIV");
				loadingImg.onselectstart = new Function("return false;");
				loadingImg.className = "thor-grid-processing thor-processing-img";
				env.loading = loading;
				container.appendChild(env.loading);
				env.loadingImg = loadingImg;
				container.appendChild(loadingImg);
			},100);
		}
	};
	container.closeLoading = function () {
		if (env.loadingTimer) {
			clearTimeout(env.loadingTimer);
			env.loadingTimer = null;
		}
		if (env.loadingImg) {
			container.removeChild(env.loadingImg);
			env.loadingImg = null;
		}
		if (env.loading) {
			container.removeChild(env.loading);
			env.loading = null;
		}
	};
	calculate();
	return container;
}

//Create a tab control
function makeTab(container, activeTab, color, onopen) {
	if (!(container && container.tagName === "DIV") || container._env)
		return;
	var doc = container.ownerDocument;
	container.onopen = onopen;
	container._env = {};
	var env = container._env;
	env.captionColor = (typeof color === "string" ? 
			"thor-button-color-" + color : "thor-button-color-default");
	container.style.display = "table";
	var buttonBar = doc.createElement("DIV");
	buttonBar.style.display = "table-cell";
	//buttonBar.className = "thor-tab-bar";
	addClass(buttonBar, "thor-tab-bar");
	
	var contentArea = doc.createElement("DIV");
	contentArea.style.display = "table-row";
	contentArea.style.height = "100%";

	var childArray = [];
	for (var i = 0; i < container.childNodes.length; i++) {
		childArray.push(container.childNodes[i]);
	}
	for (var i = 0; i < childArray.length; i++) {
		if (childArray[i].tagName === "DIV" && childArray[i].title.length > 0) {
			var tabItem = contentArea.appendChild(container.removeChild(childArray[i]));
			//tabItem.className = "thor-tab-page";
			addClass(tabItem, "thor-tab-page");
			tabItem.style.display = "none";
		} else
			container.removeChild(childArray[i]);
	}
	container.insertBefore(contentArea, container.firstChild);
	container.insertBefore(buttonBar, container.firstChild);

	buttonBar.indexOf = function (child) {
		for (var i = 0; i < this.childNodes.length; i++) {
			if (this.childNodes[i] === child) {
				return i;
			}
		}
		return -1;
	};

	for (var i = 0; i < contentArea.childNodes.length; i++) {
		var label = doc.createElement("SPAN");
		label.style.display = "inline-block";
		label.style.position = "relative";
		label.innerHTML = contentArea.childNodes[i].title;
		label.className = "thor-tab-caption " + env.captionColor;
		label.onselectstart = function () { return false; };
		buttonBar.appendChild(label);
		contentArea.childNodes[i].removeAttribute("title");
		var labelMask = doc.createElement("DIV");
		labelMask.style.display = "none";
		labelMask.style.position = "absolute";
		labelMask.style.height = "4px";
		labelMask.style.width = "100%";
		labelMask.style.left = "0px";
		labelMask.style.top = (label.offsetHeight - 2) + "px";
		labelMask.className = "thor-tab-caption-actived";
		label.appendChild(labelMask);
		
		label.onclick = function (src) {
			if (src)
				container.openTab(buttonBar.indexOf(src.currentTarget));
			else
				container.openTab(buttonBar.indexOf(event.srcElement));
		};
	}

	function getTabId(label) {
		for (var i = 0; i < buttonBar.childNodes.length; i++) {
			if (buttonBar.childNodes[i] === label) {
				return i;
			}
		}
		return -1;
	}

	container.openTab = function (tabIndex) {
		var idx = parseInt(tabIndex, 10);
		if (idx >= buttonBar.childNodes.length || idx < 0)
			return;
		var oldId = getTabId(env.currentTab);
		if (env.currentTab) {
			if (oldId === tabIndex)
				return;
			env.currentTab.className = "thor-tab-caption " + env.captionColor;
			env.currentTab.getElementsByTagName("DIV")[0].style.display = "none";
			contentArea.childNodes[oldId].style.display = "none";
		}
		buttonBar.childNodes[idx].className = "thor-tab-caption thor-tab-caption-actived";
		buttonBar.childNodes[idx].getElementsByTagName("DIV")[0].style.display = "block";
		contentArea.childNodes[idx].style.display = "table-cell";
		env.currentTab = buttonBar.childNodes[idx];
		if (typeof container.onopen === "function") {
			container.onopen(idx, env.currentTab.innerHTML);
		}
	};

	container.insertTab = function (div, pos) {
		if (!(div && div.tagName === "DIV"))
			return;
		var label = doc.createElement("SPAN");
		label.innerHTML = div.title;
		label.className = "thor-tab-caption " + env.captionColor;
		label.onselectstart = function () { return false; };
		div.className = "thor-tab-page";
		div.style.display = "none";
		div.removeAttribute("title");
		if (typeof (pos) === "number" && pos < buttonBar.childNodes.length && pos >= 0) {
			buttonBar.insertBefore(label, buttonBar.childNodes[pos]);
			contentArea.insertBefore(div, contentArea.childNodes[pos]);
		} else {
			buttonBar.appendChild(label);
			contentArea.appendChild(div);
		}
		div.removeAttribute("title");
		label.onclick = function (src) {
			if (src)
				container.openTab(buttonBar.indexOf(src.currentTarget));
			else
				container.openTab(buttonBar.indexOf(event.srcElement));
		};
		if (buttonBar.childNodes.length == 1)
			container.openTab(0);
	};
	
	container.getCount = function() {
		return buttonBar.childNodes.length;
	};
	
	container.getTab = function (pos) {
		if (typeof (pos) === "number" && pos < buttonBar.childNodes.length && pos >= 0) {
			return contentArea.childNodes[pos];
		} else
			return null;
	};
	
	container.setAllTabSize = function (size) {
		for (var i = 0; i < contentArea.childNodes.length; i++) {
			if (size.width === null)
				container.style.width = "";
			else if (typeof size.width === "number")
				container.style.width = size.width + "px";
			if (size.height === null)
				contentArea.childNodes[i].style.height = "";
			else if (typeof size.height === "number")
				contentArea.childNodes[i].style.height = size.height + "px";
		}
	};

	container.removeTab = function (pos) {
		if (typeof (pos) === "number" && pos < buttonBar.childNodes.length && pos >= 0) {
			var oldId = getTabId(env.currentTab);
			if (pos == oldId) {
				if (pos < buttonBar.childNodes.length - 1) {
					container.openTab(pos + 1);
					buttonBar.removeChild(buttonBar.childNodes[pos]);
					contentArea.removeChild(contentArea.childNodes[pos]);
				} else if (pos == 0) {
					buttonBar.removeChild(buttonBar.childNodes[pos]);
					contentArea.removeChild(contentArea.childNodes[pos]);
					env.currentTab = undefined;
				} else {
					container.openTab(pos - 1);
					buttonBar.removeChild(buttonBar.childNodes[pos]);
					contentArea.removeChild(contentArea.childNodes[pos]);
				}

			} else {
				buttonBar.removeChild(buttonBar.childNodes[pos]);
				contentArea.removeChild(contentArea.childNodes[pos]);
			}
		}
	};
	
	container.hideTab = function (pos) {
		if (typeof (pos) === "number" && pos < buttonBar.childNodes.length && pos >= 0) {
			var oldId = getTabId(env.currentTab);
			if (pos == oldId) {
				if (pos < buttonBar.childNodes.length - 1) {
					container.openTab(pos + 1);
					buttonBar.childNodes[pos].style.display = "none";
				} else if (pos == 0) {
					buttonBar.childNodes[pos].style.display = "none";
					env.currentTab = undefined;
				} else {
					container.openTab(pos - 1);
					buttonBar.childNodes[pos].style.display = "none";
				}
			} else {
				buttonBar.childNodes[pos].style.display = "none";
			}			
		}
	};
	
	container.isTabShowed = function (pos) {
		if (typeof (pos) === "number" && pos < buttonBar.childNodes.length && pos >= 0) {
			if (buttonBar.childNodes[pos].style.display == "none") {
				return false;
			} else
				return true;
		} else
			return false;
	};
	
	container.showTab = function (pos) {
		if (typeof (pos) === "number" && pos < buttonBar.childNodes.length && pos >= 0) {
			buttonBar.childNodes[pos].style.display = "inline-block";
		}
	};

	container.activeTab = function () {
		return getTabId(env.currentTab);
	};

	if (activeTab || activeTab === 0) {
		container.openTab(parseInt(activeTab));
	} else {
		container.openTab(0);
	}

	return container;
}

/************************************************************************
 * DIALOG
 ************************************************************************/
function Dialog(focusElement) {
	var CONST_BTN_OK = tuiText.ok;
	var CONST_BTN_CANCEL = tuiText.cancel;
	var _focusElement = undefined;

	function getTopDocument() {
		return window.top.document;
	}
	var isShowing = false;
	var isIE = (getIEVersion() > 0);

	function getHeight() {
		if (isIE)
			return getTopDocument().documentElement.clientHeight;
		else if (top.innerHeight)
			return top.innerHeight;
		else
			return getTopDocument().body.clientHeight;
	}
	this.fork = function (focusElement) {
		return new Dialog(focusElement);
	};

	this.createElement = function (nodeName) {
		return getTopDocument().createElement(elem);
	};

	var previousMask = null;
	var previousDialog = null;
	var instance = this;
	var titleCell = null;
	var titleContent = null;
	var contentCell = null;
	var buttonCell = null;
	var mask = null;
	var box = null;
	var closeButton = null;
	var pageTable = null;
	var noPlat = false;
	var userMovedBox = false;

	this.contentWidth = "";
	this.contentHeight = "";

	function resize() {
		popWidth = pageTable.offsetWidth;
		popHeight = pageTable.offsetHeight;
		pageTable.style.width = "";
		titleCell.style.width = "";
		if (pageTable.offsetWidth < contentCell.offsetWidth) {
			pageTable.style.width = contentCell.offsetWidth + "px";
			titleContent.style.width = "100%";
		}
		if (!userMovedBox) {
			box.style.left = (getTopDocument().documentElement.clientWidth - popWidth) / 2 + "px";
			box.style.top = (getHeight() - popHeight) / 2 + "px";
		}
		box.style.height = popHeight + "px";
		box.style.width = popWidth + "px";
	}

	this.refresh = resize;
	
	var closeFunc = function () {
		if (!isShowing)
			return;
		isShowing = false;
		userMovedBox = false;
		if (!noPlat) {
			removeEventListener(top, "resize", resize);
			instance.removeAllButtons();
			getTopDocument().body.removeChild(box);
		}
		getTopDocument().body.removeChild(mask);
		if (previousMask) {
			previousMask.style.visibility = "visible";
		}
		currentDialogMask = previousMask;
		currentDialog = previousDialog;
		if (typeof instance.onclose == "function") {
			instance.onclose();
		}
		if (_focusElement && typeof _focusElement.focus === "function") {
			try {
				_focusElement.focus();
			}
			catch (e) {
				logError(e);
			}
		}
	};
	instance.close = closeFunc;

	// Initialize
	function init(showLoading, withoutPlat) {
		if (focusElement)
			_focusElement = focusElement;
		else if (window.event)
			_focusElement = window.event.srcElement;

		var index_highest = 0;
		var doc = getTopDocument();
		var divs = getTopDocument().body.childNodes;
		for (var i = 0; i < divs.length; i++) {
			var style = getCurrentStyle(divs[i]);
			if (!style || !style.zIndex)
				continue;
			var index_current = parseInt(style.zIndex, 10);
			if (index_current > index_highest) {
				index_highest = index_current;
			}
		}
		noPlat = (withoutPlat == true);
		// Create mask
		mask = getTopDocument().createElement("DIV");
		mask.style.zIndex = ++index_highest;
		if (showLoading) {
			// thor-img-loading
			mask.className = "thor-mask-dialog thor-processing-img";
		} else {
			mask.className = "thor-mask-dialog";
		}
		getTopDocument().body.appendChild(mask);
		if (withoutPlat == true) {
			isShowing = true;
			return;
		}
		// Create popup panel
		box = getTopDocument().createElement("DIV");
		box.style.zIndex = ++index_highest;
		box.className = "thor-dialog-box";
		getTopDocument().body.appendChild(box);
		// Create layout table
		pageTable = getTopDocument().createElement("TABLE");
		pageTable.setAttribute("border", "0");
		pageTable.setAttribute("cellpadding", "0");
		pageTable.setAttribute("cellspacing", "0");
		pageTable.className = "thor-dialog-table";
		// Add title bar
		var row = pageTable.insertRow(0);
		titleContent = row.insertCell(0);
		titleContent.className = "thor-dialog-title";
		titleContent.align = "left";
		titleCell = getTopDocument().createElement("DIV");
		titleCell.setAttribute("unselectable", "on");
		titleContent.appendChild(titleCell);
		
		// Can be moved by mouse
		titleContent.setAttribute("unselectable", "on");
		titleContent.onmousedown = function(e) {
			var ev = e || top.event;
			if (isIE8) {
				if (ev.button !== 1)
					return false;
			} else {
				if (ev.button !== 0)
					return false;
			}
			if (ev.preventDefault)
				ev.preventDefault();
			//var obj = ev.srcElement || ev.target;
			var mask = doc.createElement("DIV");
			mask.className = "thor-mask";
			doc.body.appendChild(mask);

			var boxX = box.offsetLeft;
			var boxY = box.offsetTop;
			var startX = ev.clientX;
			var startY = ev.clientY;

			var savedMouseMove = doc.onmousemove;
			var savedMouseUp = doc.onmouseup;

			// SPECIFY MIN-WIDTH
			var minOffsetX = 0;
			var minOffsetY = 0;
			// SPECIFY MAX-WIDTH
			var maxOffsetX = doc.documentElement.clientWidth - box.offsetWidth; 
			var maxOffsetY = doc.documentElement.clientHeight - box.offsetHeight;

			doc.onmousemove = function (de) {
				de = de || top.event;
				if (de.preventDefault)
					de.preventDefault();
				userMovedBox = true;
				var distanceX = de.clientX - startX;
				var distanceY = de.clientY - startY;
				if (boxX + distanceX < minOffsetX)
					box.style.left = (minOffsetX) + "px";
				else if (boxX + distanceX > maxOffsetX)
					box.style.left = (maxOffsetX) + "px";
				else
					box.style.left = (boxX + distanceX) + "px";
				if (boxY + distanceY < minOffsetY)
					box.style.top = (minOffsetY) + "px";
				else if (boxY + distanceY > maxOffsetY)
					box.style.top = (maxOffsetY) + "px";
				else
					box.style.top = (boxY + distanceY) + "px";
				return false;
			};
			doc.onmouseup = function (de) {
				de = de || top.event;
				if (de.preventDefault)
					de.preventDefault();
				doc.onmousemove = savedMouseMove;
				doc.onmouseup = savedMouseUp;
				doc.body.removeChild(mask);
			};
			return false;
		};
		
		row.className = "thor-dialog-title-row";
		// Add title close button
		closeButton = getTopDocument().createElement("DIV");
		closeButton.className = "thor-img-close";
		closeButton.onclick = closeFunc;
		var cell = row.insertCell(1);
		cell.className = "thor-dialog-close-cell";
		cell.appendChild(closeButton);
		// Add content area
		row = pageTable.insertRow(1);
		cell = row.insertCell(0);
		cell.className = "thor-dialog-content-cell";
		cell.colSpan = "2";
		cell.setAttribute("valign", "middle");
		contentCell = cell;
		contentCell.align = "center";
		// Add button bar
		row = pageTable.insertRow(2);
		row.className = "thor-dialog-button-row";
		cell = row.insertCell(0);
		cell.className = "thor-dialog-button-cell";
		cell.colSpan = "2";
		buttonCell = cell;
		box.appendChild(pageTable);
		addEventListener(top, "resize", resize);
		isShowing = true;
		
		previousMask = currentDialogMask;
		if (previousMask != null) {
			previousMask.style.visibility = "hidden";
		}
		currentDialogMask = mask;
		previousDialog = currentDialog;
		currentDialog = instance;
		instance.canbeclosed = true;
	}
	this.setContentWidth = function (width) {
		instance.contentWidth = width;
		if (contentCell && contentCell.childNodes.length > 0) {
			var child = contentCell.childNodes[0];
			if (child.nodeName == "DIV") {
				if (width == "auto")
					child.style.width = "";
				else if (typeof (width) == "number")
					child.style.width = width + "px";
				else if (typeof (width) == "string")
					child.style.width = width;
			} else if (child.nodeName == "IFRAME") {
				if (width == undefined || width == "" || width == "auto")
					child.style.width = child.contentDocument.documentElement.scrollWidth;
				else if (typeof (width) == "number")
					child.style.width = width + "px";
				else
					child.style.width = width;
			}
			resize();
		}
	};
	this.setContentHeight = function (height) {
		instance.contentHeight = height;
		if (contentCell != undefined && contentCell.childNodes.length > 0) {
			var child = contentCell.childNodes[0];
			if (child.nodeName == "DIV") {
				if (height == undefined || height == "" || height == "auto")
					child.style.height = "";
				else if (typeof (height) == "number")
					child.style.height = height + "px";
				else
					child.style.height = height;
			} else if (child.nodeName == "IFRAME") {
				if (height == undefined || height == "" || height == "auto")
					child.style.height = child.contentDocument.documentElement.scrollHeight;
				else if (typeof (height) == "number") {
					child.style.height = height + "px";
				} else {
					child.style.height = height;
				}
			}
			resize();
		}
	};
	this.setTitle = function (title) {
		titleCell.innerHTML = title;
	};
	this.buttons = new Array();
	function addBtn(name, proc) {
		if (buttonCell == undefined)
			throw new Error("Must initialized first!");
		var btn = getTopDocument().createElement("SPAN");
		btn.innerHTML = name;
		makeButton(btn, proc);
		btn.style.marginLeft = "10px";
		buttonCell.appendChild(btn);
		instance.buttons.push(btn);
		resize();
		return btn;
	}
	this.addButton = addBtn;
	this.addOkCancel = function (okProc) {
		addBtn(CONST_BTN_OK, okProc);
		addBtn(CONST_BTN_CANCEL, function () {
			instance.close();
		});
	};
	this.addOkButton = function () {
		addBtn(CONST_BTN_OK, function () {
			instance.close();
		});
	};
	this.addCancelButton = function () {
		addBtn(CONST_BTN_CANCEL, function () {
			instance.close();
		});
	};

	this.removeButton = function (btn) {
		if (btn != undefined) {
			if (typeof btn == "number") {
				if (btn >= 0 && btn < buttons.length) {
					buttons[btn].onclick = null;
					buttonCell.removeChild(buttons[btn]);
					instance.buttons.splice(btn, 1);
					resize();
				}
			} else {
				var btnIndex = instance.buttons.indexOf(btn);
				if (btnIndex >= 0)
					instance.buttons.splice(btnIndex, 1);
				btn.onclick = null;
				buttonCell.removeChild(btn);
				resize();
			}
		}
	};
	// Clear buttons
	this.removeAllButtons = function () {
		while (instance.buttons.length > 0) {
			instance.removeButton(instance.buttons[0]);
		}
	};
	// Change popup content as simple message.
	this.setMessage = function (message, sameSize) {
		if (!isShowing)
			return;
		function addMessage() {
			var messageDiv = getTopDocument().createElement("DIV");
			messageDiv.className = "thor-dialog-message";
			if (instance.contentWidth == undefined ||
            		instance.contentWidth == "") {
				if (message && typeof message == "object" &&
                		(message.nodeName != undefined)) {
					messageDiv.style.width = "auto";
				}
			} else if (typeof (instance.contentWidth) == "number") {
				messageDiv.style.width = instance.contentWidth + "px";
			} else if (instance.contentWidth == "auto") {
				messageDiv.style.width = "auto";
			} else {
				messageDiv.style.width = instance.contentWidth;
			}
			if (instance.contentHeight == undefined ||
            		instance.contentHeight == "" ||
            		instance.contentHeight == "auto") {
				messageDiv.style.height = "auto";
			} else if (typeof (instance.contentHeight) == "number") {
				messageDiv.style.height = instance.contentHeight + "px";
			} else {
				messageDiv.style.height = instance.contentHeight;
			}
			if (message && typeof message == "object" && (message.nodeName != undefined))
				messageDiv.appendChild(message);
			else
				messageDiv.innerHTML = message;
			contentCell.appendChild(messageDiv);
			closeButton.style.display = "inline-block";
			resize();
		}
		if (contentCell.childNodes.length > 0) {
			var child = contentCell.childNodes[0];
			var srcWidth = child.scrollWidth;
			var srcHeight = child.scrollHeight;
			if (child.nodeName == "DIV") {
				if (sameSize == true) {
					child.style.width = srcWidth + "px";
					child.style.width = srcHeight + "px";
				} else {
					if (instance.contentWidth == undefined ||
                    		instance.contentWidth == "") {
						if (message && typeof message == "object" &&
                        		(message.nodeName != undefined))
							child.style.width = "auto";
					} else if (typeof (instance.contentWidth) == "number") {
						child.style.width = instance.contentWidth + "px";
					} else if (instance.contentWidth == "auto") {
						child.style.width = "auto";
					} else {
						child.style.width = instance.contentWidth;
					}
					if (instance.contentHeight == undefined ||
                    		instance.contentHeight == "" ||
                    		instance.contentHeight == "auto") {
						child.style.height = "auto";
					} else if (typeof (instance.contentHeight) == "number") {
						child.style.height = instance.contentHeight + "px";
					} else {
						child.style.height = instance.contentHeight;
					}
				}
				if (message && typeof message == "object" &&
                		(message.nodeName != undefined))
					child.appendChild(message);
				else
					child.innerHTML = message;
				resize();
			} else {
				contentCell.removeChild(child);
				if (sameSize == true) {
					instance.contentWidth = srcWidth;
					instance.contentHeight = srcHeight;
				}
				addMessage();
			}
		} else {
			addMessage();
		}
	};

	// Change popup content as a webpage.
	this.setPage = function (url, sameSize, usePageTitle, ns) {
		if (!isShowing)
			return;
		function addPage() {
			var contentFrame = getTopDocument().createElement("IFRAME");
			contentFrame.style.border = "none";
			contentFrame.style.overflow = "hidden";
			contentFrame.scrolling = "no";
			contentFrame.frameBorder = "0";
			var isLoaded = false;
			function showLoadError(e) {
				if (e)
					instance.setMessage("<span style='color:red'>" + e + "</span>");
				else
					instance.setMessage("<span style='color:red'>Network Error!</span>");
				resize();
				mask.style.backgroundImage = "none";
				box.style.visibility = "visible";
			}
			function frameload() {
				isLoaded = true;
				removeEventListener(contentFrame, "load", frameload);
				try {
					if (contentFrame.contentDocument == undefined ||
	                		contentFrame.contentDocument == null) {
						instance.setMessage("<span style='color:red'>Network Error!</span>");
						resize();
						mask.style.backgroundImage = "none";
						box.style.visibility = "visible";
						return;
					}
				} catch (e) {
					showLoadError();
					return;
				}
				try {
					if (usePageTitle) {
						if (contentFrame.contentDocument.title == undefined)
							titleCell.innerHTML = "";
						else
							titleCell.innerHTML = contentFrame.contentDocument.title;
					}
				} catch (e) {
					showLoadError("Permission Denied!");
					return;
				}
				instance.resizeFrame = function (first) {
					var popWidth = contentFrame.contentDocument.documentElement.scrollWidth;
					if (!first && contentFrame.contentDocument.body.offsetWidth + 20 < popWidth)
						popWidth = contentFrame.contentDocument.body.offsetWidth + 20;
					if (typeof (instance.contentWidth) == "number") {
						popWidth = instance.contentWidth;
					} else if (instance.contentWidth == undefined || instance.contentWidth == "" || instance.contentWidth == "auto") {
						// Do nothing
					} else {
						popWidth = parseInt(instance.contentWidth);
					}
					var popHeight = contentFrame.contentDocument.documentElement.scrollHeight;
					if (!first && contentFrame.contentDocument.body.offsetHeight + 20 < popHeight)
						popHeight = contentFrame.contentDocument.body.offsetHeight + 20;
					if (typeof (instance.contentHeight) == "number") {
						popHeight = instance.contentHeight;
					} else if (instance.contentHeight == undefined || instance.contentHeight == "" || instance.contentHeight == "auto") {
						// Do nothing
					} else {
						popHeight = parseInt(instance.contentHeight);
					}
					contentFrame.style.width = popWidth + "px";
					contentFrame.style.height = popHeight + "px";
				};
				instance.resizeFrame(true);

				if (ns == undefined)
					ns = "";

				if (typeof (contentFrame.contentWindow[ns + "Onload"]) == "function") {
					try {
						contentFrame.contentWindow[ns + "Onload"](instance);
					} catch (e) {
						instance.setMessage("<span style='color:red'>" + e.toString() + "</span>");
						instance.removeAllButtons();
						instance.addOkButton();
						resize();
						mask.style.backgroundImage = "none";
						box.style.visibility = "visible";
						return;
					}
				}
				resize();
				mask.style.backgroundImage = "none";
				box.style.visibility = "visible";
				if (typeof (contentFrame.contentWindow[ns + "Onshow"]) == "function") {
					try {
						contentFrame.contentWindow[ns + "Onshow"](instance);
					} catch (e) {
						instance.setMessage("<span style='color:red'>" + e.toString() + "</span>");
						instance.removeAllButtons();
						instance.addOkButton();
						resize();
						mask.style.backgroundImage = "none";
						box.style.visibility = "visible";
						return;
					}
				}
			}
			addEventListener(contentFrame, "load", frameload);
			closeButton.style.display = "inline-block";
			contentFrame.src = url;
			// If use firefox then must do a special check for load failed!!!
			if (navigator.userAgent.toLowerCase().indexOf("firefox") >= 0) {
				var failedChecker = undefined;
				failedChecker = setInterval(function () {
					if (contentFrame.contentDocument == null)
						return;
					try {
						if (contentFrame.contentDocument.URL.indexOf("about:neterror") >= 0) {
							clearInterval(failedChecker);
							showLoadError();
						} else if (contentFrame.contentDocument.URL.indexOf("about:blank") >= 0) {
							clearInterval(failedChecker);
							showLoadError("Permission Denied!");
						} else {
							clearInterval(failedChecker);
						}
					} catch (e) {
						clearInterval(failedChecker);
						if (!isLoaded)
							showLoadError();
					}
				}, 500);
			}
			contentCell.appendChild(contentFrame);
		}
		if (contentCell.childNodes.length > 0) {
			var child = contentCell.childNodes[0];
			var srcWidth = child.scrollWidth;
			var srcHeight = child.scrollHeight;
			contentCell.removeChild(child);
			if (sameSize == true) {
				instance.contentWidth = srcWidth;
				instance.contentHeight = srcHeight;
			}
			addPage();
		} else {
			addPage();
		}
	};

	// Show simple message and message content can be anything.
	// Parameters: 
	//		message: any content (both string or DOM objects)
	//		title: dialog title.
	//		buttonDict: {"Ok": function(){ ... }, "Cancel": function(){ ... }}
	this.showMessage = function (message, title, buttonDict) {
		if (!isShowing)
			init();
		if (title != undefined)
			instance.setTitle(title);
		instance.setMessage(message, title);
		instance.removeAllButtons();
		if (buttonDict == undefined) {
			addBtn(CONST_BTN_OK, instance.close);
		} else {
			for (var key in buttonDict) {
				addBtn(key, buttonDict[key]);
			}
		}
		resize();
		box.style.visibility = "visible";
	};

	// Show a popup page 
	this.showPage = function (url, title, ns) {
		if (!isShowing)
			init(true);
		if (title != undefined) {
			instance.setTitle(title);
			instance.setPage(url, false, false, ns);
		} else {
			instance.setPage(url, false, true, ns);
		}
	};

	this.showLoading = function (message, title) {
		if (isShowing)
			instance.close();
		if (typeof message !== "undefined") {
			if (typeof title === "undefined")
				title = "";
			instance.showMessage(message, title, {});
			closeButton.style.display = "none";
			instance.canbeclosed = false;
		} else {
			init(true, true);
		}
	};
	
	this.isShowing = function () {
		return isShowing;
	};

	this.showError = function (message, title) {
		instance.showMessage("<span style='color:red'>" + message + "</span>", title);
	};
}


/*
 * POPUP PANEL
 */
var checking = null;
function whetherClosePanel(e) {
	try {
		var obj = document.activeElement;
		if (obj)
			addEventListener(obj, "blur", onElementBlur);
		while (popedPanel) {
			if (popedPanel.isPosterity(obj))
				return;
			else
				popedPanel.close();
		}
	} catch (e) {
		
	} finally {
		checking = null;
	}
}
function onElementBlur(e) {
	if (checking)
		return;
	checking = setTimeout(whetherClosePanel, 50);
}
addEventListener(document, "focus", whetherClosePanel);
addEventListener(document, "mousedown", whetherClosePanel);
function closeAllPanel () {
	while (popedPanel) {
		popedPanel.close();
	}
}
addEventListener(document, "blur", closeAllPanel);

function makeMenu(menuData, bindObj, parent, popX, popY) {
	var doc = document;
	var menuPanel = doc.createElement("DIV");
	menuPanel.style.display = "none";
	doc.body.appendChild(menuPanel);
	var items = [];
	var spliters = [];
	for (var i = 0; i < menuData.length; i++) {
		var item;
		if (menuData[i].type === "item") {
			item = doc.createElement("DIV");
			menuPanel.appendChild(item);
			item.className = "thor-menu-item";
			item.innerHTML = menuData[i].text;
			item._onclick = menuData[i].onclick;
			item.onclick = function() {
				menuPanel.close();
				doc.body.removeChild(menuPanel);
				if (this._onclick)
					this._onclick();
			};
			items.push(item);
		} else if (menuData[i].type === "split") {
			item = doc.createElement("DIV");
			item.className = "thor-menu-split";
			menuPanel.appendChild(item);
			spliters.push(item);
		} else if (menuData[i].type === "menu") {
			
		}
	}
	
	popMenu = popupPanel(menuPanel, bindObj, parent, popX, popY);

	if (ieVer != -1 && ieVer <= 7) {
		for (var i = 0; i < items.length; i++) {
			items[i].style.width = popMenu.offsetWidth - 42 + "px";
		}
		for (var i = 0; i < spliters.length; i++) {
			spliters[i].style.width = popMenu.offsetWidth - 6 + "px";
		}
	}
	return popMenu;
}

function popupPanel(container, bindObj, parent, popX, popY) {
	if (typeof container === "string")
		container = document.getElementById(container);
	if (!container)
		return;
	var doc = container.ownerDocument;
	if (typeof bindObj === "string")
		bindObj = document.getElementById(bindObj);
	if (!(bindObj && bindObj.tagName))
		return;

	var isChildPanel = false;
	if (popedPanel) {
		var obj = bindObj;
		while (obj) {
			if (obj === popedPanel) {
				isChildPanel = true;
				break;
			}
			obj = obj.parentElement;
		}
	}
	if (isChildPanel) {
		container.parentPanel = popedPanel;
		popedPanel.childPanel = container;
		popedPanel = container;
	} else {
		if (popedPanel)
			popedPanel.close();
		popedPanel = container;
	}
	
	if (typeof parent === "string")
		parent = document.getElementById(parent);
	if (parent == null || parent == undefined)
		parent = getProperlyParent(bindObj, doc.body);
	
	addClass(container, "thor-pop-panel");
	container.style.display = "block";
	container.style.position = "absolute";
	container.setAttribute("tabindex", -1);
	container.setAttribute("hidefocus", true);
	var lpos;
	if (typeof popX !== "number") {
		lpos = getOffsetPosition(bindObj, parent)[0];
		lpos += bindObj.offsetWidth;
		lpos -= container.offsetWidth;
		if (lpos < 0)
			lpos = 0;
		if (lpos > parent.clientWidth - container.offsetWidth)
			lpos = parent.clientWidth - container.offsetWidth;
	} else {
		lpos = popX;
	}
	container.style.left = lpos + "px";
	var tpos;
	if (typeof popY !== "number") {
		tpos = getOffsetPosition(bindObj, parent)[1];
		tpos += bindObj.offsetHeight;
	} else {
		tpos = popY;
	}
	container.style.top = tpos + "px";
	
	container.isPosterity = function (obj) {
		while (obj) {
			if (obj === container) {
				return true;
			}
			obj = obj.parentElement;
		}
		return false;
	};
	container.close = function () {
		try {
			container.childPanels = [];
			container.style.display = "none";
			removeClass(container, "thor-pop-panel");
			if (container.childPanel)
				container.childPanel.close();
			if (container.parentPanel) {
				container.parentPanel.childPanel = null;
				popedPanel = container.parentPanel;
			} else {
				popedPanel = null;
			}
			if (typeof container.onclose === "function")
				container.onclose();
		} catch (e) {
			logError(e);
		}
	};
	if (typeof container.refreshFunc === "function")
		container.refreshFunc();
	container.focus();
	addEventListener(container, "blur", onElementBlur);
	addEventListener(container, "mousedown", function(e){
		if (e && e.stopPropagation)
			e.stopPropagation(); 
		else
			window.event.cancelBubble = true;
		return false;
	});
	return container;
}

/*
 * LIST BOX
*/
function makeListBox(container, selectData, minLine, maxLine, filterBox) {
	if (typeof container === "string")
		container = document.getElementById(container);
	if (!(container && (container.tagName === "DIV" || container.tagName === "SPAN")) || container._env)
		return;
	var dispLine;
	if (typeof minLine !== "number")
		minLine = 0;
	dispLine = minLine;
	if (typeof maxLine !== "number")
		maxLine = 10;
	if (maxLine < minLine)
		maxLine = minLine;
	var doc = container.ownerDocument;
	container.setAttribute("tabindex", -1);
	container._env = {};
	var env = container._env;
	env.firstLine = 0;
	env.activeLine = null;
	env.data = [];
	env.filtered = null;
	addClass(container, "thor-list");
	
	function data() {
		return env.filtered === null ? env.data : env.filtered;
	}
	
	// Filter
	var filterBox = doc.createElement("SPAN");
	if (filterBox !== true)
		filterBox.style.display = "none";
	filterBox.className = "thor-list-filter-box";
	var filterLine = doc.createElement("DIV");
	filterLine.className = "thor-list-filter-line";
	filterBox.appendChild(filterLine);
	var filterInput = doc.createElement("INPUT");
	filterInput.className = "thor-list-filter-input";
	filterLine.appendChild(filterInput);
	container.appendChild(filterBox);
		
	var dataBox = doc.createElement("SPAN");
	dataBox.className = "thor-list-data-box";
	setFloat(dataBox, "left");
	dataBox.style.outline = "none";
	dataBox.setAttribute("tabindex", -1);
	dataBox.onselectstart = new Function("return false;");

	var vscroll = doc.createElement("SPAN");
	setFloat(vscroll, "right");
	makeScrollbar(vscroll, 0, dataBox);
	vscroll.style.display = "none";
	
	container.appendChild(vscroll);
	container.appendChild(dataBox);
	var closer = doc.createElement("DIV");
	closer.style.clear = "both";
	container.appendChild(closer);
	
	var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
	addEventListener(container, mousewheelevt, function (e) {
		var evt = window.event || e;
		var delta = evt.detail ? evt.detail * (-120) : evt.wheelDelta;
		//delta returns +120 when wheel is scrolled up, -120 when scrolled down
		if (delta <= -120) {
			env.firstLine++;
			if (env.firstLine >= data().length - dispLine) {
				env.firstLine = data().length - dispLine;
			}
		} else {
			env.firstLine--;
		}
		if (env.firstLine < 0) {
			env.firstLine = 0;
		}
		vscroll.setInfo(data().length, env.firstLine, dispLine);
		draw();
		if (evt.preventDefault)
			evt.preventDefault();
		else
			return false;
	});
	
	function doFilter() {
		if (filterInput.value.length === 0)
			env.filtered = null;
		else {
			env.filtered = [];
			var regexp = new RegExp(filterInput.value, "gi");
			for (var i = 0; i < env.data.length; i++) {
				if (env.data[i].value && regexp.test(env.data[i].value)) {
					env.filtered.push(env.data[i]);
				}
			}
		}
		env.firstLine = 0;
		vscroll.setInfo(data().length, env.firstLine, dispLine);
		env.activeLine = null;
		draw();
	}
	filterInput.onkeypress = function (e) {
		var evt = window.event || e;
		if (evt.keyCode === 13 ) {
			doFilter();
			return false;
		}
	};
	filterLine.onclick = function (e) {
		var evt = e || window.event;
		var src = evt.srcElement || evt.target;
		if (src !== filterLine)
			return;
		if ((!isIE8 && evt.button !== 0) || (isIE8 && evt.button !== 1))
			return;
		else
			doFilter();
	};
	
	addEventListener(container, "focus", function() {
		dataBox.focus();
	});
	addEventListener(dataBox, "keydown", function (e) {
		var evt = window.event || e;
		if (evt.keyCode == 13 && typeof env.activeLine === "number" && 
				typeof container.onitemselected === "function") {
			container.onitemselected(env.activeLine);
			return;
		}
		if (evt.keyCode == 32) {
			if (typeof env.activeLine === "number") {
				if (typeof data()[env.activeLine].checked === "boolean" && !data()[env.activeLine].disabled) {
					data()[env.activeLine].checked = !data()[env.activeLine].checked;
				}
			}
			draw();
			return;
		}
		if (evt.keyCode != 40 && evt.keyCode != 38)
			return;
		if (data().length <= 0)
			return;
		if (evt.keyCode == 40) { // down key
			if (typeof env.activeLine === "number") {
				for (var i = env.activeLine + 1; i < data().length; i++) {
					if (!data()[i].disabled) {
						env.activeLine = i;
						break;
					}
				}
			} else {
				for (var i = 0; i < data().length; i++) {
					if (!data()[i].disabled) {
						env.activeLine = i;
						break;
					}
				}
			}
		} else if (evt.keyCode == 38) { // up key
			if (typeof env.activeLine === "number") {
				for (var i = env.activeLine - 1; i >= 0; i--) {
					if (!data()[i].disabled) {
						env.activeLine = i;
						break;
					}
				}
			} else {
				for (var i = 0; i < data().length; i++) {
					if (!data()[i].disabled) {
						env.activeLine = i;
						break;
					}
				}
			}
		}
		if (env.activeLine < env.firstLine)
			env.firstLine = env.activeLine;
		if (env.activeLine >= env.firstLine + dispLine)
			env.firstLine = env.activeLine - (dispLine - 1);
		if (env.firstLine < 0) {
			env.firstLine = 0;
		}
		vscroll.setInfo(data().length, env.firstLine, dispLine);
		draw();
		if (typeof container.onitemactived === "function") {
			container.onitemactived(env.data.indexOf(data()[env.activeLine]));
		}
		if (evt.preventDefault)
			evt.preventDefault();
		else
			return false;
	});
	
	function draw() {
		if (env.data == null) {
			env.data = [];
		}
		if (dataBox.childNodes.length == dispLine) {
			for (var i = 0, j = env.firstLine; i < dispLine; i++, j++) {
				var itemDisabled = false;
				if (j < data().length) {
					dataBox.childNodes[i].innerHTML = "";
					dataBox.childNodes[i].dataIndex = j;
					var item = data()[j];
					itemDisabled = (item.disabled === true);
					if (env.filtered === null) {
						for (var k = 0; k < item.level; k++) {
							var itemSpace = doc.createElement("SPAN");
							itemSpace.className = "thor-list-item-space";
							dataBox.childNodes[i].appendChild(itemSpace);
						}
					}
					if (typeof item.checked === "boolean") {
						var checkbox = doc.createElement("SPAN");
						if (item.checked) {
							if (item.disabled)
								checkbox.className = "thor-list-item-icon thor-icon-checked-disabled";
							else
								checkbox.className = "thor-list-item-icon thor-icon-checked";
						} else {
							if (item.disabled)
								checkbox.className = "thor-list-item-icon thor-icon-unchecked-disabled";
							else
								checkbox.className = "thor-list-item-icon thor-icon-unchecked";
						}
						checkbox.dataIndex = j;
						(!item.disabled) && addEventListener(checkbox, "mousedown", function(e) {
							var ev = e || window.event;
							var src = ev.srcElement || ev.target;
							data()[src.dataIndex].checked = !data()[src.dataIndex].checked;
							if (data()[src.dataIndex].checked)
								src.className = "thor-list-item-icon thor-icon-checked";
							else
								src.className = "thor-list-item-icon thor-icon-unchecked";
						});
						dataBox.childNodes[i].appendChild(checkbox);
					}
					if (item.icon) {
						var itemIcon = doc.createElement("SPAN");
						itemIcon.className = "thor-list-item-icon " + item.icon;
						dataBox.childNodes[i].appendChild(itemIcon);
					}
					if (item.value) {
						dataBox.childNodes[i].appendChild(doc.createTextNode(item.value));
					}
					//dataBox.childNodes[i].innerHTML = data()[j];
					dataBox.childNodes[i].onmousedown = (item.disabled ? null : function(e) {
						var ev = e || window.event;
						var src = ev.srcElement || ev.target;
						while (src.parentElement !== dataBox)
							src = src.parentElement;
						env.activeLine = src.dataIndex;
						draw();
						if (typeof container.onitemactived === "function") {
							container.onitemactived(env.data.indexOf(data()[env.activeLine]), true);
						}
						dataBox.focus();
						if (ev.preventDefault)
							ev.preventDefault();
						else
							return false;
					});
					if (dataBox.childNodes[i].scrollWidth > dataBox.childNodes[i].clientWidth)
						dataBox.childNodes[i].title = item.value;
					else
						dataBox.childNodes[i].title = "";
				} else {
					dataBox.childNodes[i].onmousedown = null;
					dataBox.childNodes[i].innerHTML = "";
				}
				if (itemDisabled)
					dataBox.childNodes[i].className = "thor-list-item-disabled";
				else if (env.firstLine + i === env.activeLine)
					dataBox.childNodes[i].className = "thor-list-item-active";
				else
					dataBox.childNodes[i].className = "thor-list-item";
			}
		}
		if (filterLine.clientWidth)
			filterInput.style.width = (filterLine.clientWidth - 30) + "px";
		vscroll.style.height = dataBox.offsetHeight  + "px";
		vscroll.refresh();
		dataBox.style.width = container.clientWidth - vscroll.offsetWidth + "px";
	}
	function createList() {
		dataBox.innerHTML = "";
		for (var i = 0; i < dispLine; i++) {
			var item = doc.createElement("DIV");
			item.style.display = "block";
			item.className = "thor-list-item";
			//item.setAttribute("tabindex", "-1");
			dataBox.appendChild(item);
		}
		draw();
	}
	/* data = [{
	 * 		key: (number or string, optional),
	 *  	value: (number or string),
	 *  	icon: "(icon-class, optional)",
	 *  	checked: (true or false, optional)
	 *  	children: ([], optional)
	 *  },
	 *  {...}]
	 */
	function fillList(data) {
		env.firstLine = 0;
		env.data = [];
		filterInput.value = "";
		if (data instanceof Array) {
			// Map input data to internal data
			function mapData(arr, parentId) {
				for (var i = 0; i < arr.length; i++) {
					var item = {};
					if (typeof arr[i] === "object") {
						if (typeof arr[i].value === "number" || arr[i].value)
							item.value = arr[i].value.toString();
						if (typeof arr[i].key === "number" || typeof arr[i].key === "string")
							item.key = arr[i].key;
						if (arr[i].icon)
							item.icon = arr[i].icon;
						if (arr[i].disabled === true)
							item.disabled = true;						
						if (typeof arr[i].checked === "boolean")
							item.checked = arr[i].checked;
						if (arr[i].children instanceof Array)
							item.children = arr[i].children.length;
					} else {
						item.value = arr[i].toString();
					}
					if (typeof parentId === "number") {
						item.parent = parentId;
						item.level = env.data[parentId].level + 1;
					} else {
						item.level = 0;
					}
					if (i == arr.length - 1)
						item.atLast = true;
					env.data.push(item);
					if (item.children)
						mapData(arr[i].children, env.data.length - 1);
				}
			}
			mapData(data);
			if (env.data.length > maxLine) {
				dispLine = maxLine;
			} else if (env.data.length < minLine) {
				dispLine = minLine;
			} else
				dispLine = env.data.length;
			createList();
			if (env.data.length > dispLine) {
				vscroll.style.display = "inline-block";
				vscroll.setInfo(env.data.length, 0, dispLine);
				vscroll.onscrolling = function (pos) {
					env.firstLine = pos;
					draw();
				};
				vscroll.onscrollend = function (pos) {
					env.firstLine = pos;
					draw();
				};
			} else
				vscroll.style.display = "none";
		} else
			createList();
		draw();
	}
	draw();

	container.refresh = draw;
	container.setData = fillList;
	container.getCount = function () {
		return env.data.length;
	};
	container.setFilterBox = function (hasFilter) {
		env.hasFilter = (hasFilter === true);
		if (env.hasFilter) {
			filterBox.style.display = "block";
			draw();
		} else
			filterBox.style.display = "none";
	};
	container.removeItem = function (index) {
		if (index >= 0 && index < env.data.length) {
			var item = env.data.splice(index, 1)[0];
			draw();
			return item;
		} else
			return null;
	};
	container.insertItem = function (item, index) {
		if (index >= 0 && index <= env.data.length) {
			env.data.splice(index, 0, item);
			draw();
			return item;
		} else if (index === -1 || typeof index === "undefined") {
			env.data.splice(env.data.length, 0, item);
			draw();
			return item;			
		} else
			return null;
	};
	container.getItem = function (index) {
		if (index >= 0 && index < env.data.length)
			return env.data[index];
		else
			return null;
	};
	container.setItem = function (index, item) {
		if (index >= 0 && index < env.data.length) {
			var oldItem = env.data[index];
			env.data[index] = item;
			draw();
			return oldItem;
		} else
			return null;
	};
	container.getChecked = function () {
		var checked = [];
		for (var i = 0; i < env.data.length; i++) {
			if (env.data[i].checked)
				checked.push(i);
		}
		return checked;
	};
	container.getCheckedValue = function () {
		var checked = [];
		for (var i = 0; i < env.data.length; i++) {
			if (env.data[i].checked)
				checked.push(env.data[i].value);
		}
		return checked;
	};
	container.getCheckedKey = function () {
		var checked = [];
		for (var i = 0; i < env.data.length; i++) {
			if (env.data[i].checked)
				checked.push(env.data[i].key);
		}
		return checked;
	};
	container.setChecked = function (checkedIndexes) {
		for (var i = 0; i < env.data.length; i++) {
			if (checkedIndexes.indexOf(i) >= 0 && typeof env.data[i].checked === "boolean")
				env.data[i].checked = true;
		}
		draw();
	};
	container.setUnchecked = function (uncheckedIndexes) {
		for (var i = 0; i < env.data.length; i++) {
			if (uncheckedIndexes.indexOf(i) >= 0 && typeof env.data[i].checked === "boolean")
				env.data[i].checked = false;
		}
		draw();
	};
	container.setCheckedKey = function (checkedKeys) {
		for (var i = 0; i < env.data.length; i++) {
			if (checkedKeys.indexOf(env.data[i].key) >= 0 && typeof env.data[i].checked === "boolean")
				env.data[i].checked = true;
		}
		draw();
	};
	container.setUncheckedKey = function (uncheckedKeys) {
		for (var i = 0; i < env.data.length; i++) {
			if (uncheckedKeys.indexOf(env.data[i].key) >= 0 && typeof env.data[i].checked === "boolean")
				env.data[i].checked = false;
		}
		draw();
	};
	container.checkAll = function () {
		for (var i = 0; i < data().length; i++) {
			if (typeof data()[i].checked === "boolean" && !data()[i].disabled)
				data()[i].checked = true;
		}
		draw();
	};
	container.uncheckAll = function () {
		for (var i = 0; i < data().length; i++) {
			if (typeof data()[i].checked === "boolean" && !data()[i].disabled)
				data()[i].checked = false;
		}
		draw();
	};
	container.getActived = function () {
		if (typeof env.activeLine === "number")
			return data()[env.activeLine];
		else
			return null;
	};
	container.setActived = function (item) {
		for (var i = 0; i < env.data.length; i++) {
			if (data()[i] === item) {
				container.setActivedLine(i);
				return;
			}
		}
		env.activeLine = null;
		draw();
	};
	container.getActivedLine = function () {
		if (env.activeLine === null)
			return null;
		else
			return env.data.indexOf(data()[env.activeLine]);
	};
	container.setActivedLine = function (line) {
		if (typeof line !== "number") {
			env.activeLine = null;
			return;
		}
		line = data().indexOf(env.data[line]);
		if (line >= 0 && line < data().length) {
			env.activeLine = line;
			if (env.activeLine < env.firstLine)
				env.firstLine = env.activeLine;
			if (env.activeLine >= env.firstLine + dispLine)
				env.firstLine = env.activeLine - (dispLine - 1);
			if (env.firstLine < 0) {
				env.firstLine = 0;
			}
			vscroll.setInfo(data().length, env.firstLine, dispLine);
			draw();
		}
	};
	if (typeof selectData === "function") {
		var item = doc.createElement("DIV");
		item.className = "thor-list-loading thor-processing-img";
		dataBox.appendChild(item);
		selectData(fillList);
	} else if (selectData instanceof Array){
		fillList(selectData);
	}
	return container;
}

function makeCheckBox(container) {
	if (typeof container === "string")
		container = document.getElementById(container);
	if (!(container && (container.tagName === "DIV" || container.tagName === "SPAN")) || container._env)
		return;
	container._env = {};
	var env = container._env;
	env.checked = false;
	env.enabled = true;
	var inst = this;
	
	var text = container.innerHTML;
	container.style.verticalAlign = "middle";
	container.style.display = "inline-block";
	container.innerHTML = "<SPAN></SPAN><LABEL>"+text+"</LABEL>";
	var icon = container.childNodes[0];
	var label = container.childNodes[1];
	var size = container.getAttribute("data-icon-size");
	if (size === null)
		size = "25px";
	label.style.verticalAlign = "middle";
	label.setAttribute("unselectable", "on");
	label.style.lineHeight = size;
	addClass(label, "thor-no-select");
	icon.style.verticalAlign = "middle";
	icon.style.width = size;
	icon.style.height = size;
	addEventListener(icon, "mousedown", function () {
		if (!env.enabled)
			return;
		env.checked = !env.checked;
		setStyle();
		if (typeof container.onclick === "function")
			container.onclick();
	}, true);
	addEventListener(label, "mousedown", function () {
		if (!env.enabled)
			return;
		env.checked = !env.checked;
		setStyle();
		if (typeof container.onclick === "function")
			container.onclick();
	}, true);
	function fireDlbClick() {
		if (typeof container.ondblclick === "function")
			container.ondblclick();
	}
	addEventListener(icon, "dblclick", fireDlbClick);
	addEventListener(label, "dblclick", fireDlbClick);
	function setStyle() {
		addClass(icon, "thor-list-item-icon");
		removeClass(icon, "thor-icon-unchecked");
		removeClass(icon, "thor-icon-unchecked-disabled");
		removeClass(icon, "thor-icon-checked");
		removeClass(icon, "thor-icon-checked-disabled");
		if (env.checked) {
			addClass(icon, env.enabled ? "thor-icon-checked" : "thor-icon-checked-disabled");
		} else {
			addClass(icon, env.enabled ? "thor-icon-unchecked" : "thor-icon-unchecked-disabled");
		}
	}
	
	container.getChecked = function () {
		return env.checked;
	};
	container.setChecked = function (checked) {
		env.checked = checked ? true : false;
		setStyle();
	};
	container.getEnabled = function () {
		return env.enabled;
	};
	container.setEnabled = function (enabled) {
		env.enabled = enabled ? true : false;
		setStyle();
	};
	setStyle();
	return container;
}

/*
 * SELECT BOX
*/
function makeSelectBox(container, type, selectData, hasFilter) {
	if (typeof container === "string")
		container = document.getElementById(container);
	if (!(container && (container.tagName === "DIV" || container.tagName === "SPAN")) || container._env)
		return;
	container._env = {};
	if (container.style.position.toLowerCase() != "absolute" &&
	        container.style.position.toLowerCase() != "relative" &&
	        container.style.position.toLowerCase() != "fixed")
		container.style.position = "relative";
	addClass(container, "thor-input-box");
	container.style.whiteSpace = "nowrap";
	var env = container._env;
	env.value = null;
	env.keys = [];
	env.nullable = true;
	env.listCtrl = null;
	env.readOnly = false;
	var doc = container.ownerDocument;
	var txt = doc.createElement("INPUT");
	txt.className = "thor-input-calendar-txt";
	txt.style.border = "0px";
	txt.type = "TEXT";
	txt.readOnly = true;
	txt.setAttribute("autocomplete","off");
	addEventListener(txt, "blur", onElementBlur);
	addEventListener(txt, "mousedown", function (){
		removeClass(txt, "thor-input-error");
		txt.title = "";
	});
	txt.onkeydown = function (e) {
		var evt = window.event || e;
		if ((evt.keyCode == 46 || evt.keyCode == 8) && env.nullable) {
			if (type === "multi-select") {
				var text = [];
				env.keys = [];
				env.value = [];
				setSrcDataChecked(env.listData, false);
				getSrcDataChecked(env.listData, env.keys, text);
				txt.value = text.join("; ");
			} else {	
				txt.value = "";
				env.value = null;
				env.keys = [];
			}
			if (window.event)
				evt.returnValue = false;
			if (evt.preventDefault)
				evt.preventDefault();
		} else if (evt.keyCode == 32) {
			if (window.event)
				evt.returnValue = false;
			if (evt.preventDefault)
				evt.preventDefault();
			container.openSelect();
		}
		return false;
	};
	var btn = doc.createElement("SPAN");
	if (type == "date")
		btn.className = "thor-input-button thor-icon-calendar";
	else
		btn.className = "thor-input-button thor-icon-select";
	function resize() {
		container.innerHTML = "";
		while (container.childNodes.length > 0) {
			container.removeChild(container.childNodes[0]);			
		}
		// if (container.offsetWidth <= 0) {
			var hideDiv = doc.createElement("DIV");
			hideDiv.style.visibility = "hidden";
			hideDiv.style.display = "block";
			hideDiv.style.position = "absolute";
			hideDiv.style.left = "0px";
			hideDiv.style.top = "0px";
			doc.body.appendChild(hideDiv);
			hideDiv.innerHTML = container.outerHTML;
			var outerWidth = hideDiv.firstChild.clientWidth;
			txt.style.paddingLeft = getCurrentStyle(container).paddingLeft;
			txt.style.paddingRight = getCurrentStyle(container).paddingRight;
			container.style.padding = "0px";
			hideDiv.innerHTML = container.outerHTML;
			var paddingLessWidth = hideDiv.firstChild.clientWidth;
			txt.style.height = (hideDiv.firstChild.clientHeight - 2) + "px";
			hideDiv.innerHTML = btn.outerHTML;
			var btnWidth = hideDiv.firstChild.offsetWidth;
			txt.style.width = (paddingLessWidth - btnWidth) + "px";
			container.style.width = outerWidth + "px";
			doc.body.removeChild(hideDiv);
		// } else ...
		
		container.appendChild(txt);
		container.appendChild(btn);
		btn.onclick = container.openSelect;		
	}
	function addButtonBar(parent, buttons) {
		var btnBar = doc.createElement("DIV");
		btnBar.className = "thor-input-button-bar";
		for (var i = 0; i < buttons.length; i++) {
			var btn = doc.createElement("SPAN");
			btn.innerHTML = buttons[i].name;
			btn.style.margin = "0px 2px";
			if (buttons[i].left === true) {
				setFloat(btn, "left");
			} else
				setFloat(btn, "right");
			btnBar.appendChild(btn);
			if (buttons[i].left === true) {
				makeButton(btn, buttons[i].click, "small");
			} else
				makeButton(btn, buttons[i].click, "small");
		}
		parent.appendChild(btnBar);
		return btnBar;
	}
	function openPanel(buildFunc, param) {
		removeClass(txt, "thor-input-error");
		txt.title = "";
		var pop = doc.createElement("SPAN");
		pop.className = "thor-input-pop-panel";
		pop.style.display = "none";
		pop.style.position = "absolute";
		pop.style.left = "0px";
		pop.style.top = "0px";
		pop.style.zIndex = "100";
		var parent = getProperlyParent(btn, doc.body);
		parent.appendChild(pop);
		var barArray = buildFunc(pop, param);
		popupPanel(pop, btn, parent).onclose = function () {
			parent.removeChild(pop);
			env.listCtrl = null;
		};
		var barWidth = pop.firstChild.offsetWidth;
		if (barArray) {
			var btnBar = addButtonBar(pop, barArray);
			btnBar.style.width = barWidth + "px";			
		}
		pop.firstChild.focus();
	}
	function createCalendar(pop) {
		var calDiv = doc.createElement("SPAN");
		calDiv.style.display = "inline-block";
		pop.appendChild(calDiv);
		makeDatePicker(calDiv);
		var btnArray = [{
			name: tuiText.ok,
			click: function() {
				env.value = calDiv.getDate();
				txt.value = env.value.getFullYear() + "-" + (env.value.getMonth() + 1) + "-" + env.value.getDate();
				pop.close();
				txt.focus();
				if (typeof container.onselected === "function")
					container.onselected();
			}
		},{
			name: tuiText.today,
			left: true,
			click: function(){
				env.value = new Date();
				txt.value = env.value.getFullYear() + "-" + (env.value.getMonth() + 1) + "-" + env.value.getDate();
				pop.close();
				txt.focus();
				if (typeof container.onselected === "function")
					container.onselected();
			}
		}];
		if (env.nullable) {
			btnArray.push({
				name: tuiText.clear,
				left: true,
				click: function(){
					env.value = null;
					txt.value = "";
					pop.close();
					txt.focus();
					if (typeof container.onselected === "function")
						container.onselected();
				}
			});
		}
		calDiv.ondblpicked = function(date){
			if (env.readOnly)
				return;
			env.value = date;
			txt.value = env.value.getFullYear() + "-" + (env.value.getMonth() + 1) + "-" + env.value.getDate();
			pop.close();
			txt.focus();
			if (typeof container.onselected === "function")
				container.onselected();
		};
		if (env.value)
			calDiv.setDate(env.value);
		if (env.readOnly)
			return null;
		else
			return btnArray;
	};
	function createList(pop, multiSelect) {
		var list = doc.createElement("SPAN");
		list.style.display = "inline-block";
		if (typeof container.popWidth === "number")
			list.style.width = container.popWidth + "px";
		else
			list.style.width = container.offsetWidth + "px";
		env.listCtrl = list;
		if (env.listData instanceof Array)
			makeListBox(list, env.listData);
		else {
			makeListBox(list, container.onfilldata);
		}
		list.setFilterBox(hasFilter === true);
		pop.refreshFunc = list.refresh;
		pop.appendChild(list);
		if (multiSelect) {
			var btnArray = [{
				name: tuiText.ok,
				click: function() {
					//env.value = list.getChecked();
					env.keys = list.getCheckedKey();
					txt.value = list.getCheckedValue().join("; ");
					env.value = [];
					setSrcDataChecked(env.listData, false);
					setSrcDataChecked(env.listData, true, env.keys);
					pop.close();
					txt.focus();
					if (typeof container.onselected === "function")
						container.onselected();
				}
			},{
				name: tuiText.all,
				left: true,
				click: function(){
					list.checkAll();
					/* They don't need auto close panel
					env.value = list.getChecked();
					env.keys = list.getCheckedKey();
					txt.value = list.getCheckedValue().join("; ");
					pop.close();
					txt.focus();
					if (typeof container.onselected === "function")
						container.onselected();
					*/
				}
			},{
				name: tuiText.clear,
				left: true,
				click: function(){
					list.uncheckAll();
					/* They don't need auto close panel
					env.value = list.getChecked();
					env.keys = list.getCheckedKey();
					txt.value = list.getCheckedValue().join("; ");
					pop.close();
					txt.focus();
					if (typeof container.onselected === "function")
						container.onselected();
					*/
				}
			}];
			if (env.keys instanceof Array)
				list.setCheckedKey(env.keys);
			if (env.readOnly)
				return null;
			else
				return btnArray;
		} else {
			list.onitemactived = function (line, isclick) {
				if (env.readOnly)
					return;
				env.value = list.getActived();
				if (env.value) {
					env.keys = [env.value.key];
					txt.value = env.value.value;
					env.value = line;
				} else {
					env.keys = [];
					txt.value = "";
				}
				if (isclick) {
					pop.close();
					txt.focus();
				}
				if (typeof container.onselected === "function")
					container.onselected();
			};
			list.onitemselected = function (line) {
				if (env.readOnly)
					return;
				pop.close();
				txt.focus();
			};
			
			if (typeof env.value === "number")
				list.setActivedLine(env.value);
			return null;
		}
	}
	
	function setSrcDataChecked(nodes, checked, keys) {
		if (!nodes)
			return;
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			if (!node.disabled && typeof node.checked === "boolean") {
				if (keys) {
					if (keys.indexOf(node.key) >= 0)
						node.checked = checked;
				} else
					node.checked = checked;
			}			
			if (node.children) {
				setSrcDataChecked(node.children, checked, keys);
			}
		}
	}
	
	function getSrcDataChecked(nodes, keys, text) {
		if (!nodes)
			return;
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			if (node.checked === true) {
				keys.push(node.key);
				if (text)
					text.push(node.value);
			}
			if (node.children) {
				getSrcDataChecked(node.children, keys, text);
			}
		}
	}
	function traveSrcData(nodes, fn) {
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			if (fn(node))
				return true;
			if (node.children) {
				if (traveSrcData(node.children, fn))
					return true;
			}
		}
		return false;
	}
	function findSrcData(nodes, key, pos) {
		if (!nodes)
			return [];
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			if (node.key === key) {
				return [pos, node];
			} 
			++pos;
			if (node.children) {
				var found = findSrcData(node.children, key, pos);
				if (found[1])
					return found;
				else
					pos = found[0];				
			}
		}
		return [pos];
	}
	
	
	if (type === "date") {
		container.openSelect = function() {
			openPanel(createCalendar);
		};
		container.setDate = function(date) {
			if (typeof date === "string")
				env.value = parseDate(date);
			else if (date instanceof Date)
				env.value = date;
			else
				env.value = null;
			txt.value = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
			env.keys = [];
		};
		container.getDate = function() {
			return env.value;
		};
		container.setNullable = function(nullable) {
			env.nullable = nullable;
		};
	} else if (type === "select") {
		container.openSelect = function(){
			openPanel(createList, false);
		};
		container.setNullable = function(nullable) {
			env.nullable = nullable;
		};
		container.selectFirstAvailabled = function () {
			var key = null;
			traveSrcData(env.listData, function (node) {
				if (node.disabled !== true) {
					key = node.key;
					return true;
				} else
					return false;
			});
			if (key)
				container.setKeys([key]);
		};
	} else if (type === "multi-select") {
		container.openSelect = function(){
			openPanel(createList, true);
		};
		container.checkall = function () {
			env.value = [];
			var text = [];
			env.keys = [];
			setSrcDataChecked(env.listData, true);
			getSrcDataChecked(env.listData, env.keys, text);
			txt.value = text.join("; ");			
		};
	} 
	if (type === "select" || type === "multi-select") {
		container.setData = function (data) {
			env.listData = data;
			env.value = null;
			var oldKeys = env.keys;
			env.keys = [];
			txt.value = "";
			if (env.listCtrl) {
				env.listCtrl.setData(env.listData);
			}
			if (type === "multi-select") {
				var text = [];
				env.value = [];
				getSrcDataChecked(env.listData, env.keys, text);
				txt.value = text.join("; ");
			}
			container.setKeys(oldKeys);
		};
		container.getKeys = function () {
			return env.keys;
		};
		container.setKeys = function (keys) {
			if (keys.length <= 0)
				return;
			env.keys = [];
			txt.value = "";
			if (type === "multi-select") {
				env.value = [];
				var text = [];
				setSrcDataChecked(env.listData, true, keys);
				getSrcDataChecked(env.listData, env.keys, text);
				txt.value = text.join("; ");
			} else if (type === "select") {
				env.value = null;
				var found = findSrcData(env.listData, keys[0], 0);
				if (found[1]) {
					txt.value = found[1].value;
					env.keys.push(found[1].key);
					env.value = found[0];
				}
			}
		};
		container.setKeyAndValue = function (keys, value) {
			if (keys instanceof Array)
				env.keys = keys;
			txt.value = value;
		};
		container.setCondition = function (condition) {
			if (env.condition != condition) {
				env.condition = condition;
				env.listData = null;
				env.value = null;
				env.keys = [];
				txt.value = "";
			}
		};
	}
	container.onfilldata = null;
	container.onselected = null;
	container.setError = function (msg) {
		addClass(txt, "thor-input-error");
		if (msg)
			txt.title = msg;
	};
	container.getType = function () {
		return type;
	};
	container.getText = function () {
		return txt.value;
	};
	container.setReadOnly = function (readOnly) {
		env.readOnly = readOnly;
	};
	container.resize = resize;
	resize();
	return container;
}

var tui = {
	setText: function (txtResource, value) {
		if (typeof txtResource === "object") {
			for (var name in txtResource) {
				if (tuiText[name])
					tuiText[name] = txtResource[name];
			}			
		} else if (typeof txtResource === "string" && typeof value === "string") {
			tuiText[txtResource] = value;
		}
	},
	button: makeButton,
	toolbar: makeToolbar,
	tab: makeTab,
	scrollbar: makeScrollbar,
	dialog: function(focusElement) {
		return new Dialog(focusElement);
	},
	datePicker: makeDatePicker,
	selectBox: makeSelectBox,
	listBox: makeListBox,
	grid: makeGrid,
	popup: popupPanel,
	menu: makeMenu,
	checkBox: makeCheckBox,
	inDialog: function () {
		return currentDialogMask != null;
	},
	offset: getOffsetPosition,
	addClass: addClass,
	removeClass: removeClass,
	closePopup: closeAllPanel,
	iever: getIEVersion(),
	msie: getIEVersion() > 0,
	firefox: (userAgentLike("Gecko/") || userAgentLike("Firefox/")),
	webkit: (userAgentLike("AppleWebKit/") || userAgentLike("Chrome/") || userAgentLike("Safari/"))
};

window.tui = tui;

})(window);
