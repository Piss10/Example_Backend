"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Passenger extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Checkout, { foreignKey: "departureTicketsId" });
      this.belongsTo(models.Checkout, { foreignKey: "returnTicketsId" });
    }
  }
  Passenger.init(
    {
      checkoutsId: DataTypes.UUID,
      departureTicketsId: DataTypes.UUID,
      returnTicketsId: DataTypes.UUID,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      familyName: DataTypes.STRING,
      title: DataTypes.STRING,
      dateofbirth: DataTypes.DATEONLY,
      citizenship: DataTypes.STRING,
      ktppaspor: DataTypes.STRING,
      issuingcountry: DataTypes.STRING,
      expirationdatepass: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: "Passenger",
    }
  );
  return Passenger;
};
