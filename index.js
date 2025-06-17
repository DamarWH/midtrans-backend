


// index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const midtransClient = require("midtrans-client");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Setup Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-BR3M97KxUmMNrvjWH_rlsQrM",
  clientKey: process.env.MIDTRANS_CLIENT_KEY || "SB-Mid-client-Oe3VEoSthChCgEBz"
});

app.post("/createTransaction", async (req, res) => {
  const { orderId, amount, name, email } = req.body;

  try {
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

    const transaction = await snap.createTransaction(parameter);
    res.status(200).json({
      token: transaction.token,
      redirect_url: transaction.redirect_url
    });
  } catch (error) {
    console.error("Error Midtrans:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Midtrans backend is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});