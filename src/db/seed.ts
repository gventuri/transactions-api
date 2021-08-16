import 'dotenv/config';
import * as faker from 'faker';
import Model from './Model';

const DEFAULT_USERS_AMOUNT = 1000;
const DEFAULT_MERCHANTS_AMOUNT = 500;
const DEFAULT_TRANSACTIONS_AMOUNT = 1000000;
const DEFAULT_TRANSACTIONS_AMOUNT_PER_BATCH = 1000;

const randomRange = (amount: number) => 1 + Math.floor(Math.random() * amount);

class Seeder extends Model {
  seedUsers = async (amount: number = DEFAULT_USERS_AMOUNT) => {
    const users: any = [];
    for (let i = 0; i < amount; i++) {
      users.push([faker.name.firstName(), faker.name.lastName()]);
    }

    await this.query(`INSERT INTO Users (first_name, last_name) VALUES ?`, [
      users,
    ]);
  };

  seedMerchants = async (amount: number = DEFAULT_MERCHANTS_AMOUNT) => {
    const merchants: any = [];
    for (let i = 0; i < amount; i++) {
      merchants.push([
        faker.company.companyName(),
        faker.image.business(),
        faker.image.avatar(),
      ]);
    }

    await this.query(
      `INSERT INTO Merchants (display_name, icon_url, funny_gif_url) VALUES ?`,
      [merchants]
    );
  };

  seedTransactions = async (
    amount: number = DEFAULT_TRANSACTIONS_AMOUNT,
    amountPerBatch: number = DEFAULT_TRANSACTIONS_AMOUNT_PER_BATCH,
    usersAmount: number = DEFAULT_USERS_AMOUNT,
    merchantsAmount: number = DEFAULT_MERCHANTS_AMOUNT
  ) => {
    for (let i = 0; i < amount; i += amountPerBatch) {
      const transactions: any = [];
      for (let i = 0; i < amountPerBatch; i++) {
        transactions.push([
          randomRange(usersAmount),
          faker.date.between('2018-01-01', new Date()),
          faker.finance.amount(1, 1000),
          faker.commerce.productDescription(),
          randomRange(merchantsAmount),
        ]);
      }

      await this.query(
        `INSERT INTO Transactions (user_id, date, amount, description, merchant_id) VALUES ?`,
        [transactions]
      );
    }
  };
}
export default Seeder;

// IF NOT IN TEST ENV, RUN AUTOMATICALLY
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    const seeder = new Seeder();
    await seeder.seedUsers();
    console.log(`${DEFAULT_USERS_AMOUNT} users created!`);

    await seeder.seedMerchants();
    console.log(`${DEFAULT_MERCHANTS_AMOUNT} merchants created!`);

    await seeder.seedTransactions();
    console.log(`${DEFAULT_TRANSACTIONS_AMOUNT} transactions created!`);

    // Stop the script execution
    process.exit();
  })();
}
