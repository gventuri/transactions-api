import Model, { IModel } from '../db/Model';

export interface IMerchant extends IModel {}

class Merchant extends Model implements IMerchant {
  tableName = 'Merchants';
}

export default new Merchant();
