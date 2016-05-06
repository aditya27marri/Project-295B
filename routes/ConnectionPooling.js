/**
 * New node file
 */
//Connection pooling module. Uses a simple queue for maintaining a pool of connections.
var mysql = require('mysql');
var connectionPool = [];
var count=0;

function connect()
{
	var connection =  mysql.createConnection({
	  	host:'project.chvlrqabivvo.us-west-2.rds.amazonaws.com',
	  	port:'3306',
	  	user:'root',
	  	password:'12345678',
	  	database:'project'	
	});

	connection.connect();

	return connection;
}

function setPool(numOfConn)
{
	count=numOfConn;
	for (var i = 0; i < numOfConn; i++)
	{
		connectionPool.push(connect());
	}
}

function getConnection()
{
	if(connectionPool.length >=1 )
	{
		return connectionPool.pop();
	}
}

function returnConnection(connection)
{
	
	
	connectionPool.push(connection);
	
}

exports.setPool = setPool;
exports.getConnection = getConnection;
exports.returnConnection = returnConnection;