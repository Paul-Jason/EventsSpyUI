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
    var getListQuery = 'SELECT * FROM \"EventsSpyUI.DbViews::AT_MY_CREATED_EVENTS\" AS \"EVENTS_USER\" WHERE \"EVENTS_USER\".\"USER_ID\" = ?;';
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
        		 record.TITLE = resultSet.getString(3);
        		 record.DESCRIPTION = resultSet.getString(4);
        		 record.FOR_LOB_ID = resultSet.getString(5);
        		 record.FOR_LOB = resultSet.getString(6);
        		 record.DATE_TIME = resultSet.getString(7);
        		 record.CAPACITY = resultSet.getString(8);
        		 record.CURRENT_WAITLIST = resultSet.getString(9);
        		 record.REGISTERED_NUMBER = resultSet.getString(10);
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

// To get the list of all the LOBs present non redundant.
function getLOBList(){
    var txlist = {
		results: []
	};
    var connection = $.db.getConnection();
    var statement = null;
    var resultSet = null;
    var getListQuery = 'SELECT * FROM \"ACME\".\"LOB_INFO\" AS \"LOB_INFO\";';
    try {
		statement = connection.prepareStatement(getListQuery);
		resultSet = statement.executeQuery();
		connection.commit();
		var logonStatus = resultSet.next();
		if(logonStatus){
        	do{
        		 var record = {};
        		 record.LOBId = resultSet.getString(1);
        		 record.LOB = resultSet.getString(2);
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

// To insert the new event created
function createEvent(){
    var txlist = {
		results: []
	};
    var connection = $.db.getConnection();
    var statement = null;
    var resultSet = null;
    var resultSet1 = null;
    var resultSet2 = null;
    var eventId;
    var userid = $.request.parameters.get("userid");
    var title = $.request.parameters.get("title");
    var description = $.request.parameters.get("description");
    var lobId = $.request.parameters.get("lobId");
         //var dataTime = $.request.parameters.get("dataTime");
    var capacity = $.request.parameters.get("capacity");
    var getEventIDQuery = 'SELECT COUNT(*) FROM \"ACME".\"CREATED_EVENTS\";';
    var insertEventQuery = 'INSERT INTO \"ACME\".\"CREATED_EVENTS\" VALUES(?,?,?,?,NULL,NULL,?,0,0);';
    var userCreatedEventQuery = 'INSERT INTO \"ACME\".\"USER_CREATED_EVENTS\" VALUES(?,?);';
    var usersInALOBQuery = 'SELECT \"USER_DATA\".\"USER_ID\" FROM \"EventsSpyUI.DbViews::AT_ENTIRE_USER_DATA\" AS \"USER_DATA\" WHERE \"USER_DATA\".\"LOB_ID\" = ?;';
    var inviteUsersQuery = 'INSERT INTO \"ACME\".\"USER_REGISTERED_EVENTS_WITH_STATUS\" VALUES(?,?,?);';
    try {
		statement = connection.prepareStatement(getEventIDQuery);
		resultSet = statement.executeQuery();
		connection.commit();
		var logonStatus = resultSet.next();
		if(logonStatus){
        	 eventId =  resultSet.getString(1);
        	 eventId = parseInt(eventId) + 1;
        	 eventId = eventId.toString();
        }
        statement = connection.prepareStatement(insertEventQuery);
        statement.setString(1, eventId);
		statement.setString(2, title);
		statement.setString(3, description);
		statement.setString(4, lobId);
		//statement.setString(5, dataTime);
		statement.setString(5, capacity);
        resultSet = statement.executeUpdate();
        connection.commit();
        statement = connection.prepareStatement(userCreatedEventQuery);
        statement.setString(1, userid);
		statement.setString(2, eventId);
		resultSet1 = statement.executeUpdate();
        connection.commit();
        
        statement = connection.prepareStatement(usersInALOBQuery);
        statement.setString(1, lobId);
        resultSet =  statement.executeQuery();
        connection.commit();
        if(resultSet.next()){
        	do{
        		 var record = {};
        		 record.UserId = resultSet.getString(1);
        		 txlist.results.push(record);
        		 statement = connection.prepareStatement(inviteUsersQuery);
        		 statement.setString(1, resultSet.getString(1));
        		 statement.setString(2, eventId);
        		 statement.setString(3, 'INVITED');
        		 resultSet2 = statement.executeUpdate();
                 connection.commit();
        	  }while(resultSet.next())
        	}
    }
	finally {
		statement.close();
		connection.close();
	}
	return JSON.stringify(txlist);
}

function deleteEvent(){
    var connection = $.db.getConnection();
    var statement = null;
    var resultSet = null;
    
    var eventId = $.request.parameters.get("eventId");
    var userid = $.request.parameters.get("userid");
    
    var deleteUserEventQuery = 'DELETE FROM \"ACME\".\"USER_CREATED_EVENTS\" AS \"USER_EVENTS\" WHERE \"USER_EVENTS\".\"USER_ID\"=? AND \"USER_EVENTS\".\"EVENT_ID\"=?;';
    var deleteEventQuery = 'DELETE FROM \"ACME\".\"CREATED_EVENTS\" AS \"USER_EVENTS\" WHERE \"USER_EVENTS\".\"EVENT_ID\"=?;';
    var deleteEventInviteQuery = 'DELETE FROM \"ACME\".\"USER_REGISTERED_EVENTS_WITH_STATUS\" AS \"USER_EVENTS\" WHERE \"USER_EVENTS\".\"USER_ID\"=? AND \"USER_EVENTS\".\"EVENT_ID\"=?;';
    try {
		statement = connection.prepareStatement(deleteUserEventQuery);
		statement.setString(1, userid);
		statement.setString(2, eventId);
		resultSet = statement.executeUpdate();
		connection.commit();
		statement = connection.prepareStatement(deleteEventQuery);
		statement.setString(1, eventId);
		resultSet = statement.executeUpdate();
		connection.commit();
		statement = connection.prepareStatement(deleteEventInviteQuery);
		statement.setString(1, userid);
		statement.setString(2, eventId);
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
			case "listMyEvents":
				$.response.setBody(getMyEvents().toString());
				break;
			case "listLOB":
			    $.response.setBody(getLOBList().toString());
				break;
			case "createEvent":
			    $.response.setBody(createEvent().toString());
				break;
			case "deleteEvent":
			    $.response.setBody(deleteEvent().toString());
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