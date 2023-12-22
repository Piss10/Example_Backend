const { Passenger } = require("../models");

module.exports = {
  async deleteAllDataPass(req, res) {
    Passenger.destroy({ truncate: true })
      .then(() => {
        res.status(200).json({
          status: "Success",
          message: "Passenger Data deleted successfully",
        });
      })
      .catch((error) => {
        res.status(422).json(error);
      });
  },
};
