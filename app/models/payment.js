"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.hasMany(models.Checkout, { foreignKey: "usersId", as: "usersId" }); // Perbarui foreign key
    }
  }
  Payment.init(
    {
      usersId: DataTypes.UUID,
      cardNumber: DataTypes.STRING,
      cardHolderName: DataTypes.STRING,
      cvc: DataTypes.INTEGER,
      expiration: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Payment",
    }
  );
  return Payment;
};
