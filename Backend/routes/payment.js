const express = require("express");
const { protect, authorize } = require("../middlewares/auth");
const {
  createPaymentIntent,
  confirmCheckout,
  confirmPayment,
  refundPayment,
  getPaymentHistory,
} = require("../controllers/paymentController");
const router = express.Router();
router.post("/create-intent", protect, createPaymentIntent);
router.post("/confirm-checkout", protect, confirmCheckout);
router.post("/confirm", protect, confirmPayment);
router.post("/refund", protect, authorize("admin"), refundPayment);
router.get("/history", protect, getPaymentHistory);
module.exports = router;
