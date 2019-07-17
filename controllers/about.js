//const branches = require('../db_apis/branches.js');

async function get(req, res, next) {
  try {
    const context = {};
    const http = require('http');
    const net = require('net');
    const url = require('url');

	//connect to an API and display data returned...

   let aboutXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE About SYSTEM \"About.dtd\"><About/>";
   //result = LiqMNXQueryRunner.clazz.runQueryFunctionNamed(“my.xq.function”); 
   let xqString = "{LIQ.PRIM.XQS.QUERY_ABOUT_INFO()}";
   let aboutINQ   = "<!DOCTYPE RunXQuery SYSTEM \"RunXQuery.dtd\"><RunXQuery version=\"1.0\" query=\"" + encodeURIComponent(xqString)+   "\"/>"; 
   //let xqString = "<!DOCTYPE RunXQuery SYSTEM \"RunXQuery.dtd\"><RunXQuery version=\"1.0\" query=\"    {LIQ.PRIM.XQS.QUERY_ABOUT_INFO()}\"/>";

   //= "{LIQ.PRIM.XQS.QUERY_ABOUT_INFO()}";
   //http://loaniqdub3:8080/liq_apiWebService
   var api_ip = "BLRCSWLIQCS0188"; //JPMC
   var api_port = "8085"; //JPMC
   
   //var api_ip = "blrcswliqcs0129"; //BMO
   //var api_port = "8080"; //BMO
   //var liqapi = "http://blrcswliqcs0129:8080/liq%5FapiWebService?wsdl";

   var api_url = 'http://'+api_ip+':'+api_port+'/liq%5FapiWebService?wsdl';
   
	//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	var request = require('request');

    var aTitle = 'About this environment';
    var convert = require('xml-js');
    var xml;
	var options = {
	  url: api_url, //liqapi
	  method: "POST",
	  headers: {
		'Content-type': 'text/xml',
		'Content-Encoding': 'UTF-8'
	  },
	  body: aboutINQ,
	  timeout: 2000
	};
	
	function callback(error, response, body) {
    console.log("callback function");
	  if (!error && response.statusCode == 200) {
		xml = decodeURIComponent(body); // (XML.parse(body));
		console.log(xml);
		console.log("status 200");
		//var result1 = convert.xml2json(xml, {compact: false, spaces: 4});
		//res.set('Content-Type', 'text/html');
		//res.send(xml);
		res.render('about',{
		title : aTitle,
		text : xml,
		//environments : environments
		});
	    res.end();
	
        //res.status(response.statusCode).json(result1);
	  }
	  else {
		console.log(error.code === 'ETIMEDOUT');
		console.log(error.statusCode);
		//console.log('error occured in api call');
		//console.log(/*XML.parse(body)*/body);
		res.status(400).send('Bad Request '+api_url);
	  }
	}
	console.log("About to call API About...on server"+api_ip);
    request.post(options, callback);
    

  } catch (err) {
    next(err);
  }
}

module.exports.get = get;
