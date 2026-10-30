const { Router } = require("express");
const razorpay = require("razorpay");
const crypto = require("crypto");

const paymentRouter = Router();

// Create Orders
paymentRouter.post("/orders", async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ message: "Payment service is not configured" });
    }

    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }

    const instance = new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    const order = await instance.orders.create(options);
    return res.status(200).json({ data: order });
  } catch (err) {
    console.error("Payment order creation failed:", err.message);
    return res.status(500).json({ message: "Unable to create payment order" });
  }
});

// Payment Verifying
paymentRouter.post("/verify", async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ message: "Payment service is not configured" });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid payment signature" });
    }
  } catch (err) {
    console.error("Payment verification failed:", err.message);
    res.status(500).json({ message: "Unable to verify payment" });
  }
});
module.exports = paymentRouter;
