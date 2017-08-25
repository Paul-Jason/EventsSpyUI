sap.ui.define([
               "jquery.sap.global",
               "sap/ui/core/mvc/Controller",
               "sap/ui/model/json/JSONModel"],
            function(jQuery, Controller, JSONModel){
					"use strict";
                    
                    var oModelLogin = new JSONModel();
                    
					Controller.extend("eventsspy.indexroot.controller.LoginScreen",{
							
                        onInit: function() {
                                                    	    
                        },
                                                
                        //to login into the system using username and password
                        onPressLogin: function(oEvent){
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            var that = this;
				            var username = this.getView().byId("iusername").getValue();
				            var password = this.getView().byId("ipassword").getValue();
				            var uid;
				            var query1 ="https://hanai329046trial.hanatrial.ondemand.com/EventsSpyUI/services/Login.xsjs?acmd=validate";
                            
            			    $.ajax({
            					url: query1,
            					type: "GET",
            					data: {
            					    username: username,
            					    password: password
            					},
            					datatype: 'json',
            					async: false,
            					success: function(oData) {
            					    var data = $.parseJSON(oData);   
            						console.log("response for authenticate user : ");
            						console.log(data);
            						if(data.results.length !== 0){
            						    uid = data.results[0].UserId;
            						    oRouter.navTo("homeScreen");
            						}
            					}
            				});
            				var userData = {
                					username: username,
                					uid: uid
                				};
                			console.log("userData");
                            console.log(userData);
            				oModelLogin.setData(userData);
            				sap.ui.getCore().setModel(oModelLogin, "loggedInUserData");
			                
			                
                        }
					});
});