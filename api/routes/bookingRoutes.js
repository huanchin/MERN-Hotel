import express from "express";
import { getCheckoutSession } from "../controllers/bookingControllers.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

router.post("/checkout-seesion", verifyToken, getCheckoutSession);

export default router;
