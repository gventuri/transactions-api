// @ts-ignore
import * as DBMigrate from 'db-migrate';
import * as mysql from 'mysql2';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export const closeDbConnection = () => pool.end();
export default pool.promise();

/* 
  Used in tests to always have a fresh db to be used for testing purposes
*/
export const createTestDb = async () => {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
  });
  const promisePool = await pool.promise();

  await promisePool.query('CREATE DATABASE ??', process.env.MYSQL_DATABASE);
  await promisePool.end();
};
export const dropTestDb = async () => {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
  });
  const promisePool = pool.promise();

  await promisePool.query('DROP DATABASE ??', process.env.MYSQL_DATABASE);
  await promisePool.end();
};

/* 
  Used for the db migration
*/
export const migrate = async () => {
  await DBMigrate.getInstance(true).up();
};
