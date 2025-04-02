import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import UserModel from '../models/User';
import crypto from 'crypto';
import bcrypt from "bcryptjs";

export function randomStringGenerate(length: number): string {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

export function generateOTP (): string {
    const buffer = crypto.randomBytes(4);
    const otp = (buffer.readUInt32BE(0) % 9000) + 1000;
    return otp.toString();
};

export async function hashedData(item: any): Promise<string> {
    return bcrypt.hash(item, 12);
};
export function compareData(item: string, hashedItem: string): Promise<boolean> {
    return bcrypt.compare(item, hashedItem);
};

export function generateToken(payload: any): any {
    const secretKey = process.env.JWT_SECRET!;
    const expiresIn = "1d";
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
}
//verify token
export function verifyToken(token: string): any {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        return decoded;
    } catch (error) {
        console.error("Token verification error:", error);
        throw error;
    }
}

export function userByEmail(email: string): any {
    return UserModel.findOne({ email: { $regex: new RegExp(email, 'i') } });
}
export function userById(id: ObjectId): any {
    return UserModel.findById(id);
}
export function userSafeData(user: any): any {
    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        deviceType: user.deviceType,
        emailNotification: user.emailNotification,
        smsNotification: user.smsNotification,
        timezone: user.timezone,
        address: user.address,
        location: user.location,
        dob: user.dob,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}
export const generateRandomNumbers = (totalnumber:number ,betwwen: number) => {
    const numbers = [];
    for (let i = 0; i < totalnumber; i++) {
      const randomBuffer = crypto.randomBytes(2);
      const randomNumber = randomBuffer.readUInt16LE(0);
      numbers.push(randomNumber % betwwen); // generate numbers between 0 and 69
    }
    return numbers;
  };
  
  