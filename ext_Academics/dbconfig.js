const Pool = require('pg').Pool;

const pgConn = {
  user: 'postgres',
  host: 'localhost',
  database: 'Academics',
  scheme: 'AcadSchema',
  password: 'ibiam',
  port: 5432,
};



const pool = new Pool(pgConn);
module.exports = pool;