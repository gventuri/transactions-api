import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import WrongDatesIntervalException from '../exceptions/WrongDatesIntervalException';
import MissingParamsException from '../exceptions/MissingParamsException';
import User from '../models/User';
import { isValidParam, isValidNumber } from '../helpers/validation';

class UsersController {
  static getMerchantsWithPercentile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const id: number = Number(req.params.id);
    const from: string = String(req.query.from);
    const to: string = String(req.query.to);

    // Wrong id
    if (!isValidNumber(id)) next(new MissingParamsException());

    // Missing date params
    if (!isValidParam(from) || !isValidParam(to))
      next(new MissingParamsException());

    // Interval too long
    if (moment(to).diff(moment(from), 'days') > 31)
      next(new WrongDatesIntervalException());

    // TO is earlier than FROM
    if (moment(to).diff(moment(from), 'days') <= 0)
      next(new WrongDatesIntervalException());

    const merchants = await User.getMerchantsWithPercentile(
      Number(id),
      String(from),
      String(to)
    );
    res.json(merchants);
  };
}

export default UsersController;
