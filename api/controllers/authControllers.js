import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  // const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password });

  try {
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "user create successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email }).select("+password");
    if (!validUser) return next(errorHandler(401, "Invalid email or password"));
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword)
      return next(errorHandler(401, "Invalid email or password"));

    // create token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // set cookie option
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    // send token with cookie
    res.cookie("access_token", token, cookieOptions);

    const { password: pass, ...rest } = validUser._doc;

    res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
};
