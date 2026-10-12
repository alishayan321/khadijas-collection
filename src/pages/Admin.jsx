import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Eye,
  X,
  Search,
  TrendingUp,
  Clock,
  CheckCircle2,
  Sparkles,
  Menu,
  Scissors,
  Image as ImageIcon,
  ArrowLeft,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ============ AXIOS INSTANCE WITH TOKEN ============ */
const api = axios.create({ baseURL: API });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("adminAdmin");
    if (stored) setAdmin(JSON.parse(stored));
  }, []);

  const handleLogin = (data) => {
    setToken(data.token);
    setAdmin(data.admin);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminAdmin");
    setToken(null);
    setAdmin(null);
  };

  if (!token) return <LoginScreen onLogin={handleLogin} />;

  return <AdminPanel admin={admin} onLogout={handleLogout} />;
}

/* ============================================================
   LOGIN SCREEN
============================================================ */
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("admin@khadijascollection.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminAdmin", JSON.stringify(data.admin));
        onLogin(data);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="flex flex-col items-center gap-3">
            <motion.img
              initial={{ scale: 0, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
              src="/images/logo.png"
              alt="Khadija's Collection"
              className="h-28 w-auto object-contain"
            />
            <h2 className="font-serif text-2xl text-maroon tracking-wide">
              Khadija's Collection
            </h2>
          </Link>
          <p className="text-xs tracking-[0.3em] text-gold mt-2">
            ADMIN PANEL
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gold/20 p-8 space-y-5 shadow-lg"
        >
          <h1 className="font-serif text-2xl text-maroon mb-2">
            Welcome Back
          </h1>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 text-sm p-3"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-xs tracking-widest text-charcoal/60 mb-2">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gold/30 bg-cream/30 px-4 py-3 text-sm focus:outline-none focus:border-maroon transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest text-charcoal/60 mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              className="w-full border border-gold/30 bg-cream/30 px-4 py-3 text-sm focus:outline-none focus:border-maroon transition-colors"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-maroon text-white py-4 tracking-widest text-sm hover:bg-gold transition disabled:opacity-50 shadow-md shine-btn"
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </motion.button>

          <p className="text-xs text-charcoal/40 text-center">
            Default: admin@khadijascollection.com / Khadija@2026
          </p>
        </form>
      </motion.div>
    </div>
  );
}

/* ============================================================
   ADMIN PANEL
============================================================ */
function AdminPanel({ admin, onLogout }) {
  const [tab, setTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { id: "orders", label: "Orders", icon: <ShoppingCart size={18} /> },
    { id: "products", label: "Products", icon: <Package size={18} /> },
    { id: "categories", label: "Categories", icon: <Star size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-cream flex">
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-charcoal text-white transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.img
              whileHover={{ scale: 1.08, rotate: 3 }}
              transition={{ type: "spring", stiffness: 300 }}
              src="/images/logo.png"
              alt="Khadija's Collection"
              className="h-14 w-auto object-contain"
              style={{
                filter:
                  "brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(15deg)",
              }}
            />
            <div>
              <h3 className="font-serif text-base text-gold leading-tight group-hover:text-white transition-colors">
                Khadija's Collection
              </h3>
              <p className="text-[10px] text-white/40 tracking-wider">
                ADMIN PANEL
              </p>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {tabs.map((t) => (
            <motion.button
              key={t.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setTab(t.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all ${
                tab === t.id
                  ? "bg-gold/20 text-gold border-l-2 border-gold"
                  : "text-white/70 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
              }`}
            >
              {t.icon}
              {t.label}
            </motion.button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
          <div className="mb-3 px-2">
            <p className="text-xs text-white/40">Logged in as</p>
            <p className="text-sm text-gold truncate">{admin?.email}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-red-400 hover:bg-red-500/10 transition rounded"
          >
            <LogOut size={16} /> Logout
          </motion.button>
        </div>
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <main className="flex-1 min-w-0">
        <header className="bg-white border-b border-gold/20 px-4 md:px-8 h-16 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <button
            className="md:hidden p-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <h1 className="font-serif text-lg md:text-xl text-maroon capitalize">
            {tab}
          </h1>

          <Link
            to="/"
            className="text-xs text-charcoal/60 hover:text-maroon flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={14} /> View Site
          </Link>
        </header>

        <div className="p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {tab === "dashboard" && <DashboardTab />}
              {tab === "orders" && <OrdersTab />}
              {tab === "products" && <ProductsTab />}
              {tab === "categories" && <CategoriesTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   DASHBOARD TAB
============================================================ */
function DashboardTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/orders/stats/dashboard");
        if (data.success) setStats(data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-10 h-10 border-4 border-maroon/30 border-t-maroon rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    {
      label: "Total Orders",
      value: stats?.total || 0,
      icon: <ShoppingCart size={20} />,
      color: "text-maroon",
    },
    {
      label: "Pending",
      value: stats?.pending || 0,
      icon: <Clock size={20} />,
      color: "text-yellow-600",
    },
    {
      label: "Stitching",
      value: stats?.stitching || 0,
      icon: <Scissors size={20} />,
      color: "text-blue-600",
    },
    {
      label: "Delivered",
      value: stats?.delivered || 0,
      icon: <CheckCircle2 size={20} />,
      color: "text-green-600",
    },
    {
      label: "Custom Orders",
      value: stats?.customCount || 0,
      icon: <Sparkles size={20} />,
      color: "text-gold",
    },
    {
      label: "Ready Orders",
      value: stats?.readyCount || 0,
      icon: <Package size={20} />,
      color: "text-purple-600",
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-maroon text-white p-6 md:p-8 mb-6 shadow-lg"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-widest text-gold mb-1">
              TOTAL REVENUE (PAID)
            </p>
            <p className="font-serif text-3xl md:text-4xl">
              Rs. {(stats?.revenue || 0).toLocaleString()}
            </p>
          </div>
          <TrendingUp size={48} className="text-gold/40" />
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(139,21,56,0.1)" }}
            className="bg-white border border-gold/20 p-5 transition-shadow"
          >
            <div className={`mb-3 ${c.color}`}>{c.icon}</div>
            <p className="text-2xl md:text-3xl font-serif text-charcoal mb-1">
              {c.value}
            </p>
            <p className="text-xs tracking-widest text-charcoal/50">
              {c.label.toUpperCase()}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   ORDERS TAB
============================================================ */
function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const STATUSES = [
    "pending",
    "confirmed",
    "stitching",
    "ready",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== "all") params.status = filter;
      if (typeFilter !== "all") params.type = typeFilter;
      if (search) params.search = search;

      const { data } = await api.get("/orders", { params });
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchOrders, 300);
    return () => clearTimeout(t);
  }, [filter, typeFilter, search]);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: status });
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: status } : o
        )
      );
    } catch (err) {
      alert("Status update failed");
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Delete this order permanently?")) return;
    try {
      await api.delete(`/orders/${orderId}`);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const statusColor = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      stitching: "bg-purple-100 text-purple-800",
      ready: "bg-indigo-100 text-indigo-800",
      shipped: "bg-cyan-100 text-cyan-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div>
      <div className="bg-white border border-gold/20 p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40"
          />
          <input
            type="text"
            placeholder="Search order #, name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gold/30 focus:outline-none focus:border-maroon"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gold/30 px-3 py-2.5 text-sm focus:outline-none focus:border-maroon"
        >
          <option value="all">All Status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gold/30 px-3 py-2.5 text-sm focus:outline-none focus:border-maroon"
        >
          <option value="all">All Types</option>
          <option value="ready">Ready-Made</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-10 h-10 border-4 border-maroon/30 border-t-maroon rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gold/20">
          <ShoppingCart size={48} className="text-gold mx-auto mb-4" />
          <p className="font-serif text-2xl text-maroon mb-2">
            No orders found
          </p>
          <p className="text-charcoal/60 text-sm">
            New orders will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-charcoal/50 mb-2">
            {orders.length} order{orders.length !== 1 && "s"}
          </p>

          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ boxShadow: "0 10px 30px rgba(139,21,56,0.08)" }}
              className="bg-white border border-gold/20 p-4 md:p-5"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-mono text-sm font-medium text-maroon">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 uppercase tracking-wider ${statusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 uppercase tracking-wider ${
                        order.orderType === "custom"
                          ? "bg-gold/20 text-maroon"
                          : "bg-charcoal/10 text-charcoal"
                      }`}
                    >
                      {order.orderType}
                    </span>
                    {order.paymentStatus === "paid" && (
                      <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-800 uppercase tracking-wider">
                        Paid
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-charcoal font-medium">
                    {order.customer.name}
                  </p>
                  <p className="text-xs text-charcoal/60">
                    {order.customer.phone} • {order.customer.city || "—"}
                  </p>
                </div>

                <div className="md:text-right md:w-40">
                  <p className="text-xs text-charcoal/50">Total</p>
                  <p className="font-serif text-lg text-maroon">
                    Rs. {(order.totalAmount || 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-charcoal/50 uppercase">
                    {order.paymentMethod}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border border-gold/30 px-2 py-1.5 text-xs focus:outline-none focus:border-maroon"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.toUpperCase()}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 text-charcoal hover:text-maroon transition"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="p-2 text-charcoal hover:text-red-500 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedOrder && (
          <OrderModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   ORDER DETAIL MODAL
============================================================ */
function OrderModal({ order, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 40 }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
        className="bg-cream w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="sticky top-0 bg-maroon text-white p-4 flex justify-between items-center">
          <div>
            <p className="font-mono text-sm">{order.orderNumber}</p>
            <p className="text-xs text-white/60 capitalize">
              {order.orderType} Order
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-serif text-lg text-maroon mb-3">Customer</h3>
            <div className="bg-white border border-gold/20 p-4 grid md:grid-cols-2 gap-2 text-sm">
              <p>
                <span className="text-charcoal/50">Name:</span>{" "}
                {order.customer.name}
              </p>
              <p>
                <span className="text-charcoal/50">Phone:</span>{" "}
                {order.customer.phone}
              </p>
              <p>
                <span className="text-charcoal/50">WhatsApp:</span>{" "}
                {order.customer.whatsapp || order.customer.phone}
              </p>
              <p>
                <span className="text-charcoal/50">Email:</span>{" "}
                {order.customer.email || "—"}
              </p>
              <p className="md:col-span-2">
                <span className="text-charcoal/50">Address:</span>{" "}
                {order.customer.address}, {order.customer.city}{" "}
                {order.customer.postalCode}
              </p>
            </div>
          </div>

          {order.orderType === "ready" && order.items?.length > 0 && (
            <div>
              <h3 className="font-serif text-lg text-maroon mb-3">Items</h3>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gold/20 p-3 flex gap-3"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-20 object-cover"
                      />
                    )}
                    <div className="flex-1 text-sm">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-charcoal/60">
                        Size: {item.size} • Qty: {item.qty}
                      </p>
                      <p className="text-maroon text-xs mt-1">
                        Rs. {item.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {order.orderType === "custom" && order.customDetails && (
            <>
              {order.customDetails.referenceImages?.length > 0 && (
                <div>
                  <h3 className="font-serif text-lg text-maroon mb-3 flex items-center gap-2">
                    <ImageIcon size={18} /> Reference Images
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {order.customDetails.referenceImages.map((img, i) => (
                      <motion.a
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        href={img}
                        target="_blank"
                        rel="noreferrer"
                        className="aspect-square border border-gold/20 overflow-hidden"
                      >
                        <img
                          src={img}
                          alt={`Ref ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}

              {order.customDetails.measurements && (
                <div>
                  <h3 className="font-serif text-lg text-maroon mb-3">
                    Measurements (inches)
                  </h3>
                  <div className="bg-white border border-gold/20 p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    {Object.entries(order.customDetails.measurements).map(
                      ([k, v]) =>
                        v ? (
                          <div key={k}>
                            <p className="text-xs text-charcoal/50 uppercase">
                              {k}
                            </p>
                            <p className="text-charcoal font-medium">{v}"</p>
                          </div>
                        ) : null
                    )}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-serif text-lg text-maroon mb-3">
                  Design Details
                </h3>
                <div className="bg-white border border-gold/20 p-4 space-y-2 text-sm">
                  {order.customDetails.fabricChoice && (
                    <p>
                      <span className="text-charcoal/50">Fabric:</span>{" "}
                      {order.customDetails.fabricChoice}
                    </p>
                  )}
                  {order.customDetails.colorPreference && (
                    <p>
                      <span className="text-charcoal/50">Color:</span>{" "}
                      {order.customDetails.colorPreference}
                    </p>
                  )}
                  {order.customDetails.budget && (
                    <p>
                      <span className="text-charcoal/50">Budget:</span> Rs.{" "}
                      {order.customDetails.budget}
                    </p>
                  )}
                  {order.customDetails.eventDate && (
                    <p>
                      <span className="text-charcoal/50">Event Date:</span>{" "}
                      {new Date(
                        order.customDetails.eventDate
                      ).toLocaleDateString()}
                    </p>
                  )}
                  {order.customDetails.description && (
                    <p>
                      <span className="text-charcoal/50">Description:</span>{" "}
                      {order.customDetails.description}
                    </p>
                  )}
                  {order.customDetails.notes && (
                    <p>
                      <span className="text-charcoal/50">Notes:</span>{" "}
                      {order.customDetails.notes}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {order.statusHistory?.length > 0 && (
            <div>
              <h3 className="font-serif text-lg text-maroon mb-3">
                Status History
              </h3>
              <div className="bg-white border border-gold/20 p-4 space-y-2">
                {order.statusHistory.map((h, i) => (
                  <div key={i} className="text-sm flex justify-between">
                    <span className="capitalize">{h.status}</span>
                    <span className="text-charcoal/50 text-xs">
                      {new Date(h.changedAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   PRODUCTS TAB
============================================================ */
function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/products`);
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API}/categories`);
      if (data.success) setCategories(data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditing(null);
    fetchProducts();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-charcoal/60">
          {products.length} product{products.length !== 1 && "s"}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-maroon text-white px-5 py-2.5 text-sm tracking-wide hover:bg-gold transition shadow-md"
        >
          <Plus size={16} /> Add Product
        </motion.button>
      </div>

      {showForm && (
        <ProductForm
          editing={editing}
          categories={categories}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSaved={handleSaved}
        />
      )}

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-10 h-10 border-4 border-maroon/30 border-t-maroon rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gold/20">
          <Package size={48} className="text-gold mx-auto mb-4" />
          <p className="font-serif text-2xl text-maroon mb-2">
            No products yet
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-maroon text-white px-6 py-3 text-sm"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, boxShadow: "0 15px 40px rgba(139,21,56,0.12)" }}
              className="bg-white border border-gold/20 overflow-hidden transition-shadow"
            >
              <div className="aspect-[3/4] bg-cream relative">
                {p.images?.[0] ? (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-charcoal/30">
                    <ImageIcon size={40} />
                  </div>
                )}

                {p.images?.length > 1 && (
                  <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 tracking-wider">
                    {p.images.length} IMAGES
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-[10px] tracking-widest text-gold mb-1">
                  {p.category?.toUpperCase()}
                  {p.subCategory && ` • ${p.subCategory.toUpperCase()}`}
                </p>
                <h3 className="font-serif text-base text-charcoal mb-2 line-clamp-1">
                  {p.name}
                </h3>
                <p className="text-sm text-maroon mb-3">
                  Rs. {(p.salePrice || p.price).toLocaleString()}
                </p>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setEditing(p);
                      setShowForm(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 border border-charcoal/20 text-charcoal text-xs py-2 hover:bg-charcoal hover:text-white transition"
                  >
                    <Edit size={12} /> Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDelete(p._id)}
                    className="flex-1 flex items-center justify-center gap-1 border border-red-200 text-red-500 text-xs py-2 hover:bg-red-500 hover:text-white transition"
                  >
                    <Trash2 size={12} /> Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PRODUCT FORM
============================================================ */
function ProductForm({ editing, categories, onCancel, onSaved }) {
  const [form, setForm] = useState({
    name: editing?.name || "",
    description: editing?.description || "",
    price: editing?.price || "",
    salePrice: editing?.salePrice || "",
    category: editing?.category || "",
    subCategory: editing?.subCategory || "",
    fabric: editing?.fabric || "",
    sizes: editing?.sizes?.join(", ") || "S, M, L, XL",
    tag: editing?.tag || "",
    inStock: editing?.inStock ?? true,
    isFeatured: editing?.isFeatured ?? false,
    isCustomizable: editing?.isCustomizable ?? true,
  });

  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState(editing?.images || []);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedCat = categories.find((c) => c.slug === form.category);
  const availableSubCategories = selectedCat?.subCategories || [];

  const handleCategoryChange = (newCat) => {
    setForm({ ...form, category: newCat, subCategory: "" });
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    const totalCount = existingImages.length + newImages.length + files.length;

    if (totalCount > 6) {
      alert(
        `Maximum 6 images allowed. You already have ${
          existingImages.length + newImages.length
        }.`
      );
      return;
    }

    const combined = [...newImages, ...files];
    setNewImages(combined);

    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target.result);
            reader.readAsDataURL(file);
          })
      )
    ).then((newPrevs) => setNewPreviews([...newPreviews, ...newPrevs]));
  };

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    setNewPreviews(newPreviews.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url) => {
    setExistingImages(existingImages.filter((img) => img !== url));
  };

  const moveImage = (type, index, direction) => {
    const arr = type === "existing" ? [...existingImages] : [...newPreviews];
    const target = index + direction;
    if (target < 0 || target >= arr.length) return;

    [arr[index], arr[target]] = [arr[target], arr[index]];

    if (type === "existing") {
      setExistingImages(arr);
    } else {
      const newFilesArr = [...newImages];
      [newFilesArr[index], newFilesArr[target]] = [
        newFilesArr[target],
        newFilesArr[index],
      ];
      setNewImages(newFilesArr);
      setNewPreviews(arr);
    }
  };

  const setAsMain = (url) => {
    setExistingImages([url, ...existingImages.filter((i) => i !== url)]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) => {
        if (k === "sizes") return;
        if (typeof v === "boolean") {
          fd.append(k, v ? "true" : "false");
        } else {
          fd.append(k, v);
        }
      });

      const sizesArray = form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      fd.append("sizes", JSON.stringify(sizesArray));

      fd.append("existingImages", JSON.stringify(existingImages));

      newImages.forEach((img) => fd.append("images", img));

      if (editing) {
        await api.put(`/products/${editing._id}`, fd);
      } else {
        await api.post("/products", fd);
      }

      onSaved();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Save failed. Please check all fields."
      );
    } finally {
      setSaving(false);
    }
  };

  const totalImages = existingImages.length + newImages.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gold/20 p-6 mb-6 shadow-md"
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-serif text-xl text-maroon">
          {editing ? "Edit Product" : "Add New Product"}
        </h2>
        <button
          onClick={onCancel}
          className="text-charcoal/50 hover:text-maroon transition"
        >
          <X size={20} />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <FormInput
            label="Product Name *"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            required
          />

          <div>
            <label className="block text-xs tracking-widest text-charcoal/60 mb-2">
              CATEGORY *
            </label>
            <select
              value={form.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full border border-gold/30 bg-cream/30 px-4 py-3 text-sm focus:outline-none focus:border-maroon"
            >
              <option value="">-- Select Category --</option>
              {categories.map((c) => (
                <option key={c._id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                No categories found. Add one in Categories tab first.
              </p>
            )}
          </div>

          {availableSubCategories.length > 0 && (
            <div className="md:col-span-2">
              <label className="block text-xs tracking-widest text-charcoal/60 mb-2">
                SUB-CATEGORY (optional)
              </label>
              <select
                value={form.subCategory}
                onChange={(e) =>
                  setForm({ ...form, subCategory: e.target.value })
                }
                className="w-full border border-gold/30 bg-cream/30 px-4 py-3 text-sm focus:outline-none focus:border-maroon"
              >
                <option value="">-- No sub-category --</option>
                {availableSubCategories.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-charcoal/50 mt-1">
                Sub-categories are managed in the Categories tab.
              </p>
            </div>
          )}

          <FormInput
            label="Price (PKR) *"
            type="number"
            value={form.price}
            onChange={(v) => setForm({ ...form, price: v })}
            required
          />
          <FormInput
            label="Sale Price (optional)"
            type="number"
            value={form.salePrice}
            onChange={(v) => setForm({ ...form, salePrice: v })}
          />
          <FormInput
            label="Fabric"
            value={form.fabric}
            onChange={(v) => setForm({ ...form, fabric: v })}
          />
          <FormInput
            label="Tag (New / Best Seller)"
            value={form.tag}
            onChange={(v) => setForm({ ...form, tag: v })}
          />
          <div className="md:col-span-2">
            <FormInput
              label="Sizes (comma separated)"
              value={form.sizes}
              onChange={(v) => setForm({ ...form, sizes: v })}
              placeholder="S, M, L, XL, Custom"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs tracking-widest text-charcoal/60 mb-2">
              DESCRIPTION
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border border-gold/30 bg-cream/30 px-4 py-3 text-sm focus:outline-none focus:border-maroon h-20"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <Toggle
            label="In Stock"
            checked={form.inStock}
            onChange={(v) => setForm({ ...form, inStock: v })}
          />
          <Toggle
            label="Featured"
            checked={form.isFeatured}
            onChange={(v) => setForm({ ...form, isFeatured: v })}
          />
          <Toggle
            label="Customizable"
            checked={form.isCustomizable}
            onChange={(v) => setForm({ ...form, isCustomizable: v })}
          />
        </div>

        <div className="border-t border-gold/20 pt-5">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs tracking-widest text-charcoal/60">
              PRODUCT IMAGES ({totalImages}/6)
            </label>
            {totalImages > 0 && (
              <span className="text-[10px] text-charcoal/40">
                First image = main image
              </span>
            )}
          </div>

          {totalImages < 6 && (
            <label className="block border-2 border-dashed border-gold/40 hover:border-maroon transition p-6 text-center cursor-pointer mb-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleNewImages}
                className="hidden"
              />
              <ImageIcon size={28} className="text-gold mx-auto mb-2" />
              <p className="text-sm text-charcoal mb-1">
                Click to upload images
              </p>
              <p className="text-xs text-charcoal/50">
                JPG, PNG, WEBP — {6 - totalImages} slots remaining
              </p>
            </label>
          )}

          {existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] tracking-widest text-charcoal/50 mb-2">
                EXISTING IMAGES
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {existingImages.map((url, i) => (
                  <div
                    key={`existing-${i}`}
                    className="relative aspect-square border border-gold/20 group"
                  >
                    <img
                      src={url}
                      alt={`Existing ${i + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-maroon text-white text-[9px] px-1.5 py-0.5 uppercase">
                        Main
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
                      {i !== 0 && (
                        <button
                          type="button"
                          onClick={() => setAsMain(url)}
                          className="bg-gold text-white p-1.5 hover:bg-maroon"
                        >
                          <Star size={12} />
                        </button>
                      )}
                      {i > 0 && (
                        <button
                          type="button"
                          onClick={() => moveImage("existing", i, -1)}
                          className="bg-white text-charcoal p-1.5 text-[10px]"
                        >
                          ←
                        </button>
                      )}
                      {i < existingImages.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveImage("existing", i, 1)}
                          className="bg-white text-charcoal p-1.5 text-[10px]"
                        >
                          →
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeExistingImage(url)}
                        className="bg-red-500 text-white p-1.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {newPreviews.length > 0 && (
            <div>
              <p className="text-[10px] tracking-widest text-charcoal/50 mb-2">
                NEW IMAGES ({newPreviews.length})
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {newPreviews.map((preview, i) => (
                  <div
                    key={`new-${i}`}
                    className="relative aspect-square border border-gold/20 group"
                  >
                    <img
                      src={preview}
                      alt={`New ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
                      {i > 0 && (
                        <button
                          type="button"
                          onClick={() => moveImage("new", i, -1)}
                          className="bg-white text-charcoal p-1.5 text-[10px]"
                        >
                          ←
                        </button>
                      )}
                      {i < newPreviews.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveImage("new", i, 1)}
                          className="bg-white text-charcoal p-1.5 text-[10px]"
                        >
                          →
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="bg-red-500 text-white p-1.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-charcoal/30 text-charcoal py-3 text-sm tracking-widest hover:bg-charcoal hover:text-white transition"
          >
            CANCEL
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving}
            className="flex-1 bg-maroon text-white py-3 text-sm tracking-widest hover:bg-gold transition disabled:opacity-50 shadow-md"
          >
            {saving ? "SAVING..." : editing ? "UPDATE" : "CREATE"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

/* ============================================================
   CATEGORIES TAB
============================================================ */
function CategoriesTab() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/categories`);
      if (data.success) setCategories(data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditing(null);
    fetchCategories();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-charcoal/60">
          {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-maroon text-white px-5 py-2.5 text-sm tracking-wide hover:bg-gold transition shadow-md"
        >
          <Plus size={16} /> Add Category
        </motion.button>
      </div>

      {showForm && (
        <CategoryForm
          editing={editing}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSaved={handleSaved}
        />
      )}

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-10 h-10 border-4 border-maroon/30 border-t-maroon rounded-full animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gold/20">
          <Star size={48} className="text-gold mx-auto mb-4" />
          <p className="font-serif text-2xl text-maroon mb-2">
            No categories yet
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-maroon text-white px-6 py-3 text-sm"
          >
            Add Your First Category
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ boxShadow: "0 10px 30px rgba(139,21,56,0.08)" }}
              className="bg-white border border-gold/20 p-4 flex flex-col md:flex-row gap-4 items-start transition-shadow"
            >
              <div className="w-20 h-28 flex-shrink-0 bg-cream">
                {c.image ? (
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-charcoal/30">
                    <ImageIcon size={24} />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-serif text-lg text-maroon">{c.name}</h3>
                  {!c.isActive && (
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 uppercase">
                      Hidden
                    </span>
                  )}
                  <span className="text-[10px] text-charcoal/40">
                    Order: {c.order || 0}
                  </span>
                </div>
                <p className="text-xs text-charcoal/50 mb-1">/{c.slug}</p>
                {c.description && (
                  <p className="text-sm text-charcoal/70 mb-2">
                    {c.description}
                  </p>
                )}

                {c.subCategories?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-[10px] tracking-widest text-charcoal/40 mr-1">
                      SUB:
                    </span>
                    {c.subCategories.map((s, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-gold/20 text-maroon px-2 py-0.5"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setEditing(c);
                    setShowForm(true);
                  }}
                  className="flex items-center gap-1 border border-charcoal/20 text-charcoal text-xs px-3 py-2 hover:bg-charcoal hover:text-white transition"
                >
                  <Edit size={12} /> Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(c._id)}
                  className="flex items-center gap-1 border border-red-200 text-red-500 text-xs px-3 py-2 hover:bg-red-500 hover:text-white transition"
                >
                  <Trash2 size={12} /> Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   CATEGORY FORM
============================================================ */
function CategoryForm({ editing, onCancel, onSaved }) {
  const [form, setForm] = useState({
    name: editing?.name || "",
    slug: editing?.slug || "",
    description: editing?.description || "",
    order: editing?.order || 0,
    isActive: editing?.isActive ?? true,
    gender: editing?.gender || "women",
  });

  const [subCategories, setSubCategories] = useState(
    editing?.subCategories || []
  );
  const [newSubName, setNewSubName] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(editing?.image || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const addSubCategory = () => {
    const name = newSubName.trim();
    if (!name) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    if (subCategories.some((s) => s.slug === slug)) {
      alert("This sub-category already exists");
      return;
    }

    setSubCategories([...subCategories, { name, slug }]);
    setNewSubName("");
  };

  const removeSubCategory = (slug) => {
    setSubCategories(subCategories.filter((s) => s.slug !== slug));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (typeof v === "boolean") {
          fd.append(k, v ? "true" : "false");
        } else {
          fd.append(k, v);
        }
      });

      fd.append("subCategories", JSON.stringify(subCategories));

      if (image) fd.append("image", image);

      if (editing) {
        await api.put(`/categories/${editing._id}`, fd);
      } else {
        await api.post("/categories", fd);
      }

      onSaved();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gold/20 p-6 mb-6 shadow-md"
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-serif text-xl text-maroon">
          {editing ? "Edit Category" : "Add New Category"}
        </h2>
        <button
          onClick={onCancel}
          className="text-charcoal/50 hover:text-maroon transition"
        >
          <X size={20} />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <FormInput
            label="Category Name *"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            placeholder="Abaya, Bridal, Wedding Wear..."
            required
          />
          <FormInput
            label="Slug (URL) — auto if empty"
            value={form.slug}
            onChange={(v) => setForm({ ...form, slug: v })}
            placeholder="abaya, bridal, wedding"
          />
          <FormInput
            label="Description"
            value={form.description}
            onChange={(v) => setForm({ ...form, description: v })}
            placeholder="Modest elegance"
          />
          <FormInput
            label="Display Order (1, 2, 3...)"
            type="number"
            value={form.order}
            onChange={(v) => setForm({ ...form, order: v })}
            placeholder="0"
          />
        </div>

        <div className="border-t border-gold/20 pt-5">
          <label className="block text-xs tracking-widest text-charcoal/60 mb-3">
            SUB-CATEGORIES ({subCategories.length})
          </label>
          <p className="text-xs text-charcoal/50 mb-3">
            Add options like: Modern, Arabic, Simple, Front Open, Dubai, etc.
          </p>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newSubName}
              onChange={(e) => setNewSubName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSubCategory();
                }
              }}
              placeholder="Enter sub-category name (e.g., Modern)"
              className="flex-1 border border-gold/30 bg-cream/30 px-4 py-2.5 text-sm focus:outline-none focus:border-maroon"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={addSubCategory}
              className="bg-maroon text-white px-5 text-sm hover:bg-gold transition flex items-center gap-1"
            >
              <Plus size={14} /> Add
            </motion.button>
          </div>

          {subCategories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {subCategories.map((s) => (
                  <motion.span
                    key={s.slug}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-2 bg-gold/20 text-maroon text-xs px-3 py-1.5"
                  >
                    {s.name}
                    <button
                      type="button"
                      onClick={() => removeSubCategory(s.slug)}
                      className="text-maroon/60 hover:text-red-500 transition"
                    >
                      <X size={12} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <p className="text-xs text-charcoal/40 italic">
              No sub-categories added yet.
            </p>
          )}
        </div>

        <div className="border-t border-gold/20 pt-5">
          <label className="block text-xs tracking-widest text-charcoal/60 mb-2">
            CATEGORY IMAGE
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="block w-full text-sm border border-gold/30 px-3 py-2"
          />
          {preview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 w-32 h-40 border border-gold/20 overflow-hidden"
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </div>

        <Toggle
          label="Show on website"
          checked={form.isActive}
          onChange={(v) => setForm({ ...form, isActive: v })}
        />

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-charcoal/30 text-charcoal py-3 text-sm tracking-widest hover:bg-charcoal hover:text-white transition"
          >
            CANCEL
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving}
            className="flex-1 bg-maroon text-white py-3 text-sm tracking-widest hover:bg-gold transition disabled:opacity-50 shadow-md"
          >
            {saving ? "SAVING..." : editing ? "UPDATE" : "CREATE"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

/* ============ FORM INPUT ============ */
function FormInput({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  options,
}) {
  return (
    <div>
      <label className="block text-xs tracking-widest text-charcoal/60 mb-2">
        {label.toUpperCase()}
      </label>
      {type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gold/30 bg-cream/30 px-4 py-3 text-sm focus:outline-none focus:border-maroon"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="w-full border border-gold/30 bg-cream/30 px-4 py-3 text-sm focus:outline-none focus:border-maroon transition-colors"
        />
      )}
    </div>
  );
}

/* ============ TOGGLE ============ */
function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-maroon"
      />
      <span className="text-sm text-charcoal">{label}</span>
    </label>
  );
}