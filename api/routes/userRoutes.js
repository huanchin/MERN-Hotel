import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  getUserListings,
  getUserBookings,
} from "../controllers/userController.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings);
router.get("/bookings/:id", verifyToken, getUserBookings);

export default router;
