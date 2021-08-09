"use strict";

import express, { Application, Request, Response } from "express";
const app: Application = express();

// Server config
const PORT = 3000;
const HOST = "0.0.0.0";

// App
app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
