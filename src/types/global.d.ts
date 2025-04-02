import { UserModelType } from "./Database/types";
import { ObjectId } from "mongoose";

declare module "express-serve-static-core" {
  interface Request {
    user?: any; // Properly typed user object
    userId?: any
  }
}


export {};
