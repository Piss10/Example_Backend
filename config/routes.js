const {
  login,
  register,
  authorize,
  whoAmI,
  updateUserWithToken,
  verifyUser,
} = require("../app/controllers/authControllers");
const handleGetRoot = require("../app/controllers/root");
const {
  getAllTickets,
  createTicket,
  getTicketById,
  updateTicketData,
} = require("../app/controllers/ticketController");

const {
  getAllUserData,
  getUserById,
  updateUserData,
  deleteUser,
  updatedPassword,
} = require("../app/controllers/userControllers");

const {
  createdesfav,
  getAllDestFavData,
  getDestinasiById,
  deleteDestFav,
} = require("../app/controllers/destinasifavoriteController");

const {
  createCheckout,
  getAllCheckoutData,
  getDataCheckoutById,
  updateCheckoutData,
  deleteCheckout,
  deleteAllDataCheckout,
} = require("../app/controllers/checkoutController");

const {
  createPayment,
  getAllPaymentData,
  getPaymentById,
  deleteAllDataPayment,
} = require("../app/controllers/paymentController");
const {
  createTransaction,
  getAllTransactionData,
  getDataTransactionById,
  updateDataTrans,
  deleteDataTrans,
  deleteAllDataTrans,
  getAllTransactionDataAdmin,
} = require("../app/controllers/transactionController");
const {
  forgetPass,
  resetPassView,
  resetPass,
} = require("../app/controllers/forgetPasswordController");
const { deleteAllDataPass } = require("../app/controllers/passengerController");
const {
  getNotif,
  deleteAllDataNotif,
} = require("../app/controllers/notifController");
const {
  getETicket,
  cetakTicketById,
} = require("../app/controllers/eTicketController");

const router = require("express").Router();

router.get("/", handleGetRoot);

// Register User
router.post("/api/v1/register", register);

// verify User
router.put("/api/v1/verify-user", verifyUser);

// Login User
router.post("/api/v1/login", login);

// Get All users
router.get("/api/v1/users", getAllUserData);

// Get User ById
router.get("/api/v1/users/:id", getUserById);

// Authentication
router.get("/api/v1/whoami", authorize, whoAmI);

// Update User
router.put("/api/v1/users/:id", updateUserData);

router.put("/api/v1/users", updateUserWithToken);

// Update Password
// router.put("/api/v1/resetpw/:id", updatedPassword);

// Delete User
router.delete("/api/v1/users/:id", deleteUser);

// forget password
router.post("/api/v1/forget-password", forgetPass);
router.get("/api/v1/reset-password/:token", resetPassView);
router.put("/api/v1/reset-password", resetPass);

// Get Ticket
router.get("/api/v1/tickets", getAllTickets);

// Get Ticket By Id
router.get("/api/v1/tickets/:id", getTicketById);

// Create Ticket
router.post("/api/v1/tickets", createTicket);

// Put Ticket By Id
// router.put("/api/v1/tickets/:id", updateTicketData);

// Add Destinasi Favorite
router.post("/api/v1/destfavorite", createdesfav);

// Get Destinasi Favorite
router.get("/api/v1/destfavorite", getAllDestFavData);

// Get Destinasi Favorite by Id
router.get("/api/v1/destfavorite/:id", getDestinasiById);

// Delete Destinasi Favorite
router.delete("/api/v1/destfavorite/:id", deleteDestFav);

// Post Checkout
router.post("/api/v1/checkout", authorize, createCheckout);

// get All checkout
router.get("/api/v1/checkout", authorize, getAllCheckoutData);

// Get Data Checkout By Id
router.get("/api/v1/checkout/:id", getDataCheckoutById);

// Update Data Checkout
router.put("/api/v1/checkout/:id", updateCheckoutData);

// Delete Data Checkout
router.delete("/api/v1/checkout/:id", deleteCheckout);

// Get All Data Transaction
router.get("/api/v1/transaction", authorize, getAllTransactionData);

// Get All Data Transaction without authorize
router.get("/api/v1/adminTransaction", getAllTransactionDataAdmin);

// Delete All Data Transaction
router.delete("/api/v1/checkout", deleteAllDataCheckout);

// Get Notifikasi By Token
router.get("/api/v1/notif", authorize, getNotif);

// Delete All Notif
router.delete("/api/v1/notif", deleteAllDataNotif);

// Delete All Data Passengers
router.delete("/api/v1/passenger", deleteAllDataPass);

// Add Payment
router.post("/api/v1/payment", authorize, createPayment);

// Get Payment
router.get("/api/v1/payment", getAllPaymentData);

// Get PAyment by Id
router.get("/api/v1/payment/:id", getPaymentById);

// Delete All Notif
router.delete("/api/v1/payment", deleteAllDataPayment);

// Get Data Transaction By Id
// router.get("/api/v1/transaction/:id", getDataTransactionById);
router.get("/api/v1/transaction", authorize, getDataTransactionById);

// Put Data Transaction
router.put("/api/v1/transaction/:id", updateDataTrans);

// Delete Data Transaction
router.delete("/api/v1/transaction/:id", deleteDataTrans);

// Delete All Data Transaction
router.delete("/api/v1/transaction", deleteAllDataTrans);

// Get E-Ticket
router.get("/api/v1/eticket", authorize, getETicket);

// Get E-Ticket
router.post("/api/v1/eticket", authorize, cetakTicketById);

module.exports = router;
