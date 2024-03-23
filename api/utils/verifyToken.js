import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { errorHandler } from "./error.js";

const verifyToken = (req, res, next) => {
  let token;

  if (req.headers.cookie && req.headers.cookie.startsWith("access_token")) {
    token = req.headers.cookie.split("=")[1];
    console.log(token);
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) return next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return next(errorHandler(401, "Token is not valid"));
    console.log("⭐️", decoded);
    const user = await User.findById(decoded.id);
    if (!user)
      return next(
        errorHandler(
          401,
          "The user belonging to this token does no longer existToken is not valid"
        )
      );
    req.user = user;
    next();
  });
};

export default verifyToken;
