const {
  getAllTransactionData,
  getDataTransactionById,
  updateDataTrans,
  deleteDataTrans,
  deleteAllDataTrans,
} = require("../../app/controllers/transactionController");

const {
  Ticket,
  Transaction,
  Checkout,
  Passenger,
  user,
  Op,
} = require("../../app/models");

describe("Transaction Controller", () => {
  describe("getAllTransactionData", () => {
    test("should get all transaction data successfully", async () => {
      const req = {
        user: {
          id: "user-id-1",
        },
      };

      const checkoutData = [
        {
          id: "checkout-id-1",
          usersId: "user-id-1",
          departureTicketsId: "departure-ticket-id-1",
          returnTicketsId: "return-ticket-id-1",
          total_passenger: 2,
          createdAt: "2023-06-28",
          updatedAt: "2023-06-29",
          DepartureTicket: {
            id: "departure-ticket-id-1",
            price: 100,
          },
          ReturnTicket: {
            id: "return-ticket-id-1",
            price: 50,
          },
          Passengers: [],
        },
      ];

      const findAllMock = jest
        .spyOn(Checkout, "findAll")
        .mockResolvedValue(checkoutData);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllTransactionData(req, res);

      expect(findAllMock).toHaveBeenCalledWith({
        where: {
          usersId: req.user.id,
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

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Transaction data retrieved successfully",
        data: [
          {
            id: "checkout-id-1",
            usersId: "user-id-1",
            departureTicketsId: "departure-ticket-id-1",
            returnTicketsId: "return-ticket-id-1",
            total_passenger: 2,
            createdAt: "2023-06-28",
            updatedAt: "2023-06-29",
            departureTicket: {
              id: "departure-ticket-id-1",
              price: 100,
            },
            returnTicket: {
              id: "return-ticket-id-1",
              price: 50,
            },
            total_price: 300,
            passengers: [],
          },
        ],
      });
    });

    test("should handle no transaction data found and send error response", async () => {
      const req = {
        user: {
          id: "user-id-1",
        },
      };

      const findAllMock = jest.spyOn(Checkout, "findAll").mockResolvedValue([]);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllTransactionData(req, res);

      expect(findAllMock).toHaveBeenCalledWith({
        where: {
          usersId: req.user.id,
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

    test("should handle error and send error response", async () => {
      const req = {
        user: {
          id: "user-id-1",
        },
      };

      const error = new Error("Failed to get transaction data");

      const findAllMock = jest
        .spyOn(Checkout, "findAll")
        .mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      console.log = jest.fn(); // Mock console.log to prevent console output in tests

      await getAllTransactionData(req, res);

      expect(findAllMock).toHaveBeenCalledWith({
        where: {
          usersId: req.user.id,
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

      expect(console.log).toHaveBeenCalledWith(error); // Verify that the error is logged
    });
  });

  describe("getDataTransactionById", () => {
    test("should get transaction data by ID successfully", async () => {
      const req = {
        user: {
          id: "user-id-1",
        },
      };

      const transactions = [
        {
          id: "transaction-id-1",
          usersId: "user-id-1",
          tickets: [],
          checkouts: [],
        },
      ];

      const findAllMock = jest
        .spyOn(Transaction, "findAll")
        .mockResolvedValue(transactions);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getDataTransactionById(req, res);

      expect(findAllMock).toHaveBeenCalledWith({
        where: {
          usersId: req.user.id,
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

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: transactions,
      });
    });

    test("should handle error and send error response", async () => {
      const req = {
        user: {
          id: "user-id-1",
        },
      };

      const error = new Error("Failed to get transaction data by ID");

      const findAllMock = jest
        .spyOn(Transaction, "findAll")
        .mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      console.log = jest.fn(); // Mock console.log to prevent console output in tests

      await getDataTransactionById(req, res);

      expect(findAllMock).toHaveBeenCalledWith({
        where: {
          usersId: req.user.id,
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

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });

      expect(console.log).toHaveBeenCalledWith(error); // Verify that the error is logged
    });
  });

  describe("updateDataTrans", () => {
    test("should update transaction data successfully", async () => {
      const req = {
        params: {
          id: "transaction-id-1",
        },
        body: {
          userId: "user-id-1",
          ticketId: "ticket-id-1",
          quantity: 2,
          date: "2023-06-30",
        },
      };

      const iduser = {
        id: "user-id-1",
      };

      const ticket = {
        id: "ticket-id-1",
        price: 100,
      };

      const updateMock = jest.spyOn(Transaction, "update").mockResolvedValue(1);
      const findByPkUserMock = jest
        .spyOn(user, "findByPk")
        .mockResolvedValue(iduser);
      const findByPkTicketMock = jest
        .spyOn(Ticket, "findByPk")
        .mockResolvedValue(ticket);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateDataTrans(req, res);

      expect(findByPkUserMock).toHaveBeenCalledWith(req.body.userId);
      expect(findByPkTicketMock).toHaveBeenCalledWith(req.body.ticketId);

      expect(updateMock).toHaveBeenCalledWith(
        {
          id: expect.any(String),
          usersId: iduser.id,
          ticketsId: ticket.id,
          amounts: ticket.price * req.body.quantity,
          date: req.body.date,
          status: "Success",
        },
        {
          where: { id: req.params.id },
        }
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Update Data Transaction Successfully",
        data: 1,
      });
    });

    test("should handle error and send error response", async () => {
      const req = {
        params: {
          id: "transaction-id-1",
        },
        body: {
          userId: "user-id-1",
          ticketId: "ticket-id-1",
          quantity: 2,
          date: "2023-06-30",
        },
      };

      const error = new Error("Failed to update transaction data");

      const updateMock = jest
        .spyOn(Transaction, "update")
        .mockRejectedValue(error);
      const findByPkUserMock = jest
        .spyOn(user, "findByPk")
        .mockResolvedValue(null);
      const findByPkTicketMock = jest
        .spyOn(Ticket, "findByPk")
        .mockResolvedValue(null);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      console.log = jest.fn(); // Mock console.log to prevent console output in tests

      await updateDataTrans(req, res);

      expect(findByPkUserMock).toHaveBeenCalledWith(req.body.userId);
      expect(findByPkTicketMock).toHaveBeenCalledWith(req.body.ticketId);

      expect(updateMock).toHaveBeenCalledWith(
        {
          id: expect.any(String),
          usersId: null,
          ticketsId: null,
          amounts: null,
          date: null,
          status: "Success",
        },
        {
          where: { id: req.params.id },
        }
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        message: error.message,
      });

      expect(console.log).toHaveBeenCalledWith(error); // Verify that the error is logged
    });
  });

  describe("deleteDataTrans", () => {
    test("should delete transaction data successfully", async () => {
      const req = {
        params: {
          id: "transaction-id-1",
        },
      };

      const destroyMock = jest
        .spyOn(Transaction, "destroy")
        .mockResolvedValue(1);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deleteDataTrans(req, res);

      expect(destroyMock).toHaveBeenCalledWith({
        where: { id: req.params.id },
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Delete Data Transaction Successfully",
        data: 1,
      });
    });

    test("should handle error and send error response", async () => {
      const req = {
        params: {
          id: "transaction-id-1",
        },
      };

      const error = new Error("Failed to delete transaction data");

      const destroyMock = jest
        .spyOn(Transaction, "destroy")
        .mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      console.log = jest.fn(); // Mock console.log to prevent console output in tests

      await deleteDataTrans(req, res);

      expect(destroyMock).toHaveBeenCalledWith({
        where: { id: req.params.id },
      });

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        message: error.message,
      });

      expect(console.log).toHaveBeenCalledWith(error); // Verify that the error is logged
    });
  });

  describe("deleteAllDataTrans", () => {
    test("should delete all transaction data successfully", async () => {
      const req = {
        user: {
          id: "user-id-1",
        },
      };

      const destroyMock = jest
        .spyOn(Transaction, "destroy")
        .mockResolvedValue(2);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deleteAllDataTrans(req, res);

      expect(destroyMock).toHaveBeenCalledWith({
        where: { usersId: req.user.id },
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Delete All Data Transaction Successfully",
        data: 2,
      });
    });

    test("should handle error and send error response", async () => {
      const req = {
        user: {
          id: "user-id-1",
        },
      };

      const error = new Error("Failed to delete all transaction data");

      const destroyMock = jest
        .spyOn(Transaction, "destroy")
        .mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      console.log = jest.fn(); // Mock console.log to prevent console output in tests

      await deleteAllDataTrans(req, res);

      expect(destroyMock).toHaveBeenCalledWith({
        where: { usersId: req.user.id },
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
