import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import { webhookCheckout } from "./controllers/bookingControllers.js";
const __dirname = path.resolve();
const app = express();
dotenv.config({ path: "./config.env" });

const corsOptions = {
  credentials: true,
  optionsSuccessStatus: 200,
  origin: "http://localhost:5173",
};

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
app.use(cors(corsOptions));

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

/****** routes *****/
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/listing", listingRoutes);
app.use("/api/booking", bookingRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

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
