import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  Minus,
  Plus,
  MessageCircle,
  Check,
  Truck,
  Store,
  CreditCard,
  Banknote,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useCart } from "../store/cart";
import { KhadijaNavbar } from "./Home";

const API = "import.meta.env.VITE_API_URL || "http://localhost:5000/api"";
const WHATSAPP = "923363406330";
const DELIVERY_CHARGE = 250;

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQty, clear } = useCart();

  const [step, setStep] = useState("cart");
  const [placing, setPlacing] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Pakistan",
    deliveryMethod: "delivery",
    paymentMethod: "cod",
    notes: "",
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = form.deliveryMethod === "delivery" ? DELIVERY_CHARGE : 0;
  const total = subtotal + delivery;

  const handleRemove = (item) => removeItem(item._id, item.size);
  const handleQty = (item, newQty) => {
    if (newQty < 1) return;
    updateQty(item._id, item.size, newQty);
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    setPlacing(true);

    try {
      const orderItems = items.map((i) => ({
        productId: i._id,
        name: i.name,
        slug: i.slug,
        image: i.image,
        size: i.size,
        qty: i.qty,
        price: i.price,
        total: i.price * i.qty,
      }));

      const payload = {
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          whatsapp: form.whatsapp || form.phone,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
        items: orderItems,
        deliveryMethod: form.deliveryMethod,
        paymentMethod: form.paymentMethod,
        totalAmount: total,
        subtotal,
        deliveryCharges: delivery,
        notes: form.notes,
      };

      const { data } = await axios.post(`${API}/orders/ready`, payload);

      if (data.success) {
        setOrderData(data.order);
        clear();
        setStep("success");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(data.message || "Order place nahi ho saka");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Order place nahi ho saka. Backend check karein."
      );
    } finally {
      setPlacing(false);
    }
  };

  /* EMPTY CART */
  if (items.length === 0 && step === "cart") {
    return (
      <div className="min-h-screen bg-cream">
        <KhadijaNavbar />
        <div className="pt-32 md:pt-40 max-w-2xl mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <ShoppingBag size={64} className="text-gold mx-auto mb-6" />
            <h1 className="font-serif text-3xl md:text-4xl text-maroon mb-4">
              Your Bag is Empty
            </h1>
            <p className="text-charcoal/60 mb-8">
              Discover our collection and add your favourite pieces.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/shop"
                className="inline-block bg-maroon text-white px-10 py-3 tracking-widest text-sm hover:bg-gold transition shadow-md"
              >
                SHOP NOW
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* SUCCESS */
  if (step === "success" && orderData) {
    const waText = encodeURIComponent(
      `Assalam-o-Alaikum! I just placed order ${orderData.orderNumber} on your website. Please confirm.`
    );

    return (
      <div className="min-h-screen bg-cream">
        <KhadijaNavbar />
        <div className="pt-32 md:pt-40 max-w-2xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check size={40} className="text-green-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-3xl md:text-4xl text-maroon mb-4"
          >
            Order Received!
          </motion.h1>
          <p className="text-charcoal/70 mb-6">
            Thank you, {orderData.customer.name}. We've received your order.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-gold/20 p-6 mb-8 text-left shadow-sm"
          >
            <div className="flex justify-between mb-3 pb-3 border-b border-gold/20">
              <span className="text-charcoal/60 text-sm">Order Number</span>
              <span className="font-medium text-maroon">
                {orderData.orderNumber}
              </span>
            </div>
            <div className="flex justify-between mb-3 pb-3 border-b border-gold/20">
              <span className="text-charcoal/60 text-sm">Total Amount</span>
              <span className="font-medium">
                Rs. {orderData.totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between mb-3 pb-3 border-b border-gold/20">
              <span className="text-charcoal/60 text-sm">Payment</span>
              <span className="uppercase text-xs bg-gold/20 text-maroon px-2 py-1">
                {orderData.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal/60 text-sm">Status</span>
              <span className="uppercase text-xs bg-yellow-100 text-yellow-800 px-2 py-1">
                {orderData.orderStatus}
              </span>
            </div>
          </motion.div>

          <p className="text-sm text-charcoal/60 mb-6">
            We'll contact you on WhatsApp within 24 hours to confirm.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href={`https://wa.me/${WHATSAPP}?text=${waText}`}
              target="_blank"
              rel="noreferrer"
              className="bg-green-600 text-white px-6 py-3 tracking-widest text-sm hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-md"
            >
              <MessageCircle size={16} /> CONFIRM ON WHATSAPP
            </motion.a>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/shop"
                className="block border border-maroon text-maroon px-6 py-3 tracking-widest text-sm hover:bg-maroon hover:text-white transition"
              >
                CONTINUE SHOPPING
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  /* MAIN CART / CHECKOUT */
  return (
    <div className="min-h-screen bg-cream pb-20">
      <KhadijaNavbar />
      <div className="pt-24 md:pt-32" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-charcoal/60 hover:text-maroon text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Continue Shopping
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-3xl md:text-4xl text-maroon mb-8"
        >
          {step === "cart" ? "Your Bag" : "Checkout"}
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === "cart" ? (
              <div className="space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={`${item._id}-${item.size}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="bg-white border border-gold/20 p-4 flex gap-4 shadow-sm"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-32 object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="font-serif text-lg text-charcoal mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-charcoal/60 mb-2">
                          Size: <span className="text-maroon">{item.size}</span>
                        </p>
                        <p className="text-maroon font-medium text-sm mb-3">
                          Rs. {item.price.toLocaleString()}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-gold/30">
                            <button
                              onClick={() => handleQty(item, item.qty - 1)}
                              className="p-2 hover:bg-cream transition"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-4 text-sm">{item.qty}</span>
                            <button
                              onClick={() => handleQty(item, item.qty + 1)}
                              className="p-2 hover:bg-cream transition"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemove(item)}
                            className="text-red-500 hover:text-red-700 p-2 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button
                  onClick={() => {
                    if (window.confirm("Clear entire bag?")) clear();
                  }}
                  className="text-sm text-charcoal/50 hover:text-red-500 transition-colors"
                >
                  Clear Bag
                </button>
              </div>
            ) : (
              <form
                onSubmit={placeOrder}
                className="bg-white border border-gold/20 p-6 md:p-8 space-y-6 shadow-sm"
              >
                <h2 className="font-serif text-2xl text-maroon mb-2">
                  Delivery Details
                </h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3">
                    {error}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                    required
                  />
                  <Input
                    label="Phone *"
                    value={form.phone}
                    onChange={(v) => setForm({ ...form, phone: v })}
                    placeholder="03XX XXXXXXX"
                    required
                  />
                  <Input
                    label="WhatsApp"
                    value={form.whatsapp}
                    onChange={(v) => setForm({ ...form, whatsapp: v })}
                    placeholder="(optional)"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                  />
                </div>

                <div>
                  <p className="text-xs tracking-widest text-charcoal/60 mb-3">
                    DELIVERY METHOD
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <MethodBtn
                      icon={<Truck size={18} />}
                      label="Home Delivery"
                      sub={`Rs. ${DELIVERY_CHARGE}`}
                      active={form.deliveryMethod === "delivery"}
                      onClick={() =>
                        setForm({ ...form, deliveryMethod: "delivery" })
                      }
                    />
                    <MethodBtn
                      icon={<Store size={18} />}
                      label="Self Pickup"
                      sub="Free"
                      active={form.deliveryMethod === "pickup"}
                      onClick={() =>
                        setForm({ ...form, deliveryMethod: "pickup" })
                      }
                    />
                  </div>
                </div>

                {form.deliveryMethod === "delivery" && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="Full Address *"
                        value={form.address}
                        onChange={(v) => setForm({ ...form, address: v })}
                        required
                      />
                    </div>
                    <Input
                      label="City *"
                      value={form.city}
                      onChange={(v) => setForm({ ...form, city: v })}
                      required
                    />
                    <Input
                      label="Postal Code"
                      value={form.postalCode}
                      onChange={(v) => setForm({ ...form, postalCode: v })}
                    />
                  </div>
                )}

                <div>
                  <p className="text-xs tracking-widest text-charcoal/60 mb-3">
                    PAYMENT METHOD
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <MethodBtn
                      icon={<Banknote size={18} />}
                      label="COD"
                      sub="Cash on delivery"
                      active={form.paymentMethod === "cod"}
                      onClick={() =>
                        setForm({ ...form, paymentMethod: "cod" })
                      }
                    />
                    <MethodBtn
                      icon={<Building2 size={18} />}
                      label="Bank"
                      sub="Bank transfer"
                      active={form.paymentMethod === "bank_transfer"}
                      onClick={() =>
                        setForm({ ...form, paymentMethod: "bank_transfer" })
                      }
                    />
                    <MethodBtn
                      icon={<CreditCard size={18} />}
                      label="Card"
                      sub="Stripe"
                      active={form.paymentMethod === "stripe"}
                      onClick={() =>
                        setForm({ ...form, paymentMethod: "stripe" })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-widest text-charcoal/60 mb-2">
                    ORDER NOTES
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    placeholder="Any special instructions..."
                    className="w-full border border-gold/30 bg-cream/30 px-4 py-3 text-sm focus:outline-none focus:border-maroon h-24"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep("cart")}
                    className="flex-1 border border-charcoal/30 text-charcoal py-4 tracking-widest text-sm hover:bg-charcoal hover:text-white transition"
                  >
                    BACK TO BAG
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={placing}
                    className="flex-1 bg-maroon text-white py-4 tracking-widest text-sm hover:bg-gold transition disabled:opacity-50 shadow-md"
                  >
                    {placing
                      ? "PLACING..."
                      : `PLACE ORDER — Rs. ${total.toLocaleString()}`}
                  </motion.button>
                </div>
              </form>
            )}
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gold/20 p-6 sticky top-24 shadow-sm"
            >
              <h2 className="font-serif text-xl text-maroon mb-4">
                Order Summary
              </h2>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-charcoal/60">
                    Items ({items.reduce((s, i) => s + i.qty, 0)})
                  </span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">
                    {form.deliveryMethod === "delivery" ? "Delivery" : "Pickup"}
                  </span>
                  <span>{delivery === 0 ? "Free" : `Rs. ${delivery}`}</span>
                </div>
              </div>

              <div className="border-t border-gold/20 pt-4 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-charcoal">Total</span>
                  <span className="text-2xl font-medium text-maroon">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {step === "cart" && (
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep("checkout")}
                  className="w-full bg-maroon text-white py-4 tracking-widest text-sm hover:bg-gold transition shadow-md"
                >
                  PROCEED TO CHECKOUT
                </motion.button>
              )}

              <div className="mt-6 pt-6 border-t border-gold/20 space-y-2 text-xs text-charcoal/60">
                <p className="flex items-center gap-2">
                  <Check size={14} className="text-green-600" />
                  Free exchange within 7 days
                </p>
                <p className="flex items-center gap-2">
                  <Check size={14} className="text-green-600" />
                  Quality checked before shipping
                </p>
                <p className="flex items-center gap-2">
                  <Check size={14} className="text-green-600" />
                  Custom sizing available
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.a
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
        whileHover={{ scale: 1.15, rotate: 8 }}
        href={`https://wa.me/${WHATSAPP}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-2xl hover:bg-green-700 transition z-50 pulse-glow"
      >
        <MessageCircle size={24} />
      </motion.a>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required, placeholder }) {
  return (
    <div>
      <label className="block text-xs tracking-widest text-charcoal/60 mb-2">
        {label.toUpperCase()}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full border border-gold/30 bg-cream/30 px-4 py-3 text-sm focus:outline-none focus:border-maroon transition-colors"
      />
    </div>
  );
}

function MethodBtn({ icon, label, sub, active, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={onClick}
      className={`border p-4 text-left transition ${
        active
          ? "border-maroon bg-maroon/5"
          : "border-gold/30 hover:border-maroon"
      }`}
    >
      <div className={`mb-2 ${active ? "text-maroon" : "text-charcoal/60"}`}>
        {icon}
      </div>
      <p className="text-sm font-medium text-charcoal">{label}</p>
      <p className="text-xs text-charcoal/50">{sub}</p>
    </motion.button>
  );
}