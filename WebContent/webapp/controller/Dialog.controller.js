sap.ui.define([
		'sap/m/Button',
		'sap/m/Dialog',
		'sap/ui/core/mvc/Controller'
	], function(Button, Dialog, Controller) {
	"use strict";
	Controller.extend("eventsspy.indexroot.controller.Dialog", {
	
	    onMessageSuccessDialogPress: function (oEvent) {
			var dialog = new Dialog({
				title: 'Success',
				type: 'Message',
				state: 'Success',
				beginButton: new Button({
					text: 'OK',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
 
			dialog.open();
		}
		
	});
	});
	