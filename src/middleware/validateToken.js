import jwt from "jsonwebtoken";
import { config } from "dotenv";
import userServices from "../services/userServices";

config();

class User {
  static async validateUserTokenMiddleware(req, res, next) {
    const { token } = req.headers;
    try {
      if (!token) {
        return res.status(401).json({
          status: 401,
          error: "You have to signin to perform this action",
        });
      }
      const decodedToken = jwt.verify(token, process.env.APP_KEY);
      if (!decodedToken) {
        return res
          .status(401)
          .json({
            status: 401,
            error: "Could not verify your token. signin again",
          });
      }
      const foundUser = await userServices.findUser({
        userId: decodedToken.userId,
      });
      if (!foundUser)
        return res
          .status(404)
          .json({
            status: 404,
            error: "This account seems to have been deleted",
          });
      req.user = decodedToken;
      next();
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
}

export default User;
