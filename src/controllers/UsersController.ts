import { Request, Response } from 'express';
import User from '../models/User';

class UsersController {
  static getMerchantsWithPercentile = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const merchants = await User.getMerchantsWithPercentile(
      Number(req.params.id),
      String(req.query.from),
      String(req.query.to)
    );
    res.json(merchants);
  };
}

export default UsersController;
