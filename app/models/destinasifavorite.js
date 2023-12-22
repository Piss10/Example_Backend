"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class destinasifavorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  destinasifavorite.init(
    {
      image_destinasi: DataTypes.STRING,
      info: DataTypes.STRING,
      continent: DataTypes.STRING,
      city_from: DataTypes.STRING,
      city_to: DataTypes.STRING,
      airlines: DataTypes.STRING,
      date: DataTypes.STRING,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "destinasifavorite",
    }
  );
  return destinasifavorite;
};
