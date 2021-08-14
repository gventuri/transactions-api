import 'dotenv/config';
import User from './models/User';

import express, { Application, Request, Response } from 'express';

const app: Application = express();

// App
app.use(express.json());
app.get(
  '/users/:id/merchants_with_percentile',
  async (req: Request, res: Response) => {
    const merchants = await User.getMerchantsWithPercentile(
      Number(req.params.id),
      String(req.query.from),
      String(req.query.to)
    );
    res.json(merchants);
  }
);

app.listen(
  Number(process.env.NODE_LOCAL_PORT),
  String(process.env.NODE_HOST),
  () => {
    console.log(
      `Running on http://${process.env.NODE_HOST}:${process.env.NODE_LOCAL_PORT}`
    );
  }
);
