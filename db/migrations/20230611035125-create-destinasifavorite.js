"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("destinasifavorites", {
      id: {
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        unique: true,
      },
      info: {
        type: Sequelize.STRING,
      },
      image_destinasi: {
        type: Sequelize.STRING,
      },
      continent: {
        type: Sequelize.STRING,
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
      date: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("destinasifavorites");
  },
};
