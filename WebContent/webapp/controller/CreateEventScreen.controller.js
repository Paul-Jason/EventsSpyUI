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
				var query = "https://hanai329046trial.hanatrial.ondemand.com/EventsSpyUI/services/MyEvents.xsjs?acmd=listLOB";
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
				var description = this.getView().byId("iDescription").getValue();
				var lob = this.getView().byId("iLOB").getSelectedKey();
				lob = lob.toString();
				var date = this.getView().byId("iDate").getValue();
				var time = this.getView().byId("iTime").getValue();
				var capacity = this.getView().byId("iCapacity").getValue();
				console.log(userid);
				console.log(title);
				console.log(description);
				console.log(lob);
				console.log(date);
				console.log(time);
				console.log(capacity);
				var dateTime = date + " " + time;
				var query = "https://hanai329046trial.hanatrial.ondemand.com/EventsSpyUI/services/MyEvents.xsjs?acmd=createEvent&userid=" + userid +
					"&title=" + title + "&description= " + description + "&lob=" + lob + "&dateTime=" + dateTime + "&capacity=" + capacity;
				console.log(query);
				$.ajax({
					url: query,
					type: "GET",
					data: 'json',
					async: false,
					success: function(oData) {
						var data = $.parseJSON(oData);
						console.log(data);
					}
				});
			}
		});
	});