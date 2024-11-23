import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  verifyUser,
} from "../controller/userController";
import { verifyToken } from "../utils/token-manager";
import { loginValidator, signupValidator, validate } from "../utils/validators";

const userRouter = Router();

userRouter.post("/register", validate(signupValidator), registerUser);
userRouter.post("/login", validate(loginValidator), loginUser);
userRouter.get("/logout", verifyToken, logoutUser);
userRouter.get("/auth-status", verifyToken, verifyUser);

export default userRouter;
