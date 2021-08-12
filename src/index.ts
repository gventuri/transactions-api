import 'dotenv/config';

import express, { Application, Request, Response } from 'express';
import db from './db';

const app: Application = express();

// App
app.use(express.json());
app.get('/', async (_req: Request, res: Response) => {
  res.send('Hello World');
});

app.listen(
  Number(process.env.NODE_LOCAL_PORT),
  String(process.env.NODE_HOST),
  () => {
    console.log(
      `Running on http://${process.env.NODE_HOST}:${process.env.NODE_LOCAL_PORT}`
    );
  }
);
