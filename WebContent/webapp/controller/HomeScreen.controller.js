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
                                        console.log("EventsModel:");
                                        console.log(data);
                                        view.setModel(oModelEvents);
                                    }
                                });
                                //Ajax call 2 to get the events invites list
                                var LOBId = userDataModel.getData().LOBId;
                                this.getView().setModel(oModelEventInvites, "EventInvitesModel");
                                var query = "https://hanadbi329046trial.hanatrial.ondemand.com/EventsSpyUI/services/EventInvites.xsjs?acmd=listMyEventsInvites";
                                 $.ajax({
                                    url: query,
                                    type: "GET",
                                    data:{
                                        LOBId : LOBId
                                    },
            					    datatype: 'json',
                                    async: false,
                                    success: function(oData) {
                                        var data = $.parseJSON(oData);   
                                        oModelEventInvites.setData(data);
                                        console.log("EventInvitesModel:");
                                        console.log(data);
                                        view.setModel(oModelEventInvites);
                                    }
                                });
                        },
                    //     getMyEventsList: function(){
                    //         //Ajax call 1 to get the my events list
                    //           var userDataModel = sap.ui.getCore().getModel("loggedInUserData");
                    //           var userid = userDataModel.getData().uid;
                    //           sap.ui.getCore().setModel(oModelEvents, "EventsModel");
                    //           this.getView().setModel(oModelEvents, "EventsModel");
                    //           var view = this.getView();
                    //           var query = "https://hanadbi329046trial.hanatrial.ondemand.com/EventsSpyUI/services/MyEvents.xsjs?acmd=listMyEvents";
                    //             $.ajax({
                    //                 url: query,
                    //                 type: "GET",
                    //                 data: {
            					   //     userid: userid
            					   // },
            					   // datatype: 'json',
                    //                 async: false,
                    //                 success: function(oData) {
                    //                     var data = $.parseJSON(oData);   
                    //                     oModelEvents.setData(data);
                    //                     view.setModel(oModelEvents);
                    //                 }
                    //             });
                    //     },
                        onClickCreateNewEvent:function(){
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            oRouter.navTo("createEventScreen");
                        },
                        onClickDeleteEvent: function(oEvent){
                            var listId = oEvent.getSource().getId();
                            listId = listId.split("-");
                			var itemId = listId[listId.length - 1];
                			var userDataModel = sap.ui.getCore().getModel("loggedInUserData");
                            var userid = userDataModel.getData().uid;
                			var eventId = oModelEvents.getData().results[itemId].EVENT_ID;
                			var query6 = "https://hanadbi329046trial.hanatrial.ondemand.com/EventsSpyUI/services/MyEvents.xsjs?acmd=deleteEvent&eventId=" + eventId +"&userid=" + userid;
                			$.ajax({
                				url: query6,
                				type: "GET",
                				dataType: "json",
                				async: false,
                				success: function(oData) {
                				    console.log("success delete");
                				    //Ajax call 1 to get the my events list
                                   var query = "https://hanadbi329046trial.hanatrial.ondemand.com/EventsSpyUI/services/MyEvents.xsjs?acmd=listMyEvents";
                                    $.ajax({
                                        url: query,
                                        type: "GET",
                                        data: {
                					        userid: userid
                					    },
                					    datatype: 'json',
                                        async: false,
                                        success: function(oData1) {
                                            var data = $.parseJSON(oData1);   
                                            oModelEvents.setData(data);
                                            console.log("EventsModel:");
                                            console.log(data);
                                        }
                                    });
                				}
                			});
                        },
                        onAcceptClick: function(oEvent){
                            var listId = oEvent.getSource().getId();
                            listId = listId.split("-");
                			var itemId = listId[listId.length - 1];
                			var userDataModel = sap.ui.getCore().getModel("loggedInUserData");
                            var userid = userDataModel.getData().uid;
                			var eventId = oModelEvents.getData().results[itemId].EVENT_ID;
                			var query6 = "https://hanadbi329046trial.hanatrial.ondemand.com/EventsSpyUI/services/EventInvites.xsjs?acmd=acceptEventInvite&eventId=" + eventId +"&userid=" + userid;
                			$.ajax({
                                        url: query6,
                                        type: "GET",
                					    datatype: 'json',
                                        async: false,
                                        success: function(oData) {
                                            console.log("Accept success");
                                           //Ajax call 2 to get the events invites list
                                            var LOBId = userDataModel.getData().LOBId;
                                            this.getView().setModel(oModelEventInvites, "EventInvitesModel");
                                            var query = "https://hanadbi329046trial.hanatrial.ondemand.com/EventsSpyUI/services/EventInvites.xsjs?acmd=listMyEventsInvites";
                                             $.ajax({
                                                url: query,
                                                type: "GET",
                                                data:{
                                                    LOBId : LOBId
                                                },
                        					    datatype: 'json',
                                                async: false,
                                                success: function(oData1) {
                                                    var data = $.parseJSON(oData1);   
                                                    oModelEventInvites.setData(data);
                                                    console.log("EventInvitesModel:");
                                                    console.log(data);
                                                    //view.setModel(oModelEventInvites);
                                                }
                                            });
                                        }
                					});
                            },
                onRejectClick: function(oEvent){
                                var listId = oEvent.getSource().getId();
                                listId = listId.split("-");
                    			var itemId = listId[listId.length - 1];
                    			var userDataModel = sap.ui.getCore().getModel("loggedInUserData");
                                var userid = userDataModel.getData().uid;
                    			var eventId = oModelEvents.getData().results[itemId].EVENT_ID;
                    			var query6 = "https://hanadbi329046trial.hanatrial.ondemand.com/EventsSpyUI/services/EventInvites.xsjs?acmd=rejectEventInvite&eventId=" + eventId +"&userid=" + userid;
                    			$.ajax({
                                        url: query6,
                                        type: "GET",
                					    datatype: 'json',
                                        async: false,
                                        success: function(oData) {
                                            console.log("Accept success");
                                           //Ajax call 2 to get the events invites list
                                            var LOBId = userDataModel.getData().LOBId;
                                            this.getView().setModel(oModelEventInvites, "EventInvitesModel");
                                            var query = "https://hanadbi329046trial.hanatrial.ondemand.com/EventsSpyUI/services/EventInvites.xsjs?acmd=listMyEventsInvites";
                                             $.ajax({
                                                url: query,
                                                type: "GET",
                                                data:{
                                                    LOBId : LOBId
                                                },
                        					    datatype: 'json',
                                                async: false,
                                                success: function(oData1) {
                                                    var data = $.parseJSON(oData1);   
                                                    oModelEventInvites.setData(data);
                                                    console.log("EventInvitesModel:");
                                                    console.log(data);
                                                    //view.setModel(oModelEventInvites);
                                                }
                                            });
                        }
					});
            }
    });
});