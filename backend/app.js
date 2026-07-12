import express from "express";
import { router } from "./routes/routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Oodo");
});

app.use("/oodo", router);

export { app };
