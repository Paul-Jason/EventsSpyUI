sap.ui.define([], function(){
   "use strict";
    
    return {
        formatJSONDateTime: function(dateTime){
            if(dateTime) {
                        /\/(.+)\//.exec(dateTime);
                        return eval("new " + RegExp.$1);
                    }
        }
    };
});