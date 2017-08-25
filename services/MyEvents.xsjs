$.response.contentType = "application/text";

//To perform the login of the user and return the user id which is used to display the items according to the user.
function getMyEvents(){
    var txlist = {
		results: []
	};
    var userid = $.request.parameters.get("userid");
    var connection = $.db.getConnection();
    var statement = null;
    var resultSet = null;
    var getListQuery = 'SELECT * FROM \"HanaSchema::AT_USER_CREATED_EVENTS\" AS \"EVENTS_USER\" WHERE \"EVENTS_USER\".\"USER_ID\" = ?;';
    try {
		statement = connection.prepareStatement(getListQuery);
		statement.setString(1, userid);
		resultSet = statement.executeQuery();
		connection.commit();
		var logonStatus = resultSet.next();
		if(logonStatus){
        	do{
        		 var record = {};
        		 record.USER_ID = resultSet.getString(1);
        		 record.EVENT_ID = resultSet.getString(2);
        		 record.TITLE = resultSet.getString(4);
        		 record.DESCRIPTION = resultSet.getString(5);
        		 record.FOR_LOB = resultSet.getString(7);
        		 record.DATE_TIME = resultSet.getString(8);
        		 record.CAPACITY = resultSet.getString(9);
        		 record.CURRENT_WAITLIST = resultSet.getString(10);
        		 record.REGISTERED_NUMBER = resultSet.getString(11);
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
			case "listMyEvents":
				$.response.setBody(getMyEvents().toString());
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