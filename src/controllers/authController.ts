import { NextFunction, Request, Response } from "express";
import { compareData, generateOTP, generateToken, hashedData, randomStringGenerate, userByEmail, userById, userSafeData } from "../utils/utils";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../utils/errors";
import UserModel from "../models/User";
import { SUCCESS } from "../utils/response";
import { sendEmail } from "../services/sendEmail";


export const soicalLogin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { socialId, firstName, lastName, email, socialType, deviceType, deviceToken, timezone, latitude, longitude, } = req.body;
        let user = await UserModel.findOne({ socialId }) || await userByEmail(email);
        const isNew = !user;

        if (isNew) {
            user = new UserModel({ socialId, firstName, lastName, email, socialType, deviceType, deviceToken, timezone, });
        } else {
            Object.assign(user, { socialId, firstName, lastName, email, socialType, deviceType, deviceToken, timezone });
        }
        user.latitude = latitude;
        user.longitude = longitude;
        if (latitude && longitude) user.location = { type: "Point", coordinates: [longitude, latitude] };
        user.jti = randomStringGenerate(30);
        await user.save();
        const token = generateToken({ id: user._id, jti: user.jti });
        return SUCCESS(res, 200, "Success", { data: { _id: user._id, email, firstName, lastName, token, isNew } });

    } catch (error: any) {
        console.error("Error in socialLogin:", error);
        next(error);
    }
}
export const register = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { firstName, lastName, email, password, address, latitude, longitude, dob, timezone, deviceToken, deviceType } = req.body;

        let user = await userByEmail(email);

        if (user && user.isEmailVerified) {
            throw new BadRequestError("User already exists");
        }

        const hashPassword = await hashedData(password);
        const otp = generateOTP();
        const otpHash = await hashedData(otp);
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        if (user) {
            // Update the existing unverified user instead of deleting and recreating
            Object.assign(user, { firstName, lastName, password: hashPassword, address, dob, timezone, deviceToken, deviceType, otp: otpHash, otpExpires });

            if (latitude && longitude) user.location = { type: "Point", coordinates: [longitude, latitude] };

            await user.save();
        } else {
            user = new UserModel({
                firstName,
                lastName,
                email,
                password: hashPassword,
                address,
                dob,
                timezone,
                deviceToken,
                deviceType,
                otp: otpHash,
                otpExpires,
                ...(latitude && longitude && { location: { type: "Point", coordinates: [longitude, latitude] } })
            });

            await user.save();
        }

        await sendEmail(email, 1, otp);

        return SUCCESS(res, 200, "Registration successful", {
            data: { _id: user._id, email, firstName, lastName }
        });

    } catch (err) {
        next(err);
    }
};

// verify otp 
export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { otp, id } = req.body;
        console.log("verifyOtp", req.body);

        const user = await userById(id);
        if (!user) throw new NotFoundError("User not found");

        if (!user.otp || !user.otpExpires || user.otpExpires < new Date()) {
            throw new BadRequestError("OTP expired or invalid");
        }

        const isValid = await compareData(otp, user.otp);
        if (!isValid) throw new BadRequestError("Invalid OTP");

        Object.assign(user, {
            otp: null,
            otpExpires: null,
            isEmailVerified: true,
            jti: randomStringGenerate(30),
        });

        await user.save();

        const token = generateToken({ id: user._id, jti: user.jti });

        return SUCCESS(res, 200, "OTP verified", {
            data: { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, token }
        });

    } catch (error) {
        next(error);
    }
};

//forget and re send otp
export const sendOtp = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { email, type } = req.body;

        const user = await userByEmail(email);
        if (!user) throw new NotFoundError("User not found");

        const otp = generateOTP();
        user.otp = await hashedData(otp);
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();
        console.log(`Generated OTP: ${otp}`); // Remove in production

        await sendEmail(email, type, otp);

        return SUCCESS(res, 200, "OTP sent successfully", { data: { _id: user._id, email } });

    } catch (error) {
        next(error);
    }
};


export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { email, password, latitude, longitude, timezone, deviceToken, deviceType } = req.body;
        const user = await userByEmail(email);
        console.log(user);
        if (!user  || !user.password || !(await compareData(password, user.password))) throw new UnauthorizedError("Invalid credentials");;
        Object.assign(user, {
            jti: randomStringGenerate(30),
            latitude: latitude ?? user.latitude,
            longitude: longitude ?? user.longitude,
            timezone,
            deviceToken,
            deviceType,
            lastLogin: new Date(),
            ...(latitude && longitude && { location: { type: "Point", coordinates: [longitude, latitude] } }),
        });
        await user.save();
        const token = generateToken({ id: user._id, jti: user.jti });
        return SUCCESS(res, 200, "Login successful", { data: { _id: user._id, email, firstName: user.firstName, lastName: user.lastName, token } });
    } catch (err) {
        next(err);
    }
};

//get profile
export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        console.log((req.headers.authorization ?? "").split(" ")[1]);
        const userExists = req.user;
        const userData = userSafeData(userExists);
        return SUCCESS(res, 200, "Profile fetched successfully", {
            data: userData
        });
    } catch (error: any) {
        next(error);
    }
};

// update profile
export const updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const {
            email, firstName, lastName,
            address, latitude, longitude, smsNotification,
            emailNotification, currentPassword, newPassword
        } = req.body;
        const id = req.userId;
        const userExists = await userById(id);
        if (!userExists) throw new NotFoundError("User not found");
        if (currentPassword && newPassword) {
            if (!(await compareData(currentPassword, userExists.password)))
                throw new UnauthorizedError("Invalid current password");
            userExists.password = await hashedData(newPassword);
            return SUCCESS(res, 200, "Password changed", {});
        }

        if (email && email !== userExists.email) {
            const exist = await userByEmail(email);
            if (exist) throw new BadRequestError("Email already in use");

            userExists.tempVariable = { email };
            const otp = generateOTP();
            userExists.otp = await hashedData(otp);
            userExists.otpExpires = new Date(Date.now() + 10 * 60 * 1000);

            await userExists.save();
            await sendEmail(email, 5, otp);

            return SUCCESS(res, 200, "OTP sent for email verification", {});
        }

        // Update other fields
        Object.assign(userExists, {
            firstName: firstName ?? userExists.firstName,
            lastName: lastName ?? userExists.lastName,
            address: address ?? userExists.address,
            smsNotification: smsNotification ?? userExists.smsNotification,
            emailNotification: emailNotification ?? userExists.emailNotification,
            ...(latitude && longitude && { location: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] } }),
        });
        await userExists.save();
        const userData = userSafeData(userExists);

        return SUCCESS(res, 200, "Profile updated successfully", { data: userData });
    } catch (error: any) {
        next(error);
    }
};
// verify email update 
export const verifyEmailUpdate = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { otp } = req.body;
        const id = req.userId;

        const userExists = await userById(id);
        if (!userExists) throw new NotFoundError("User not found");
        if (!userExists.otp || !userExists.otpExpires || new Date() > userExists.otpExpires) {
            throw new BadRequestError("OTP has expired or is invalid");
        }
        const isValid = await compareData(otp, userExists.otp);
        if (!isValid) throw new BadRequestError("Invalid OTP");
        if (!userExists.tempVariable?.email) {
            throw new BadRequestError("No email update request found");
        }
        userExists.email = userExists.tempVariable.email;
        userExists.tempVariable = null;
        userExists.otp = null;
        userExists.otpExpires = null;
        userExists.isEmailVerified = true;

        await userExists.save();

        return SUCCESS(res, 200, "Email verified successfully", { email: userExists.email });

    } catch (error) {
        next(error);
    }
};
export const updateProfileImage = async (req: Request, res: Response, next: NextFunction
): Promise<any> => {
    try {
        const userExists = req.user;
        if (req.file) {
            userExists.profileImage = `/uploads/${req.file.filename}`;
        }
        await userExists.save();
        // Exclude sensitive fields before sending response
        const userData = userSafeData(userExists);
        return SUCCESS(res, 200, "Profile image updated successfully", { data: userData });
    } catch (error: any) {
        next(error);
    }
};


