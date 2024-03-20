import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
const app = express();
dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 3000;

const Database = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(Database, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected successfully!"))
  .catch((err) => {
    console.log("💥ERROR", err);
    console.log("Database connected fail!");
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
