const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  verifySession,
  getProducts,
} = require("./stripe.controller");

router.post("/create-checkout-session", createCheckoutSession);
router.post("/verify-session", verifySession);
router.get("/products", getProducts);

module.exports = router;
