const { user } = require("../../app/models");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const {
  findEmail,
  checkVerified,
} = require("../../app/controllers/emailVerification");

jest.mock("../../app/models");
jest.mock("bcrypt");
jest.mock("nodemailer");

describe("emailVerification", () => {
  describe("findEmail", () => {
    test("should call user.findOne with correct parameters", async () => {
      const email = "test@example.com";
      user.findOne.mockResolvedValueOnce({});

      await findEmail(email);

      expect(user.findOne).toHaveBeenCalledWith({
        where: {
          email,
        },
      });
    });

    test("should return the result of user.findOne", async () => {
      const email = "test@example.com";
      const expectedResult = { id: 1, email };
      user.findOne.mockResolvedValueOnce(expectedResult);

      const result = await findEmail(email);

      expect(result).toEqual(expectedResult);
    });
  });

  describe("checkVerified", () => {
    test("should call user.findOne with correct parameters", async () => {
      const email = "test@example.com";
      user.findOne.mockResolvedValueOnce({});

      await checkVerified(email);

      expect(user.findOne).toHaveBeenCalledWith({
        where: {
          email,
        },
      });
    });

    test("should return the result of user.findOne", async () => {
      const email = "test@example.com";
      const expectedResult = { id: 1, email, verified: true };
      user.findOne.mockResolvedValueOnce(expectedResult);

      const result = await checkVerified(email);

      expect(result).toEqual(expectedResult);
    });
  });
});
