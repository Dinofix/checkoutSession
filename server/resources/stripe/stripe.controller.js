const initStripe = require("../../stripe");
const fs = require("fs").promises;

const createCheckoutSession = async (req, res) => {
  console.log("Creating checkout session for user:", req.session.user);
  try {
    if (!req.session.user || !req.session.user.stripeCustomerId) {
      console.log("Unauthorized attempt with session:", req.session);
      return res
        .status(401)
        .json({ error: "Unauthorized: No active session or customer ID" });
    }

    const cart = req.body;
    console.log("Received cart items:", cart);
    const stripeCustomerId = req.session.user.stripeCustomerId;

    const stripe = initStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: stripeCustomerId,
      line_items: cart.map((item) => {
        return {
          price: item.product,
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.FRONTEND_URL}/confirmation`,
      cancel_url: process.env.FRONTEND_URL,
    });

    console.log("Checkout session created:", session.id);
    res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Failed to create checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

const verifySession = async (req, res) => {
  console.log("Verifying session with ID:", req.body.sessionId);
  try {
    const stripe = initStripe();
    const sessionId = req.body.sessionId;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
      const order = {
        orderNumber: Math.floor(Math.random() * 100000000),
        customerName: session.customer_details.name,
        products: lineItems.data,
        total: session.amount_total,
        date: new Date(),
      };

      const orders = JSON.parse(await fs.readFile("./data/orders.json"));
      orders.push(order);
      await fs.writeFile("./data/orders.json", JSON.stringify(orders, null, 4));

      console.log("Order verified and recorded:", order);
      res.status(200).json({ verified: true });
    } else {
      console.log("Payment status not successful for session:", sessionId);
      res.status(400).json({ error: "Payment not successful" });
    }
  } catch (error) {
    console.error("Error verifying session:", error);
    res.status(500).json({ error: "Error during session verification" });
  }
};

const getProducts = async (req, res) => {
  try {
    const stripe = initStripe();
    const products = await stripe.products.list({
      expand: ["data.default_price"],
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

module.exports = { createCheckoutSession, verifySession, getProducts };
