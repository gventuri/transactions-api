import Model from '../db/Model';

export type MercantRanking = {
  readonly display_name: string;
  readonly percentile: number;
};

export interface IUser {
  getMerchantIds: (id: number, from: string, to: string) => Promise<number[]>;
  getMerchantsWithPercentile: (
    id: number,
    from: string,
    to: string
  ) => Promise<MercantRanking>;
}

class User extends Model implements IUser {
  tableName = 'Users';

  #merchantIdsSQL: string = `
    SELECT
      GROUP_CONCAT(DISTINCT merchant_id) AS merchants
    FROM
      Transactions
    WHERE
      user_id = ?
    AND
      date BETWEEN ? AND ?
  `;

  #intervalMerchantPercentilesByUserSQL: string = `
    SELECT
      merchant_id,
      user_id,
      SUM(amount) amount,
      100 * ROUND (
        CUME_DIST() OVER(
          PARTITION BY merchant_id
          ORDER BY SUM(amount) ASC
        ), 4
      ) percentile
    FROM
      Transactions
    WHERE
      date BETWEEN ? AND ?
    AND
      merchant_id IN (?)
    GROUP BY
      merchant_id,
      user_id
    ORDER BY
      merchant_id ASC
  `;

  getMerchantIds = async (id: number, from: string, to: string) => {
    const merchantsQuery = await this.query(this.#merchantIdsSQL, [
      id,
      from,
      to,
    ]);
    return merchantsQuery[0]['merchants']
      ? merchantsQuery[0]['merchants'].split(',')
      : [];
  };

  getMerchantsWithPercentile = async (id: number, from: string, to: string) => {
    const merchantIds: string = await this.getMerchantIds(id, from, to);

    return this.query(
      `
      WITH
        IntervalMerchantPercentilesByUser AS (${
          this.#intervalMerchantPercentilesByUserSQL
        })
      SELECT
        Merchants.display_name,
        IntervalMerchantPercentilesByUser.percentile
      FROM
        IntervalMerchantPercentilesByUser
      INNER JOIN
        Merchants
      ON
        Merchants.id = IntervalMerchantPercentilesByUser.merchant_id
      WHERE
        user_id = ?;
      `,
      [from, to, merchantIds, id]
    );
  };
}

export default new User();
