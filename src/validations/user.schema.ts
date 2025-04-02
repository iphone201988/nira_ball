import Joi from 'joi';

export const socialLoginSchema = {
    body: Joi.object({
        socialId: Joi.string().required(),
        socialType: Joi.number().valid(1, 2, 3).required(),
        email: Joi.string().email().optional(),
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        deviceType: Joi.number().valid(1, 2, 3).optional().messages({
            "any.only": "Device type must be either '1 for ios', ' 2 for android', or '3 for web'"
        }),
        deviceToken: Joi.string().optional(),
        timezone: Joi.string().optional(),
        latitude: Joi.number().min(-90).max(90).optional().messages({
            "number.base": "Latitude must be a number",
            "number.min": "Latitude must be between -90 and 90",
            "number.max": "Latitude must be between -90 and 90"
        }),
        longitude: Joi.number().min(-180).max(180).optional().messages({
            "number.base": "Longitude must be a number",
            "number.min": "Longitude must be between -180 and 180",
            "number.max": "Longitude must be between -180 and 180"
        }),
    }),
};
export const registerSchema = {
    body: Joi.object({
        email: Joi.string().pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/).required().messages({
            "string.base": "Email must be a string",
            "string.pattern.base": "Email must be a valid email address (e.g., user@example.com)",
            "string.empty": "Email is required"
        }),
        password: Joi.string().min(6).max(50).required().messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 6 characters",
            "string.max": "Password cannot exceed 50 characters"
        }),
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        address: Joi.string().allow("").optional(),
        latitude: Joi.number().min(-90).max(90).optional().messages({
            "number.base": "Latitude must be a number",
            "number.min": "Latitude must be between -90 and 90",
            "number.max": "Latitude must be between -90 and 90"
        }),
        longitude: Joi.number().min(-180).max(180).optional().messages({
            "number.base": "Longitude must be a number",
            "number.min": "Longitude must be between -180 and 180",
            "number.max": "Longitude must be between -180 and 180"
        }),
        dob: Joi.date().iso().optional().messages({
            "date.base": "Date of birth must be a valid date",
            "date.format": "Date of birth must be in ISO format (YYYY-MM-DD)"
        }),
        timezone: Joi.string().optional(),
        deviceToken: Joi.string().optional(),
        deviceType: Joi.number().valid(1, 2, 3).optional().messages({
            "any.only": "Device type must be either '1 for ios', ' 2 for android', or '3 for web'"
        })
    })
};
export const verifyOtpSchema = {
    body: Joi.object({
        id: Joi.string().required().messages({
            "string.base": "User ID must be a string",
            "string.empty": "User ID is required"
        }),
        otp: Joi.string().length(4).required().messages({
            "string.base": "OTP must be a string",
            "string.length": "OTP must be exactly 4 digits",
            "string.empty": "OTP is required"
        })
    })
};
export const sendOtpSchema = {
    body: Joi.object({
        email: Joi.string().email().required().messages({
            "string.base": "Email must be a string",
            "string.email": "Invalid email format",
            "string.empty": "Email is required"
        }),
        type: Joi.number()
            .required().strict()
            .integer()
            .valid(1, 2, 3, 4)
            .messages({
                "number.base": "Type must be a number",
                "number.integer": "Type must be an integer",
                "any.required": "Type is required",
                "any.only": "Type must be one of the following: 1 (register), 2 (resend register), 3 (forget), 4 (resend forget)"
            }),
    })
}; 
export const loginSchema = {
    body: Joi.object({
        email: Joi.string().email().required().messages({
            "string.base": "Email must be a string",
            "string.email": "Invalid email format",
            "string.empty": "Email is required"
        }),
        password: Joi.string().min(6).required().messages({
            "string.base": "Password must be a string",
            "string.min": "Password must be at least 6 characters long",
            "string.empty": "Password is required"
        }),
        latitude: Joi.number().optional(),
        longitude: Joi.number().optional(),
        timezone: Joi.string().optional(),
        deviceToken: Joi.string().optional(),
        deviceType: Joi.number().valid(1, 2, 3).optional().messages({
            "any.only": "Device type must be either '1 for ios', ' 2 for android', or '3 for web'"
        })
    })
};
export const updateProfileSchema = {
    body: Joi.object({
        email: Joi.string().email().optional().messages({
            "string.email": "Invalid email format",
        }),
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        address: Joi.string().optional(),
        latitude: Joi.number().optional(),
        longitude: Joi.number().optional(),
        smsNotification: Joi.boolean().optional(),
        emailNotification: Joi.boolean().optional(),
        currentPassword: Joi.string().optional(),
        newPassword: Joi.string().min(6).optional().when("currentPassword", {
            is: Joi.exist(),
            then: Joi.required(),
            otherwise: Joi.forbidden(),
        }),
    }),
};
export const verifyEmailUpdateSchema = {
    body: Joi.object({
        otp: Joi.string().length(4).required().messages({
            "string.base": "OTP must be a string",
            "string.length": "OTP must be exactly 4 digits",
            "string.empty": "OTP is required"
        })
    }),
};
