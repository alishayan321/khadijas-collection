import express from "express";
import Order from "../models/Order.js";
import { protect } from "../middleware/auth.js";
import { uploadReferences } from "../middleware/upload.js";
import { uploadMany } from "../utils/cloudinary.js";

const router = express.Router();

/* ============ PUBLIC ============ */

// POST /api/orders/ready — Cart checkout (ready-made)
router.post("/ready", async (req, res, next) => {
  try {
    const { customer, items, deliveryMethod, paymentMethod, totalAmount } =
      req.body;

    if (!customer?.name || !customer?.phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required",
      });
    }

    if (!items?.length) {
      return res.status(400).json({
        success: false,
        message: "No items in order",
      });
    }

    const order = await Order.create({
      orderType: "ready",
      customer,
      items: items.map((i) => ({
        ...i,
        total: (i.price || 0) * (i.qty || 1),
      })),
      deliveryMethod: deliveryMethod || "delivery",
      paymentMethod: paymentMethod || "cod",
      subtotal: totalAmount,
      totalAmount,
      statusHistory: [
        { status: "pending", note: "Order placed by customer" },
      ],
    });

    res.status(201).json({
      success: true,
      order,
      message: `Order ${order.orderNumber} placed successfully!`,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/orders/custom — Custom bridal order with reference images
router.post("/custom", uploadReferences, async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      whatsapp,
      address,
      city,
      postalCode,
      country,
      bust,
      waist,
      hip,
      length,
      shoulder,
      sleeve,
      armhole,
      neckDepth,
      fabric,
      color,
      eventDate,
      budget,
      notes,
      description,
      deliveryMethod,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required",
      });
    }

    let referenceImages = [];
    if (req.files?.length) {
      referenceImages = await uploadMany(
        req.files,
        "khadijas-collection/references"
      );
    }

    const order = await Order.create({
      orderType: "custom",
      customer: {
        name,
        email,
        phone,
        whatsapp: whatsapp || phone,
        address: address || "",
        city: city || "",
        postalCode: postalCode || "",
        country: country || "Pakistan",
      },
      customDetails: {
        referenceImages,
        description: description || "",
        measurements: {
          bust,
          waist,
          hip,
          length,
          shoulder,
          sleeve,
          armhole,
          neckDepth,
        },
        fabricChoice: fabric,
        colorPreference: color,
        eventDate: eventDate ? new Date(eventDate) : undefined,
        budget,
        notes,
      },
      deliveryMethod: deliveryMethod || "delivery",
      paymentMethod: "cod",
      totalAmount: 0, // Quoted after review
      statusHistory: [
        { status: "pending", note: "Custom order submitted" },
      ],
    });

    res.status(201).json({
      success: true,
      order,
      message: `Custom request ${order.orderNumber} received! We'll contact you shortly.`,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/track/:orderNumber — public tracking
router.get("/track/:orderNumber", async (req, res, next) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
    }).select("orderNumber orderStatus statusHistory createdAt");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
});

/* ============ ADMIN ============ */

// GET /api/orders
router.get("/", protect, async (req, res, next) => {
  try {
    const { status, type, search } = req.query;
    const filter = {};

    if (status && status !== "all") filter.orderStatus = status;
    if (type && type !== "all") filter.orderType = type;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/stats/dashboard — admin dashboard stats
router.get("/stats/dashboard", protect, async (req, res, next) => {
  try {
    const [total, pending, confirmed, stitching, ready, delivered] =
      await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ orderStatus: "pending" }),
        Order.countDocuments({ orderStatus: "confirmed" }),
        Order.countDocuments({ orderStatus: "stitching" }),
        Order.countDocuments({ orderStatus: "ready" }),
        Order.countDocuments({ orderStatus: "delivered" }),
      ]);

    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const customCount = await Order.countDocuments({ orderType: "custom" });
    const readyCount = await Order.countDocuments({ orderType: "ready" });

    res.json({
      success: true,
      stats: {
        total,
        pending,
        confirmed,
        stitching,
        ready,
        delivered,
        customCount,
        readyCount,
        revenue: revenueAgg[0]?.total || 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id
router.get("/:id", protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
});

// PUT /api/orders/:id/status
router.put("/:id/status", protect, async (req, res, next) => {
  try {
    const { orderStatus, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.orderStatus = orderStatus;
    order.statusHistory.push({
      status: orderStatus,
      note: note || `Status updated to ${orderStatus}`,
    });
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
});

// PUT /api/orders/:id/payment
router.put("/:id/payment", protect, async (req, res, next) => {
  try {
    const { paymentStatus, totalAmount } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, ...(totalAmount && { totalAmount }) },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
});

// PUT /api/orders/:id/quote — set price for custom order
router.put("/:id/quote", protect, async (req, res, next) => {
  try {
    const { totalAmount, adminNotes } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        totalAmount: Number(totalAmount),
        adminNotes,
        orderStatus: "confirmed",
      },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/orders/:id
router.delete("/:id", protect, async (req, res, next) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Order deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;