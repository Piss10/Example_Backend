const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { user } = require("../../app/models");
const { v4: uuid } = require("uuid");
const {
  register,
  login,
  whoAmI,
  authorize,
  updateUserWithToken,
} = require("../../app/controllers/authControllers");

// Mocking bcrypt.hash function
jest.mock("bcrypt", () => ({
  hash: jest.fn((data, salt, callback) => {
    callback(null, "encryptedPassword");
  }),
  compare: jest.fn((data, encryptedData, callback) => {
    callback(null, true);
  }),
}));

// Mocking jwt.sign and jwt.verify functions
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn((payload, secretOrPrivateKey, options) => "token"),
  verify: jest.fn((token, secretOrPrivateKey, options, callback) => {
    callback(null, {
      id: "user-id",
      email: "test@example.com",
      createdAt: "2023-06-27T08:43:49.680Z",
      updatedAt: "2023-06-27T08:43:49.680Z",
    });
  }),
}));

// Mocking user model
jest.mock("../../app/models", () => ({
  user: {
    findOne: jest.fn(),
    create: jest.fn(() => ({
      id: "user-id",
      name: "Test User",
      password: "encryptedPassword",
      email: "test@example.com",
      phone: "123456789",
      verified: "false",
      image_profile:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    })),
    findByPk: jest.fn(() => ({
      id: "user-id",
      name: "Test User",
      password: "encryptedPassword",
      email: "test@example.com",
      phone: "123456789",
      verified: "false",
      image_profile:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      save: jest.fn(),
    })),
  },
}));

describe("User Controller", () => {
  describe("register", () => {
    let req;
    let res;

    beforeEach(() => {
      req = {
        body: {
          name: "Test User",
          email: "test@example.com",
          password: "password",
          phone: "123456789",
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    test("should respond with status 201 and a success message", async () => {
      await register(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith(
        "password",
        10,
        expect.any(Function)
      );
      expect(user.create).toHaveBeenCalledWith({
        id: expect.any(String),
        name: "Test User",
        password: "encryptedPassword",
        email: "test@example.com",
        phone: "123456789",
        verified: "false",
        image_profile:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Created User Success",
        data: {
          id: expect.any(String),
          name: "Test User",
          password: "encryptedPassword",
          email: "test@example.com",
          phone: "123456789",
          verified: "false",
          image_profile:
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        },
      });
    });

    test("should respond with status 400 if email or password is empty", async () => {
      req.body.email = "";
      req.body.password = "";

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Email and password is required",
      });
    });

    test("should respond with status 400 if email format is invalid", async () => {
      req.body.email = "invalid-email";

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Email format is invalid",
      });
    });

    test("should respond with status 400 if email already exists", async () => {
      user.findOne.mockResolvedValueOnce({
        email: "test@example.com",
      });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "Error",
        message: "Email already Exist",
        data: {},
      });
    });

    test("should respond with status 400 and error message if an error occurs", async () => {
      const errorMessage = "Internal Server Error";
      bcrypt.hash.mockImplementationOnce((data, salt, callback) => {
        callback(new Error(errorMessage));
      });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        message: errorMessage,
      });
    });
  });

  describe("login", () => {
    let req;
    let res;

    beforeEach(() => {
      req = {
        body: {
          email: "test@example.com",
          password: "password",
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    test("should respond with status 201 and a token", async () => {
      user.findOne.mockResolvedValueOnce({
        email: "test@example.com",
        password: "encryptedPassword",
        createdAt: "2023-06-27T08:43:49.680Z",
        updatedAt: "2023-06-27T08:43:49.680Z",
      });

      await login(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password",
        "encryptedPassword",
        expect.any(Function)
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: "user-id",
          email: "test@example.com",
          createdAt: "2023-06-27T08:43:49.680Z",
          updatedAt: "2023-06-27T08:43:49.680Z",
        },
        "Rahasia"
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        token: "token",
        name: "Test User",
        createdAt: "2023-06-27T08:43:49.680Z",
        updatedAt: "2023-06-27T08:43:49.680Z",
      });
    });

    test("should respond with status 400 if email is not found", async () => {
      user.findOne.mockResolvedValueOnce(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Email tidak ditemukan",
      });
    });

    test("should respond with status 401 if password is incorrect", async () => {
      bcrypt.compare.mockImplementationOnce((data, encryptedData, callback) => {
        callback(null, false);
      });

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Pasword salah!",
      });
    });

    test("should respond with status 500 and error message if an error occurs", async () => {
      const errorMessage = "Internal Server Error";
      user.findOne.mockRejectedValueOnce(new Error(errorMessage));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Login Failed",
        error: errorMessage,
      });
    });
  });

  describe("whoAmI", () => {
    test("should respond with status 200 and user data", () => {
      const req = {
        user: {
          id: "user-id",
          email: "test@example.com",
          createdAt: "2023-06-27T08:43:49.680Z",
          updatedAt: "2023-06-27T08:43:49.680Z",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      whoAmI(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(req.user);
    });
  });

  describe("authorize", () => {
    test("should call next() if token is valid", async () => {
      const req = {
        headers: {
          authorization: "Bearer token",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await authorize(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(
        "token",
        "Rahasia",
        undefined,
        expect.any(Function)
      );
      expect(user.findByPk).toHaveBeenCalledWith("user-id");
      expect(next).toHaveBeenCalled();
    });

    test("should respond with status 401 if token is invalid", async () => {
      const req = {
        headers: {
          authorization: "Bearer invalid-token",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      jwt.verify.mockImplementationOnce(
        (token, secretOrPrivateKey, options, callback) => {
          callback(new Error("Invalid token"));
        }
      );

      await authorize(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Unauthorized",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("should respond with status 401 if user is not found", async () => {
      const req = {
        headers: {
          authorization: "Bearer token",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      user.findByPk.mockResolvedValueOnce(null);

      await authorize(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Unauthorized",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("updateUserWithToken", () => {
    let req;
    let res;

    beforeEach(() => {
      req = {
        headers: {
          authorization: "Bearer token",
        },
        body: {
          name: "New Name",
        },
        user: {
          id: "user-id",
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    test("should respond with status 200 and updated user data", async () => {
      await updateUserWithToken(req, res);

      expect(user.findByPk).toHaveBeenCalledWith("user-id");
      expect(user.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "User updated",
        data: {
          id: "user-id",
          name: "New Name",
          password: "encryptedPassword",
          email: "test@example.com",
          phone: "123456789",
          verified: "false",
          image_profile:
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        },
      });
    });

    test("should respond with status 400 if user is not found", async () => {
      user.findByPk.mockResolvedValueOnce(null);

      await updateUserWithToken(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "Error",
        message: "User not found",
      });
    });

    test("should respond with status 500 and error message if an error occurs", async () => {
      const errorMessage = "Internal Server Error";
      user.save.mockRejectedValueOnce(new Error(errorMessage));

      await updateUserWithToken(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "Error",
        message: "Update user failed",
        error: errorMessage,
      });
    });
  });
});
