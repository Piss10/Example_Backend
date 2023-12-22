const { destinasifavorite } = require("../models");
const { v4: uuid } = require("uuid");
const { Op } = require("sequelize");

module.exports = {
  async createdesfav(req, res) {
    try {
      const {
        image_destinasi,
        continent,
        city_from,
        city_to,
        airlines,
        date,
        price,
      } = req.body;

      const destfavForm = await destinasifavorite.create({
        id: uuid(),
        image_destinasi: image_destinasi,
        continent: continent,
        city_from: city_from,
        city_to: city_to,
        airlines: airlines,
        date: date,
        price: price,
      });

      res.status(201).json({
        status: "Success",
        message: "Created Destinasi Favorite Success",
        data: destfavForm,
      });
    } catch (error) {
      res.status(400).json({
        status: "Failed",
        message: error.message,
      });
    }
  },

  async getAllDestFavData(req, res) {
    const continent = req.query.continent ? req.query.continent : "";

    const querySearch = {
      continent: {
        [Op.iLike]: `%${continent}`,
      },
    };
    const findAll = () => {
      return destinasifavorite.findAll({
        where: querySearch,
      });
    };
    try {
      const dataDestFav = await findAll();
      if (!dataDestFav) {
        res.status(404).json({
          status: "Failed",
          message: "Data not found",
          data: {},
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Get All Data Destinasi Favorit Success",
        data: dataDestFav,
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: error.message,
      });
    }
  },

  async getDestinasiById(req, res) {
    try {
      const idDestFav = req.params.id;
      const findDestFavId = () => {
        return destinasifavorite.findOne({
          where: { id: idDestFav },
        });
      };

      const dataDestFavId = await findDestFavId();

      if (!dataDestFavId) {
        res.status(404).json({
          status: "Failed",
          message: "Data not found",
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Get Data Destinasi Successfully",
        data: dataDestFavId,
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: error.message,
      });
    }
  },

  async deleteDestFav(req, res) {
    try {
      const idDestFav = req.params.id;
      destinasifavorite
        .destroy({
          where: { id: idDestFav },
        })
        .then(() => {
          res.status(200).json({
            status: "Success",
            message: "Destinasi Data deleted successfully",
          });
        })
        .catch((err) => {
          res.status(422).json(err);
        });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: error.message,
      });
    }
  },
};
