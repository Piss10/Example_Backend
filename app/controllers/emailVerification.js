const { user } = require("../models");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const checkEmail = async (email) => {
  return await user.findOne({
    where: {
      email,
    },
  });
};

module.exports = {
  // find user by email
  async findEmail(email) {
    return user.findOne({
      where: {
        email,
      },
    });
  },

  // check verified
  async checkVerified(email) {
    return user.findOne({
      where: {
        email,
      },
    });
  },
};
