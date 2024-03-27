import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A listing must have a name"],
    },
    description: {
      type: String,
      required: [true, "A listing must have a description"],
    },
    address: {
      type: String,
      required: [true, "A listing must have a address"],
    },
    regularPrice: {
      type: Number,
      required: [true, "A listing must have a regular price"],
    },
    discountPrice: {
      type: Number,
      required: [true, "A listing must have a discount price"],
    },
    bathrooms: {
      type: Number,
      required: [true, "A listing must have numbers of bathrooms"],
    },
    bedrooms: {
      type: Number,
      required: [true, "A listing must have numbers of bedrooms"],
    },
    furnished: {
      type: Boolean,
      required: [
        true,
        "A listing must indicate whether it contains furniture.",
      ],
    },
    parking: {
      type: Boolean,
      required: [true, "A listing must indicate whether it contains parking."],
    },
    type: {
      type: String,
      required: [true, "A listing must have a type(sell/ rent)"],
    },
    offer: {
      type: Boolean,
      required: [true, "A listing must have a offer"],
    },
    imageUrls: {
      type: Array,
      required: [true, "A listing must have images"],
    },
    userRef: {
      type: String,
      required: [true, "A listing must have a creator"],
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
