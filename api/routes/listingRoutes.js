import express from "express";
import { createListing } from "../controllers/listingController.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);

export default router;
