import Joi from "joi";

const userSchema = Joi.object({
  userPhone: Joi.string()
    .regex(/^[-\s\./0-9]{10}$/)
    .required()
    .error(new Error("Phone number is required and should have 10 digits")),
  userEmail: Joi.string().email(),
  userPassword: Joi.string()
    .required()
    .error(new Error("Password is required!")),
});

export default userSchema;
