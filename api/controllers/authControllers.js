import User from "../models/userModel.js";
// import bcrypt from "bcryptjs";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  // const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password });

  try {
    await newUser.save();
    res.status(201).json({
      message: "user create successfully",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
