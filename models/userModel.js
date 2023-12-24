const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is empty"] },
    email: {
      type: String,
      required: [true, "Email is empty"],
      unique: [true, "Email already exists"],
    },
    password: { type: String, required: [true, "Password is required"] },
    dob: { type: String },
    role: { type: String, required: [true, "Role is required"] },
    profilePicture: { type: String },
    iFollow: { type: Array },
    followMe: { type: Array },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", UserSchema);

// following -> iFollow
// follower -> followMe
