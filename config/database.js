var dbConfig = require('./dbconfig.js');

dbConfig.initialize();

module.exports = {

  hrPool: {
    user: dbConfig.userId(),
    password : dbConfig.dbPassword(),
    connectString: dbConfig.connectString,
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0
  }
};