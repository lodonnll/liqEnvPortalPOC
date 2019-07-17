//JDBC URL
const JSqlAccessJdbcUrlKey = "JSqlAccessJdbcUrl";
let JSqlAccessJdbcUrlValue = "";
//userId
const DBDefaultUserNameKey = "DBDefaultUserName";
let DBDefaultUserNameValue;
//password
const DBDefaultPasswordKey = "DBDefaultPassword";
let DBDefaultPasswordValue = "";

fs = require('fs');
var path  = require('path');
var parser = require('xml-js');

function connectionStringOracle(JSqlAccessJdbcUrlValue){
    /*
    "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = LOANIQDUB3)(PORT = 1521))(CONNECT_DATA =(SID= DUB3LIQ1)))",
    
    jdbc:oracle:thin:@//LOANIQDUB3:1521/DUB3LIQ1"
    */
    var prop = JSqlAccessJdbcUrlValue.split(":")
    var database = prop[4].split("/")
    var server = prop[3].split("//")
    //console.log("server "+ server[1]+ ' port '+ database[0]+' database '+database[1])

    return "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = "+server[1]+")(PORT = "+database[0]+"))(CONNECT_DATA =(SID="+database[1]+")))"
}

function connectionStringDB2(JSqlAccessJdbcUrlValue){
//TODO:
    return JSqlAccessJdbcUrlValue;
}

function connectionStringMSS(JSqlAccessJdbcUrlValue){
//TODO:
    return JSqlAccessJdbcUrlValue;
}


async function initialize(){
  
    await processProperties();
        console.log("initialized");
}

function processProperties(){
    //var data = fs.readFileSync( '..\\..\\Tomcat\\jrconf\\JSqlAccessProperties.xml');
    var data = fs.readFileSync( 'c:\\LoanIQ\\Server\\Tomcat\\jrconf\\JSqlAccessProperties.xml');
//    
//    function(err, data) {
//    if (!err) {
        
    let JRConfProperties = parser.xml2js(data, {compact: true, spaces: 4});
    
    var prop =  JRConfProperties.properties.entry

        prop.forEach(function(property){
            console.log(property._attributes.key+' : ' +property._text);
            if ( property._attributes.key === JSqlAccessJdbcUrlKey){  
                JSqlAccessJdbcUrlValue = connectionStringOracle(property._text);
                ///console.log(JSqlAccessJdbcUrlValue);
            }
            if ( property._attributes.key === DBDefaultUserNameKey){  
                DBDefaultUserNameValue = property._text;
            }
            if ( property._attributes.key === DBDefaultPasswordKey){  
                DBDefaultPasswordValue = property._text;
                //console.log('Password3='+DBDefaultPasswordValue)
            }
        })
        console.log('done processProperties...')    
}

function propertiesRead(result) {
  console.log("Properties file ready : " + result);
}

function propertiesNotRead(error) {
  console.log("Error reading properties file: " + error);
}

function dbPassword(){
  //  console.log('DB Password0 ...'+DBDefaultPasswordValue);  
   return DBDefaultPasswordValue;
}


function userId(){
   return DBDefaultUserNameValue;
}





module.exports = {
	initialize,
  dbPassword,
  userId,
  connectionString : connectionStringOracle,

  // Setting externalAuth is optional.  It defaults to false.  See:
  // https://oracle.github.io/node-oracledb/doc/api.html#extauth
  externalAuth  : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
};