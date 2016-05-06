
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , admin = require('./routes/admin')
  , http = require('http')
  , path = require('path')
  ,Lyric = require('lyric-node')
  ,dataObject = require('./routes/ConnectionPooling');

var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
dataObject.setPool(10);
app.use(express.cookieParser());
app.use(express.session({secret: 'Project'}));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
//app.get('/users', user.list);
app.get('/login', user.login);
app.get('/valid', user.valid);
app.post('/validateSignin', user.validate); 
app.post('/register', user.register);
app.get('/logout', user.logout);
app.get('/stats', user.stats);
app.get('/power', user.power);
app.get('/temp', user.temp);
app.get('/getDayStats',user.getDayStats);
app.get('/tempPreStats',user.tempPreStats);
app.get('/getMonthStats',user.getMonthStats);
app.get('/monthStats',user.MonthStats);
app.get('/peoStats',user.peoStats);
app.get('/forcastWeat',user.forcastWeat);
app.get('/monHumStats',user.monHumStats);
app.get('/threeWeaStats',user.threeWeaStats);
app.get('/preCost',user.createStats);
app.get('/addTenants', user.addTenant);
app.get('/home', user.home);
app.get('/layout', user.layout);
app.get('/viewProfile/:id', function(req,res){
	user.viewProfile(req,res,req.param('id'));
});
app.get('/viewUsers', admin.viewUsers);
app.get('/viewUsers', admin.viewUsers);
app.get('/viewTenants', admin.viewTenants);
app.get('/viewEmployees', admin.viewEmployees);
app.get('/deleteUser/:id',function(req,res){
	admin.deleteUser(req,res,req.param('id'));
});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
