"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Payments", {
      id: {
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        unique: true,
      },
      usersId: {
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        type: Sequelize.UUID,
      },
      cardNumber: {
        type: Sequelize.STRING,
      },
      cardHolderName: {
        type: Sequelize.STRING,
      },
      cvc: {
        type: Sequelize.INTEGER,
      },
      expiration: {
        type: Sequelize.STRING,
      },
      status: {
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
    await queryInterface.dropTable("Payments");
  },
};
