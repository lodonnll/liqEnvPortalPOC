const http = require('http');
const express = require('express');
const morgan = require('morgan');
const webServerConfig = require('../config/web-server.js');
const database = require('./database.js');
const router = require('./router.js');
//--------
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var path  = require('path');

let httpServer;
process.env.ORA_SDTZ = 'UTC';
const defaultThreadPoolSize = 4;
// Increase thread pool size by poolMax
//process.env.UV_THREADPOOL_SIZE = dbConfig.hrPool.poolMax + defaultThreadPoolSize;

//dummy data
 let liqbranches = [{BRN_CDE_BRANCH : 'B1' , BRN_DSC_BRANCH : 'Branch one'},
                {BRN_CDE_BRANCH : 'B2' , BRN_DSC_BRANCH : 'Branch Two'},
				{BRN_CDE_BRANCH : 'B3' , BRN_DSC_BRANCH : 'Branch Three'}
			   ]
			   
 let environments = [{ENV_NME_VAR_CLASS : 'C1' , ENV_NME_VAR_NAME : 'Env 1', ENV_TXT_VAR_VALUE : 'VAL 1' , ENV_TXT_COMMENT : 'CMT1'},
                {ENV_NME_VAR_CLASS : 'C2' , ENV_NME_VAR_NAME : 'Env 2', ENV_TXT_VAR_VALUE : 'VAL 2' , ENV_TXT_COMMENT : 'CMT2'}
			   ]

 let liqusers = [{pwd_chr_login_id : 'P1' , UPT_CDE_BRANCH : 'P11', JBF_DSC_JOB_FUNC : 'P111' },
                {pwd_chr_login_id : 'P2' , UPT_CDE_BRANCH : 'P22', JBF_DSC_JOB_FUNC : 'P222' }
			   ]			   
			   
function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();
	
	//-------------
	//View Engine
	app.set('view engine','ejs');
	app.set('views',path.join(__dirname,'../views'));

	//Body Parser Middleware
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended : false}))
	//set static path
	app.use(express.static(path.join(__dirname,'public')));
	//route request to home page of app, and callback function (unnamed)
	// express validator middleware
	app.use(expressValidator()); 

	//Global Vars defined in here
	app.use(function(req,res,next){
		res.locals.errors = null; //a global var
		res.locals.liqbranches = null; //a global var
		res.locals.environments = null; //a global var
		res.locals.liqusers = null; //a global var
		next();
	});
	//----------------
	
    httpServer = http.createServer(app);

    // Combines logging info from request and response
    app.use(morgan('combined'));
	
	// Parse incoming JSON requests and revive JSON.
    app.use(express.json({
      reviver: reviveJson
    }));

	// Mount the router at /api so all its routes start with /api
    //app.use('/api', router);
	app.use('/', router);

    /*app.get('/', async (req, res) => {
      const result = await database.simpleExecute('select user, systimestamp from dual');
	  console.log(result.rows[0].SYSTIMESTAMP);
      const user = result.rows[0].USER;
      const date = result.rows[0].SYSTIMESTAMP;

      res.end(`DB user: ${user}\nDate: ${date}`); //Template literals are string literals allowing embedded expressions
    });*/
	
	app.get('/', 
	async function(req,res){
	//res.send('Hello CS Loan IQ');
	//res.json(person);
	var result = await database.simpleExecute('SELECT BRN_CDE_BRANCH , BRN_DSC_BRANCH FROM VLS_BRANCH');
	liqbranches = result.rows;
	result = null;
	
	//more useful info...SQL finds all active unlocked logins with password 'password'
	var sql = 'select PWD_CHR_LOGIN_ID "PWD_CHR_LOGIN_ID" ,upr.UPT_CDE_BRANCH "UPT_CDE_BRANCH" , jbf.JBF_DSC_JOB_FUNC \
                                           from vls_password_mgr pwd, vls_user_profile upr left join vls_job_function jbf ON upr.UPT_CDE_JOB_FUNC = jbf.JBF_CDE_JOB_FUNC \
                                          where UPT_UID_USERID = PWD_CHR_LOGIN_ID \
                                          AND pwd_ind_nvr_expire = \'Y\' and PWD_IND_LOCKED = \'N\' \
                                          and pwd_txt_password = \'33105D42695A19941B1E2124272A2D30\' order by pwd_tsp_rec_update desc';
	result = await database.simpleExecute(sql);
	liqusers = result.rows;

	result = await database.simpleExecute('SELECT ENV_NME_VAR_CLASS , ENV_NME_VAR_NAME , ENV_TXT_VAR_VALUE , ENV_TXT_COMMENT FROM VLS_ENVIRONMENT where  ENV_NME_VAR_CLASS LIKE \'ZONE%\' AND ENV_NME_VAR_NAME LIKE \'%Business%\' '); 
	environments = result.rows;
	
	
	var aTitle = 'A Customer Support Portal POC';
	console.log('respond render');
	res.render('index',{
		title : aTitle,
		branches : liqbranches,
		environments : environments,
		users : liqusers
		});
	res.end();
    });


    httpServer.listen(webServerConfig.port)
      .on('listening', () => {
        console.log(`Web server listening on localhost:${webServerConfig.port}`);

        resolve();
      })
      .on('error', err => {
        reject(err);
      });
  });
}

module.exports.initialize = initialize;

function close() {
  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

module.exports.close = close;

const iso8601RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
 
function reviveJson(key, value) {
  // revive ISO 8601 date strings to instances of Date
  if (typeof value === 'string' && iso8601RegExp.test(value)) {
    return new Date(value);
  } else {
    return value;
  }
}