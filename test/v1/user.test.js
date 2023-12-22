const { user } = require("../../app/models");
const bcrypt = require("bcrypt");
const salt = 10;

jest.mock("../../app/models", () => ({
  user: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

const {
  getAllUserData,
  getUserById,
  updateUserData,
  deleteUser,
} = require("../../app/controllers/userControllers");

describe("getAllUserData", () => {
  test("should return all user data", async () => {
    const mockData = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
    ];
    user.findAll.mockResolvedValue(mockData);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllUserData(req, res);

    expect(user.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "Success",
      message: "Get All Data User Success",
      data: mockData,
    });
  });

  test("should return an error message when no user data found", async () => {
    user.findAll.mockResolvedValue(null);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllUserData(req, res);

    expect(user.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "Failed",
      message: "Data not found",
    });
  });

  test("should return an error message when an exception occurs", async () => {
    const errorMessage = "Internal server error";
    user.findAll.mockRejectedValue(new Error(errorMessage));

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllUserData(req, res);

    expect(user.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "Error",
      message: errorMessage,
    });
  });
});

describe("getUserById", () => {
  test("should return user data by id", async () => {
    const mockUser = { id: 1, name: "John" };
    user.findOne.mockResolvedValue(mockUser);

    const req = {
      params: { id: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getUserById(req, res);

    expect(user.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "Success",
      message: "Get Data User Successfully",
      data: mockUser,
    });
  });

  test("should return an error message when user not found", async () => {
    user.findOne.mockResolvedValue(null);

    const req = {
      params: { id: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getUserById(req, res);

    expect(user.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "Failed",
      message: "User not found",
    });
  });

  test("should return an error message when an exception occurs", async () => {
    const errorMessage = "Internal server error";
    user.findOne.mockRejectedValue(new Error(errorMessage));

    const req = {
      params: { id: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getUserById(req, res);

    expect(user.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "Error",
      message: errorMessage,
    });
  });
});

describe("updateUserData", () => {
  test("should update user data", async () => {
    const req = {
      params: { id: 1 },
      body: {
        name: "John Doe",
        phone: "1234567890",
        email: "john@example.com",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateUserData(req, res);

    expect(user.update).toHaveBeenCalledWith(
      {
        name: "John Doe",
        phone: "1234567890",
        email: "john@example.com",
      },
      { where: { id: 1 } }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "Success",
      message: "Update Data User Successfully",
    });
  });

  test("should return an error message when an exception occurs", async () => {
    const errorMessage = "Internal server error";
    user.update.mockRejectedValue(new Error(errorMessage));

    const req = {
      params: { id: 1 },
      body: {
        name: "John Doe",
        phone: "1234567890",
        email: "john@example.com",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateUserData(req, res);

    expect(user.update).toHaveBeenCalledWith(
      {
        name: "John Doe",
        phone: "1234567890",
        email: "john@example.com",
      },
      { where: { id: 1 } }
    );
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalled();
  });
});

describe("deleteUser", () => {
  test("should delete user data by id", async () => {
    const req = {
      params: { id: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteUser(req, res);

    expect(user.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "Success",
      message: "User Data deleted successfully",
    });
  });

  test("should return an error message when an exception occurs", async () => {
    const errorMessage = "Internal server error";
    user.destroy.mockRejectedValue(new Error(errorMessage));

    const req = {
      params: { id: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteUser(req, res);

    expect(user.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalled();
  });
});
