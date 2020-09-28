import { Op, DataTypes } from 'sequelize';
import { sequelize } from '../models/index';
import users from '../models/schemas/users';

class User {
  static async createUser(userData) {
    try {
      const userModel = users(sequelize, DataTypes);
      const { userPhone, userEmail } = userData;
      const isUser = await userModel.findOne({
        where: {
          [Op.or]: [
            { userPhone: userPhone || '' },
            { userEmail: userEmail || '' },
          ],
        },
      });
      if (!isUser) {
        const createdUser = await userModel.create(userData);
        return createdUser;
      }
      return false;
    } catch (error) {
      return error;
    }
  }

  static async findByPhoneOrEmail(userPhone, userEmail) {
    const user = users(sequelize, DataTypes);
    const isUser = await user.findOne({
      where: {
        [Op.or]: [
          { userPhone: userPhone || '' },
          { userEmail: userEmail || '' },
        ],
      },
    });
    if (!isUser) return null;
    return isUser;
  }

  static async updateUserData(user) {
    const userModel = users(sequelize, DataTypes);
    const updatedUser = await userModel.update(
      { isVerified: true },
      { returning: true, where: { id: user.id } }
    );
    if (!updatedUser) return null;
    return updatedUser;
  }
}

export default User;
