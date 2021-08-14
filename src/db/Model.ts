import db from '.';

export type QueryParams = (string | number)[];

export interface IModel {
  query: (sqlQuery: string, params: QueryParams) => Promise<number>;
}

class Model implements IModel {
  query = async (sqlQuery: string, params: QueryParams) => {
    try {
      const result = await db.query(sqlQuery, params);
      return result[0];
    } catch (error) {
      return error;
    }
  };
}

export default Model;
