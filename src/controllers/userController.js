import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import userServices from "../services/userServices";
import {
  signinValidations,
  signupValidations,
} from "../validations/userValidations";
import sendEmail from "../helpers/sendEmailHelper";

config();
class User {
  static async signupConroller(req, res) {
    try {
      const { userEmail, userPhone } = req.body;
      if (!userEmail && !userPhone) {
        return res
          .status(422)
          .json({ status: 422, error: "Phone number or email is required" });
      }
      if (userEmail) {
        const signupSchema = signupValidations();
        const { error } = signupSchema.validate(req.body);
        if (error)
          return res.status(422).json({ status: 422, error: error.message });
        const hashedPassword = bcrypt.hashSync(req.body.userPassword, 10);
        const isUser = await userServices.createUser({
          userPhone,
          userEmail,
          userPassword: hashedPassword,
          isVerified: false,
        });
        if (!isUser) {
          return res.status(409).json({
            status: 409,
            error: "User already created, signin instead!",
          });
        }
        // generate token with jwt
        const userToken = jwt.sign(
          {
            userId: isUser.id,
            userEmail: isUser.userEmail,
            isVerified: isUser.isVerified,
          },
          process.env.APP_KEY,
          { expiresIn: 300 }
        );
        sendEmail(userEmail, userToken);
        // return token in the data object
        return res.status(201).json({ status: 201, data: userToken });
      }

      // if user email is not available
      const signupSchema = signupValidations();
      const { error } = signupSchema.validate(req.body);
      if (error)
        return res.status(422).json({ status: 422, error: error.message });
      const hashedPassword = bcrypt.hashSync(req.body.userPassword, 10);
      const isUser = await userServices.createUser({
        userPhone,
        userEmail,
        userPassword: hashedPassword,
        isVerified: false,
      });
      if (!isUser) {
        return res.status(409).json({
          status: 409,
          error: "User already created, signin instead!",
        });
      }
      // generate token with jwt

      const userToken = jwt.sign(
        {
          userId: isUser.id,
          userEmail: isUser.userEmail,
          isVerified: isUser.isVerified,
        },
        process.env.APP_KEY,
        { expiresIn: 300 }
      );
      // sendEmail(userEmail, userToken);
      // return token in the data object
      return res.status(201).json({ status: 201, data: userToken });
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }

  static async verifyUserController(req, res) {
    const { token } = req.params;
    try {
      const verifiedUser = jwt.verify(token, process.env.APP_KEY);
      // database services
      const foundUser = await userServices.findByPhoneOrEmail(
        verifiedUser.userPhone || "",
        verifiedUser.userEmail
      );
      if (!foundUser)
        return res.status(404).json({ status: 404, error: "User not found" });
      if (foundUser.isVerified) {
        return res
          .status(409)
          .json({ status: 409, error: "User already verified" });
      }
      const updatedUser = await userServices.updateUserData(foundUser);
      return res.status(200).json({
        status: 200,
        message: "User verified successfully! You can now login",
      });
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }

  static async signInController(req, res) {
    try {
      const { userPhone, userEmail, userPassword } = req.body;
      const signinSchema = signinValidations();
      const { error } = signinSchema.validate(req.body);
      if (error)
        return res.status(422).json({ status: 422, error: error.message });
      const isUser = await userServices.findByPhoneOrEmail(
        userPhone,
        userEmail
      );
      if (!isUser) {
        return res.status(404).json({
          status: 404,
          error: "User not found, create an account instead",
        });
      }
      if (!isUser.isVerified) {
        return res.status(401).json({
          status: 401,
          error: "Account not verified!",
        });
      }
      const isPassword = bcrypt.compareSync(userPassword, isUser.userPassword);
      if (!isPassword) {
        return res
          .status(401)
          .json({ status: 401, error: "Incorrect email or password" });
      }
      const userToken = jwt.sign(
        {
          userId: isUser.id,
          firstName: isUser.userFirstName,
          lastName: isUser.userLastName,
          isVerified: isUser.isVerified,
          role: isUser.role,
        },
        process.env.APP_KEY,
        { expiresIn: "1h" }
      );
      return res.status(200).json({ status: 200, data: userToken });
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
}

export default User;
