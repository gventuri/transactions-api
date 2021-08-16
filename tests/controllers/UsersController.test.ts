import request from 'supertest';
import app from '../../src/app';

import User from '../../src/models/User';

describe('Users controller', () => {
  it('should return a list of merchants and percentile score for the user', async () => {
    const user_id = 1;
    const from = '2020-01-01';
    const to = '2020-02-01';

    jest.spyOn(User, 'getMerchantsWithPercentile').mockImplementationOnce(() =>
      Promise.resolve([
        {
          display_name: 'Merchant name',
          percentile: '98.2',
        },
      ])
    );

    const response = await request(app).get(
      `/users/${user_id}/merchants_with_percentile?from=${from}&to=${to}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject([
      {
        display_name: 'Merchant name',
        percentile: '98.2',
      },
    ]);
  });

  it('should return an error if missing FROM param', async () => {
    const user_id = 1;
    const to = '2020-01-01';

    const response = await request(app).get(
      `/users/${user_id}/merchants_with_percentile?to=${to}`
    );
    expect(response.statusCode).toBe(422);
    expect(response.body.message).toBe('Some required params are missing');
  });

  it('should return an error if missing TO param', async () => {
    const user_id = 1;
    const from = '2020-01-01';

    const response = await request(app).get(
      `/users/${user_id}/merchants_with_percentile?from=${from}`
    );
    expect(response.statusCode).toBe(422);
    expect(response.body.message).toBe('Some required params are missing');
  });

  it('should return an error if the USER ID param is not a number', async () => {
    const user_id = 'wrong_user';
    const from = '2020-01-01';
    const to = '2020-02-01';

    const response = await request(app).get(
      `/users/${user_id}/merchants_with_percentile?from=${from}&to=${to}`
    );
    expect(response.statusCode).toBe(422);
    expect(response.body.message).toBe('Some required params are missing');
  });

  it('should return an error if the dates interval is bigger than 1 month', async () => {
    const user_id = 1;
    const from = '2020-01-01';
    const to = '2020-03-01';

    const response = await request(app).get(
      `/users/${user_id}/merchants_with_percentile?from=${from}&to=${to}`
    );
    expect(response.statusCode).toBe(422);
    expect(response.body.message).toBe(
      'Wrong dates interval. The interval cannot be longer than 1 month'
    );
  });

  it('should return an error if TO param is earlier than FROM param', async () => {
    const user_id = 1;
    const from = '2020-02-01';
    const to = '2020-01-01';

    const response = await request(app).get(
      `/users/${user_id}/merchants_with_percentile?from=${from}&to=${to}`
    );
    expect(response.statusCode).toBe(422);
    expect(response.body.message).toBe(
      'Wrong dates interval. The interval cannot be longer than 1 month'
    );
  });
});
