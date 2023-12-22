const {
  createTicket,
  getAllTickets,
  getTicketById,
} = require("../../app/controllers/ticketController");
const { Ticket } = require("../../app/models");

describe("Ticket Controller", () => {
  describe("createTicket", () => {
    test("should create ticket and send success response", async () => {
      const req = {
        body: {
          city_from: "City A",
          city_to: "City B",
          airlines: "Airline A",
          airport_from: "Airport A",
          airport_to: "Airport B",
          dateDeparture: "2023-06-28",
          dateReturn: "2023-06-30",
          dateEnd: "2023-07-01",
          type_seat: "Economy",
          total_passenger: 2,
          adult_price: 100,
          child_price: 50,
          price: 250,
          available: true,
        },
      };

      const createdTicket = {
        id: "ticket-id-1",
        ...req.body,
      };

      const createMock = jest
        .spyOn(Ticket, "create")
        .mockResolvedValue(createdTicket);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createTicket(req, res);

      expect(createMock).toHaveBeenCalledWith({
        id: expect.any(String),
        ...req.body,
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Created Ticket Success",
        data: createdTicket,
      });
    });

    test("should handle error and send error response", async () => {
      const req = {
        body: {
          city_from: "City A",
          city_to: "City B",
          airlines: "Airline A",
          airport_from: "Airport A",
          airport_to: "Airport B",
          dateDeparture: "2023-06-28",
          dateReturn: "2023-06-30",
          dateEnd: "2023-07-01",
          type_seat: "Economy",
          total_passenger: 2,
          adult_price: 100,
          child_price: 50,
          price: 250,
          available: true,
        },
      };

      const error = new Error("Failed to create ticket");

      const createMock = jest.spyOn(Ticket, "create").mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      console.log = jest.fn(); // Mock console.log to prevent console output in tests

      await createTicket(req, res);

      expect(createMock).toHaveBeenCalledWith({
        id: expect.any(String),
        ...req.body,
      });

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        message: error.message,
      });

      expect(console.log).toHaveBeenCalledWith(error); // Verify that the error is logged
    });
  });

  describe("getAllTickets", () => {
    test("should get all tickets successfully with query parameters", async () => {
      const req = {
        query: {
          city_from: "City A",
          city_to: "City B",
          type_seat: "Economy",
          dateDeparture: "2023-06-28",
          dateEnd: "2023-07-01",
          dateReturn: "2023-06-30",
        },
      };

      const tickets = [
        {
          id: "ticket-id-1",
          city_from: "City A",
          city_to: "City B",
          type_seat: "Economy",
          dateDeparture: "2023-06-28",
          dateEnd: "2023-07-01",
          dateReturn: "2023-06-30",
        },
      ];

      const findAllMock = jest
        .spyOn(Ticket, "findAll")
        .mockResolvedValue(tickets);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllTickets(req, res);

      const querySearch = {
        city_from: {
          [Op.iLike]: `%${req.query.city_from}`,
        },
        city_to: {
          [Op.iLike]: `%${req.query.city_to}`,
        },
        type_seat: {
          [Op.iLike]: `%${req.query.type_seat}`,
        },
      };

      if (req.query.dateDeparture && Date.parse(req.query.dateDeparture)) {
        querySearch.dateDeparture = {
          [Op.eq]: req.query.dateDeparture,
        };
      }

      if (req.query.dateEnd && Date.parse(req.query.dateEnd)) {
        querySearch.dateEnd = {
          [Op.eq]: req.query.dateEnd,
        };
      }

      if (req.query.dateReturn && Date.parse(req.query.dateReturn)) {
        querySearch.dateReturn = {
          [Op.eq]: req.query.dateReturn,
        };
      }

      expect(findAllMock).toHaveBeenCalledWith({
        where: querySearch,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Get All Data Ticket Success",
        data: tickets,
      });
    });

    test("should handle error and send error response", async () => {
      const req = {
        query: {
          city_from: "City A",
          city_to: "City B",
          type_seat: "Economy",
          dateDeparture: "2023-06-28",
          dateEnd: "2023-07-01",
          dateReturn: "2023-06-30",
        },
      };

      const error = new Error("Failed to get tickets");

      const findAllMock = jest
        .spyOn(Ticket, "findAll")
        .mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      console.log = jest.fn(); // Mock console.log to prevent console output in tests

      await getAllTickets(req, res);

      const querySearch = {
        city_from: {
          [Op.iLike]: `%${req.query.city_from}`,
        },
        city_to: {
          [Op.iLike]: `%${req.query.city_to}`,
        },
        type_seat: {
          [Op.iLike]: `%${req.query.type_seat}`,
        },
      };

      if (req.query.dateDeparture && Date.parse(req.query.dateDeparture)) {
        querySearch.dateDeparture = {
          [Op.eq]: req.query.dateDeparture,
        };
      }

      if (req.query.dateEnd && Date.parse(req.query.dateEnd)) {
        querySearch.dateEnd = {
          [Op.eq]: req.query.dateEnd,
        };
      }

      if (req.query.dateReturn && Date.parse(req.query.dateReturn)) {
        querySearch.dateReturn = {
          [Op.eq]: req.query.dateReturn,
        };
      }

      expect(findAllMock).toHaveBeenCalledWith({
        where: querySearch,
      });

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        message: error.message,
      });

      expect(console.log).toHaveBeenCalledWith(error); // Verify that the error is logged
    });

    test("should handle no tickets found and send error response", async () => {
      const req = {
        query: {
          city_from: "City A",
          city_to: "City B",
          type_seat: "Economy",
          dateDeparture: "2023-06-28",
          dateEnd: "2023-07-01",
          dateReturn: "2023-06-30",
        },
      };

      const findAllMock = jest.spyOn(Ticket, "findAll").mockResolvedValue([]);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllTickets(req, res);

      const querySearch = {
        city_from: {
          [Op.iLike]: `%${req.query.city_from}`,
        },
        city_to: {
          [Op.iLike]: `%${req.query.city_to}`,
        },
        type_seat: {
          [Op.iLike]: `%${req.query.type_seat}`,
        },
      };

      if (req.query.dateDeparture && Date.parse(req.query.dateDeparture)) {
        querySearch.dateDeparture = {
          [Op.eq]: req.query.dateDeparture,
        };
      }

      if (req.query.dateEnd && Date.parse(req.query.dateEnd)) {
        querySearch.dateEnd = {
          [Op.eq]: req.query.dateEnd,
        };
      }

      if (req.query.dateReturn && Date.parse(req.query.dateReturn)) {
        querySearch.dateReturn = {
          [Op.eq]: req.query.dateReturn,
        };
      }

      expect(findAllMock).toHaveBeenCalledWith({
        where: querySearch,
      });

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: "Error",
        message: "No tickets found",
      });
    });
  });

  describe("getTicketById", () => {
    test("should get ticket by ID successfully", async () => {
      const req = {
        params: {
          id: "ticket-id-1",
        },
      };

      const ticket = {
        id: "ticket-id-1",
        city_from: "City A",
        city_to: "City B",
        type_seat: "Economy",
        dateDeparture: "2023-06-28",
        dateEnd: "2023-07-01",
        dateReturn: "2023-06-30",
      };

      const findOneMock = jest
        .spyOn(Ticket, "findOne")
        .mockResolvedValue(ticket);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getTicketById(req, res);

      expect(findOneMock).toHaveBeenCalledWith({
        where: {
          id: req.params.id,
        },
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Get Data Ticket Successfully",
        data: ticket,
      });
    });

    test("should handle ticket not found and send error response", async () => {
      const req = {
        params: {
          id: "ticket-id-1",
        },
      };

      const findOneMock = jest.spyOn(Ticket, "findOne").mockResolvedValue(null);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getTicketById(req, res);

      expect(findOneMock).toHaveBeenCalledWith({
        where: {
          id: req.params.id,
        },
      });

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        message: "Ticket not found",
      });
    });

    test("should handle error and send error response", async () => {
      const req = {
        params: {
          id: "ticket-id-1",
        },
      };

      const error = new Error("Failed to get ticket");

      const findOneMock = jest
        .spyOn(Ticket, "findOne")
        .mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      console.log = jest.fn(); // Mock console.log to prevent console output in tests

      await getTicketById(req, res);

      expect(findOneMock).toHaveBeenCalledWith({
        where: {
          id: req.params.id,
        },
      });

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        message: error.message,
      });

      expect(console.log).toHaveBeenCalledWith(error); // Verify that the error is logged
    });
  });
});
