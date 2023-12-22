"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Tickets", {
      id: {
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      city_from: {
        type: Sequelize.STRING,
      },
      city_to: {
        type: Sequelize.STRING,
      },
      airlines: {
        type: Sequelize.STRING,
      },
      code: {
        type: Sequelize.STRING,
      },
      logo: {
        type: Sequelize.STRING,
      },
      information: {
        type: Sequelize.STRING,
      },
      airport_from: {
        type: Sequelize.STRING,
      },
      airport_to: {
        type: Sequelize.STRING,
      },
      dateTakeoff: {
        type: Sequelize.STRING,
      },
      dateLanding: {
        type: Sequelize.STRING,
      },
      dateDeparture: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      dateEnd: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      dateReturn: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      type_seat: {
        type: Sequelize.STRING,
      },
      booking_code: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      available: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Tickets");
  },
};
