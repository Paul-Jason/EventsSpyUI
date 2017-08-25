sap.ui.define([
    "sap/ui/core/UIComponent"
], function(UIComponent){
    "use strict";
    
    return UIComponent.extend("eventsspy.indexroot.Component",{
       
        metadata: {
            manifest : "json"
        },
        
        init: function(){
			UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();
			// additional initialization can be done here
            // used only for this lessons to show the request individually...
			//this.getModel().setUseBatch(false);


        }
        
    });
});