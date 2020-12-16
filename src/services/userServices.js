import { Op, DataTypes } from "sequelize";
import { sequelize } from "../models/index";
import users from "../models/schemas/users";

const userModel = users(sequelize, DataTypes);

class User {
  static async createUser(userData) {
    try {
      const { userPhone, userEmail } = userData;
      const isUser = await userModel.findOne({
        where: {
          [Op.or]: [
            { userPhone: userPhone || "" },
            { userEmail: userEmail || "" },
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

  static async findUser(user) {
    const isUser = await userModel.findOne({
      where: {
        [Op.or]: [
          { id: user.userId || 0 },
          { userPhone: user.userPhone || "" },
          { userEmail: user.userEmail || "" },
        ],
      },
    });
    if (!isUser) return null;
    return isUser;
  }

  static async updateUserData(user, data) {
    // const userModel = users(sequelize, DataTypes);
    const currentUserData = await userModel.findOne({
      where: {
        [Op.or]: [
          { userPhone: user.userPhone || "" },
          { id: user.id || 0 },
          { userEmail: user.userEmail || "" },
        ],
      },
    });

    const updatedUser = await userModel.update(
      {
        userFirstName: data.userFirstName || currentUserData.userFirstName,
        userLastName: data.userLastName || currentUserData.userLastName,
        userPhone: data.userPhone || currentUserData.userPhone,
        userEmail: data.userEmail || currentUserData.userEmail,
        userPassword: data.userPassword || currentUserData.userPassword,
        userLocation: data.userLocation || currentUserData.userLocation,
        preferredCurrency:
          data.preferredCurrency || currentUserData.preferredCurrency,
        preferredPaymentMethod:
          data.preferredPaymentMethod || currentUserData.preferredPaymentMethod,
        role: data.role || currentUserData.role,
        isVerified: data.isVerified || currentUserData.isVerified,
      },
      {
        returning: true,
        plain: true,
        where: {
          [Op.or]: [
            { userPhone: user.userPhone || "" },
            { id: user.id || 0 },
            { userEmail: user.userEmail || "" },
          ],
        },
      }
    );

    if (!updatedUser) return null;
    return updatedUser;
  }

  static async deleteUserData(id) {
    try {
      const deletedData = await userModel.destroy({
        where: { id },
        force: true,
      });
      return deletedData;
    } catch (error) {
      return false;
    }
  }

  static async findAllUsers() {
    try {
      const allUsers = await userModel.findAll({
        attributes: [
          "id",
          "userFirstName",
          "userLastName",
          "userPhone",
          "userEmail",
          "userLocation",
          "preferredCurrency",
          "preferredPaymentMethod",
          "role",
          "isVerified",
          "createdAt",
          "updatedAt",
        ],
      });
      if (!allUsers) return null;
      return allUsers;
    } catch (error) {
      return false;
    }
  }
}

export default User;
