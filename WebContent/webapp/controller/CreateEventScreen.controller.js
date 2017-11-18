sap.ui.define([
               "jquery.sap.global",
               "sap/ui/core/mvc/Controller",
               "sap/ui/model/json/JSONModel"],
	function(jQuery, Controller, JSONModel) {
		"use strict";
		var oModelLOB = new JSONModel();
		Controller.extend("eventsspy.indexroot.controller.CreateEventScreen", {
			onInit: function() {
				var view = this.getView();
				var query = "https://hanadbi329046trial.hanatrial.ondemand.com/EventsSpyUI/services/MyEvents.xsjs?acmd=listLOB";
				$.ajax({
					url: query,
					type: "GET",
					data: 'json',
					async: false,
					success: function(oData) {
						var data = $.parseJSON(oData);
						oModelLOB.setData(data);
						console.log("Response for list of LOB's:");
						console.log(data);
						view.setModel(oModelLOB, "lobOdata");
					}
				});
			},
			goBackToHome: function() {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("homeScreen");
				
			},
			createANewEvent: function() {
				var userDataModel = sap.ui.getCore().getModel("loggedInUserData");
				var userid = userDataModel.getData().uid;
				var title = this.getView().byId("iTitle").getValue();
				//title = title.toString();
				var description = this.getView().byId("iDescription").getValue();
				//description = description.toString();
				var lobId = this.getView().byId("iLOB").getSelectedKey();
				var dateTime = this.getView().byId("iDateTime").getValue();
				//dateTime = dateTime.toString();
				var capacity = this.getView().byId("iCapacity").getValue();
				console.log(userid);
				console.log(title);
				console.log(description);
				console.log(lobId);
				console.log(dateTime);
				console.log(capacity);
				var query = "https://hanadbi329046trial.hanatrial.ondemand.com/EventsSpyUI/services/MyEvents.xsjs?acmd=createEvent";
				console.log(query);
				$.ajax({
					url: query,
					type: "GET",
					data: {
					    userid: userid,
					    title: title,
					    description: description,
					    lobId: lobId,
					    // dateTime: dateTime,
					    capacity: capacity
					},
					dataType: 'json',
					async: false,
					success: function(oData) {
						var data = $.parseJSON(oData);
						console.log(data);
					}
				});
			}
		});
	});