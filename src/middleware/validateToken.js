import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

class User {
  static validateUserTokenMiddleware(req, res, next) {
    const { token } = req.headers;
    try {
      if (!token) {
        return res.status(401).json({
          status: 401,
          error: 'You have to signin to perform this action',
        });
      }
      const decodedToken = jwt.verify(token, process.env.APP_KEY);
      if (!decodedToken) {
        return res
          .status(403)
          .json({ status: 403, error: 'Permission denied. signin again' });
      }
      req.user = decodedToken;
      next();
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
}

export default User;
