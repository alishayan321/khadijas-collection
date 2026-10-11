import express from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET);

// POST /api/payment/create-checkout-session
router.post("/create-checkout-session", async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const line_items =
      order.orderType === "ready"
        ? order.items.map((i) => ({
            price_data: {
              currency: "pkr",
              product_data: { name: i.name },
              unit_amount: Math.round((i.price || 0) * 100),
            },
            quantity: i.qty || 1,
          }))
        : [
            {
              price_data: {
                currency: "pkr",
                product_data: {
                  name: `Custom Order ${order.orderNumber}`,
                  description: order.customDetails?.description || "Bridal Custom",
                },
                unit_amount: Math.round((order.totalAmount || 0) * 100),
              },
              quantity: 1,
            },
          ];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      customer_email: order.customer.email || undefined,
      success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
      },
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.json({ success: true, url: session.url, sessionId: session.id });
  } catch (err) {
    next(err);
  }
});

// POST /api/payment/webhook — Stripe webhook for payment confirmation
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: "paid",
          orderStatus: "confirmed",
          stripePaymentIntentId: session.payment_intent,
          $push: {
            statusHistory: {
              status: "confirmed",
              note: "Payment received via Stripe",
            },
          },
        });
      }
    }

    res.json({ received: true });
  }
);

export default router;