import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
const app = express();
dotenv.config({ path: "./config.env" });

/***** connect to database ******/
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

/****** routes *****/
app.use("/api/user", userRoutes);

/***** run the server ******/
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
