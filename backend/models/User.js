import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"],
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  avatarUrl: {
    type: String,
  },
  avatarID: {
    type: String
  },
  bio: {
    type: String,
    maxLength: 500
  },
  phone: {
    type: String,
    sparse: true
  },
},
  { 
    timestamps: true 
  },
)

const User = mongoose.model("User", userSchema)
export default User;