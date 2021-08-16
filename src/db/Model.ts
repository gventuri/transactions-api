import db from '.';

export type QueryParams = (string | number | (string | number)[])[];

export interface IModel {
  tableName: string;
  query: (sqlQuery: string, params: QueryParams) => Promise<number>;
  create: (params: { [key: string]: string }) => Promise<void>;
}

class Model implements IModel {
  tableName: string = '';

  query = async (sqlQuery: string, params: QueryParams) => {
    try {
      const result = await db.query(sqlQuery, params);
      return result[0];
    } catch (error) {
      return error;
    }
  };

  create = async (params: { [key: string]: string }) => {
    const keys: string[] = Object.keys(params);
    const values: string[] = Object.values(params);

    try {
      await this.query(
        `
        INSERT INTO ?? (??)
        VALUES (?);
        `,
        [this.tableName, keys, values]
      );
    } catch (_e) {
      throw new Error(`Failed to create a new record into ${this.tableName}`);
    }
  };
}

export default Model;
