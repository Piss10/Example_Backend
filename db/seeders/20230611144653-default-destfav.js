"use strict";
const { v4: uuid } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("destinasifavorites", [
      {
        id: uuid(),
        image_destinasi:
          "https://fullsuitcase.com/wp-content/uploads/2022/06/Best-areas-to-stay-in-Bangkok-neighborhood-guide.jpg.webp",
        info: "Limited!",
        continent: "Asia",
        city_from: "Jakarta",
        city_to: "Bangkok",
        airlines: "AirAsia",
        date: "01 - 10 Juli",
        price: 950000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        image_destinasi:
          "https://s1.it.atcdn.net/wp-content/uploads/2022/03/hero-oahu.jpg",
        info: "80% OFF",
        continent: "Amerika",
        city_from: "Jakarta",
        city_to: "Hawaii",
        airlines: "Cathay Pacific",
        date: "20 - 30 Juli",
        price: 19151700,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        image_destinasi:
          "https://anekatempatwisata.com/wp-content/uploads/2016/02/Purnululu-National-Park.jpg",
        info: "Limited!",
        continent: "Australia",
        city_from: "Jakarta",
        city_to: "Australia",
        airlines: "Batik Air",
        date: "01 - 10 Agustus",
        price: 4911795,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        image_destinasi:
          "https://res.klook.com/image/upload/Mobile/City/swox6wjsl5ndvkv5jvum.jpg",
        info: "Limited!",
        continent: "Eropa",
        city_from: "Jakarta",
        city_to: "Paris",
        airlines: "Qatar Airways",
        date: "10 - 15 Agustus",
        price: 7478200,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        image_destinasi:
          "https://asset.kompas.com/crops/8srCmE8900NF5ApEz9lFx2YcFSA=/26x0:970x629/750x500/data/photo/2019/10/13/5da2fd916d120.jpg",
        info: "80% OFF",
        continent: "Afrika",
        city_from: "Jakarta",
        city_to: "Mesir",
        airlines: "Cathay Pacific",
        date: "18 - 23 Agustus",
        price: 13000200,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("destinasifavorites", null, {});
  },
};
