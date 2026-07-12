import dotenv, { config } from "dotenv";

dotenv.config({
  path: "./.env",
});

import { connectDB } from "./db/index.js";
import { app } from "./app.js";

const port = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`app listen on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("DB not connected");
  });
