/**
 * New node file
 */
var mysql=require("mysql");
var request = require('request');
var objectControl= require('../routes/ControlCenter');
var global_ssn;
var dataObject = require('../routes/ConnectionPooling');
var Lyric = require('lyric-node');

exports.login = function(req, res){
res.render('login');
};

exports.home = function(req, res){
	console.log(req.session.fullname);
	if(req.session.fullname===undefined){
		res.render('login');
	}else{
		if(req.session.details==='admin')
		{res.render('index',{fname:req.session.fullname,
			name:req.session.email,wthr :req.session.whr,id:req.session.uid});
		}else
			{res.render('index-tenant',{fname:req.session.fullname,
				name:req.session.email,wthr :req.session.whr,id:req.session.uid});
			}
		
	}
	};

exports.logout = function(req, res){
req.session.destroy();
res.redirect('/');

res.render('error',{ title:
	'Signed out !! ' ,message: 'Successfully Signed Out !',back:'index'});
};

exports.addTenant = function(req, res){
	if(req.session.details==='admin'){
		res.render('addTenant',{fname:req.session.fullname,id:req.session.uid});		
	}else{
		res.redirect('/viewTenants');
	}
};

exports.layout = function(req, res){
	res.render('layout',{fname:req.session.fullname,id:req.session.uid});
};

exports.stats = function(req, res){
	res.render('prestats',{fname:req.session.fullname,id:req.session.uid});
};
exports.power = function(req, res){
	res.render('stats',{fname:req.session.fullname,id:req.session.uid});
};
exports.temp = function(req, res){
	res.render('temp',{fname:req.session.fullname,id:req.session.uid});
};
	
exports.selling = function(req, res){
res.render('selling',{ title:
	'sell a product ',name:req.session.email,time:req.session.lastlogin});
};

exports.valid = function(req, res){
				res.render('home',{ title:
					'login' ,name:req.session.email,time:req.session.lastlogin});
	
};

		
exports.auction = function(req, res){
res.render('auction',{ title:
'Keep a product for auction',name:req.session.email,time:req.session.lastlogin});
};
exports.validate = function(req, res){
	var email=req.param('email');
	var password=req.param('password');
	email=(email+"");
	var len=email.length;
	console.log("len"+len);
	email=email.substring(0,len-1);
	var flag=0;
	{
		//checks for email id
		/*var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    if(!re.test(email))
	    	{
	    		flag=1;
	    	}*/
	    //one character minimum, one numeric minimum. Wordlenght 4-20
	    var re1= /^(?=.*\d)(?=.*[a-zA-Z]).{4,20}$/;
	    if(!re1.test(password))
    	{
    		flag=2;
    	}
	    
	}
	if(email===null || email==='' || flag===1)
	{
		res.render('error',{ title:
			'Unable to signin !! ' ,message: 'Please enter a valid email id',back:'login'});
	}
	else if(password===null || password==='' || flag===2)
	{
		console.log('Password is Missing');
		res.render('error',{ title:
			'Unable to signin !! ' ,message: 'Please enter a valid password',back:'login'});
	}
	else
	{ 
		objectControl.validateEmailPassword(function(err,results){
			if(err)
			{
				res.render('error',{ title:
					'Unable to signin !! ' ,message: 'In-correct Username or Password',back:'login'});
			}
			else
			{   var query ="http://api.openweathermap.org/data/2.5/weather?q=sanjose,us&APPID=f3b958356236d3aa04321ada7a2cd55d";
			    request(query, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					var wthr=JSON.parse(response.body);
					var tem=Math.round((9/5)*(wthr.main.temp - 273) + 32+10);
					req.session.email = results[0].username;
					req.session.fullname = results[0].fullname;
					req.session.details = results[0].details;
					req.session.whr = tem;
					var id = results[0].user_id;
					req.session.uid =id;
					console.log("json weather: "+wthr);
						res.redirect('/home');
						//res.render('index',{ title:
						//'login' ,name:email,fname:req.session.fullname,wthr:tem});
					
					}
			});
				//req.session.email = results[0].username;
				/*req.session.firstname = results[0].firstname;
				req.session.lastname = results[0].lastname;
				req.session.lastlogin = new Date();
				req.session.ssn = results[0].ssn;
				console.log(req.session.email);*/
				
			}
		},email ,password);
	}
};

exports.viewProfile = function(req,res,id)
{	
var connection = dataObject.getConnection();
//var connection=connect();
var query = "SELECT * from user_details where user_id='"+id+"'";
console.log("select from user_details: "+query);
connection.query(query,function(err,rows){
	if(err){
		throw err;
		console.log(err);
	}
	else{
		console.log("user profile.");
		res.render('viewProfile',{ title:
			'view profile' ,rows:rows,fname:req.session.fullname,id:req.session.uid},
			function(err, result) {
		        // render on success
		        if (!err) {
		            res.end(result);
		        }
		        // render or error
		        else {
		            res.end('An error occurred');
		            console.log(err);
		        }
		    });
	}

});
dataObject.returnConnection(connection);
}
exports.register = function(req, res){
	var fullname=req.param('fname');
	var email=req.param('email');
	var password=req.param('password');
	var address=req.param('address');
	var people=req.param('people');
	var details=req.param('details');
	var type=req.param('type');
	
	
		var time=new Date();
		console.log(" Inside Register");
		objectControl.createUser(email,password,fullname,type);
		if(type==="tenant"){
			objectControl.createTenant(address,people,details);	
		}
		res.render('error',{ title:
			 'SuccessFully added User!! ' ,message: 'SuccessFully added User',back:'addTenants'});
	
};
exports.getDayStats=function(req, res){
	var connection = dataObject.getConnection();
	//var connection=connect();
	console.log("getDayStats");
	var d = new Date();
	var a=[];
	var query = "SELECT date, SUM(cost) as price  FROM `electricity` GROUP BY DAY(Date), month(Date) order by date;";

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
				for(var i in rows){
					d= rows[i].date;
					rows[i].date= d.getTime();
					if(req.session.details==='admin'){
						rows[i].price=rows[i].price*12;
					}
					 a[i]=[rows[i].date , rows[i].price];
	             //   data= JSON.parse(a[i]);
				}
				//console.log("DATA : "+JSON.stringify(data));
				console.log("a : "+JSON.stringify(a));
				res.send(a);
				
			}
			else
			{
				console.log("error data : "+JSON.stringify(rows));
			}
		}

	});
	dataObject.returnConnection(connection);
	
};

exports.getMonthStats=function(req, res){
	var connection = dataObject.getConnection();
	//var connection=connect();
	console.log("getMonthStats");
	var d = new Date();
	var a=[];
	var query = "SELECT MONTHNAME(Date) as month, SUM(kwatts) as tusage FROM `electricity` GROUP BY MONTH(Date)";

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
				for(var i in rows){
					if(req.session.details==='admin'){
						rows[i].tusage=rows[i].tusage*12;
					}
			  a[i]= rows[i].tusage; 
			  
				} 
				console.log("data : "+JSON.stringify(a));
				res.send(a);
			}
			else
			{
				console.log("error data : "+JSON.stringify(rows));
			}
		}

	});
	dataObject.returnConnection(connection);
	
};

exports.monHumStats=function(req, res){
	var connection = dataObject.getConnection();
	//var connection=connect();
	console.log("monHumStats");
	var d = new Date();
	var a=[];
	var query = "SELECT monthname(date) as month, avg(temp_in) as temp_in, avg(temp_out) as temp_out  FROM `weather` GROUP BY  month(Date) order by date";

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
				
				console.log("data : "+JSON.stringify(rows));
				res.send(rows);
			}
			else
			{
				console.log("error data : "+JSON.stringify(rows));
			}
		}

	});
	dataObject.returnConnection(connection);
	
};

exports.peoStats=function(req, res){
	var connection = dataObject.getConnection();
	//var connection=connect();
	console.log("peoStats");
	var query = "SELECT MONTHNAME(Date) as month, SUM(kwatts) as tusage,avg(people) as people  FROM `electricity` GROUP BY MONTH(Date), people order by date";

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
				
				console.log("data : "+JSON.stringify(rows));
				res.send(rows);
			}
			else
			{
				console.log("error data : "+JSON.stringify(rows));
			}
		}

	});
	dataObject.returnConnection(connection);
	
};


exports.threeWeaStats=function(req, res){
	var connection = dataObject.getConnection();
	//var connection=connect();
	console.log("threeWeaStats");
	var d = new Date();
	var a=[];
	var query = "SELECT monthname(date) as month, avg(temp_out) as temp_out,avg(humid_out) as humid_out  FROM `weather` GROUP BY  month(Date) order by date";

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
				
				console.log("data : "+JSON.stringify(rows));
				res.send(rows);
			}
			else
			{
				console.log("error data : "+JSON.stringify(rows));
			}
		}

	});
	dataObject.returnConnection(connection);
	
};

exports.renewPassword=function(req, res){
	var name=req.param('name');
	var ssn=req.param('ssn');
	req.session.ssn=ssn;
	var flag=0;
	var re= /([a-zA-Z]).{1,35}$/;
    if(!re.test(name))
	{
		flag=1;
	}
    
    if(flag===1)
	{
		console.log('Invalid Name ');
		res.render('error',{ title:
			 'Unable to add security answer !! ' ,message: 'Invalid Name',back:'security'});
	}
	else
	{
		console.log(" Inside Validation of Security Quesion");
		objectControl.validateSecurity(function(err,results){
			if(err)
			{
				res.render('error',{ title:
					'Unable to Reset Password !! ' ,message: 'Incorrect Answer'});
			}
			else
			{
				res.render('updatePassword');
			}
		},name,req.session.ssn);
		
	}
	
};

exports.createStats=function(req, res){
	var connection = dataObject.getConnection();
	//var connection=connect();
	console.log("createStats");
	var d = new Date();
	var fd = new Date();
	var a=[];
	var query = "SELECT sum(kwatts) as usg,date, SUM(cost) as price  FROM `electricity` GROUP BY DAY(Date), month(Date) order by date";

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
				var input = new Array();
				input['x'] = new Array();	input['y'] = new Array();
				var estimationInput = new Array();
				estimationInput['x'] = new Array();
				estimationInput['y'] = new Array();
				for(var i in rows) {
						d= rows[i].date;
					rows[i].date= d.getTime();
					var dt=d.getUTCFullYear();
					var s='-';
					var dm=JSON.stringify(d.getUTCMonth());
					if(dm.length===1){
						 dm ='0'+d.getUTCMonth();
					}
					if(dm==='00'){
						dm='12';
					}
					input['x'][i]=dt+s+dm+s+d.getUTCDate();
					//input['x'][i]=rows[i].usg;
					if(dm!=='12'){
						dt=dt+1;	
					}
					
					estimationInput['x'][i]=dt+s+dm+s+d.getUTCDate();
					//estimationInput['x'][i]=rows[i].usg+1;
					if(req.session.details==='admin'){
						rows[i].price=rows[i].price*12;
					}
					 input['y'][i]=rows[i].price;
					//   data= JSON.parse(a[i]);
				}
				console.log('input '+input['x']);
				console.log('input '+input['y']);
				console.log('estimationInput '+estimationInput['x']);
				var ordinalInput = Lyric.ordinalize(input);
				console.log('ordinalInput x '+ordinalInput['x']);
				var estInput = Lyric.ordinalize(estimationInput);
				console.log('estInput '+estInput['x']);
				var estimateData = Lyric.applyModel( estInput, Lyric.buildModel(ordinalInput));
				//var estimateData = Lyric.applyModel(estimationInput, Lyric.buildModel(input));
				console.log("DATA : "+JSON.stringify(estimateData));
				console.log("DATA : "+JSON.stringify(estimateData[0].x));
				
				for(i in estimateData){
					d= new Date(estimateData[i].x);
					 fd= d.getTime();
					 a[i]=[fd,estimateData[i].y,rows[i].price]
				}
				console.log("A :"+a);
				res.send(a);
			}
			else
			{
				console.log("error data : "+JSON.stringify(rows));
			}
		}

	});
	dataObject.returnConnection(connection);
	
};

exports.peopreStats=function(req, res){
	var connection = dataObject.getConnection();
	//var connection=connect();
	console.log("peopreStats");
	var query = "SELECT MONTHNAME(Date) as month, sum(kwatts) as tusage,sum(cost) as price,avg(people) as people  FROM `electricity` GROUP BY day(Date), people order by date";

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
				var input = new Array();
				input['x'] = new Array();	input['y'] = new Array();
				var estimationInput = new Array();
				estimationInput['x'] = new Array();
				estimationInput['y'] = new Array();
				for(var i in rows) {
					input['x'][i]=rows[i].tusage;
					input['y'][i]=rows[i].price;
				}
				k=0;
				for(var i in rows) {
					estimationInput['x'][i]=rows[i].tusage+0.29;
					k++;
					if(k>5){
						k=0;
					}
				}
				var estimateData = Lyric.applyModel(estimationInput, Lyric.buildModel(input));
				console.log("rows : "+JSON.stringify(rows));
				console.log("data : "+JSON.stringify(estimateData));
				res.send(estimateData);
			}
			else
			{
				console.log("error data : "+JSON.stringify(rows));
			}
		}

	});
	dataObject.returnConnection(connection);
	
};

exports.MonthStats=function(req, res){
	var connection = dataObject.getConnection();
	//var connection=connect();
	console.log("MonthStats");
	var d = new Date();
	var a=[];
	var query = "SELECT MONTHNAME(Date) as month, SUM(kwatts) as tusage FROM `electricity` GROUP BY MONTH(Date)";

	console.log("query: "+query);
	connection.query(query,function(err,rows,fields){
		if (err) 
		{ 
			console.log("ERROR: " + err.message);
		}
		else
		{    
			if(rows.length!==0)
			{var input = new Array();
			input['x'] = new Array();	input['y'] = new Array();
			var estimationInput = new Array();
			estimationInput['x'] = new Array();
			estimationInput['y'] = new Array();
			for(var i in rows) {
			     a[i]= rows[i].tusage; 
			     input['x'][i] =i;
			     if(req.session.details==='admin'){
						rows[i].tusage=rows[i].tusage*12;
					}
			     input['y'][i] =rows[i].tusage;
			     estimationInput['x'][i] = i;
				} 
			var estimateData = Lyric.applyModel(estimationInput, Lyric.buildModel(input));
				console.log("data : "+estimateData);
				for(i in estimateData){
				a[i]=estimateData[i].y;
				}
				res.send(a);
			}
			else
			{
				console.log("error data : "+JSON.stringify(rows));
			}
		}

	});
	dataObject.returnConnection(connection);
	
};

exports.tempPreStats=function(req, res){
	var connection = dataObject.getConnection();
	//var connection=connect();
	console.log("tempPreStats");
	var d = new Date();
	var a=[];
	var query = "SELECT temp_out,Humid_out, sum(kwatts) as usg,sum(cost) as price FROM project.weather as w inner join project.electricity as e where e.Date =w.Date  GROUP BY day(e.Date),month(e.Date)";

	console.log("query: "+query);
	connection.query(query,function(err,rows,fields){
		if (err) 
		{ 
			console.log("ERROR: " + err.message);
		}
		else
		{var query ="http://api.openweathermap.org/data/2.5/forecast/daily?q=sanjose,us&cnt={7}&APPID=f3b958356236d3aa04321ada7a2cd55d";
	    request(query, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				var wthr=JSON.parse(response.body);
				 console.log("weathr"+JSON.stringify(wthr));
			if(rows.length!==0) {
				var input = new Array();
			input['x'] = new Array();	input['y'] = new Array();
			var estimationInput = new Array();
			estimationInput['x'] = new Array();
			estimationInput['y'] = new Array();
			for(var i in rows) {
			     input['x'][i] =rows[i].temp_out;
			     if(req.session.details==='admin'){
						rows[i].usg=rows[i].usg*12;
					}
			     input['y'][i] =rows[i].usg;
			     for(j=0;j<7;j++){
			    	 estimationInput['x'][j] = Math.round((9/5)*(wthr.list[j].temp.max - 273) + 32+10);
                   }
				} 
			var estimateData = Lyric.applyModel(estimationInput, Lyric.buildModel(input));
				console.log("data : "+estimateData);
				for(i in estimateData){
				a[i]=estimateData[i].y;
				}
				res.send(a);
			}
			else
			{
				console.log("error data : "+JSON.stringify(rows));
			}
			}
	      });
		}

	});
	dataObject.returnConnection(connection);
	
};
exports.forcastWeat=function(req, res){
	var connection = dataObject.getConnection();
	//var connection=connect();
	console.log("threeWeaStats");
	var d = new Date();
	var a=[];
	var query = "http://api.openweathermap.org/data/2.5/forecast/daily?q=sanjose,us&cnt={7}&APPID=f3b958356236d3aa04321ada7a2cd55d";

	console.log("query: "+query);
	 request(query, function (error, response, body) {
		 if (!error && response.statusCode === 200) {
				var rows=JSON.parse(response.body);
				 console.log("weathr"+JSON.stringify(rows));
			if(rows.length!==0) {
				res.send(rows);
			}
			else
			{
				console.log("error data : "+JSON.stringify(rows));
			}
		}

	});
	dataObject.returnConnection(connection);
	
};
exports.resetPwd = function(req, res){
	var password=req.param('password');
	var confirm_password=req.param('confirm_password');
	var flag=0;
	{
		var re1= /^(?=.*\d)(?=.*[a-zA-Z]).{4,20}$/;
	    if(!re1.test(password))
    	{
    		flag=1;
    	}
		if(password!==confirm_password)
		{
			flag=2;
		}
	}
	if(password===null || password==='' || flag===1)
	{
		console.log('Password is incorrect');
		res.render('error',{ title:
			'Unable to Change password !! ' ,message: 'Please enter a valid password',back:'resetPassword'});
	}
	else if(flag===2)
	{
		console.log('Passwords dont match');
		res.render('error',{ title:
			'Unable to Change Password !! ' ,message: 'Passwords should match',back:'resetPassword'});
	}
	else
	{
		objectControl.updatePassword(password,req.session.ssn);
		res.render('login');
	}
};
exports.error = function(req, res){
	res.render('error',{ title:
		email ,message: 'ok',back:'signup'});
};
