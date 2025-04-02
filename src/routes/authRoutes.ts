import express from "express";
import { register, login, verifyOtp, sendOtp, getProfile, updateProfile, updateProfileImage, verifyEmailUpdate, soicalLogin } from "../controllers/authController";
import { validate } from "../middleware/validate.middleware";
import { loginSchema, registerSchema, sendOtpSchema, socialLoginSchema, updateProfileSchema, verifyEmailUpdateSchema, verifyOtpSchema } from "../validations/user.schema";
import { authMiddleware } from "../middleware/authMiddleware";
import upload from "../middleware/uploadImage";

const userRouter = express.Router();

userRouter.post("/social_login", validate(socialLoginSchema), soicalLogin);
userRouter.post("/register", validate(registerSchema), register);
userRouter.post("/verify_otp", validate(verifyOtpSchema), verifyOtp);
userRouter.post("/send_otp", validate(sendOtpSchema), sendOtp);
userRouter.post("/login", validate(loginSchema), login);
userRouter.get("/me",authMiddleware, getProfile);
userRouter.put("/me",authMiddleware, validate(updateProfileSchema), updateProfile);
userRouter.patch("/me/verify",authMiddleware, validate(verifyEmailUpdateSchema), verifyEmailUpdate);
userRouter.patch("/me/image",authMiddleware, upload.single("image"), updateProfileImage);



export default userRouter;
