import stripePackage from "stripe";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";
dotenv.config({ path: "./config.env" });

// const stripe = stripePackage(
//   "sk_test_51P11JIBsPI4UcnIqvHsLG6y8i0OX4nGvLr3Xdc6L5uuQSTZcAg4RA2uTRsRam3DxWSCWGaVufylwl5GZhgLTF3mZ007f76gbwF"
// );
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

export const getCheckoutSession = async (req, res, next) => {
  try {
    // 1) Get currently booked items
    const items = req.body;
    const transformedItems = [];

    const purchaseList = items.map((item) => {
      return {
        id: item.id,
        quantity: item.quantity,
      };
    });

    console.log(purchaseList);

    // 2) Create checkout session
    items.forEach((item) => {
      transformedItems.push({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: item.price * 100,
          product_data: {
            name: `${item.name}`,
            images: [`${item.image}`], //only accepts live images (images hosted on the internet),
          },
        },
      });
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${req.protocol}://${req.get("host")}/`, //user will be redirected to this url when payment is successful. home page
      cancel_url: `${req.protocol}://${req.get("host")}/cart`, //user will be redirected to this url when payment has an issue. tour page (previous page)
      customer_email: req.user.email,
      metadata: {
        purchaseList: JSON.stringify(purchaseList), // Convert purchaseList to JSON string
      },
      //client_reference_id: JSON.stringify(purchaseList), //this field allows us to pass in some data about this session that we are currently creating.
      line_items: transformedItems,
      mode: "payment",
    });

    // 3) Create session as response
    res.status(200).json({
      status: "success",
      url: session.url,
    });
  } catch (err) {
    next(err);
  }
};

const createBookingCheckout = async (session) => {
  try {
    const purchaseList = JSON.parse(session.metadata.purchaseList);
    const user = (await User.findOne({ email: session.customer_details.email }))
      .id;
    const price = session.amount_total / 100;
    await Booking.create({ user, purchaseList, price });
    console.log("createBookingCheckout");
  } catch (err) {
    console.log("Error createBookingCheckout");
  }
};

export const webhookCheckout = (req, res, next) => {
  const endpointSecret =
    "whsec_0e4a6da48e7ab6bd1732b52321744ec618ab1244d143d2798de434214a263860";
  // whsec_0e4a6da48e7ab6bd1732b52321744ec618ab1244d143d2798de434214a263860

  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("total price:");
    console.log(event.data.object.amount_total);
    console.log("user email:");
    console.log(event.data.object.customer_details.email);
    console.log("purchase list:");
    console.log(event.data.object.metadata.purchaseList);
    createBookingCheckout(event.data.object);
  }

  res.status(200).json({ received: true });
};
