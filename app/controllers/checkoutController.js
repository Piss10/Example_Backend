const { Checkout } = require("../models");
const { Passenger } = require("../models");
const { Ticket } = require("../models");
const { Notif } = require("../models");
const { v4: uuid } = require("uuid");
const { Op } = require("sequelize");

module.exports = {
  async createCheckout(req, res) {
    try {
      const {
        departureTicketsId,
        returnTicketsId,
        total_passenger,
        passengers,
      } = req.body;

      // Get the current authenticated user ID
      const usersId = req.user.id; // Ganti `req.user.id` dengan cara yang sesuai untuk mengakses ID pengguna saat ini

      // check if the provided ticketsId exists in the Ticket Table
      const departureTicket = await Ticket.findOne({
        where: {
          id: departureTicketsId,
        },
      });

      if (!departureTicket) {
        res.status(400).json({
          status: "Failed",
          message: "Invalid ticketsId, Ticket does not exist",
        });
        return;
      }

      let returnTotalPrice = 0;

      if (returnTicketsId !== undefined && returnTicketsId !== null) {
        // check if the provided returnTicketsId exists in the Ticket Table
        const returnTicket = await Ticket.findOne({
          where: {
            id: returnTicketsId,
          },
        });

        if (!returnTicket) {
          res.status(400).json({
            status: "Failed",
            message: "Invalid returnTicketsId, Ticket does not exist",
          });
          return;
        }

        // Calculate the total price for return tickets
        returnTotalPrice = total_passenger * returnTicket.price;
      }

      // Calculate the total price for departure tickets
      const departureTotalPrice = total_passenger * departureTicket.price;

      // Create departure checkout
      const checkout = await Checkout.create({
        id: uuid(),
        departureTicketsId: departureTicketsId,
        returnTicketsId: returnTicketsId,
        total_passenger,
        total_price: departureTotalPrice + returnTotalPrice,
        usersId,
      });

      // Create passengers for departure ticket
      for (const passengerData of passengers) {
        await Passenger.create({
          id: uuid(),
          checkoutsId: checkout.id,
          departureTicketsId: departureTicketsId,
          returnTicketsId: returnTicketsId,
          name: passengerData.name,
          email: passengerData.email,
          phone: passengerData.phone,
          familyName: passengerData.familyName,
          title: passengerData.title,
          dateofbirth: passengerData.dateofbirth,
          citizenship: passengerData.citizenship,
          ktppaspor: passengerData.ktppaspor,
          issuingcountry: passengerData.issuingcountry,
          expirationdatepass: passengerData.expirationdatepass,
        });
      }

      res.status(201).json({
        status: "Success",
        message: "Checkout created successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  async getAllCheckoutData(req, res) {
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
      });

      if (checkoutData.length === 0) {
        // jika transaction tidak ada
        res.status(404).json({
          message: "No Checkout data found",
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
        message: "Checkout data retrieved successfully",
        data: formattedCheckoutData,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error,
      });
    }
  },
  async getDataCheckoutById(req, res) {
    try {
      const idCheckout = req.params.id; // Mengambil ID pengguna dari token
      const checkoutData = await Checkout.findAll({
        where: {
          id: idCheckout, // Menggunakan ID pengguna dalam kondisi WHERE
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
      });

      if (checkoutData.length === 0) {
        // jika transaction tidak ada
        res.status(404).json({
          message: "No checkout data found",
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
        message: "Checkout data by id retrieved successfully",
        data: formattedCheckoutData,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error,
      });
    }
  },
  async updateCheckoutData(req, res) {
    const idCheckout = req.params.id;

    const findDataCheckoutId = async () => {
      return await Checkout.findOne({
        where: {
          id: idCheckout,
        },
      });
    };

    Checkout.update({
      id: uuid(),
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      familyName: req.body.familyName,
      title: req.body.title,
      dateofbirth: req.body.dateofbirth,
      citizenship: req.body.citizenship,
      ktppaspor: req.body.ktppaspor,
      issuingcountry: req.body.issuingcountry,
      expirationdatepass: req.body.expirationdatepass,
    })
      .then(() => {
        res.status(200).json({
          status: "Success",
          message: "Update Data Checkout Successfully",
        });
      })
      .catch((err) => {
        res.status(422).json(err);
      });
  },
  async deleteCheckout(req, res) {
    try {
      const idCheckout = req.params.id;
      Checkout.destroy({
        where: {
          id: idCheckout,
        },
      })
        .then(() => {
          res.status(200).json({
            status: "Success",
            message: "Checkout Data Deleted successfully",
          });
        })
        .catch((err) => {
          res.status(422).json(err);
        });
    } catch (error) {
      res.status(500).json({
        status: "Erro",
        message: error.message,
      });
    }
  },
  async deleteAllDataCheckout(req, res) {
    Checkout.destroy({ truncate: true })
      .then(() => {
        res.status(200).json({
          status: "Success",
          message: "Checkout Data deleted successfully",
        });
      })
      .catch((error) => {
        res.status(422).json(error);
      });
  },
};
