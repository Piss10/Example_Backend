"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      password: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      image_profile: {
        type: Sequelize.STRING,
      },
      otp: {
        type: Sequelize.STRING,
      },
      otpExpiration: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("users");
  },
};
