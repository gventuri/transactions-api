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
    'Transactions',
    {
      id: { type: 'bigint', primaryKey: true, autoIncrement: true },
      user_id: {
        type: 'bigint',
        notNull: true,
        foreignKey: {
          name: 'Transactions_user_id_fk',
          table: 'Users',
          rules: {
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT',
          },
          mapping: 'id',
        },
      },
      date: { type: 'datetime', notNull: true },
      amount: { type: 'decimal', notNull: true },
      description: { type: 'text' },
      merchant_id: {
        type: 'bigint',
        notNull: true,
        foreignKey: {
          name: 'Transactions_merchant_id_fk',
          table: 'Merchants',
          rules: {
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT',
          },
          mapping: 'id',
        },
      },
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('Transactions', callback);
};

exports._meta = {
  version: 1,
};
