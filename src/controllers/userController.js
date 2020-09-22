import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import userServices from "../services/userServices";
import userSchema from "../validations/userValidations";

config();
class User {
  static async signupConroller(req, res) {
    try {
      const { userEmail, userPhone } = req.body;
      const { error, results } = userSchema.validate(req.body);
      console.log("iseUser=====>", error);
      if (error)
        return res.status(422).json({ status: 422, error: error.message });
      const hashedPasswrod = bcrypt.hashSync(req.body.userPassword, 10);
      const isUser = await userServices.createUser({
        userPhone,
        userEmail,
        userPassword: hashedPasswrod,
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
          firstName: isUser.userFirstName,
          lastName: isUser.userLastName,
          isVerified: isUser.isVerified,
        },
        process.env.APP_KEY
      );
      // return token in the data object
      return res.status(201).json({ status: 201, data: userToken });
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
}

export default User;
