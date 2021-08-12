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
    'Merchants',
    {
      id: { type: 'bigint', primaryKey: true, autoIncrement: true },
      display_name: { type: 'string', notNull: true },
      icon_url: { type: 'string' },
      funny_gif_url: { type: 'string' },
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('Merchants', callback);
};

exports._meta = {
  version: 1,
};
