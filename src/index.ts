import 'dotenv/config';
import express, { Application } from 'express';
import routes from './routes';
import errorHandler from './middlewares/error-handler';

const app: Application = express();
app.use(express.json());

app.use(routes);
app.use(errorHandler);

app.listen(
  Number(process.env.NODE_LOCAL_PORT),
  String(process.env.NODE_HOST),
  () => {
    console.log(
      `Running on http://${process.env.NODE_HOST}:${process.env.NODE_LOCAL_PORT}`
    );
  }
);
