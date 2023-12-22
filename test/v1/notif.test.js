const {
  getNotif,
  deleteAllDataNotif,
} = require("../../app/controllers/notifController");
const { Notif } = require("../../app/models");

describe("Notif Controller", () => {
  describe("getNotif", () => {
    test("should retrieve notification data successfully", async () => {
      const req = {
        user: { id: "123" },
      };

      const findAll = jest.fn().mockResolvedValue([
        { id: "1", message: "Notification 1" },
        { id: "2", message: "Notification 2" },
      ]);

      Notif.findAll = findAll;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getNotif(req, res);

      expect(findAll).toHaveBeenCalledWith({
        where: { usersId: "123" },
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Notification data retrieved successfully",
        data: [
          { id: "1", message: "Notification 1" },
          { id: "2", message: "Notification 2" },
        ],
      });
    });

    test("should handle case when no notification data found", async () => {
      const req = {
        user: { id: "123" },
      };

      const findAll = jest.fn().mockResolvedValue([]);

      Notif.findAll = findAll;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getNotif(req, res);

      expect(findAll).toHaveBeenCalledWith({
        where: { usersId: "123" },
      });

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "No notification data found",
        data: [],
      });
    });

    test("should handle error and send error response", async () => {
      const req = {
        user: { id: "123" },
      };

      const error = new Error("Internal server error");

      const findAll = jest.fn().mockRejectedValue(error);

      Notif.findAll = findAll;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      console.log = jest.fn(); // Mock console.log to prevent console output in tests

      await getNotif(req, res);

      expect(findAll).toHaveBeenCalledWith({
        where: { usersId: "123" },
      });

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: error,
      });

      expect(console.log).toHaveBeenCalledWith(error); // Verify that the error is logged
    });
  });

  describe("deleteAllDataNotif", () => {
    test("should delete all notification data successfully", async () => {
      const destroy = jest.fn().mockResolvedValue(true);

      Notif.destroy = destroy;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deleteAllDataNotif({}, res);

      expect(destroy).toHaveBeenCalledWith({
        truncate: true,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Notif Data deleted successfully",
      });
    });

    test("should handle error and send error response", async () => {
      const error = new Error("Internal server error");

      const destroy = jest.fn().mockRejectedValue(error);

      Notif.destroy = destroy;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      console.log = jest.fn(); // Mock console.log to prevent console output in tests

      await deleteAllDataNotif({}, res);

      expect(destroy).toHaveBeenCalledWith({
        truncate: true,
      });

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith(error);

      expect(console.log).toHaveBeenCalledWith(error); // Verify that the error is logged
    });
  });
});
