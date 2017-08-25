sap.ui.define([
               "jquery.sap.global",
               "sap/ui/core/mvc/Controller",
               "sap/ui/model/json/JSONModel"],
            function(jQuery, Controller, JSONModel){
					"use strict";
                    
    
					Controller.extend("eventsspy.indexroot.controller.LoginScreen",{
							
                        onInit: function() {
                                                    	    
                        },
                                                
                        //to login into the system using username and password
                        onPressLogin: function(oEvent){
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			                oRouter.navTo("homeScreen");
                        }
					});
});