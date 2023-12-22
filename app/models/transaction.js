"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // this.belongsTo(models.user, { foreignKey: "usersId" });
      // this.belongsTo(models.Ticket, { foreignKey: "ticketsId", as: "tickets" });
      // this.belongsTo(models.Checkout, {
      //   foreignKey: "checkoutsId",
      //   as: "checkouts",
      // });
      this.belongsTo(models.Checkout, {
        foreignKey: "usersId",
        as: "checkout",
      });
    }
  }
  Transaction.init(
    {
      usersId: DataTypes.UUID,
      ticketsId: DataTypes.UUID,
      checkoutsId: DataTypes.UUID,
      amounts: DataTypes.INTEGER,
      date: DataTypes.DATEONLY,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
