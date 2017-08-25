sap.ui.define([
               "jquery.sap.global",
               "sap/ui/core/mvc/Controller",
               "sap/ui/model/json/JSONModel"],
            function(jQuery, Controller, JSONModel){
					"use strict";
                    
    
					Controller.extend("eventsspy.indexroot.controller.CreateEventScreen",{
							
                        onInit: function() {
                                                    	    
                        },
                        goBackToHome: function(){
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            oRouter.navTo("homeScreen");
                        }
					});
});