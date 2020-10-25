import Joi from "joi";

export const signupValidations = () => {
  const signupSchema = Joi.object({
    userPhone: Joi.string()
      .regex(/^[-\s\./0-9]{10}$/)
      .error(new Error("Phone number is required and should have 10 digits")),
    userEmail: Joi.string()
      .email()
      .error(new Error("Email should be a valid email")),
    userPassword: Joi.string()
      .required()
      .error(new Error("Password is required!")),
  });
  return signupSchema;
};

export const signinValidations = () => {
  const signinSchema = Joi.object({
    userPhone: Joi.string()
      .regex(/^[-\s\./0-9]{10}$/)
      .error(new Error("Phone number is required and should have 10 digits")),
    userEmail: Joi.string()
      .email()
      .error(new Error("Email should be a valid email")),
    userPassword: Joi.string()
      .required()
      .error(new Error("Password is required!")),
  });
  return signinSchema;
};

export const resetEmailValidations = (req, res, next) => {
  const resetEmail = Joi.object({
    userEmail: Joi.string()
      .email()
      .error(new Error("Email should be a valid email")),
    userPhone: Joi.string()
      .regex(/^[-\s\./0-9]{10}$/)
      .error(new Error("Phone number is required and should have 10 digits")),
  });
  const { error } = resetEmail.validate(req.body);
  if (error) return res.status(422).json({ status: 422, error: error.message });
  next();
};
