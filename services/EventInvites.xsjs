$.response.contentType = "application/text";

//To perform the login of the user and return the user id which is used to display the items according to the user.
function getMyEventInvites(){
    var txlist = {
		results: []
	};
    var LOBId = $.request.parameters.get("LOBId");
    var connection = $.db.getConnection();
    var statement = null;
    var resultSet = null;
    var getInvitesListQuery = 'SELECT * FROM \"EventsSpyUI.DbViews::AT_MY_REGISTERED_EVENTS\" AS \"EVENTS_INVITES\" WHERE \"EVENTS_INVITES\".\"FOR_LOB_ID\"=? AND \"EVENTS_INVITES\".\"STATUS\"=?;';
    //var updateInvitesDoneQuery = 'UPDATE \"ACME::AT_MY_REGISTERED_EVENTS\" AS \"EVENTS_INVITES\" SET \"EVENTS_INVITES\".\"STATUS\"=? WHERE \"CREATED_EVENTS\".\"FOR_LOBId\"=?;';
    try {
		statement = connection.prepareStatement(getInvitesListQuery);
		statement.setString(1, LOBId);
		statement.setString(2, 'INVITED');
		resultSet = statement.executeQuery();
		connection.commit();
		var logonStatus = resultSet.next();
		if(logonStatus){
        	do{
        		 var record = {};
        		 record.EVENT_ID = resultSet.getString(2);
        		 record.TITLE = resultSet.getString(3);
        		 record.DESCRIPTION = resultSet.getString(4);
        		 record.LOB_ID = resultSet.getString(6);
        		 //lob = resultSet.getString(5);
        		 record.DATE_TIME = resultSet.getString(7);
        		 record.CAPACITY = resultSet.getString(8);
        		 record.CURRENT_WAITLIST = resultSet.getString(9);
        		 record.REGISTERED_NUMBER = resultSet.getString(10);
        		 record.FOR_LOB = resultSet.getString(5);
        		 txlist.results.push(record);
        	  }while(resultSet.next())
        	}
//         statement = connection.prepareStatement(updateInvitesDoneQuery);
//         statement.setString(1, 'INVITED');
//         statement.setString(1, LOBId);
// 		var resultSet1 = statement.executeUpdate();
// 		connection.commit();
    }
	finally {
		statement.close();
		connection.close();
	}
	return JSON.stringify(txlist);
}

function acceptEventInvite(){
    var connection = $.db.getConnection();
    var statement = null;
    var resultSet = null;
    
    var eventId = $.request.parameters.get("eventId");
    var userid = $.request.parameters.get("userid");
    
    var updateEventInviteQuery = 'UPDATE \"ACME\".\"USER_REGISTERED_EVENTS_WITH_STATUS\" as \"EVENT_INVITES\" SET \"EVENT_INVITES\".\"STATUS\" = ? WHERE \"EVENT_INVITES\".\"USER_ID\" = ? AND \"EVENT_INVITES\".\"EVENT_ID\"= ?;';
    
    try {
		statement = connection.prepareStatement(updateEventInviteQuery);
		statement.setString(1, 'ACCEPTED');
		statement.setString(2, userid);
		statement.setString(3, eventId);
		resultSet = statement.executeUpdate();
		connection.commit();
	} finally {
		statement.close();
		connection.close();
	}
	return JSON.stringify(resultSet);
}

function rejectEventInvite(){
    var connection = $.db.getConnection();
    var statement = null;
    var resultSet = null;
    
    var eventId = $.request.parameters.get("eventId");
    var userid = $.request.parameters.get("userid");
    
    var updateEventInviteQuery = 'UPDATE \"ACME\".\"USER_REGISTERED_EVENTS_WITH_STATUS\" as \"EVENT_INVITES\" SET \"EVENT_INVITES\".\"STATUS\" = ? WHERE \"EVENT_INVITES\".\"USER_ID\" = ? AND \"EVENT_INVITES\".\"EVENT_ID\"= ?;';
    
    try {
		statement = connection.prepareStatement(updateEventInviteQuery);
		statement.setString(1, 'REJECTED');
		statement.setString(2, userid);
		statement.setString(3, eventId);
		resultSet = statement.executeUpdate();
		connection.commit();
	} finally {
		statement.close();
		connection.close();
	}
	return JSON.stringify(resultSet);
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
			case "acceptEventInvite":
				$.response.setBody(acceptEventInvite().toString());
				break;
			case "rejectEventInvite":
				$.response.setBody(rejectEventInvite().toString());
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