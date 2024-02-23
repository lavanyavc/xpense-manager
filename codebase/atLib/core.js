/**
 * @Description : Acinonyx JS Library
 * @Author : Kishan Ravindra
 */
var ENTER_KEY = 13;
var ESC_KEY = 27;
var INSERT_KEY = 45;
var ALPHA_KEY_I = 73;
var XHRObj = false;
var isDebug = true;
var PARSEERR = "Server response failure.";
var MOBILEPATTERN = /^[0-9]{10}$/;
var EMAILPATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var USERNAMEPATTERN = /^[a-z0-9-]+([-_\.]?[a-z0-9]+)+$/;
var PASSWORDPATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
var core = {
	goToURL: function (requestedUrl) {
		window.location.href = requestedUrl;
	},
	sendToConsole: function (value) {
		if (isDebug) {
			console.log(value);
		}
		return isDebug;
	},
	isDataNull: function (value) {
		var isNull = false;
		if (value == null || value == undefined) {
			isNull = true;
		} else {
			if (typeof value !== 'boolean') {
				isNull = value.trim() == "" ? true : false;
			}
		}
		return isNull;
	},
	getValue: function (elemId) {
		return $('#' + elemId).val().trim();
	},
	setValue: function (elemId, elemVal = "") {
		$('#' + elemId).val(elemVal);
	},
	clearValues: function (arrElemIds) {
		var i;
		for (i = 0; i < arrElemIds.length; i++) {
			this.setValue(arrElemIds[i]);
		}
	},
	getHTML: function (elemId) {
		return $('#' + elemId).html();
	},
	setHTML: function (elemId, elemVal = "", autoClearTime = 0) {
		$('#' + elemId).html(elemVal);
		if (autoClearTime != 0) {
			setTimeout(function () {
				$('#' + elemId).html("");
			}, autoClearTime);
		}
	},
	atLoader: function (action = true) {
		let max = 15;
		if (!$('#atLoader').length) {
			let random = Math.floor(Math.random() * max);
			$('body').prepend("<div id='atLoader' class='atLoader atLoader" + (random == 0 ? max : random) + "'></div>");
		}
		if (action) {
			$('body').addClass("loading");
		} else {
			$('body').removeClass("loading");
		}
	},
	getBootstrapAlerts: function (alertType, displayMsg) {
		var alertTypes = new Array("INFO", "WARNING", "DANGER", "SUCCESS");
		var index = alertTypes.indexOf(alertType.toUpperCase());
		if (index < 0) {
			this.sendToConsole("Invalid Alert Type : " + alertType);
			return;
		}
		var alertStyles = new Array();
		alertStyles.push("<div class='alert alert-info alert-dismissable'>");
		alertStyles.push("<div class='alert alert-warning alert-dismissable'>");
		alertStyles.push("<div class='alert alert-danger alert-dismissable'>");
		alertStyles.push("<div class='alert alert-success alert-dismissable'>");
		var commonStyle = "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" + displayMsg + "</div>";
		return (alertStyles[index]) + commonStyle;
	},
	getDialogBox: function (dialogTitle, dialogContent, showClose = true) {
		var closeButton = (showClose ? "<button type='button' class='close' data-dismiss='modal'>&times</button>" : "");
		var dialogTemplate = "<div class='container'>" +
			"<div class='modal fade' id='coreModal' role='dialog'>" +
			"<div class='modal-dialog modal-lg'>" +
			"<div class='modal-content'>" +
			"<div class='modal-header'><h5 class='modal-title'><b><span id='infoTitle'></span></b></h5>" + closeButton + "</div>" +
			"<div class='modal-body'><p><span id='infoBody'></span></p></div>" +
			"<div class='modal-footer'><span id='infoFooter'></span></div>" +
			"</div>" +
			"</div>" +
			"</div>" +
			"</div>";
		if (!$('#dialogHolder').length) {
			$('body').after("<div id='dialogHolder'></div>");
		}
		this.setHTML('dialogHolder', dialogTemplate);
		this.setHTML('infoTitle', dialogTitle);
		this.setHTML('infoBody', dialogContent);
		this.setHTML('infoFooter');
		$('#coreModal').modal({ backdrop: "static" });
		return;
	},
	closeDialogBox: function () {
		$('#coreModal').modal('hide');
	},
	getFlashMsg: function (alertType, alertVal = "") {
		var alertTypes = new Array("INFO", "WARNING", "DANGER", "SUCCESS");
		var index = alertTypes.indexOf(alertType.toUpperCase());
		alertType = index < 0 ? "default" : alertType.toLowerCase();
		try {
			Msg[alertType](alertVal);
		} catch (e) {
			return false;
		}
	},
	getAlertMsg: function (alertType, alertVal = "", autoHide = true) {
		var alertTypes = new Array("INFO", "WARNING", "DANGER", "SUCCESS");
		var index = alertTypes.indexOf(alertType.toUpperCase());
		alertType = index < 0 ? "default" : alertType.toLowerCase();
		notif({
			msg: alertVal,
			type: alertType,
			position: "right",
			multiline: true,
			autohide: autoHide
		});
	},
	transformCase: function (thisPtr, toCase) {
		switch (toCase.toUpperCase()) {
			case "UPPER":
				thisPtr.value = thisPtr.value.toUpperCase();
				break;
			case "LOWER":
				thisPtr.value = thisPtr.value.toLowerCase();
				break;
			case "UCWORDS":
				thisPtr.value = thisPtr.value.toLowerCase().replace(/\b[a-z]/g,
					function (letter) {
						return letter.toUpperCase();
					});
				break;
		}
		return;
	},
	validatePattern: function (strToValidate, pattern) {
		var response = false;
		if (strToValidate.search(pattern) >= 0) {
			response = true;
		}
		return response;
	},
	getUniqueArray: function (value, index, self) {
		return self.indexOf(value) === index;
	},
	sanitizeArray: function (arrElems) {
		arrElems = arrElems.filter(function (element) {
			return (element != null && element != "");
		});
		return arrElems;
	},
	createXHRObj: function (isXML) {
		XHRObj = false;
		if (window.XMLHttpRequest) {
			XHRObj = new XMLHttpRequest();
			if (isXML) {
				XHRObj.overrideMimeType('text/xml');
			}
		} else if (window.ActiveXObject) {
			XHRObj = new ActiveXObject("Microsoft.XMLHTTP");
		}
		return XHRObj;
	},
	execAJAXCall: function (reqHandler, reqData, reqMethod = "GET", isXML = false) {
		var XHRobj = core.createXHRObj(falseisXML);
		if (!XHRobj) {
			this.sendToConsole("Incompatible to start AJAX Engine");
			return;
		}
		XHRobj.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				var respObj = false;
				if (isXML) {
					respObj = this.responseXML;
				} else {
					respObj = this.responseText;
				}
			}
		}
		XHRobj.open(reqMethod, reqHandler, false);
		if (reqMethod == "POST") {
			XHRobj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		}
		XHRobj.send(reqData);
		return respObj;
	},
	smartAJAX: function (requestHandler, requestData, requestMethod = "GET") {
		var respObj;
		$.ajax({
			url: requestHandler,
			data: requestData,
			type: requestMethod,
			async: false,
			cache: false,
			success: function (responseData) { respObj = responseData; },
			error: function (responseData) { respObj = responseData; }
		});
		return respObj;
	}
}