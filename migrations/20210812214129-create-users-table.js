'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  db.createTable(
    'Users',
    {
      id: { type: 'bigint', primaryKey: true, autoIncrement: true },
      first_name: { type: 'string', notNull: true },
      last_name: { type: 'string', notNull: true },
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('Users', callback);
};

exports._meta = {
  version: 1,
};
