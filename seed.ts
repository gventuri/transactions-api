import 'dotenv/config';
import * as faker from 'faker';
import Model from './src/db/Model';

const USERS_AMOUNT = 1000;
const MERCHANTS_AMOUNT = 500;
const TRANSACTIONS_AMOUNT = 1000000;
const TRANSACTIONS_AMOUNT_PER_BATCH = 1000;

const randomRange = (amount: number) => 1 + Math.floor(Math.random() * amount);

class Seed extends Model {
  seedUsers = async () => {
    const users: any = [];
    for (let i = 0; i < USERS_AMOUNT; i++) {
      users.push([faker.name.firstName(), faker.name.lastName()]);
    }

    await this.query(`INSERT INTO Users (first_name, last_name) VALUES ?`, [
      users,
    ]);

    console.log(`${USERS_AMOUNT} users created!`);
  };

  seedMerchants = async () => {
    const merchants: any = [];
    for (let i = 0; i < MERCHANTS_AMOUNT; i++) {
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

    console.log(`${MERCHANTS_AMOUNT} merchants created!`);
  };

  seedTransactions = async () => {
    for (
      let i = 0;
      i < TRANSACTIONS_AMOUNT;
      i += TRANSACTIONS_AMOUNT_PER_BATCH
    ) {
      const transactions: any = [];
      for (let i = 0; i < TRANSACTIONS_AMOUNT_PER_BATCH; i++) {
        transactions.push([
          randomRange(USERS_AMOUNT),
          faker.date.between('2018-01-01', new Date()),
          faker.finance.amount(1, 1000),
          faker.commerce.productDescription(),
          randomRange(MERCHANTS_AMOUNT),
        ]);
      }

      await this.query(
        `INSERT INTO Transactions (user_id, date, amount, description, merchant_id) VALUES ?`,
        [transactions]
      );

      console.log(`${TRANSACTIONS_AMOUNT_PER_BATCH} transactions created!`);
    }
  };
}

// Fill in random info
(async () => {
  const seed = new Seed();
  await seed.seedUsers();
  await seed.seedMerchants();
  await seed.seedTransactions();

  // Stop the script execution
  process.exit();
})();
