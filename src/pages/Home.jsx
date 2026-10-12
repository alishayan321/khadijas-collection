import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Menu,
  X,
  Phone,
  MapPin,
  Clock,
  Camera,
  MessageCircle,
  ChevronDown,
  Home as HomeIcon,
  Sparkles,
  Store,
  Ruler,
  Scissors,
  ArrowRight,
  Navigation,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useCart } from "../store/cart";
import BridalHero from "../components/BridalHero";
import ChatBox from "../components/ChatBox";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const WHATSAPP = "923363406330";
const PHONE_DISPLAY = "0336 340 6330";

/* ============ SMOOTH SCROLL HELPER ============ */
const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }
};

/* ============ FALLBACK CATEGORIES ============ */
const FALLBACK_CATEGORIES = [
  { _id: "f1", name: "Abaya", slug: "abaya", description: "Modest elegance" },
  { _id: "f2", name: "Bridal", slug: "bridal", description: "Dulhan collection" },
  { _id: "f3", name: "Wedding Wear", slug: "wedding", description: "For the big day" },
  { _id: "f4", name: "Party Wear", slug: "party", description: "Evening glamour" },
  { _id: "f5", name: "Formal", slug: "formal", description: "Sophisticated" },
  { _id: "f6", name: "Custom", slug: "custom", description: "Design your own" },
];

/* ============ ANIMATION VARIANTS ============ */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/* ============ SECTION TITLE ============ */
function SectionTitle({ label, title, subtitle }) {
  return (
    <div className="text-center mb-14">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-gold tracking-[0.3em] text-xs mb-3"
      >
        {label}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-serif text-3xl md:text-5xl text-maroon mb-4"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-charcoal/60 text-sm max-w-xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: 80 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="h-px bg-gold mx-auto mt-6"
      />
    </div>
  );
}

/* ============ NAVBAR ============ */
export function KhadijaNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const items = useCart((s) => s.items);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API}/categories`, {
          params: { gender: "women", active: "true" },
        });
        if (data.success && data.categories.length > 0) {
          setCategories(data.categories);
        } else {
          setCategories(FALLBACK_CATEGORIES);
        }
      } catch {
        setCategories(FALLBACK_CATEGORIES);
      }
    };
    fetchCategories();
  }, []);

  /* Contact click handler */
  const handleContactClick = (e) => {
    e.preventDefault();
    scrollToSection("contact");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-cream/95 backdrop-blur-xl shadow-md border-b border-gold/30"
            : "bg-gradient-to-b from-cream/95 to-cream/70 backdrop-blur-md border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div
            className={`flex justify-between items-center transition-all duration-500 ${
              scrolled ? "h-16 md:h-20" : "h-20 md:h-24"
            }`}
          >
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <motion.div
                whileHover={{ scale: 1.08, rotate: 3 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gold/40 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src="/images/logo.png"
                  alt="Khadija's Collection"
                  className={`relative w-auto object-contain transition-all duration-500 ${
                    scrolled ? "h-10 md:h-12" : "h-12 md:h-16"
                  }`}
                />
              </motion.div>
              <div className="hidden sm:block">
                <h1
                  className={`font-serif font-semibold text-maroon tracking-wide leading-tight transition-all duration-500 group-hover:text-gold ${
                    scrolled ? "text-lg md:text-xl" : "text-xl md:text-2xl"
                  }`}
                >
                  Khadija's Collection
                </h1>
                <p className="text-[9px] tracking-[0.3em] text-gold/90 -mt-0.5">
                  BESPOKE BRIDAL
                </p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1 text-sm">
              <NavLink to="/" icon={<HomeIcon size={14} />}>
                Home
              </NavLink>

              <div
                className="relative"
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
              >
                <button className="group flex items-center gap-1.5 px-4 py-2.5 text-charcoal/80 hover:text-maroon transition-colors relative">
                  <Store size={14} />
                  <span className="tracking-wide">Shop</span>
                  <motion.div
                    animate={{ rotate: shopOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={14} />
                  </motion.div>
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 group-hover:w-8 h-px bg-gold transition-all duration-300" />
                </button>

                <AnimatePresence>
                  {shopOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="absolute top-full left-0 pt-3 min-w-[260px]"
                    >
                      <div className="bg-cream/98 backdrop-blur-xl border border-gold/30 shadow-2xl overflow-hidden">
                        <Link
                          to="/shop"
                          className="flex items-center gap-3 px-5 py-3.5 text-sm text-maroon font-medium hover:bg-gold/10 transition-colors border-b border-gold/15"
                        >
                          <Sparkles size={14} className="text-gold" />
                          Shop All Collection
                        </Link>
                        <div className="max-h-[70vh] overflow-y-auto">
                          {categories.map((c, i) => (
                            <motion.div
                              key={c._id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.04 }}
                            >
                              <Link
                                to={`/shop?category=${c.slug}`}
                                className="flex items-center justify-between px-5 py-3 text-sm text-charcoal/80 hover:text-maroon hover:bg-gold/5 transition-all group/item border-b border-gold/10 last:border-0"
                              >
                                <span>{c.name}</span>
                                <span className="text-gold opacity-0 group-hover/item:opacity-100 transition-opacity">
                                  →
                                </span>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink to="/custom">Custom</NavLink>

              {/* CONTACT — now smooth scrolls */}
              <a
                href="#contact"
                onClick={handleContactClick}
                className="group relative flex items-center gap-1.5 px-4 py-2.5 text-charcoal/80 hover:text-maroon transition-colors cursor-pointer"
              >
                <Phone size={14} />
                <span className="tracking-wide">Contact</span>
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 group-hover:w-8 h-px bg-gold transition-all duration-300" />
              </a>

              <Link to="/cart" className="relative ml-3">
                <motion.div
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="relative p-2.5 border border-gold/30 rounded-full hover:border-maroon hover:bg-maroon/5 transition-all"
                >
                  <ShoppingBag size={18} className="text-charcoal" />
                  <AnimatePresence>
                    {items.length > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        className="absolute -top-1.5 -right-1.5 bg-maroon text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md"
                      >
                        {items.length}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            </div>

            <button
              className="lg:hidden p-2 relative z-50"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <motion.div
                animate={{ rotate: menuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {menuOpen ? <X size={26} /> : <Menu size={26} />}
              </motion.div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-cream z-50 lg:hidden overflow-y-auto shadow-2xl"
            >
              <div className="p-6 border-b border-gold/20 flex items-center justify-between">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3"
                >
                  <img
                    src="/images/logo.png"
                    alt="Khadija's Collection"
                    className="h-12 w-auto object-contain"
                  />
                  <div>
                    <h2 className="font-serif text-lg font-semibold text-maroon leading-tight">
                      Khadija's Collection
                    </h2>
                    <p className="text-[8px] tracking-[0.3em] text-gold">
                      BESPOKE BRIDAL
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 text-charcoal/60 hover:text-maroon"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="p-6 space-y-1">
                <MobileLink to="/" onClick={() => setMenuOpen(false)}>
                  Home
                </MobileLink>
                <MobileLink to="/shop" onClick={() => setMenuOpen(false)}>
                  Shop All
                </MobileLink>

                <div className="pt-4 pb-2">
                  <p className="text-[10px] tracking-[0.3em] text-gold mb-3 px-3">
                    CATEGORIES
                  </p>
                  {categories.map((c) => (
                    <Link
                      key={c._id}
                      to={`/shop?category=${c.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 text-sm text-charcoal/80 hover:text-maroon hover:bg-gold/5 rounded transition-colors"
                    >
                      <span>{c.name}</span>
                      <span className="text-gold/60">→</span>
                    </Link>
                  ))}
                </div>

                <MobileLink to="/custom" onClick={() => setMenuOpen(false)}>
                  Custom Order
                </MobileLink>

                {/* Contact — smooth scroll */}
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    setTimeout(() => scrollToSection("contact"), 300);
                  }}
                  className="block px-4 py-3 text-base text-charcoal/90 hover:text-maroon hover:bg-gold/5 rounded transition-colors border-b border-gold/10"
                >
                  Contact
                </a>

                <Link
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between mt-4 px-4 py-3 bg-maroon text-white rounded"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag size={16} /> Cart
                  </span>
                  <span className="bg-white text-maroon text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {items.length}
                  </span>
                </Link>
              </div>

              <div className="p-6 border-t border-gold/20 mt-auto">
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 text-sm tracking-wider rounded hover:bg-green-700 transition"
                >
                  <MessageCircle size={16} /> WhatsApp Us
                </a>
                <p className="text-[10px] text-charcoal/40 text-center mt-4 tracking-wider">
                  © {new Date().getFullYear()} KHADIJA'S COLLECTION
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ to, children, icon }) {
  return (
    <Link
      to={to}
      className="group relative flex items-center gap-1.5 px-4 py-2.5 text-charcoal/80 hover:text-maroon transition-colors"
    >
      {icon}
      <span className="tracking-wide">{children}</span>
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 group-hover:w-8 h-px bg-gold transition-all duration-300" />
    </Link>
  );
}

function MobileLink({ to, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-3 text-base text-charcoal/90 hover:text-maroon hover:bg-gold/5 rounded transition-colors border-b border-gold/10"
    >
      {children}
    </Link>
  );
}

/* ============ HOME PAGE ============ */
export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API}/categories`, {
          params: { gender: "women", active: "true" },
        });
        if (data.success && data.categories.length > 0) {
          setCategories(data.categories);
        } else {
          setCategories(FALLBACK_CATEGORIES);
        }
      } catch {
        setCategories(FALLBACK_CATEGORIES);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCategories();
  }, []);

  const featured = [
    {
      id: 1,
      name: "Royal Bridal Lehenga",
      price: 85990,
      oldPrice: 99990,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800",
      tag: "Best Seller",
    },
    {
      id: 2,
      name: "Ivory Walima Gown",
      price: 54990,
      oldPrice: 64990,
      image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800",
      tag: "New",
    },
    {
      id: 3,
      name: "Maroon Mehndi Sharara",
      price: 42990,
      oldPrice: 49990,
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800",
      tag: "",
    },
    {
      id: 4,
      name: "Golden Nikkah Ensemble",
      price: 68990,
      oldPrice: 79990,
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800",
      tag: "Best Seller",
    },
  ];

  return (
    <div className="min-h-screen bg-cream overflow-x-hidden">
      <KhadijaNavbar />

      {/* HERO */}
      <BridalHero />

      {/* CATEGORIES */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <SectionTitle
          label="EXPLORE"
          title="Shop by Category"
          subtitle="Curated collections for every occasion"
        />

        {loadingCats ? (
          <div className="text-center py-20">
            <div className="inline-block w-10 h-10 border-4 border-maroon/30 border-t-maroon rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {categories.map((cat) => (
              <motion.div key={cat._id} variants={staggerItem}>
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="group relative overflow-hidden aspect-[3/4] bg-white block shadow-sm hover:shadow-2xl transition-shadow duration-500"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="w-full h-full"
                  >
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-maroon to-gold flex items-center justify-center text-white text-2xl font-serif">
                        {cat.name}
                      </div>
                    )}
                  </motion.div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <h3 className="font-serif text-2xl mb-1">{cat.name}</h3>
                    {cat.description && (
                      <p className="text-xs text-white/70 mb-2">
                        {cat.description}
                      </p>
                    )}
                    <span className="inline-block mt-1 text-[10px] tracking-widest border-b border-gold text-gold pb-0.5 group-hover:border-white group-hover:text-white transition">
                      SHOP NOW →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* FEATURED */}
      <section className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionTitle label="THE EDIT" title="Featured Pieces" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
          >
            {featured.map((p) => (
              <motion.div key={p.id} variants={staggerItem}>
                <Link to="/shop" className="group block">
                  <div className="relative overflow-hidden aspect-[3/4] bg-white">
                    <motion.img
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {p.tag && (
                      <span className="absolute top-3 left-3 bg-maroon text-white text-[10px] tracking-wider px-3 py-1">
                        {p.tag.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="pt-4 text-center">
                    <h3 className="font-serif text-base md:text-lg text-charcoal group-hover:text-maroon transition">
                      {p.name}
                    </h3>
                    <p className="text-sm mt-1">
                      <span className="text-maroon font-medium">
                        Rs. {p.price.toLocaleString()}
                      </span>
                      <span className="text-charcoal/40 line-through ml-2 text-xs">
                        Rs. {p.oldPrice.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* STORY */}
      <section className="py-24 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center"
        >
          <p className="text-gold tracking-[0.3em] text-xs mb-3">OUR STORY</p>
          <h2 className="font-serif text-3xl md:text-5xl text-maroon mb-6">
            Every Woman Deserves Perfection
          </h2>
          <p className="text-charcoal/70 leading-relaxed max-w-3xl mx-auto">
            Khadija's Collection specialises in bespoke abaya, bridal, wedding
            and party wear for women. Whether you bring us a reference picture
            or design from scratch, our artisans craft each piece with
            precision — perfectly fitted to your measurements, your style, your
            moment.
          </p>
        </motion.div>
      </section>

      {/* CUSTOM CTA */}
      <section className="py-20 px-4 md:px-8 bg-cream">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto bg-maroon text-white p-8 md:p-14 text-center relative overflow-hidden shadow-xl"
        >
          <motion.div
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "linear-gradient(45deg, #C9A961, #8B1538, #C9A961, #8B1538)",
              backgroundSize: "300% 300%",
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-gold/50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-gold/50"
          />

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: ["0%", "-150%"],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 10 + i,
                  repeat: Infinity,
                  delay: i * 1.5,
                  ease: "linear",
                }}
                style={{ left: `${12 + i * 15}%` }}
                className="absolute bottom-0 w-1 h-1 bg-gold/50 rounded-full"
              />
            ))}
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-gold/40 px-3 py-1.5 mb-6"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={12} className="text-gold" />
              </motion.div>
              <span className="text-[9px] tracking-[0.3em] text-gold">
                BESPOKE SERVICE
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4 leading-tight"
            >
              Have a Design
              <br />
              <span className="italic text-gold">in Mind?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-white/80 mb-8 max-w-xl mx-auto text-sm md:text-base leading-relaxed"
            >
              Share your dream design, upload references, and give us your
              exact measurements. Our artisans will craft it just for you.
            </motion.p>

            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
              {[
                {
                  icon: <Sparkles size={18} />,
                  step: "01",
                  title: "Share Design",
                },
                {
                  icon: <Ruler size={18} />,
                  step: "02",
                  title: "Give Measurements",
                },
                {
                  icon: <Scissors size={18} />,
                  step: "03",
                  title: "We Craft It",
                },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.12, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className="relative"
                >
                  <div className="flex flex-col items-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-11 h-11 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center text-gold mb-2 backdrop-blur-sm"
                    >
                      {s.icon}
                    </motion.div>
                    <p className="text-[9px] tracking-[0.2em] text-gold/80 mb-0.5">
                      {s.step}
                    </p>
                    <h3 className="font-serif text-sm md:text-base text-white text-center">
                      {s.title}
                    </h3>
                  </div>

                  {i < 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 + i * 0.12 }}
                      className="absolute top-5 -right-3 text-gold/40"
                    >
                      <ArrowRight size={14} />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Link
                  to="/custom"
                  className="inline-flex items-center gap-2 bg-gold text-charcoal px-7 py-3 tracking-widest text-xs font-medium hover:bg-white transition-colors shine-btn"
                >
                  <span className="relative z-10">START CUSTOM ORDER</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="relative z-10"
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <a
                  href={`https://wa.me/${WHATSAPP}?text=Assalam-o-Alaikum! I want to discuss a custom design.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-6 py-3 tracking-widest text-xs font-medium hover:bg-white hover:text-maroon hover:border-white transition-colors"
                >
                  <MessageCircle size={14} />
                  DISCUSS ON WHATSAPP
                </a>
              </motion.div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="text-[9px] tracking-[0.3em] text-gold/60 mt-6"
            >
              ★ 500+ BRIDES TRUSTED US ★
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ============ CONTACT SECTION — PROFESSIONAL & ANIMATED ============ */}
      <section
        id="contact"
        className="py-24 px-4 md:px-8 bg-white relative overflow-hidden"
      >
        {/* Background decoration */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-gold blur-3xl pointer-events-none"
        />

        <div className="max-w-6xl mx-auto relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-gold tracking-[0.4em] text-xs mb-3"
            >
              VISIT US
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-3xl md:text-5xl text-maroon mb-4"
            >
              Get in Touch
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-charcoal/60 text-sm max-w-xl mx-auto"
            >
              Visit our studio or reach out — we'd love to help you craft your
              perfect outfit.
            </motion.p>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-px bg-gold mx-auto mt-6"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* LEFT: Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="font-serif text-2xl md:text-3xl text-maroon mb-8">
                Contact Information
              </h3>

              <div className="space-y-6">
                {/* Phone */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  whileHover={{ x: 5 }}
                  className="flex gap-5 items-start group cursor-pointer"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-maroon/10 to-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0 group-hover:border-maroon transition-colors"
                  >
                    <Phone className="text-maroon" size={20} />
                  </motion.div>
                  <div className="pt-1">
                    <p className="text-[10px] tracking-[0.2em] text-gold mb-1">
                      PHONE / WHATSAPP
                    </p>
                    <a
                      href={`tel:+${WHATSAPP}`}
                      className="text-base md:text-lg text-charcoal font-medium hover:text-maroon transition-colors"
                    >
                      {PHONE_DISPLAY}
                    </a>
                  </div>
                </motion.div>

                {/* Location — KARACHI */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  whileHover={{ x: 5 }}
                  className="flex gap-5 items-start group cursor-pointer"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-maroon/10 to-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0 group-hover:border-maroon transition-colors"
                  >
                    <MapPin className="text-maroon" size={20} />
                  </motion.div>
                  <div className="pt-1">
                    <p className="text-[10px] tracking-[0.2em] text-gold mb-1">
                      STUDIO
                    </p>
                    <p className="text-base md:text-lg text-charcoal font-medium">
                      Karachi, Pakistan
                    </p>
                    <motion.a
                      href="https://maps.google.com/?q=Karachi,Pakistan"
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ x: 3 }}
                      className="inline-flex items-center gap-1 text-xs text-maroon hover:text-gold mt-1 transition-colors"
                    >
                      <Navigation size={11} /> Get Directions
                    </motion.a>
                  </div>
                </motion.div>

                {/* Timing */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  whileHover={{ x: 5 }}
                  className="flex gap-5 items-start group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-maroon/10 to-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0 group-hover:border-maroon transition-colors"
                  >
                    <Clock className="text-maroon" size={20} />
                  </motion.div>
                  <div className="pt-1">
                    <p className="text-[10px] tracking-[0.2em] text-gold mb-1">
                      TIMINGS
                    </p>
                    <p className="text-sm text-charcoal">Mon–Sat: 11 AM – 9 PM</p>
                    <p className="text-sm text-charcoal">Sunday: 3 PM – 10 PM</p>
                  </div>
                </motion.div>
              </div>

              {/* Social Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-wrap gap-3 mt-10"
              >
                <motion.a
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 bg-green-600 text-white px-6 py-3 hover:bg-green-700 transition shadow-md"
                >
                  <MessageCircle size={18} className="group-hover:rotate-12 transition" />
                  WhatsApp
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 border border-maroon text-maroon px-6 py-3 hover:bg-maroon hover:text-white transition"
                >
                  <Camera size={18} className="group-hover:scale-110 transition" />
                  Instagram
                </motion.a>
              </motion.div>
            </motion.div>

            {/* RIGHT: Quick Enquiry Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="bg-cream p-8 md:p-10 border border-gold/20 shadow-xl relative overflow-hidden"
              >
                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-gold/40" />
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-gold/40" />

                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="w-14 h-14 rounded-full bg-maroon flex items-center justify-center mb-6 mx-auto"
                >
                  <MessageCircle className="text-gold" size={24} />
                </motion.div>

                <h3 className="font-serif text-2xl md:text-3xl text-maroon mb-3 text-center">
                  Quick Enquiry
                </h3>
                <p className="text-charcoal/60 text-sm mb-8 text-center leading-relaxed">
                  Send us a message and we'll respond on WhatsApp within
                  minutes.
                </p>

                <motion.a
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href={`https://wa.me/${WHATSAPP}?text=Assalam-o-Alaikum, I want to inquire about Khadija's Collection.`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center bg-maroon text-white py-4 tracking-widest text-sm hover:bg-gold transition shadow-md shine-btn"
                >
                  <span className="relative z-10">MESSAGE ON WHATSAPP</span>
                </motion.a>

                {/* Trust badges */}
                <div className="mt-8 pt-6 border-t border-gold/20 grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: "REPLY", sub: "in minutes" },
                    { label: "CUSTOM", sub: "stitching" },
                    { label: "DELIVERY", sub: "all Pakistan" },
                  ].map((b, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <p className="text-[10px] tracking-widest text-gold font-medium">
                        {b.label}
                      </p>
                      <p className="text-[10px] text-charcoal/50 mt-0.5">
                        {b.sub}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-charcoal text-white/70 py-12 px-4 md:px-8 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-4"
        >
          <img
            src="/images/logo.png"
            alt="Khadija's Collection"
            className="h-20 w-auto object-contain"
            style={{
              filter:
                "brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(15deg)",
            }}
          />
        </motion.div>

        <h3 className="font-serif text-2xl text-gold mb-3">
          Khadija's Collection
        </h3>
        <p className="text-sm mb-4">
          Bespoke Abaya, Bridal & Formal Wear — Karachi
        </p>
        <p className="text-xs">
          © {new Date().getFullYear()} Khadija's Collection. All rights
          reserved.
        </p>
      </motion.footer>

      <ChatBox />
    </div>
  );
}