const { Ticket } = require("../models");
const { Transaction } = require("../models");
const { Checkout } = require("../models");
const { Passenger } = require("../models");
const { user } = require("../models");
const { Op } = require("sequelize");
const { v4: uuid } = require("uuid");

module.exports = {
  async getAllTransactionData(req, res) {
    try {
      const idUser = req.user.id; // Mengambil ID pengguna dari token
      const checkoutData = await Checkout.findAll({
        where: {
          usersId: idUser, // Menggunakan ID pengguna dalam kondisi WHERE
        },
        include: [
          {
            model: Passenger,
          },
          {
            model: Ticket,
            as: "DepartureTicket",
            where: {
              id: { [Op.col]: "Checkout.departureTicketsId" },
            },
          },
          {
            model: Ticket,
            as: "ReturnTicket",
            where: {
              id: { [Op.col]: "Checkout.returnTicketsId" },
            },
            required: false,
          },
        ],
        order: [["createdAt", "DESC"]], // Menambahkan pengurutan berdasarkan createdAt secara menurun (data terbaru)
      });

      if (checkoutData.length === 0) {
        // jika transaksi tidak ada
        res.status(404).json({
          message: "No transaction data found",
          data: [],
        });
        return;
      }

      const formattedCheckoutData = checkoutData.map((checkout) => {
        const departureTicketPrice = checkout.DepartureTicket
          ? checkout.DepartureTicket.price
          : 0;
        const returnTicketPrice = checkout.ReturnTicket
          ? checkout.ReturnTicket.price
          : 0;
        const totalPassenger = checkout.total_passenger;
        const totalPrice =
          (departureTicketPrice + returnTicketPrice) * totalPassenger;

        return {
          id: checkout.id,
          usersId: checkout.usersId,
          departureTicketsId: checkout.departureTicketsId,
          returnTicketsId: checkout.returnTicketsId,
          total_passenger: checkout.total_passenger,
          createdAt: checkout.createdAt,
          updatedAt: checkout.updatedAt,
          departureTicket: checkout.DepartureTicket,
          returnTicket: checkout.ReturnTicket,
          total_price: totalPrice,
          passengers: checkout.Passengers,
        };
      });

      res.status(200).json({
        status: "Success",
        message: "Transaction data successfully obtained",
        data: formattedCheckoutData,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error,
      });
    }
  },
  async getDataTransactionById(req, res) {
    try {
      const usersId = req.user.id; // Menggunakan ID pengguna saat ini

      const transactions = await Transaction.findAll({
        where: {
          usersId,
        },
        include: [
          {
            model: Ticket,
            as: "tickets",
          },
          {
            model: Checkout,
            as: "checkouts",
          },
        ],
      });

      res.status(200).json({
        data: transactions,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  async getAllTransactionDataAdmin(req, res) {
    try {
      const checkoutData = await Checkout.findAll({
        include: [
          {
            model: Passenger,
          },
          {
            model: Ticket,
            as: "DepartureTicket",
            where: {
              id: { [Op.col]: "Checkout.departureTicketsId" },
            },
          },
          {
            model: Ticket,
            as: "ReturnTicket",
            where: {
              id: { [Op.col]: "Checkout.returnTicketsId" },
            },
            required: false,
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      if (checkoutData.length === 0) {
        res.status(404).json({
          message: "No transaction data found",
          data: [],
        });
        return;
      }

      const formattedCheckoutData = checkoutData.map((checkout) => {
        const departureTicketPrice = checkout.DepartureTicket
          ? checkout.DepartureTicket.price
          : 0;
        const returnTicketPrice = checkout.ReturnTicket
          ? checkout.ReturnTicket.price
          : 0;
        const totalPassenger = checkout.total_passenger;
        const totalPrice =
          (departureTicketPrice + returnTicketPrice) * totalPassenger;

        return {
          id: checkout.id,
          usersId: checkout.usersId,
          departureTicketsId: checkout.departureTicketsId,
          returnTicketsId: checkout.returnTicketsId,
          total_passenger: checkout.total_passenger,
          createdAt: checkout.createdAt,
          updatedAt: checkout.updatedAt,
          departureTicket: checkout.DepartureTicket,
          returnTicket: checkout.ReturnTicket,
          total_price: totalPrice,
          passengers: checkout.Passengers,
        };
      });

      res.status(200).json({
        status: "Success",
        message: "Transaction data successfully obtained",
        data: formattedCheckoutData,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error,
      });
    }
  },

  async updateDataTrans(req, res) {
    try {
      const idDataTrans = req.params.id;

      // Mengambil data user dari model User berdasarkan ID user
      const iduser = await user.findByPk(req.body.userId);

      // Mengambil data tiket dari model Ticket berdasarkan ID tiket
      const ticket = await Ticket.findByPk(req.body.ticketId);

      // Menghitung total amount berdasarkan price tiket dan quantity
      const amount = ticket.price * req.body.quantity;

      // Membuat transaksi baru dengan data yang diambil
      const transaction = await Transaction.update(
        {
          id: uuid(),
          usersId: iduser.id,
          ticketsId: ticket.id,
          amounts: amount,
          date: req.body.date,
          status: "Success",
        },
        {
          where: { id: idDataTrans },
        }
      );

      res.status(200).json({
        status: "Success",
        message: "Update Data Transaction Successfully",
        data: transaction,
      });
    } catch (error) {
      res.status(500).json({
        status: "Failed",
        message: error.message,
      });
    }
  },

  async deleteDataTrans(req, res) {
    try {
      const idDataTrans = req.params.id;
      Transaction.destroy({
        where: {
          id: idDataTrans,
        },
      })
        .then(() => {
          res.status(200).json({
            status: "Success",
            message: "Transaction Data deleted successfully",
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

  async deleteAllDataTrans(req, res) {
    Transaction.destroy({ truncate: true })
      .then(() => {
        res.status(200).json({
          status: "Success",
          message: "Transaction Data deleted successfully",
        });
      })
      .catch((error) => {
        res.status(422).json(error);
      });
  },
};
