import { Response, NextFunction, Request } from "express";
import Joi from "joi";
import { ValidationError } from "../utils/errors";

export const validate = (schema: Record<string, Joi.Schema>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const validationResults = Object.entries(schema).map(([key, joiSchema]) => {
      // Validate the request object based on the schema
      const { error } = joiSchema.validate(req[key as keyof Request], { abortEarly: false, allowUnknown: false });

      // If validation fails, throw a custom error with a message
      if (error) {
        return next(new ValidationError(error.message));
      }
    });

    // If all validations pass, proceed to the next middleware
    next();
  };
};

