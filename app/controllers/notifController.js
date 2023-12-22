const { Notif } = require("../models");

module.exports = {
  async getNotif(req, res) {
    try {
      const idUser = req.user.id;

      const notifData = await Notif.findAll({
        where: {
          usersId: idUser,
        },
      });

      if (notifData.length === 0) {
        res.status(404).json({
          message: "No notificaton data found",
          data: [],
        });
        return;
      }
      res.status(200).json({
        message: "Notification data retrieved successfully",
        data: notifData,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error,
      });
    }
  },

  async deleteAllDataNotif(req, res) {
    Notif.destroy({
      truncate: true,
    })
      .then(() => {
        res.status(200).json({
          status: "Success",
          message: "Notif Data deleted successfully",
        });
      })
      .catch((error) => {
        res.status(422).json(error);
      });
  },
};
