import bcrypt from "bcryptjs";
import User from "../models/User.js";

import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";


const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 ngày

export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message: "Không thể thiếu username, password, email, firstName, lastName",
      });
    }

    // Kiểm tra tồn tại chưa
    const duplicate = await User.findOne({ username });

    if (duplicate) {
      return res.status(400).json({ message: "Username đã tồn tại" });
    }

    // Mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    return res.sendStatus(201);

  } catch (error) {
    console.log("Lỗi khi gọi signUp", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const signIn = async (req, res) => {
  try {
    //Lấy thông tin từ req.body
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Thiếu username hoặc password' });
    }
    //lấy hashedPassword từ db so với hpw input
    const user = await User.findOne({ username })
    if (!username) {
      return res.status(401).json({ message: 'username hoặc password không chính xác' });
    }

    //check password
    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordCorrect) {
      return res.status(401).json({ message: 'username hoặc password không chính xác' });
    }
    //nếu khớp tạo assessToken với JWT
    const accsessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

    //tạo refreshToken 
    const refreshToken = crypto.randomBytes(64).toString('hex')

    //Tạo session lưu refreshToken
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    //Trả refreshToken về trong cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: REFRESH_TOKEN_TTL,
    });

    //Trả accessToken về cho res
    return res.status(200).json({ message: `User ${user.displayName} đã đăng nhập thành công`, accsessToken })
  } catch (error) {
    console.log("Lỗi khi gọi signIn", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
}


export const signOut = async (req, res) => {
  try {
    //Lấy refreshToken từ cookie
    const token = req.cookies?.refreshToken;
    if (token) {
      //xóa refreshToken trong session
      await Session.deleteOne({ refreshToken: token });
      //xóa cookie
      res.clearCookie('refreshToken')
    }
    return res.status(204);

  } catch (error) {
    console.log("Lỗi khi gọi signIn", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
}