"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notif extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, { foreignKey: "usersId" }); //
    }
  }
  Notif.init(
    {
      usersId: DataTypes.UUID,
      message: DataTypes.STRING,
      read: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Notif",
    }
  );
  return Notif;
};
