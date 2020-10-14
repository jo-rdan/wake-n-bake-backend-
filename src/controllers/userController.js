import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import userServices from "../services/userServices";
import {
  signinValidations,
  signupValidations,
} from "../validations/userValidations";
import sendEmail from "../helpers/sendEmailHelper";
import { sendSms, verifySmsCode } from "../helpers/sendSmsHelper";

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
          role: "customer",
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
        role: "customer",
        isVerified: false,
      });
      if (!isUser) {
        return res.status(409).json({
          status: 409,
          error: "User already created, signin instead!",
        });
      }
      // generate token with jwt
      await sendSms(isUser.userPhone, "sms");
      const userToken = jwt.sign(
        {
          userId: isUser.id,
          userEmail: isUser.userEmail,
          isVerified: isUser.isVerified,
        },
        process.env.APP_KEY,
        { expiresIn: 300 }
      );
      return res.status(201).json({ status: 201, data: userToken });
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }

  static async verifyUserEmailController(req, res) {
    const { token } = req.params;
    try {
      const verifiedUser = jwt.decode(token);
      const currentTime = Date.now().valueOf() / 1000;
      if (verifiedUser.exp < currentTime) {
        const deletedUser = await userServices.deleteUserData(
          verifiedUser.userId
        );
        if (deletedUser) {
          return res.status(401).json({
            status: 401,
            error: "Expired link, your account was canceled",
          });
        }
        return;
      }
      // database services
      const foundUser = await userServices.findUser({
        userPhone: verifiedUser.userPhone || "",
        userEmail: verifiedUser.userEmail,
      });
      if (!foundUser)
        return res.status(404).json({ status: 404, error: "User not found" });
      if (foundUser.isVerified) {
        return res
          .status(409)
          .json({ status: 409, error: "User already verified" });
      }
      const updated = await userServices.updateUserData(
        { id: verifiedUser.userId },
        { isVerified: true }
      );
      return res.status(200).json({
        status: 200,
        message: "User verified successfully! You can now login",
        data: updated,
      });
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }

  static async verifyUserPhoneController(req, res) {
    const { code } = req.body;
    const { phone } = req.query;
    try {
      const verifyUser = await verifySmsCode(phone, code);
      if (verifyUser.status === "pending")
        return res.status(401).json({ status: 401, error: "Incorrect code" });
      await userServices.updateUserData(
        { userPhone: phone },
        { isVerified: true }
      );
      return res
        .status(200)
        .json({ status: 200, message: "User account verified succesfully!" });
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
      const isUser = await userServices.findUser({
        userPhone,
        userEmail,
      });
      // console.log("userrr", isUser.dataValues);
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

  static async editUserProfileController(req, res) {
    const { userId } = req.params;
    try {
      const isUser = await userServices.findUser({
        userId,
      });
      if (!isUser)
        return res.status(404).json({ status: 404, error: "User not found" });
      const updatedUser = await userServices.updateUserData(
        { id: userId },
        req.body
      );
      const [, users] = updatedUser;
      const { userPassword, isVerified, ...rest } = users.dataValues;
      return res.status(200).json({
        status: 200,
        message: "Profile updated successfully!",
        data: rest,
      });
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }

  static async getSingleUserController(req, res) {
    const { userId } = req.params;
    const foundUser = await userServices.findUser({ userId });
    if (!foundUser)
      return res.status(404).json({ status: 404, error: "User not found" });

    const { userPassword, ...rest } = foundUser.dataValues;
    return res
      .status(200)
      .json({ status: 200, message: "User found", data: rest });
  }

  static async getAllUsers(req, res) {
    try {
      const users = await userServices.findAllUsers();
      return res.status(200).json({ status: 200, data: users });
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
}

export default User;
