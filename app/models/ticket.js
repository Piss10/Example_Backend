"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Transaction, { foreignKey: "ticketsId" });
      this.hasMany(models.Checkout, { foreignKey: "id", as: "ticketsId" }); // Perbarui foreign key
    }
    // calculateTotalPrice() {
    //   return this.price * this.total_passenger;
    // }
  }
  Ticket.init(
    {
      city_from: DataTypes.STRING,
      city_to: DataTypes.STRING,
      airlines: DataTypes.STRING,
      code: DataTypes.STRING,
      logo: DataTypes.STRING,
      airport_from: DataTypes.STRING,
      airport_to: DataTypes.STRING,
      information: DataTypes.STRING,
      dateTakeoff: DataTypes.STRING,
      dateLanding: DataTypes.STRING,
      dateDeparture: DataTypes.DATEONLY,
      dateEnd: DataTypes.DATEONLY,
      dateReturn: DataTypes.DATEONLY,
      type_seat: DataTypes.STRING,
      price: DataTypes.INTEGER,
      booking_code: DataTypes.STRING,
      available: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Ticket",
    }
  );

  // Hook to automatically update total_price when price or total_passenger changes
  // Ticket.addHook("beforeSave", (ticket, options) => {
  //   if (ticket.changed("price") || ticket.changed("total_passenger")) {
  //     const totalPrice = ticket.calculateTotalPrice();
  //     ticket.setDataValue("total_price", totalPrice);
  //   }
  // });

  return Ticket;
};
