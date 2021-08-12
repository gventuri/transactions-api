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
  db.addIndex(
    'Transactions',
    'Transactions_user_id_date_idx',
    ['user_id', 'date'],
    false,
    callback
  );
  db.addIndex(
    'Transactions',
    'Transactions_merchant_id_date_idx',
    ['merchant_id', 'date'],
    false,
    callback
  );
  db.addIndex(
    'Transactions',
    'Transactions_user_id_merchant_id_idx',
    ['user_id', 'merchant_id'],
    false,
    callback
  );
};

exports.down = function (_db, callback) {
  callback();
};

exports._meta = {
  version: 1,
};
