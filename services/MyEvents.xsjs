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

// To get the list of all the LOBs present non redundant.
function getLOBList(){
    var txlist = {
		results: []
	};
    var connection = $.db.getConnection();
    var statement = null;
    var resultSet = null;
    var getListQuery = 'SELECT \"TEAM_INFO\".\"LOB\" FROM \"HANA_SCHEMA\".\"TEAM_INFO\" AS \"TEAM_INFO\";';
    try {
		statement = connection.prepareStatement(getListQuery);
		resultSet = statement.executeQuery();
		connection.commit();
		var logonStatus = resultSet.next();
		if(logonStatus){
        	do{
        		 var record = {};
        		 record.LOB = resultSet.getString(1);
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
    var connection = $.db.getConnection();
    var statement = null;
    var resultSet = null;
    var resultSet1 = null;
    var eventId;
    var userid = $.request.parameters.get("userid");
    var title = $.request.parameters.get("title");
    var description = $.request.parameters.get("description");
    var lob = $.request.parameters.get("lob");
    var dataTime = $.request.parameters.get("dataTime");
    var capacity = $.request.parameters.get("capacity");
    var getEventIDQuery = 'SELECT COUNT(*) FROM \"HANA_SCHEMA\".\"CREATED_EVENTS\";';
    var getListQuery = 'INSERT INTO \"HANA_SCHEMA\".\"CREATED_EVENTS\" VALUES(?,?,?,NULL,?,?,?,0,0);';
    var userCreatedEventQuery = 'INSERT INTO \"HANA_SCHEMA\".\"USER_CREATED_EVENTS\" VALUES(?,?);';
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
        statement = connection.prepareStatement(getListQuery);
        statement.setString(1, eventId);
		statement.setString(2, title);
		statement.setString(3, description);
		statement.setString(4, lob);
		statement.setString(5, dataTime);
		statement.setString(6, capacity);
        resultSet = statement.executeUpdate();
        connection.commit();
        statement = connection.prepareStatement(userCreatedEventQuery);
        statement.setString(1, userid);
		statement.setString(2, eventId);
		resultSet1 = statement.executeUpdate();
        connection.commit();
    }
	finally {
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