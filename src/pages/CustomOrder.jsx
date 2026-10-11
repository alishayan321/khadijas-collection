import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  MessageCircle,
  Check,
  Truck,
  Store,
  Ruler,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { KhadijaNavbar } from "./Home";

const API = "import.meta.env.VITE_API_URL || "http://localhost:5000/api"";
const WHATSAPP = "923363406330";

export default function CustomOrder() {
  const navigate = useNavigate();

  const [step, setStep] = useState("form");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState(null);

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Pakistan",
    bust: "",
    waist: "",
    hip: "",
    length: "",
    shoulder: "",
    sleeve: "",
    armhole: "",
    neckDepth: "",
    fabric: "",
    color: "",
    eventDate: "",
    budget: "",
    description: "",
    notes: "",
    deliveryMethod: "delivery",
  });

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 6) {
      alert("Maximum 6 images allowed");
      return;
    }

    const newImages = [...images, ...files].slice(0, 6);
    setImages(newImages);

    Promise.all(
      newImages.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          })
      )
    ).then(setPreviews);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.phone) {
      setError("Name and phone are required");
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (!form.whatsapp) fd.set("whatsapp", form.phone);

      images.forEach((img) => fd.append("references", img));

      const { data } = await axios.post(`${API}/orders/custom`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        setOrderData(data.order);
        setStep("success");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(data.message || "Order submit nahi ho saka");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Order submit nahi ho saka. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "success" && orderData) {
    const waText = encodeURIComponent(
      `Assalam-o-Alaikum! I just submitted custom order ${orderData.orderNumber}. Please review my measurements and design.`
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
            <Sparkles size={40} className="text-green-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-3xl md:text-4xl text-maroon mb-4"
          >
            Design Request Received!
          </motion.h1>
          <p className="text-charcoal/70 mb-6">
            Thank you, {orderData.customer.name}. Our team will review your
            reference design and measurements.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-gold/20 p-6 mb-8 text-left shadow-sm"
          >
            <div className="flex justify-between mb-3 pb-3 border-b border-gold/20">
              <span className="text-charcoal/60 text-sm">Request Number</span>
              <span className="font-medium text-maroon">
                {orderData.orderNumber}
              </span>
            </div>
            <div className="flex justify-between mb-3 pb-3 border-b border-gold/20">
              <span className="text-charcoal/60 text-sm">References</span>
              <span className="font-medium">
                {orderData.customDetails?.referenceImages?.length || 0} images
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal/60 text-sm">Status</span>
              <span className="uppercase text-xs bg-yellow-100 text-yellow-800 px-2 py-1">
                Pending Review
              </span>
            </div>
          </motion.div>

          <p className="text-sm text-charcoal/60 mb-6">
            We'll contact you within <strong>24 hours</strong> with a price
            quote and timeline.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href={`https://wa.me/${WHATSAPP}?text=${waText}`}
              target="_blank"
              rel="noreferrer"
              className="bg-green-600 text-white px-6 py-3 tracking-widest text-sm hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-md"
            >
              <MessageCircle size={16} /> MESSAGE ON WHATSAPP
            </motion.a>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/shop"
                className="block border border-maroon text-maroon px-6 py-3 tracking-widest text-sm hover:bg-maroon hover:text-white transition"
              >
                BROWSE READY-MADE
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-20">
      <KhadijaNavbar />
      <div className="pt-24 md:pt-32" />

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-charcoal/60 hover:text-maroon text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="text-gold tracking-[0.3em] text-xs mb-3">
            BESPOKE SERVICE
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-maroon mb-4">
            Custom Bridal Order
          </h1>
          <p className="text-charcoal/60 max-w-2xl mx-auto">
            Share your dream design and exact measurements. We'll craft it
            just for you — piece by piece.
          </p>
        </motion.div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 mb-6 max-w-3xl mx-auto">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
          <Section
            icon={<Upload size={20} />}
            title="Reference Images"
            subtitle="Upload up to 6 design images you like (max 5MB each)"
          >
            <div className="border-2 border-dashed border-gold/40 p-6 text-center hover:border-maroon transition">
              <input
                type="file"
                id="ref-images"
                multiple
                accept="image/*"
                onChange={handleImages}
                className="hidden"
              />
              <label htmlFor="ref-images" className="cursor-pointer block">
                <Upload size={32} className="text-gold mx-auto mb-3" />
                <p className="text-sm text-charcoal mb-1">
                  Click to upload reference images
                </p>
                <p className="text-xs text-charcoal/50">
                  JPG, PNG, WEBP — {6 - images.length} slots remaining
                </p>
              </label>
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-4">
                <AnimatePresence>
                  {previews.map((preview, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative aspect-square border border-gold/20"
                    >
                      <img
                        src={preview}
                        alt={`Reference ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-700 transition"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </Section>

          <Section
            icon={<Ruler size={20} />}
            title="Your Measurements"
            subtitle="All in inches. Take help from a tailor if unsure."
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                ["bust", "Bust", "36"],
                ["waist", "Waist", "30"],
                ["hip", "Hip", "38"],
                ["length", "Length", "42"],
                ["shoulder", "Shoulder", "14"],
                ["sleeve", "Sleeve", "18"],
                ["armhole", "Armhole", "16"],
                ["neckDepth", "Neck Depth", "7"],
              ].map(([key, label, placeholder]) => (
                <MeasureInput
                  key={key}
                  label={label}
                  value={form[key]}
                  onChange={(v) => setForm({ ...form, [key]: v })}
                  placeholder={placeholder}
                />
              ))}
            </div>
          </Section>

          <Section
            icon={<Sparkles size={20} />}
            title="Design Details"
            subtitle="Tell us about your dream outfit"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Fabric Preference"
                value={form.fabric}
                onChange={(v) => setForm({ ...form, fabric: v })}
                placeholder="Silk, chiffon, organza..."
              />
              <Input
                label="Color Preference"
                value={form.color}
                onChange={(v) => setForm({ ...form, color: v })}
                placeholder="Maroon, gold, ivory..."
              />
              <Input
                label="Event Date"
                type="date"
                value={form.eventDate}
                onChange={(v) => setForm({ ...form, eventDate: v })}
              />
              <Input
                label="Budget (PKR)"
                value={form.budget}
                onChange={(v) => setForm({ ...form, budget: v })}
                placeholder="50000 - 100000"
              />
            </div>

            <div className="mt-4">
              <label className="block text-xs tracking-widest text-charcoal/60 mb-2">
                DESIGN DESCRIPTION
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Describe the design: embroidery, cut, style, occasions..."
                className="w-full border border-gold/30 bg-cream/30 px-4 py-3 text-sm focus:outline-none focus:border-maroon h-28"
              />
            </div>

            <div className="mt-4">
              <label className="block text-xs tracking-widest text-charcoal/60 mb-2">
                ADDITIONAL NOTES
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any special requests..."
                className="w-full border border-gold/30 bg-cream/30 px-4 py-3 text-sm focus:outline-none focus:border-maroon h-20"
              />
            </div>
          </Section>

          <Section
            icon={<Check size={20} />}
            title="Your Details"
            subtitle="We'll contact you on WhatsApp"
          >
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
              <Input
                label="City"
                value={form.city}
                onChange={(v) => setForm({ ...form, city: v })}
              />
              <Input
                label="Postal Code"
                value={form.postalCode}
                onChange={(v) => setForm({ ...form, postalCode: v })}
              />
              <div className="md:col-span-2">
                <Input
                  label="Full Address"
                  value={form.address}
                  onChange={(v) => setForm({ ...form, address: v })}
                  placeholder="House, street, area..."
                />
              </div>
            </div>
          </Section>

          <Section icon={<Truck size={20} />} title="Delivery Method">
            <div className="grid grid-cols-2 gap-3">
              <MethodBtn
                icon={<Truck size={18} />}
                label="Home Delivery"
                sub="Nationwide shipping"
                active={form.deliveryMethod === "delivery"}
                onClick={() =>
                  setForm({ ...form, deliveryMethod: "delivery" })
                }
              />
              <MethodBtn
                icon={<Store size={18} />}
                label="Self Pickup"
                sub="From our studio"
                active={form.deliveryMethod === "pickup"}
                onClick={() => setForm({ ...form, deliveryMethod: "pickup" })}
              />
            </div>
          </Section>

          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full bg-maroon text-white py-5 tracking-widest text-sm hover:bg-gold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shine-btn"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  SUBMITTING...
                </span>
              ) : (
                "SUBMIT CUSTOM ORDER REQUEST"
              )}
            </motion.button>
            <p className="text-xs text-charcoal/50 text-center mt-3">
              We'll review and send you a price quote within 24 hours.
            </p>
          </div>
        </form>
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

function Section({ icon, title, subtitle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="bg-white border border-gold/20 p-6 md:p-8 shadow-sm"
    >
      <div className="flex items-start gap-3 mb-5 pb-5 border-b border-gold/20">
        <div className="text-maroon mt-1">{icon}</div>
        <div>
          <h2 className="font-serif text-xl md:text-2xl text-maroon">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-charcoal/60 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </motion.div>
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

function MeasureInput({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs tracking-widest text-charcoal/60 mb-2">
        {label.toUpperCase()}
      </label>
      <div className="relative">
        <input
          type="number"
          step="0.5"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gold/30 bg-cream/30 px-4 py-3 pr-10 text-sm focus:outline-none focus:border-maroon transition-colors"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-charcoal/40">
          in
        </span>
      </div>
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