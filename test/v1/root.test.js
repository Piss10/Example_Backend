const handleGetRoot = require("../../app/controllers/root");

describe("handleGetRoot", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("should respond with status 200 and a JSON message", () => {
    handleGetRoot(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "OK",
      message: "API is up and running!!",
    });
  });
});
