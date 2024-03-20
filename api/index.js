import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
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

/****** middlewares ******/
app.use(express.json({ limit: "10kb" }));

/****** routes *****/
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
/***** run the server ******/
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
