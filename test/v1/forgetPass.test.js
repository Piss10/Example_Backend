const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { user } = require("../../app/models");
const {
  forgetPass,
  resetPassView,
  resetPass,
} = require("../../app/controllers/forgetPasswordController");

jest.mock("nodemailer");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../app/models");

describe("Auth Controller", () => {
  describe("forgetPass", () => {
    test("should send email for password reset", async () => {
      const req = {
        body: {
          email: "test@example.com",
        },
      };

      const findUserEmail = jest.fn().mockResolvedValue({
        id: "123",
      });

      const signToken = jest.fn().mockReturnValue("token");

      jwt.sign = signToken;

      const sendMail = jest.fn().mockResolvedValue(true);

      nodemailer.createTransport = jest.fn().mockReturnValue({
        sendMail,
      });

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await forgetPass(req, res);

      expect(findUserEmail).toHaveBeenCalledWith({ email: "test@example.com" });

      expect(signToken).toHaveBeenCalledWith(
        { id: "123" },
        process.env.JWT_SIGNATURE_KEY || "Rahasia",
        {
          expiresIn: "1h",
        }
      );

      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        service: "gmail",
        auth: {
          user: "backendproject010101@gmail.com",
          pass: "fzkeehrkmvvsaaao",
        },
      });

      expect(sendMail).toHaveBeenCalledWith({
        from: "backendproject010101@gmail.com",
        to: "test@example.com",
        subject: "Reset Password",
        html: expect.any(String),
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        status: "success",
        message: "Check your email to reset password",
      });
    });

    test("should handle error when sending email for password reset", async () => {
      const req = {
        body: {
          email: "test@example.com",
        },
      };

      const findUserEmail = jest.fn().mockResolvedValue({
        id: "123",
      });

      const signToken = jest.fn().mockReturnValue("token");

      jwt.sign = signToken;

      const sendMail = jest
        .fn()
        .mockRejectedValue(new Error("Failed to send email"));

      nodemailer.createTransport = jest.fn().mockReturnValue({
        sendMail,
      });

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await forgetPass(req, res);

      expect(findUserEmail).toHaveBeenCalledWith({ email: "test@example.com" });

      expect(signToken).toHaveBeenCalledWith(
        { id: "123" },
        process.env.JWT_SIGNATURE_KEY || "Rahasia",
        {
          expiresIn: "1h",
        }
      );

      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        service: "gmail",
        auth: {
          user: "backendproject010101@gmail.com",
          pass: "fzkeehrkmvvsaaao",
        },
      });

      expect(sendMail).toHaveBeenCalledWith({
        from: "backendproject010101@gmail.com",
        to: "test@example.com",
        subject: "Reset Password",
        html: expect.any(String),
      });

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        status: "error",
        message: "Failed to send email",
      });
    });

    test("should handle error when user email is not found", async () => {
      const req = {
        body: {
          email: "test@example.com",
        },
      };

      const findUserEmail = jest.fn().mockResolvedValue(null);

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await forgetPass(req, res);

      expect(findUserEmail).toHaveBeenCalledWith({ email: "test@example.com" });

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        status: "error",
        message: "Email not found",
      });
    });
  });

  describe("resetPassView", () => {
    test("should return reset password view", async () => {
      const req = {
        params: {
          token: "token",
        },
      };

      const verifyToken = jest.fn().mockReturnValue({ id: "123" });

      jwt.verify = verifyToken;

      const findUserId = jest.fn().mockResolvedValue({
        id: "123",
        email: "test@example.com",
      });

      user.findOne = findUserId;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await resetPassView(req, res);

      expect(verifyToken).toHaveBeenCalledWith(
        "token",
        process.env.JWT_SIGNATURE_KEY || "Rahasia"
      );

      expect(findUserId).toHaveBeenCalledWith("123");

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "reset password view",
        data: {
          id: "123",
          email: "test@example.com",
        },
        token: "token",
      });
    });

    test("should handle error when token is invalid", async () => {
      const req = {
        params: {
          token: "invalid_token",
        },
      };

      const verifyToken = jest.fn().mockImplementation(() => {
        throw new Error("Invalid token");
      });

      jwt.verify = verifyToken;

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await resetPassView(req, res);

      expect(verifyToken).toHaveBeenCalledWith(
        "invalid_token",
        process.env.JWT_SIGNATURE_KEY || "Rahasia"
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        status: "error",
        message: "Token reset password not found",
      });
    });

    test("should handle error when user is not found", async () => {
      const req = {
        params: {
          token: "token",
        },
      };

      const verifyToken = jest.fn().mockReturnValue({ id: "123" });

      jwt.verify = verifyToken;

      const findUserId = jest.fn().mockResolvedValue(null);

      user.findOne = findUserId;

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await resetPassView(req, res);

      expect(verifyToken).toHaveBeenCalledWith(
        "token",
        process.env.JWT_SIGNATURE_KEY || "Rahasia"
      );

      expect(findUserId).toHaveBeenCalledWith("123");

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        status: "error",
        message: "Token reset password not found",
      });
    });
  });

  describe("resetPass", () => {
    test("should reset user password", async () => {
      const req = {
        headers: {
          authorization: "Bearer token",
        },
        body: {
          password: "newpassword",
          confirmPassword: "newpassword",
        },
      };

      const verifyToken = jest.fn().mockReturnValue({ id: "123" });

      jwt.verify = verifyToken;

      const findUserId = jest.fn().mockResolvedValue({
        id: "123",
      });

      user.findOne = findUserId;

      const encryptPassword = jest.fn().mockResolvedValue("encryptedPassword");

      bcrypt.hash = encryptPassword;

      const updatePassUser = jest.fn().mockResolvedValue(true);

      user.update = updatePassUser;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await resetPass(req, res);

      expect(verifyToken).toHaveBeenCalledWith(
        "token",
        process.env.JWT_SIGNATURE_KEY || "Rahasia"
      );

      expect(findUserId).toHaveBeenCalled();

      expect(encryptPassword).toHaveBeenCalledWith("newpassword", 10);

      expect(updatePassUser).toHaveBeenCalledWith("123", {
        password: "encryptedPassword",
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "update password successfully",
      });
    });

    test("should handle error when token is invalid", async () => {
      const req = {
        headers: {
          authorization: "Bearer invalid_token",
        },
        body: {
          password: "newpassword",
          confirmPassword: "newpassword",
        },
      };

      const verifyToken = jest.fn().mockImplementation(() => {
        throw new Error("Invalid token");
      });

      jwt.verify = verifyToken;

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await resetPass(req, res);

      expect(verifyToken).toHaveBeenCalledWith(
        "invalid_token",
        process.env.JWT_SIGNATURE_KEY || "Rahasia"
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        status: "error",
        message: "Token reset password not found",
      });
    });

    test("should handle error when user is not found", async () => {
      const req = {
        headers: {
          authorization: "Bearer token",
        },
        body: {
          password: "newpassword",
          confirmPassword: "newpassword",
        },
      };

      const verifyToken = jest.fn().mockReturnValue({ id: "123" });

      jwt.verify = verifyToken;

      const findUserId = jest.fn().mockResolvedValue(null);

      user.findOne = findUserId;

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await resetPass(req, res);

      expect(verifyToken).toHaveBeenCalledWith(
        "token",
        process.env.JWT_SIGNATURE_KEY || "Rahasia"
      );

      expect(findUserId).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        status: "error",
        message: "Token reset password not found",
      });
    });

    test("should handle error when passwords do not match", async () => {
      const req = {
        headers: {
          authorization: "Bearer token",
        },
        body: {
          password: "newpassword",
          confirmPassword: "mismatchpassword",
        },
      };

      const verifyToken = jest.fn().mockReturnValue({ id: "123" });

      jwt.verify = verifyToken;

      const findUserId = jest.fn().mockResolvedValue({
        id: "123",
      });

      user.findOne = findUserId;

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await resetPass(req, res);

      expect(verifyToken).toHaveBeenCalledWith(
        "token",
        process.env.JWT_SIGNATURE_KEY || "Rahasia"
      );

      expect(findUserId).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        status: "error",
        message: "Passwords do not match",
      });
    });
  });
});
