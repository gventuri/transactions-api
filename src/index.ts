import 'dotenv/config';
import app from './app';

app.listen(
  Number(process.env.NODE_LOCAL_PORT),
  String(process.env.NODE_HOST),
  () => {
    console.log(
      `Running on http://${process.env.NODE_HOST}:${process.env.NODE_LOCAL_PORT}`
    );
  }
);
