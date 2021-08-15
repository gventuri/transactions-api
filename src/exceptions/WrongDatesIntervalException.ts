import HttpException from './HttpException';

class WrongDatesIntervalException extends HttpException {
  constructor() {
    super(
      422,
      `Wrong dates interval. The interval cannot be longer than 1 month`
    );
  }
}

export default WrongDatesIntervalException;
