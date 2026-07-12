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

// 404 handler - anything that didn't match a route above
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    msg: "Route not found",
    data: null,
  });
});

app.use((err, req, res, next) => {
  const statusCode =
    err.statusCode && err.statusCode >= 100 ? err.statusCode : 500;

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    msg: err.msg || err.message || "Something went wrong",
    data: null,
  });
});

export { app };
