import dotenv, { config } from "dotenv";

dotenv.config({
  path: "./.env",
});

import { connectDB } from "./db/index.js";
import { app } from "./app.js";

const port = process.env.PORT || 4000;

import bcrypt from "bcryptjs";

async function generateHash() {
  const password = "123";
  const hash = await bcrypt.hash(password, 10);

  console.log("Password:", password);
  console.log("Hash:", hash);
}

generateHash();

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`app listen on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("DB not connected");
  });
