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
                               this.getView().setModel(oModelEvents, "EventsModel");
                               var view = this.getView();
                               var query1 = "https://hanai329046trial.hanatrial.ondemand.com/EventsSpyUI/services/EventsSpyOdata.xsodata/ALL_EVENTS_LIST?$format=json";
                                $.ajax({
                                    url: query1,
                                    type: "GET",
                                    data: "json",
                                    async: false,
                                    success: function(oData) {
                                        oModelEvents.setData(oData);
                                        console.log(oModelEvents);
                                        view.setModel(oModelEvents);
                                    }
                                });                     	    
                        }
					});
});