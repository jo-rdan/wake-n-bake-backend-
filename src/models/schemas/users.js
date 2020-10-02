const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users.init(
    {
      userFirstName: DataTypes.STRING,
      userLastName: DataTypes.STRING,
      userPhone: { type: DataTypes.STRING, unique: true },
      userEmail: { type: DataTypes.STRING, unique: true },
      userPassword: DataTypes.STRING,
      userLocation: DataTypes.STRING,
      preferredCurrency: DataTypes.STRING,
      preferredPaymentMethod: DataTypes.STRING,
      role: { type: DataTypes.STRING, values: ['admin', 'customer', 'vendor'] },
      isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: 'users',
    }
  );
  return users;
};
