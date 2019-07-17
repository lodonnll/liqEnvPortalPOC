const oracledb = require('oracledb');
const dbConfig = require('../config/database.js');
 
async function initialize() {
    // await dbConfig.initialize();
    // console.log('userid '+dbConfig.hrPool.user);
    //console.log('password '+dbConfig.hrPool.password);
    //console.log('connectionString '+dbConfig.hrPool.connectionString);
    
  const pool = await oracledb.createPool(dbConfig.hrPool);
}

 
module.exports.initialize = initialize;

async function close() {
  await oracledb.getPool().close();
}
 
module.exports.close = close;

function simpleExecute(statement, binds = [], opts = {}) {
  return new Promise(async (resolve, reject) => {
    let conn;
 
    //opts.outFormat = oracledb.OBJECT;
    //opts.autoCommit = true;
	
	opts = {
      outFormat: oracledb.OBJECT,   // query result format
      // extendedMetaData: true,   // get extra metadata
      // fetchArraySize: 100       // internal buffer allocation size for tuning
	  autoCommit: true
    };
 
    try {
      conn = await oracledb.getConnection();
      
      const result = await conn.execute(statement, binds, opts);
      console.log(statement);
      resolve(result);
    } catch (err) {
          reject(err);
    } finally {
      if (conn) { // conn assignment worked, need to close
        try {
          await conn.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
}
 
module.exports.simpleExecute = simpleExecute;

