import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateTokenAndSendRes = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };
  res.cookie("access_token", token, cookieOptions);
  const { password: pass, ...rest } = user._doc;
  res.status(statusCode).json(rest);
};

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

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (user) {
      generateTokenAndSendRes(user, 200, res);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: req.body.username.split(" ").join("").toLowerCase(),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      generateTokenAndSendRes(newUser, 200, res);
    }
  } catch (err) {
    next(err);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out");
  } catch (err) {
    next(err);
  }
};
