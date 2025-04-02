import mongoose from "mongoose";
import { devicesTypeEnums, rolesEnums } from "../utils/enums";

const UserSchema = new mongoose.Schema({
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, },
    role: {
        type: String,
        enum: Object.values(rolesEnums),
        default: rolesEnums.USER,
    },
    profileImage: { type: String, default: null },
    jti: { type: String, default: null },
    deviceToken: { type: String, default: null },
    deviceType: {
        type: Number,
        enum: Object.values(devicesTypeEnums),
        default: null,
    },
    kycVerified: { type: Boolean, default: false },
    emailNotification: { type: Boolean, default: false },
    smsNotification: { type: Boolean, default: false },
    socialId: { type: String, default: null },
    socialType: { type: String, default: null },
    timezone: { type: String,  default: null },
    address: { type: String,  default: null },
    latitude:{
      type: Number,
      default: null,
    },
    longitude:{
      type: Number,
      default: null,
    },
    location: {
      type: {
          type: String,
          enum: ["Point"],
          default: "Point",

      },
      coordinates: {
          type: [Number],
          default: [0, 0],
      },
  },
  dob: { type: Date, default: null },
  isAccountBanByAdmin: { type: Boolean, default: false },
  isDeactivateAccount: { type: Boolean, default: false },
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  lastLogin: { type: Date, default: null },
  isEmailVerified: { type: Boolean, default: false },
  tempVariable:{
    email: { type: String, default: null },
  },
  walletBalance: { type: Number, default: 0 },

},{ timestamps: true });    


const UserModel = mongoose.model("User", UserSchema, 'User');

export default UserModel;


