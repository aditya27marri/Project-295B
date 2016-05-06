/**
 * New node file
 */
var mysql=require('mysql');
var dataPool=require('../routes/ConnectionPooling');

/*function connect()
{
	var connection =  mysql.createConnection({
	  	host:'localhost',
	  	port:'3306',
	  	user:'root',
	  	password:'password',
	  	database:'project'	
	});

	connection.connect();

	return connection;
}*/


function createUser(email,password,fullname,type)
{
	var connection = dataPool.getConnection();
	//var connection=connect();

	var query = "INSERT INTO user_details(email,password,fullname,details) VALUES('" + email + "','" +password + "','"  + fullname + "','"  + type + "')";
	console.log(query); 
	connection.query(query,function(err,results) {
		if (err) {
			console.log("ERROR: " + err.message);
		}
		console.log(results);
	});
	//connection.end();
	dataPool.returnConnection(connection);
}
function createTenant(address,people,details)
{
	var connection = dataPool.getConnection();
	//var connection=connect();

	var query = "INSERT INTO tenant_details(tenant_address,num_people,tenant_details) VALUES('" + address + "','" +people + "','"  + details +  "')";
	console.log(query); 
	connection.query(query,function(err,results) {
		if (err) {
			console.log("ERROR: " + err.message);
		}
		console.log(results);
	});
	//connection.end();
	dataPool.returnConnection(connection);
}

function validateEmailPassword(callback,email,password)
{
	var connection = dataPool.getConnection();
	//var connection=connect();
	var query = "SELECT * from user_details where email='" + email +  "'AND password='" + password + "'";
	console.log("query: "+query);
	connection.query(query,function(err,rows,fields){
		if (err) 
		{ 
			console.log("ERROR: " + err.message);
		}
		else
		{    
			if(rows.length!==0)
			{
				// Updating the last log in time
				/*var d=new Date();
				var curTime=d.toString();
				var query = "UPDATE userDetails SET time="+"'"+curTime+"'"+" WHERE email="+"'"+email+"'";
				connection.query(query,function(err){
						if (err) 
					{
						console.log("ERROR: " + err.message);
					}
					else
					{
						console.log("Log in Time updated");
					}

				});*/
				
				console.log("DATA : "+JSON.stringify(rows));
				callback(err, rows);
			}
			else
			{
				callback("Invalid Username", rows);
			}
		}

	});


	//connection.end();
	dataPool.returnConnection(connection);
	 
}

function validateSecurity(callback,name,ssn)
{
	var connection = dataPool.getConnection();
	//var connection=connect();
	var query = "SELECT * from forgotPassword where answer='" + name +  "'AND ssn='" + ssn + "'";
	connection.query(query,function(err,rows,fields){
		if (err) 
		{
			console.log("ERROR: " + err.message);
		}
		else
		{
			if(rows.length!==0)
			{
				console.log("DATA : "+JSON.stringify(rows));
				callback(err, rows);
			}
			else
			{
				callback("Invalid Username", rows);
			}
		}

	});
	//connection.end();
	dataPool.returnConnection(connection);
}


function updateSecurity(password,ssn)
{
	var connection = dataPool.getConnection();
	//var connection=connect();

	var securityQuestion="What is your mother maiden name ?";
	var query = "INSERT INTO forgotPassword(ssn,securityQuestion,answer) VALUES('" +ssn + "','"  + securityQuestion + "','" + password + "')";
	console.log(query); 
	connection.query(query,function(err,results) {
		if (err) {
			console.log("ERROR: " + err.message);
		}
		console.log(results);
	});
	//connection.end();
	dataPool.returnConnection(connection);
}

function updatePassword(password,ssn)
{
	var connection = dataPool.getConnection();
	//var connection=connect();
	var query = "UPDATE userDetails SET password="+"'"+password+"'"+" WHERE ssn="+"'"+ssn+"'";
	connection.query(query,function(err){
	if (err) 
	{
		console.log("ERROR: " + err.message);
	}
	else
	{
		console.log("Password Updated");
	}
	});
 }

function addProduct(callback,productType,category,quantity,brand,state,model,description,productName,imageName)
{
	var connection = dataPool.getConnection();
	//var connection=connect();
	var query = "INSERT INTO product(productType,category,quantity,brand,state,model,description,productName,imageName) VALUES('" + productType + "','" +category + "','"  + quantity + "','" + brand + "','" + state + "','" + model+"','" + description +"','" + productName+"','" + imageName + "')";
	connection.query(query,function(err,results){
		if (err) 
		{
			console.log("ERROR: " + err.message);
		}
		else
		{
			
			callback(err, results);
			
		}

	});
	//connection.end();
	dataPool.returnConnection(connection);
}

function getProductId(callback)
{
	var connection = dataPool.getConnection();
	//var connection=connect();
	var query = "SELECT LAST_INSERT_ID() as lastid FROM product";
	connection.query(query,function(err,rows,fields){
		if (err) 
		{
			console.log("ERROR: " + err.message);
		}
		else
		{
			if(rows.length!==0)
			{
				console.log("DATA : "+JSON.stringify(rows));
				callback(err, rows);
			}
			else
			{
				callback("Invalid product", rows);
			}
		}

	});
	//connection.end();
	dataPool.returnConnection(connection);
}

function addAuction(callback,sellerId,quantity,basePrice,productId,increment,category,endTime)
{
	var connection = dataPool.getConnection();
	//var connection=connect();
	var validity=1;
	var query = "INSERT INTO Auction(sellerId,quantity,basePrice,productId,increment,category,validity,endTime) VALUES('" + sellerId + "','" +quantity + "','"  + basePrice + "','" + productId + "','" + increment + "','" + category+"','" + validity +"','" + endTime+ "')";
	console.log(" Inside addAunction: "+query);
	connection.query(query,function(err,results){
		if (err) 
		{
			console.log("ERROR: " + err.message);
		}
		else
		{
			
			callback(err, results);
			
		}

	});
	//connection.end();
	dataPool.returnConnection(connection);
}		

function addSelling(callback,sellerId,quantity,price,productId)
{
	var connection = dataPool.getConnection();
	//var connection=connect();
	var validity=1;
	var query = "INSERT INTO Selling(sellerId,quantity,price,productId,validity) VALUES('" + sellerId + "','" +quantity + "','"  + price + "','" + productId + "','" + validity + "')";
	connection.query(query,function(err,results){
		if (err) 
		{
			console.log("ERROR: " + err.message);
		}
		else
		{
			
			console.log("Inside addSelling");			
			callback(err, results);
			
		}

	});
	//connection.end();
	dataPool.returnConnection(connection);
}		

function updateSellingHistory(callback,userId,product)
{
	var connection = dataPool.getConnection();
	//var connection=connect();
	var query = "INSERT INTO History(userId,itemsSold) VALUES('" + userId + "','" +product + "')";
	connection.query(query,function(err,results){
		if (err) 
		{
			console.log("ERROR: " + err.message);
		}
		else
		{
			
			callback(err, results);
			
		}

	});
	//connection.end();
	dataPool.returnConnection(connection);
}
exports.createUser = createUser;
exports.createTenant  = createTenant;
exports.validateEmailPassword=validateEmailPassword;
exports.validateSecurity=validateSecurity;
exports.updatePassword=updatePassword;
exports.updateSecurity=updateSecurity;
exports.addProduct=addProduct;
exports.getProductId=getProductId;
exports.addAuction=addAuction;
exports.addSelling=addSelling;
exports.updateSellingHistory=updateSellingHistory;
