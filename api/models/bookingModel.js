import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a User!"],
  },
  purchaseList: [
    {
      id: {
        type: mongoose.Schema.ObjectId,
        ref: "Listing",
      },
      quantity: Number,
    },
  ],
  price: {
    type: Number,
    require: [true, "Booking must have a price."],
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate("purchaseList.id");
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
