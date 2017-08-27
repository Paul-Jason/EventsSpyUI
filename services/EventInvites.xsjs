$.response.contentType = "application/text";

//To perform the login of the user and return the user id which is used to display the items according to the user.
function getMyEventInvites(){
    var txlist = {
		results: []
	};
    var TeamId = $.request.parameters.get("TeamId");
    var connection = $.db.getConnection();
    var lob;
    var statement = null;
    var resultSet = null;
    var getInvitesListQuery = 'SELECT * FROM \"HanaSchema::AT_EVENTS_LOB_ID\" AS \"CREATED_EVENTS\" WHERE \"CREATED_EVENTS\".\"TEAM_ID\"=? AND "CREATED_EVENTS"."INVITED"=0;';
    var updateInvitesDoneQuery = 'UPDATE \"HANA_SCHEMA\".\"CREATED_EVENTS\" AS \"CREATED_EVENTS\" SET \"CREATED_EVENTS\".\"INVITED\"=1 WHERE \"CREATED_EVENTS\".\"FOR_LOB\"=?;';
    try {
		statement = connection.prepareStatement(getInvitesListQuery);
		statement.setString(1, TeamId);
		resultSet = statement.executeQuery();
		connection.commit();
		var logonStatus = resultSet.next();
		if(logonStatus){
        	do{
        		 var record = {};
        		 record.EVENT_ID = resultSet.getString(1);
        		 record.TITLE = resultSet.getString(2);
        		 record.DESCRIPTION = resultSet.getString(3);
        		 record.FOR_LOB = resultSet.getString(5);
        		 lob = resultSet.getString(5);
        		 record.DATE_TIME = resultSet.getString(6);
        		 record.CAPACITY = resultSet.getString(7);
        		 record.CURRENT_WAITLIST = resultSet.getString(8);
        		 record.REGISTERED_NUMBER = resultSet.getString(9);
        		 record.TEAM_ID = resultSet.getString(11);
        		 record.LOB = resultSet.getString(12);
        		 txlist.results.push(record);
        	  }while(resultSet.next())
        	}
//         statement = connection.prepareStatement(updateInvitesDoneQuery);
//         statement.setString(1, lob);
// 		var resultSet1 = statement.executeUpdate();
// 		connection.commit();
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
			case "listMyEventsInvites":
				$.response.setBody(getMyEventInvites().toString());
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