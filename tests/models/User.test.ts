import { closeDbConnection } from '../../src/db';
import {
  setupDb,
  dropDb,
  estimateExecutionTime,
} from '../../src/helpers/test_helper';

// Models
import Seeder from '../../src/db/seed';
import User from '../../src/models/User';
import Merchant from '../../src/models/Merchant';
import Transaction from '../../src/models/Transaction';

describe('User model', () => {
  beforeEach(setupDb);
  afterEach(dropDb);
  afterAll(closeDbConnection);

  it('should return the right merchants and percentiles', async () => {
    await User.create({ first_name: 'Iron', last_name: 'Man' });
    await Merchant.create({ display_name: 'Awesome merchant' });
    await Merchant.create({ display_name: 'Super merchant' });
    await Transaction.create({
      user_id: '1',
      amount: '10',
      merchant_id: '1',
      date: '2020-01-01',
    });
    await Transaction.create({
      user_id: '1',
      amount: '20',
      merchant_id: '2',
      date: '2020-01-02',
    });

    expect(
      await User.getMerchantsWithPercentile(1, '2020-01-01', '2020-01-02')
    ).toMatchObject([
      {
        display_name: 'Awesome merchant',
        percentile: 100,
      },
      {
        display_name: 'Super merchant',
        percentile: 100,
      },
    ]);

    await User.create({ first_name: 'Evil', last_name: 'Char' });
    await Transaction.create({
      user_id: '2',
      amount: '30',
      merchant_id: '1',
      date: '2020-01-02',
    });
    expect(
      await User.getMerchantsWithPercentile(1, '2020-01-01', '2020-01-02')
    ).toMatchObject([
      {
        display_name: 'Awesome merchant',
        percentile: 50,
      },
      {
        display_name: 'Super merchant',
        percentile: 100,
      },
    ]);
    expect(
      await User.getMerchantsWithPercentile(2, '2020-01-01', '2020-01-02')
    ).toMatchObject([
      {
        display_name: 'Awesome merchant',
        percentile: 100,
      },
    ]);
  });

  it('should return the merchants and percentiles within the right time frame', async () => {
    await User.create({ first_name: 'Iron', last_name: 'Man' });
    await Merchant.create({ display_name: 'Awesome merchant' });
    await Merchant.create({ display_name: 'Super merchant' });
    await Transaction.create({
      user_id: '1',
      amount: '10',
      merchant_id: '1',
      date: '2020-01-01',
    });
    await Transaction.create({
      user_id: '1',
      amount: '20',
      merchant_id: '2',
      date: '2020-01-02',
    });

    expect(
      await User.getMerchantsWithPercentile(1, '2020-01-01', '2020-01-01')
    ).toMatchObject([
      {
        display_name: 'Awesome merchant',
        percentile: 100,
      },
    ]);
    expect(
      await User.getMerchantsWithPercentile(1, '2020-01-01', '2020-01-02')
    ).toMatchObject([
      {
        display_name: 'Awesome merchant',
        percentile: 100,
      },
      {
        display_name: 'Super merchant',
        percentile: 100,
      },
    ]);
  });

  it('should be fast as the db scales', async () => {
    const seeder = new Seeder();
    await seeder.seedUsers(1000);
    await seeder.seedMerchants(500);
    await seeder.seedTransactions(100000, 100, 1000, 500);

    const executionTime = await estimateExecutionTime(
      User.getMerchantsWithPercentile(1, '2020-01-01', '2020-03-01')
    );

    // Expect the query to take less than 50ms with 100.000 transactions, 1000 users and 500 merchants
    expect(executionTime).toBeLessThan(50);
  }, 30000);
});
