/**
 * @Description : Acinonyx JS Library
 * @Author : Kishan Ravindra
 */
var ENTER_KEY = 13;
var CTRL_KEY = 17;
var SHIFT_KEY = 16;
var ESC_KEY = 27;
var INSERT_KEY = 45;
var ALPHA_KEY_I = 73;
var ALPHA_KEY_L = 76;
var XHRObj = false;
var isDebug = true;
var PARSEERR = "Server response failure.";
var MOBILE_PATTERN = /^[0-9]{10}$/;
var EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var USERNAME_PATTERN = /^[a-z0-9-]+([-_\.]?[a-z0-9]+)+$/;
var PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
var coreModal;
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
	getDialogBox: function (title, content, footer, size = "lg") {
		var sizeClass = { sm: "modal-sm", md: "modal-md", lg: "modal-lg" };
		var template = "<div class='modal fade' id='coreModal' role='dialog'>";
		template += "<div class='modal-dialog " + sizeClass[size] + "'>";
		template += "<div class='modal-content'>";
		template += "<div class='modal-header'><span class='modal-title' id='coreTitle'></span></div>";
		template += "<div class='modal-body'><span id='coreBody'></span></div>";
		template += "<div class='modal-footer'><span id='coreFooter'></span></div>";
		template += "</div></div></div>";
		if (!$('#coreHolder').length) {
			$('body').after("<div id='coreHolder'></div>");
		}
		this.setHTML('coreHolder', template);
		this.setHTML('coreTitle', title);
		this.setHTML('coreBody', content);
		this.setHTML('coreFooter', footer);
		coreModal = new bootstrap.Modal(document.getElementById('coreModal'), {
			backdrop: "static",
			keyboard: false
		});
		coreModal.show();
		return;
	},
	closeDialogBox: function () {
		coreModal.hide();
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
	execAJAX: function (reqHandler, reqData, reqMethod = "GET", isXML = false) {
		var XHRobj = core.createXHRObj(isXML);
		if (!XHRobj) {
			this.sendToConsole("Incompatible to start AJAX Engine");
			return;
		}
		var respObj = false;
		XHRobj.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
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
	ajax: async function (requestHandler, requestData, requestMethod = "GET") {
		var respObj;
		await $.ajax({
			url: requestHandler,
			data: requestData,
			type: requestMethod,
			async: true,
			cache: false,
			success: function (responseData) { respObj = responseData; },
			error: function (responseData) { respObj = responseData; }
		});
		return respObj;
	}
}