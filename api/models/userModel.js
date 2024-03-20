import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "A user must have a name"],
    },
    email: {
      type: String,
      required: [true, "A user must have an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "A user must have a password"],
      minlength: [8, "A password must have more or equal then 8 characters"],
      // select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
