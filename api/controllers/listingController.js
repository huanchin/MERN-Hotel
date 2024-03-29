import Listing from "../models/listingModel.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found!"));

    // console.log(listing.userRef);
    if (req.user.id !== listing.userRef.toString())
      return next(errorHandler(401, "You can only delete your own listings"));

    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json("listing has been deleted");
  } catch (err) {
    next(err);
  }
};
