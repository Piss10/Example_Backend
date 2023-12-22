const {
  createdesfav,
  getAllDestFavData,
  getDestinasiById,
  deleteDestFav,
} = require("../../app/controllers/destinasiFavoriteController");
const { destinasifavorite } = require("../../app/models");

jest.mock("../../app/models", () => {
  const mockDestinasifavorite = jest.fn();
  return {
    destinasifavorite: {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      destroy: jest.fn(),
    },
  };
});

describe("Destinasi Favorite Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createdesfav", () => {
    test("should create new destinasi favorite", async () => {
      const req = {
        body: {
          image_destinasi: "image.png",
          continent: "Europe",
          city_from: "Paris",
          city_to: "Rome",
          airlines: "Air France",
          date: "2023-07-01",
          price: 200,
        },
      };

      const destfavForm = {
        id: "123",
        image_destinasi: "image.png",
        continent: "Europe",
        city_from: "Paris",
        city_to: "Rome",
        airlines: "Air France",
        date: "2023-07-01",
        price: 200,
      };

      destinasifavorite.create.mockResolvedValueOnce(destfavForm);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createdesfav(req, res);

      expect(destinasifavorite.create).toHaveBeenCalledWith({
        id: expect.any(String),
        image_destinasi: "image.png",
        continent: "Europe",
        city_from: "Paris",
        city_to: "Rome",
        airlines: "Air France",
        date: "2023-07-01",
        price: 200,
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Created Destinasi Favorite Success",
        data: destfavForm,
      });
    });

    test("should handle error when creating destinasi favorite", async () => {
      const req = {
        body: {
          image_destinasi: "image.png",
          continent: "Europe",
          city_from: "Paris",
          city_to: "Rome",
          airlines: "Air France",
          date: "2023-07-01",
          price: 200,
        },
      };

      const error = new Error("Failed to create destinasi favorite");

      destinasifavorite.create.mockRejectedValueOnce(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createdesfav(req, res);

      expect(destinasifavorite.create).toHaveBeenCalledWith({
        id: expect.any(String),
        image_destinasi: "image.png",
        continent: "Europe",
        city_from: "Paris",
        city_to: "Rome",
        airlines: "Air France",
        date: "2023-07-01",
        price: 200,
      });

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        message: error.message,
      });
    });
  });

  describe("getAllDestFavData", () => {
    test("should get all destinasi favorite data without query", async () => {
      const req = {
        query: {},
      };

      const dataDestFav = [
        {
          id: "123",
          image_destinasi: "image1.png",
          continent: "Europe",
          city_from: "Paris",
          city_to: "Rome",
          airlines: "Air France",
          date: "2023-07-01",
          price: 200,
        },
        {
          id: "456",
          image_destinasi: "image2.png",
          continent: "Asia",
          city_from: "Tokyo",
          city_to: "Bangkok",
          airlines: "ANA",
          date: "2023-07-02",
          price: 300,
        },
      ];

      destinasifavorite.findAll.mockResolvedValueOnce(dataDestFav);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllDestFavData(req, res);

      expect(destinasifavorite.findAll).toHaveBeenCalledWith({
        where: {},
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Get All Data Destinasi Favorit Success",
        data: dataDestFav,
      });
    });

    test("should get all destinasi favorite data with query", async () => {
      const req = {
        query: {
          continent: "Europe",
        },
      };

      const dataDestFav = [
        {
          id: "123",
          image_destinasi: "image1.png",
          continent: "Europe",
          city_from: "Paris",
          city_to: "Rome",
          airlines: "Air France",
          date: "2023-07-01",
          price: 200,
        },
      ];

      destinasifavorite.findAll.mockResolvedValueOnce(dataDestFav);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllDestFavData(req, res);

      expect(destinasifavorite.findAll).toHaveBeenCalledWith({
        where: {
          continent: {
            [Op.iLike]: "%Europe",
          },
        },
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Get All Data Destinasi Favorit Success",
        data: dataDestFav,
      });
    });

    test("should handle error when getting all destinasi favorite data", async () => {
      const req = {
        query: {},
      };

      const error = new Error("Failed to get destinasi favorite data");

      destinasifavorite.findAll.mockRejectedValueOnce(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllDestFavData(req, res);

      expect(destinasifavorite.findAll).toHaveBeenCalledWith({
        where: {},
      });

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "Error",
        message: error.message,
      });
    });

    test("should handle no data found when getting all destinasi favorite data", async () => {
      const req = {
        query: {},
      };

      destinasifavorite.findAll.mockResolvedValueOnce(null);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getAllDestFavData(req, res);

      expect(destinasifavorite.findAll).toHaveBeenCalledWith({
        where: {},
      });

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        message: "Data not found",
        data: {},
      });
    });
  });

  describe("getDestinasiById", () => {
    test("should get destinasi favorite data by id", async () => {
      const req = {
        params: {
          id: "123",
        },
      };

      const dataDestFavId = {
        id: "123",
        image_destinasi: "image1.png",
        continent: "Europe",
        city_from: "Paris",
        city_to: "Rome",
        airlines: "Air France",
        date: "2023-07-01",
        price: 200,
      };

      destinasifavorite.findOne.mockResolvedValueOnce(dataDestFavId);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getDestinasiById(req, res);

      expect(destinasifavorite.findOne).toHaveBeenCalledWith({
        where: { id: "123" },
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Get Data Destinasi Successfully",
        data: dataDestFavId,
      });
    });

    test("should handle error when getting destinasi favorite data by id", async () => {
      const req = {
        params: {
          id: "123",
        },
      };

      const error = new Error("Failed to get destinasi favorite data");

      destinasifavorite.findOne.mockRejectedValueOnce(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getDestinasiById(req, res);

      expect(destinasifavorite.findOne).toHaveBeenCalledWith({
        where: { id: "123" },
      });

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "Error",
        message: error.message,
      });
    });

    test("should handle no data found when getting destinasi favorite data by id", async () => {
      const req = {
        params: {
          id: "123",
        },
      };

      destinasifavorite.findOne.mockResolvedValueOnce(null);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getDestinasiById(req, res);

      expect(destinasifavorite.findOne).toHaveBeenCalledWith({
        where: { id: "123" },
      });

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: "Failed",
        message: "Data not found",
      });
    });
  });

  describe("deleteDestFav", () => {
    test("should delete destinasi favorite data by id", async () => {
      const req = {
        params: {
          id: "123",
        },
      };

      destinasifavorite.destroy.mockResolvedValueOnce(1);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deleteDestFav(req, res);

      expect(destinasifavorite.destroy).toHaveBeenCalledWith({
        where: { id: "123" },
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        message: "Destinasi Data deleted successfully",
      });
    });

    test("should handle error when deleting destinasi favorite data by id", async () => {
      const req = {
        params: {
          id: "123",
        },
      };

      const error = new Error("Failed to delete destinasi favorite data");

      destinasifavorite.destroy.mockRejectedValueOnce(error);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deleteDestFav(req, res);

      expect(destinasifavorite.destroy).toHaveBeenCalledWith({
        where: { id: "123" },
      });

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "Error",
        message: error.message,
      });
    });
  });
});
