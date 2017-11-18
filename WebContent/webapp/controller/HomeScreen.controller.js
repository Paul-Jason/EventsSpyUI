sap.ui.define([
               "jquery.sap.global",
               "sap/ui/core/mvc/Controller",
               "sap/ui/model/json/JSONModel",
               "eventsspy/indexroot/model/formatter"],
            function(jQuery, Controller, JSONModel, formatter){
					"use strict";
                    
                    var oModelEvents = new JSONModel();
                    var oModelEventInvites = new JSONModel();
					Controller.extend("eventsspy.indexroot.controller.HomeScreen",{
						formatter : formatter,	
                        onInit: function() {
                                //Ajax call 1 to get the my events list
                               var userDataModel = sap.ui.getCore().getModel("loggedInUserData");
                               var userid = userDataModel.getData().uid;
                               console.log(userDataModel);
                               sap.ui.getCore().setModel(oModelEvents, "EventsModel");
                               this.getView().setModel(oModelEvents, "EventsModel");
                               var view = this.getView();
                               var query = "https://hanadbi329046trial.hanatrial.ondemand.com/EventsSpyUI/services/MyEvents.xsjs?acmd=listMyEvents";
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
                                //Ajax call 2 to get the events invites list
                                var TeamId = userDataModel.getData().TeamId;
                                console.log(TeamId);
                                this.getView().setModel(oModelEventInvites, "EventInvitesModel");
                                var query = "https://hanai329046trial.hanatrial.ondemand.com/EventsSpyUI/services/EventInvites.xsjs?acmd=listMyEventsInvites&TeamId="+TeamId;
                                console.log(query);
                                 $.ajax({
                                    url: query,
                                    type: "GET",
            					    datatype: 'json',
                                    async: false,
                                    success: function(oData) {
                                        var data = $.parseJSON(oData);   
                                        oModelEventInvites.setData(data);
                                        console.log("Response for all the event invites created:");
                                        console.log(oData);
                                        view.setModel(oModelEventInvites);
                                    }
                                });
                        },
                        onClickCreateNewEvent:function(){
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            oRouter.navTo("createEventScreen");
                        }
					});
});