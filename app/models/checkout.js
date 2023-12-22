"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Checkout extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Transaction, { foreignKey: "checkoutsId" });
      this.hasMany(models.Transaction, { foreignKey: "usersId" });
      this.hasMany(models.Passenger, { foreignKey: "checkoutsId" });
      this.belongsTo(models.Ticket, {
        foreignKey: "departureTicketsId",
        as: "DepartureTicket",
      }); // Perbarui foreign key
      this.belongsTo(models.Ticket, {
        foreignKey: "returnTicketsId",
        as: "ReturnTicket",
      });
      // this.hasMany(models.Ticket, {
      //   foreignKey: "ticketsId",
      // });
    }
  }
  Checkout.init(
    {
      usersId: DataTypes.UUID,
      departureTicketsId: DataTypes.UUID,
      returnTicketsId: DataTypes.UUID,
      total_passenger: DataTypes.INTEGER,
      total_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        get() {
          const passengersCount = this.getDataValue("total_passenger");
          const ticketPrice = this.Ticket
            ? this.Ticket.getDataValue("price")
            : 0;
          return passengersCount * ticketPrice;
        },
      },
    },
    {
      sequelize,
      modelName: "Checkout",
    }
  );
  return Checkout;
};
