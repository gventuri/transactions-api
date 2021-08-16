import Model, { IModel } from '../db/Model';

export interface ITransaction extends IModel {}

class Transaction extends Model implements ITransaction {
  tableName = 'Transactions';
}

export default new Transaction();
