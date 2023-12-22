const { user } = require("../models");
const bcrypt = require("bcrypt");
const salt = 10;

function encryptPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, encryptedPassword) => {
      if (!!err) {
        reject(err);
        return;
      }
      resolve(encryptedPassword);
    });
  });
}

module.exports = {
  async getAllUserData(req, res) {
    const findAll = () => {
      return user.findAll();
    };
    try {
      const dataUsers = await findAll();
      if (!dataUsers) {
        res.status(404).json({
          status: "Failed",
          message: "Data not found",
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Get All Data User Success",
        data: dataUsers,
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: error.message,
      });
    }
  },

  async getUserById(req, res) {
    try {
      const idUser = req.params.id;
      const findUserId = () => {
        return user.findOne({
          where: { id: idUser },
        });
      };

      const dataUsersId = await findUserId();

      if (!dataUsersId) {
        res.status(404).json({
          status: "Failed",
          message: "User not found",
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Get Data User Successfully",
        data: dataUsersId,
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: error.message,
      });
    }
  },

  async updateUserData(req, res) {
    const idUser = req.params.id;

    const findUserId = async () => {
      return await user.findOne({
        where: { id: idUser },
      });
    };

    const dataUsersId = await findUserId();

    user
      .update(
        {
          name: req.body.name,
          phone: req.body.phone,
          email: req.body.email,
        },
        {
          where: { id: req.params.id },
        }
      )
      .then(() => {
        res.status(200).json({
          status: "Success",
          message: "Update Data User Successfully",
        });
      })
      .catch((err) => {
        res.status(422).json(err);
      });
  },

  // async updatedPassword(req, res) {
  //   const password = await encryptPassword(req.body.password);
  //   const idUser = req.params.id;
  //   user
  //     .update(
  //       {
  //         password,
  //       },
  //       {
  //         where: { id: idUser },
  //       }
  //     )
  //     .then(() => {
  //       res.status(200).json({
  //         status: "Success",
  //         message: "Update Password Success",
  //       });
  //     })
  //     .catch((err) => {
  //       res.status(422).json(err);
  //     });
  // },
  async deleteUser(req, res) {
    try {
      const idUser = req.params.id;
      user
        .destroy({
          where: { id: idUser },
        })
        .then(() => {
          res.status(200).json({
            status: "Success",
            message: "User Data deleted successfully",
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
