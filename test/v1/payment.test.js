const {
  createPayment,
  getAllPaymentData,
  getPaymentById,
  deleteAllDataPayment,
} = require("../../app/controllers/paymentController");
const { Payment, Notif } = require("../../app/models");

describe("Payment Controller", () => {
  describe("createPayment", () => {
    test("should create payment and notification successfully", async () => {
      const userId = "user-id";
      const cardNumber = "1234567890123456";
      const cardHolderName = "John Doe";
      const cvc = "123";
      const expiration = "12/24";
      const country = "United States";

      const paymentForm = {
        id: "payment-id",
        usersId: userId,
        cardNumber: cardNumber,
        cardHolderName: cardHolderName,
        cvc: cvc,
        expiration: expiration,
        country: country,
        status: true,
      };

      const message =
        "Pembayaran ticket berhasil! Selamat menikmati perjalanan Anda";

      const notif = {
        id: "notification-id",
        message: message,
        usersId: userId,
        read: false,
      };

      const createPaymentMock = jest
        .spyOn(Payment, "create")
        .mockResolvedValue(paymentForm);
      const createNotifMock = jest
        .spyOn(Notif, "create")
        .mockResolvedValue(notif);

      const req = {
        body: {
          cardNumber: cardNumber,
          cardHolderName: cardHolderName,
          cvc: cvc,
          expiration: expiration,
          country: country,
        },
        user: {
          id: userId,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createPayment(req, res);

      expect(createPaymentMock).toHaveBeenCalledWith({
        id: expect.any(String),
        usersId: userId,
        cardNumber: cardNumber,
        cardHolderName: cardHolderName,
        cvc: cvc,
        expiration: expiration,
        country: country,
        status: true,
      });

      expect(createNotifMock).toHaveBeenCalledWith({
        id: expect.any(String),
        message: message,
        usersId: userId,
        read: false,
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Created payment Success",
        data: paymentForm,
      });
    });

    test("should handle error and send error response", async () => {
      const error = new Error("Invalid payment data");

      const createPaymentMock = jest
        .spyOn(Payment, "create")
        .mockRejectedValue(error);

      const req = {
        body: {},
        user: {
          id: "user-id",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      console.log = jest.fn(); // Mock console.log to prevent console output in tests

      await createPayment(req, res);

      expect(createPaymentMock).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        message: error.message,
      });

      expect(console.log).toHaveBeenCalledWith(error); // Verify that the error is logged
    });
  });

  describe("getAllPaymentData", () => {
    test("should get all payment data successfully", async () => {
      const paymentData = [
        { id: "payment-id-1", usersId: "user-id-1", amount: 100 },
        { id: "payment-id-2", usersId: "user-id-2", amount: 200 },
      ];

      const findAllMock = jest
        .spyOn(Payment, "findAll")
        .mockResolvedValue(paymentData);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllPaymentData({}, res);

      expect(findAllMock).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Get All Data Payment Success",
        data: paymentData,
      });
    });

    test("should handle error and send error response", async () => {
      const error = new Error("Internal server error");

      const findAllMock = jest
        .spyOn(Payment, "findAll")
        .mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      console.log = jest.fn(); // Mock console.log to prevent console output in tests

      await getAllPaymentData({}, res);

      expect(findAllMock).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "Error",
        message: error.message,
      });

      expect(console.log).toHaveBeenCalledWith(error); // Verify that the error is logged
    });

    test("should send not found response when no payment data found", async () => {
      const findAllMock = jest
        .spyOn(Payment, "findAll")
        .mockResolvedValue(null);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllPaymentData({}, res);

      expect(findAllMock).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        message: "Data not found",
      });
    });
  });

  describe("getPaymentById", () => {
    test("should get payment data by ID successfully", async () => {
      const paymentId = "payment-id-1";
      const paymentData = { id: paymentId, usersId: "user-id-1", amount: 100 };

      const findOneMock = jest
        .spyOn(Payment, "findOne")
        .mockResolvedValue(paymentData);

      const req = {
        params: {
          id: paymentId,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getPaymentById(req, res);

      expect(findOneMock).toHaveBeenCalledWith({
        where: { id: paymentId },
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Get Data Payment Successfully",
        data: paymentData,
      });
    });

    test("should handle error and send error response", async () => {
      const paymentId = "payment-id-1";
      const error = new Error("Internal server error");

      const findOneMock = jest
        .spyOn(Payment, "findOne")
        .mockRejectedValue(error);

      const req = {
        params: {
          id: paymentId,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      console.log = jest.fn(); // Mock console.log to prevent console output in tests

      await getPaymentById(req, res);

      expect(findOneMock).toHaveBeenCalledWith({
        where: { id: paymentId },
      });

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "Error",
        message: error.message,
        data: {},
      });

      expect(console.log).toHaveBeenCalledWith(error); // Verify that the error is logged
    });

    test("should send not found response when payment data not found", async () => {
      const paymentId = "payment-id-1";

      const findOneMock = jest
        .spyOn(Payment, "findOne")
        .mockResolvedValue(null);

      const req = {
        params: {
          id: paymentId,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getPaymentById(req, res);

      expect(findOneMock).toHaveBeenCalledWith({
        where: { id: paymentId },
      });

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        message: "Data not found",
        data: {},
      });
    });
  });

  describe("deleteAllDataPayment", () => {
    test("should delete all payment data successfully", async () => {
      const destroyMock = jest.spyOn(Payment, "destroy").mockResolvedValue();

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deleteAllDataPayment({}, res);

      expect(destroyMock).toHaveBeenCalledWith({ truncate: true });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Payment Data deleted successfully",
      });
    });

    test("should handle error and send error response", async () => {
      const error = new Error("Failed to delete payment data");

      const destroyMock = jest
        .spyOn(Payment, "destroy")
        .mockRejectedValue(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      console.log = jest.fn(); // Mock console.log to prevent console output in tests

      await deleteAllDataPayment({}, res);

      expect(destroyMock).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith(error);

      expect(console.log).toHaveBeenCalledWith(error); // Verify that the error is logged
    });
  });
});
