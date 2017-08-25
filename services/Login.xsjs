$.response.contentType = "application/text";

//To perform the login of the user and return the user id which is used to display the items according to the user.
function authenticateUser(){
    var txlist = {
		results: []
	};
    var username = $.request.parameters.get("username");
    var password = $.request.parameters.get("password");
    var connection = $.db.getConnection();
    var statement = null;
    var resultSet = null;
    var validateQuery = 'SELECT * FROM \"HANA_SCHEMA\".\"EVENTS_USER\" AS \"EVENTS_USER\" WHERE \"EVENTS_USER\".\"USERNAME\" = ? AND \"EVENTS_USER\".\"PASSWORD\" = ?;';
    try {
		statement = connection.prepareStatement(validateQuery);
		statement.setString(1, username);
		statement.setString(2, password);
		resultSet = statement.executeQuery();
		connection.commit();
		var logonStatus = resultSet.next();
		if(logonStatus){
        	do{
        		 var record = {};
        		 record.UserId = resultSet.getString(1);
        		 record.UserName = resultSet.getString(2);
        		 txlist.results.push(record);
        	  }while(resultSet.next())
        	}
    }
	finally {
		statement.close();
		connection.close();
	}
	return JSON.stringify(txlist);
}

var acmd = $.request.parameters.get('acmd');

function doGet() {
	try {
		$.response.contentType = "application/json";
		$.response.contentType = "text/plain";
		switch (acmd) {
			case "validate":
				$.response.setBody(authenticateUser().toString());
				break;
			default:
				$.response.status = $.net.http.BAD_REQUEST;
				$.response.setBody('Invalid Command');
		}
	} catch (err) {
		$.response.contentType = "text/plain";
		$.response.setBody("Error while executing query: [" + err.message + "]");
		$.response.returnCode = 200;
	}
}

doGet();