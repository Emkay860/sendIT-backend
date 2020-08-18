// require("dotenv").config();

import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import ordersRouter from "./routes/orders";
import usersRouter from "./routes/users";
import authRouter from "./routes/auth";

const app = express();

app.use(cors());

// Serve static pages from public directory
app.use(express.static("public"));

app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("mongoDb database connection established successfully");
});

app.use("/api/v1/parcels/", ordersRouter);
app.use("/api/v1/users/", usersRouter);
app.use("/api/v1/auth/", authRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("Application listening on port 3000!");
});

export default app;
