const { Payment } = require("../models");
const { Notif } = require("../models");
const { v4: uuid } = require("uuid");

module.exports = {
  async createPayment(req, res) {
    try {
      const { cardNumber, cardHolderName, cvc, expiration, country } = req.body;
      const usersId = req.user.id;
      const paymentForm = await Payment.create({
        id: uuid(),
        usersId,
        cardNumber: cardNumber,
        cardHolderName: cardHolderName,
        cvc: cvc,
        expiration: expiration,
        country: country,
        status: true,
      });

      // create notification
      const message = `Ticket payment successful! Enjoy your trip`;

      const notif = await Notif.create({
        id: uuid(),
        message: message,
        usersId: usersId,
        read: false,
      });

      res.status(201).json({
        status: "Success",
        message: "Created payment Success",
        data: paymentForm,
      });
    } catch (error) {
      res.status(400).json({
        status: "Failed",
        message: error.message,
      });
    }
  },

  async getAllPaymentData(req, res) {
    const findAll = () => {
      return Payment.findAll();
    };
    try {
      const dataPayment = await findAll();
      if (!dataPayment) {
        res.status(404).json({
          status: "Failed",
          message: "Data not found",
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Get All Data Payment Success",
        data: dataPayment,
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: error.message,
      });
    }
  },

  async getPaymentById(req, res) {
    try {
      const idPayment = req.params.id;
      const findPaymentId = () => {
        return Payment.findOne({
          where: { id: idPayment },
        });
      };

      const dataPaymentId = await findPaymentId();

      if (!dataPaymentId) {
        res.status(404).json({
          status: "Failed",
          message: "Data not found",
          data: {},
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Get Data Payment Successfully",
        data: dataPaymentId,
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: error.message,
        data: {},
      });
    }
  },

  async deleteAllDataPayment(req, res) {
    Payment.destroy({ truncate: true })
      .then(() => {
        res.status(200).json({
          status: "Success",
          message: "Payment Data deleted successfully",
        });
      })
      .catch((error) => {
        res.status(422).json(error);
      });
  },
};
