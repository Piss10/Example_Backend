"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Transactions", {
      id: {
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      usersId: {
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      ticketsId: {
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      checkoutsId: {
        type: Sequelize.UUID,
      },
      amounts: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.DATEONLY,
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
    await queryInterface.dropTable("Transactions");
  },
};
