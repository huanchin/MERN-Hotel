import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listingModel.js";
import Booking from "../models/bookingModel.js";

export const test = (req, res) => {
  res.json({
    message: "api route is working",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account"));
  try {
    if (req.body.password)
      req.body.password = bcryptjs.hashSync(req.body.password, 10);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User deleted successfully");
  } catch (err) {
    next(err);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only view your own listings"));
  try {
    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json(listings);
  } catch (err) {
    next(err);
  }
};

export const getUserBookings = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only view your own bookings"));
  try {
    const bookings = await Booking.find({ user: req.params.id });
    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};
