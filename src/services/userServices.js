import Sequelize from 'sequelize';
import db from '../models/index';
import users from '../models/schemas/users';

class UserServices {
  static async createUser(userData) {
    try {
      const { DataTypes } = Sequelize;
      const userModel = users(db.sequelize, DataTypes);
      console.log('=====>', userData);
      const isUser = await userModel.findOne({
        where: { userPhone: userData.userPhone },
      });
      if (!isUser) {
        const createdUser = await userModel.create(userData);
        return createdUser;
      }
      return false;
      return isUser;
    } catch (error) {
      return error;
    }
  }
}
export default UserServices;
