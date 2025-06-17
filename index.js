// index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const midtransClient = require("midtrans-client");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Midtrans Snap Client
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-BR3M97KxUmMNrvjWH_rlsQrM",
  clientKey: process.env.MIDTRANS_CLIENT_KEY || "SB-Mid-client-Oe3VEoSthChCgEBz"
});

// POST route
app.post("/createTransaction", async (req, res) => {
  const { orderId, amount, name, email } = req.body;

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount
    },
    customer_details: {
      first_name: name,
      email: email
    }
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    res.status(200).json({
      token: transaction.token,
      redirect_url: transaction.redirect_url
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Root Route (opsional, biar gak error di /)
app.get("/", (req, res) => {
  res.send("Midtrans Backend is Running");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});