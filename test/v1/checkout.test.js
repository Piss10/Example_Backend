const { Checkout, Passenger, Ticket } = require("../../app/models");
const { v4: uuid } = require("uuid");
const { Op } = require("sequelize");
const {
  createCheckout,
  getAllCheckoutData,
  getDataCheckoutById,
  updateCheckoutData,
  deleteCheckout,
  deleteAllDataCheckout,
} = require("../../app/controllers/checkoutController");

jest.mock("../../app/models");

describe("checkout", () => {
  describe("createCheckout", () => {
    test("should create checkout and passengers correctly", async () => {
      const req = {
        body: {
          departureTicketsId: "departureTicketId",
          returnTicketsId: "returnTicketId",
          total_passenger: 2,
          passengers: [
            {
              name: "John Doe",
              email: "john.doe@example.com",
              phone: "123456789",
              familyName: "Doe",
              title: "Mr.",
              dateofbirth: "1990-01-01",
              citizenship: "US",
              ktppaspor: "1234567890",
              issuingcountry: "US",
              expirationdatepass: "2025-01-01",
            },
            {
              name: "Jane Doe",
              email: "jane.doe@example.com",
              phone: "987654321",
              familyName: "Doe",
              title: "Ms.",
              dateofbirth: "1992-01-01",
              citizenship: "US",
              ktppaspor: "0987654321",
              issuingcountry: "US",
              expirationdatepass: "2026-01-01",
            },
          ],
        },
        user: {
          id: "userId",
        },
      };

      const departureTicket = {
        id: "departureTicketId",
        price: 100,
      };

      const returnTicket = {
        id: "returnTicketId",
        price: 50,
      };

      const createdCheckout = {
        id: "checkoutId",
        departureTicketsId: "departureTicketId",
        returnTicketsId: "returnTicketId",
        total_passenger: 2,
      };

      Checkout.create.mockResolvedValueOnce(createdCheckout);
      Ticket.findOne.mockResolvedValueOnce(departureTicket);
      Ticket.findOne.mockResolvedValueOnce(returnTicket);
      Passenger.create.mockResolvedValueOnce({});
      Passenger.create.mockResolvedValueOnce({});

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createCheckout(req, res);

      expect(Checkout.create).toHaveBeenCalledWith({
        id: expect.any(String),
        departureTicketsId: "departureTicketId",
        returnTicketsId: "returnTicketId",
        total_passenger: 2,
        total_price: 300,
        usersId: "userId",
      });

      expect(Ticket.findOne).toHaveBeenCalledTimes(2);
      expect(Ticket.findOne).toHaveBeenCalledWith({
        where: {
          id: "departureTicketId",
        },
      });
      expect(Ticket.findOne).toHaveBeenCalledWith({
        where: {
          id: "returnTicketId",
        },
      });

      expect(Passenger.create).toHaveBeenCalledTimes(2);
      expect(Passenger.create).toHaveBeenCalledWith({
        id: expect.any(String),
        checkoutsId: "checkoutId",
        departureTicketsId: "departureTicketId",
        returnTicketsId: "returnTicketId",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "123456789",
        familyName: "Doe",
        title: "Mr.",
        dateofbirth: "1990-01-01",
        citizenship: "US",
        ktppaspor: "1234567890",
        issuingcountry: "US",
        expirationdatepass: "2025-01-01",
      });
      expect(Passenger.create).toHaveBeenCalledWith({
        id: expect.any(String),
        checkoutsId: "checkoutId",
        departureTicketsId: "departureTicketId",
        returnTicketsId: "returnTicketId",
        name: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "987654321",
        familyName: "Doe",
        title: "Ms.",
        dateofbirth: "1992-01-01",
        citizenship: "US",
        ktppaspor: "0987654321",
        issuingcountry: "US",
        expirationdatepass: "2026-01-01",
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Checkout created successfully",
      });
    });

    test("should handle error when creating checkout", async () => {
      const req = {
        body: {
          departureTicketsId: "departureTicketId",
          returnTicketsId: "returnTicketId",
          total_passenger: 2,
          passengers: [
            {
              name: "John Doe",
              email: "john.doe@example.com",
              phone: "123456789",
              familyName: "Doe",
              title: "Mr.",
              dateofbirth: "1990-01-01",
              citizenship: "US",
              ktppaspor: "1234567890",
              issuingcountry: "US",
              expirationdatepass: "2025-01-01",
            },
            {
              name: "Jane Doe",
              email: "jane.doe@example.com",
              phone: "987654321",
              familyName: "Doe",
              title: "Ms.",
              dateofbirth: "1992-01-01",
              citizenship: "US",
              ktppaspor: "0987654321",
              issuingcountry: "US",
              expirationdatepass: "2026-01-01",
            },
          ],
        },
        user: {
          id: "userId",
        },
      };

      const error = new Error("Failed to create checkout");

      Checkout.create.mockRejectedValueOnce(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createCheckout(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  describe("getAllCheckoutData", () => {
    test("should retrieve all checkout data for the authenticated user", async () => {
      const req = {
        user: {
          id: "userId",
        },
      };

      const departureTicket = {
        id: "departureTicketId",
        price: 100,
      };

      const returnTicket = {
        id: "returnTicketId",
        price: 50,
      };

      const checkoutData = [
        {
          id: "checkoutId1",
          departureTicketsId: "departureTicketId",
          returnTicketsId: "returnTicketId",
          total_passenger: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          DepartureTicket: departureTicket,
          ReturnTicket: returnTicket,
          Passengers: [],
        },
      ];

      Checkout.findAll.mockResolvedValueOnce(checkoutData);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllCheckoutData(req, res);

      expect(Checkout.findAll).toHaveBeenCalledWith({
        where: {
          usersId: "userId",
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

      const formattedCheckoutData = [
        {
          id: "checkoutId1",
          usersId: undefined,
          departureTicketsId: "departureTicketId",
          returnTicketsId: "returnTicketId",
          total_passenger: 2,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          departureTicket: departureTicket,
          returnTicket: returnTicket,
          total_price: 300,
          passengers: [],
        },
      ];

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transaction data retrieved successfully",
        data: formattedCheckoutData,
      });
    });

    test("should handle case when no checkout data found", async () => {
      const req = {
        user: {
          id: "userId",
        },
      };

      const checkoutData = [];

      Checkout.findAll.mockResolvedValueOnce(checkoutData);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllCheckoutData(req, res);

      expect(Checkout.findAll).toHaveBeenCalledWith({
        where: {
          usersId: "userId",
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

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "No transaction data found",
        data: [],
      });
    });

    test("should handle error when retrieving checkout data", async () => {
      const req = {
        user: {
          id: "userId",
        },
      };

      const error = new Error("Failed to retrieve checkout data");

      Checkout.findAll.mockRejectedValueOnce(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllCheckoutData(req, res);

      expect(Checkout.findAll).toHaveBeenCalledWith({
        where: {
          usersId: "userId",
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

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: error,
      });
    });
  });

  describe("getDataCheckoutById", () => {
    test("should retrieve checkout data by ID", async () => {
      const req = {
        params: {
          id: "checkoutId",
        },
        user: {
          id: "userId",
        },
      };

      const departureTicket = {
        id: "departureTicketId",
        price: 100,
      };

      const returnTicket = {
        id: "returnTicketId",
        price: 50,
      };

      const checkoutData = {
        id: "checkoutId",
        departureTicketsId: "departureTicketId",
        returnTicketsId: "returnTicketId",
        total_passenger: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        DepartureTicket: departureTicket,
        ReturnTicket: returnTicket,
        Passengers: [],
      };

      Checkout.findOne.mockResolvedValueOnce(checkoutData);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getDataCheckoutById(req, res);

      expect(Checkout.findOne).toHaveBeenCalledWith({
        where: {
          id: "checkoutId",
          usersId: "userId",
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

      const formattedCheckoutData = {
        id: "checkoutId",
        usersId: undefined,
        departureTicketsId: "departureTicketId",
        returnTicketsId: "returnTicketId",
        total_passenger: 2,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        departureTicket: departureTicket,
        returnTicket: returnTicket,
        total_price: 300,
        passengers: [],
      };

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transaction data retrieved successfully",
        data: formattedCheckoutData,
      });
    });

    test("should handle case when checkout data by ID is not found", async () => {
      const req = {
        params: {
          id: "checkoutId",
        },
        user: {
          id: "userId",
        },
      };

      const checkoutData = null;

      Checkout.findOne.mockResolvedValueOnce(checkoutData);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getDataCheckoutById(req, res);

      expect(Checkout.findOne).toHaveBeenCalledWith({
        where: {
          id: "checkoutId",
          usersId: "userId",
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

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transaction data not found",
      });
    });

    test("should handle error when retrieving checkout data by ID", async () => {
      const req = {
        params: {
          id: "checkoutId",
        },
        user: {
          id: "userId",
        },
      };

      const error = new Error("Failed to retrieve checkout data");

      Checkout.findOne.mockRejectedValueOnce(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getDataCheckoutById(req, res);

      expect(Checkout.findOne).toHaveBeenCalledWith({
        where: {
          id: "checkoutId",
          usersId: "userId",
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

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: error,
      });
    });
  });
});
