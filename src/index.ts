import express from "express";
import cors from "cors";
import config from "./config";
import DB from "./db";
const app = express();
DB().catch((err) => console.log(err));

const port: number = parseInt(<string>config.PORT, 10);
app.listen(port, () => {
  console.log(`✅ : listening on port ${port}`);
});
