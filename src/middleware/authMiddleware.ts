import { NextFunction, Request, Response } from "express";
import { compareData, verifyToken } from "../utils/utils";
import { UnauthorizedError } from "../utils/errors";
import UserModel from "../models/User";


// Authentication Middleware
export const apikeyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.headers.x_api_key) {
      throw new UnauthorizedError("Unauthorized")
    }
    const api_key = req.headers.x_api_key as string;
    const isValid = await compareData(process.env.API_KEY!, api_key );
    if (!isValid) {
        throw new UnauthorizedError("Unauthorized");        
    }
    next(); 
  } catch (error) {
    next(error)
  }
};
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.headers.authorization) {
      throw new UnauthorizedError("Unauthorized")
    }

    const token = req.headers.authorization.split(" ")[1];
    // Verify token
    const decoded =  verifyToken(token);
      if (!decoded) {
        throw new UnauthorizedError("Unauthorized")
    }

    // Find user
    const user =  await UserModel.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedError("Unauthorized")
    }
    if (user?.jti !== decoded?.jti) {
      throw new UnauthorizedError("Unauthorized")
    }
    
    req.user = user;
    req.userId = user._id;

    next(); 
  } catch (error) {
    next(error)
  }
};
