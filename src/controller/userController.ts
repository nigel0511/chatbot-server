import User from "../model/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { COOKIE_NAME, EXPIRES_IN } from "../utils/contants";
import { config } from "dotenv";
config();
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN;
const ENV = process.env.ENV;
const SECURE = false;

// Generate JWT
export const generateToken = (id: any, email: string) => {
  const payload = { id, email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: EXPIRES_IN,
  });
  return token;
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // create hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // create token and store cookie
  // res.clearCookie(COOKIE_NAME, {
  //   httpOnly: true,
  //   domain: COOKIE_DOMAIN,
  //   signed: true,
  //   secure: ENV === "production", // In production, ensure secure cookies
  //   path: "/",
  // });

  const token = generateToken(user.id.toString(), user.email);
  const expires = new Date();
  expires.setDate(expires.getDate() + 30);

  res.cookie(COOKIE_NAME, token, {
    path: "/",
    httpOnly: true, // Prevents client-side access to the cookie (security)
    domain: COOKIE_DOMAIN,
    // sameSite: "none",
    secure: ENV === "production",
    expires,
    signed: true,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check for user email
  const user = await User.findOne({ email });

  // res.clearCookie(COOKIE_NAME, {
  //   httpOnly: true,
  //   domain: COOKIE_DOMAIN,
  //   signed: true,
  //   secure: ENV === "production", // In production, ensure secure cookies
  //   path: "/",
  // });

  const token = generateToken(user.id.toString(), user.email);
  const expires = new Date();
  expires.setDate(expires.getDate() + 30);
  res.cookie(COOKIE_NAME, token, {
    path: "/",
    httpOnly: true, // Prevents client-side access to the cookie (security)
    domain: COOKIE_DOMAIN,
    // sameSite: "none",
    secure: ENV === "production",
    expires,
    signed: true,
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      res.status(401).send("Permissions didn't match");
    }
    res.status(200).json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      res.status(401).send("User not registered OR Token malfunctioned");
      return;
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      res.status(401).send("Permissions didn't match");
      return;
    }

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: COOKIE_DOMAIN,
      sameSite: "none",
      signed: true,
      path: "/",
      secure: ENV === "production", // In production, ensure secure cookies
    });

    res.status(200).json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "ERROR", cause: error.message });
  }
};
