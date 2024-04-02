import stripePackage from "stripe";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

// const stripe = stripePackage(
//   "sk_test_51P11JIBsPI4UcnIqvHsLG6y8i0OX4nGvLr3Xdc6L5uuQSTZcAg4RA2uTRsRam3DxWSCWGaVufylwl5GZhgLTF3mZ007f76gbwF"
// );
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

export const getCheckoutSession = async (req, res, next) => {
  try {
    // 1) Get currently booked items
    console.log(req.body);
    const items = req.body;
    const transformedItems = [];

    // 2) Create checkout session
    items.forEach((item) => {
      transformedItems.push({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: item.price * 100,
          product_data: {
            name: `${item.name} Tour`,
            images: [`${item.image}`], //only accepts live images (images hosted on the internet),
          },
        },
      });
    });

    console.log(transformedItems);

    // 2) Create checkout session
    // const transformedItems = [
    //   {
    //     quantity: 1,
    //     price_data: {
    //       currency: "usd",
    //       unit_amount: tour.price * 100,
    //       product_data: {
    //         name: `${tour.name} Tour`,
    //         description: tour.description, //description here
    //         images: [
    //           `${req.protocol}://${req.get("host")}/img/tours/${
    //             tour.imageCover
    //           }`,
    //         ], //only accepts live images (images hosted on the internet),
    //       },
    //     },
    //   },
    // ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${req.protocol}://${req.get("host")}/`, //user will be redirected to this url when payment is successful. home page
      cancel_url: `${req.protocol}://${req.get("host")}/cart`, //user will be redirected to this url when payment has an issue. tour page (previous page)
      customer_email: req.user.email,
      // client_reference_id: , //this field allows us to pass in some data about this session that we are currently creating.
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
