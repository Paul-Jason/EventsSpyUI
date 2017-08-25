sap.ui.define([
               "jquery.sap.global",
               "sap/ui/core/mvc/Controller",
               "sap/ui/model/json/JSONModel",
               "eventsspy/indexroot/model/formatter"],
            function(jQuery, Controller, JSONModel, formatter){
					"use strict";
                    
                    var oModelEvents = new JSONModel();
					Controller.extend("eventsspy.indexroot.controller.HomeScreen",{
						formatter : formatter,	
                        onInit: function() {
                               var userDataModel = sap.ui.getCore().getModel("loggedInUserData");
                               var userid = userDataModel.getData().uid;
                               console.log(userid);
                               this.getView().setModel(oModelEvents, "EventsModel");
                               var view = this.getView();
                               var query = "https://hanai329046trial.hanatrial.ondemand.com/EventsSpyUI/services/MyEvents.xsjs?acmd=listMyEvents";
                                $.ajax({
                                    url: query,
                                    type: "GET",
                                    data: {
            					        userid: userid
            					    },
            					    datatype: 'json',
                                    async: false,
                                    success: function(oData) {
                                        var data = $.parseJSON(oData);   
                                        oModelEvents.setData(data);
                                        console.log("Response for all the events created:");
                                        console.log(oData);
                                        view.setModel(oModelEvents);
                                    }
                                });                     	    
                        }
					});
});