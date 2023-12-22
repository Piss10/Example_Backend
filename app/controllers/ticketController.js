const { Ticket } = require("../models");
const { v4: uuid } = require("uuid");
const { Op } = require("sequelize");

module.exports = {
  async createTicket(req, res) {
    try {
      const {
        city_from,
        city_to,
        airlines,
        airport_from,
        airport_to,
        dateDeparture,
        dateReturn,
        dateEnd,
        type_seat,
        total_passenger,
        adult_price,
        child_price,
        price,
        available,
      } = req.body;

      const addTicket = await Ticket.create({
        id: uuid(),
        city_from: city_from,
        city_to: city_to,
        airlines: airlines,
        airport_from: airport_from,
        airport_to: airport_to,
        dateDeparture: dateDeparture,
        dateReturn: dateReturn,
        dateEnd: dateEnd,
        type_seat: type_seat,
        total_passenger: total_passenger,
        adult_price: adult_price,
        child_price: child_price,
        price: price,
        available: available,
      });
      res.status(201).json({
        status: "Success",
        message: "Created Ticket Success",
        data: addTicket,
      });
    } catch (error) {
      res.status(400).json({
        status: "Failed",
        message: error.message,
      });
    }
  },

  async getAllTickets(req, res) {
    const city_from = req.query.city_from ? req.query.city_from : "";
    const city_to = req.query.city_to ? req.query.city_to : "";
    const type_seat = req.query.type_seat ? req.query.type_seat : "";
    const dateDeparture = req.query.dateDeparture
      ? req.query.dateDeparture
      : "";
    const dateEnd = req.query.dateEnd ? req.query.dateEnd : "";
    const dateReturn = req.query.dateReturn ? req.query.dateReturn : "";

    const querySearch = {
      city_from: {
        [Op.iLike]: `%${city_from}`,
      },
      city_to: {
        [Op.iLike]: `%${city_to}`,
      },
      type_seat: {
        [Op.iLike]: `%${type_seat}`,
      },
    };

    if (dateDeparture && Date.parse(dateDeparture)) {
      querySearch.dateDeparture = {
        [Op.eq]: dateDeparture,
      };
    }
    if (dateEnd && Date.parse(dateEnd)) {
      querySearch.dateEnd = {
        [Op.eq]: dateEnd,
      };
    }
    if (dateReturn && Date.parse(dateReturn)) {
      querySearch.dateReturn = {
        [Op.eq]: dateReturn,
      };
    }
    const tickets = await Ticket.findAll({
      where: querySearch,
    });
    if ((dateDeparture && !tickets.length) || (dateReturn && !tickets.length)) {
      res.status(404).json({
        status: "Error",
        message: "No tickets found",
      });
    } else {
      res.status(200).json({
        status: "Success",
        message: "Get All Data Ticket Success",
        data: tickets,
      });
    }
  },

  async getTicketById(req, res) {
    try {
      const idTicket = req.params.id;
      const findTicketId = () => {
        return Ticket.findOne({
          where: {
            id: idTicket,
          },
        });
      };
      const dataTicketId = await findTicketId();
      if (!dataTicketId) {
        res.status(404).json({
          status: "Failed",
          message: "Ticket not found",
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Get Data Ticket Successfully",
        data: dataTicketId,
      });
    } catch (error) {
      res.status(500).json({
        status: "Failed",
        message: error.message,
      });
    }
  },

  // async updateTicketData(req, res) {
  //   const idTicket = req.params.id;

  //   const updateData = {
  //     dateDeparture: req.body.dateDeparture,
  //     total_passenger: req.body.total_passenger,
  //   };

  //   if (req.body.dateReturn) {
  //     updateData.dateReturn = req.body.dateReturn;
  //   }

  //   try {
  //     const ticket = await Ticket.findByPk(idTicket);
  //     // Hitung total price baru
  //     const totalPrice = ticket.price * updateData.total_passenger;
  //     // Update total_price di data tiket
  //     ticket.total_price = totalPrice;

  //     await ticket.save();

  //     await Ticket.update(updateData, {
  //       where: { id: idTicket },
  //     });

  //     res.status(200).json({
  //       status: "Success",
  //       message: "Update Data Ticket Successfully",
  //       data: ticket,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({
  //       status: "Error",
  //       message: "Failed to update ticket data",
  //     });
  //   }
  // },
};
