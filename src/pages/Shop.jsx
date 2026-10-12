import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  Filter,
  Star,
  MessageCircle,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useCart } from "../store/cart";
import { KhadijaNavbar } from "./Home";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const WHATSAPP = "923363406330";

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [subCategory, setSubCategory] = useState(
    searchParams.get("subCategory") || "all"
  );
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API}/categories`, {
          params: { gender: "women", active: "true" },
        });
        if (data.success) setCategories(data.categories);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setCategory(searchParams.get("category") || "all");
    setSubCategory(searchParams.get("subCategory") || "all");
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const params = { gender: "women" };
        if (category !== "all") params.category = category;
        if (subCategory !== "all") params.subCategory = subCategory;
        if (search) params.search = search;
        if (sort) params.sort = sort;

        const { data } = await axios.get(`${API}/products`, { params });
        if (data.success) setProducts(data.products);
      } catch (err) {
        console.error(err);
        setError("Backend se connect nahi ho pa raha");
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(fetchProducts, 400);
    return () => clearTimeout(t);
  }, [category, subCategory, search, sort]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setSubCategory("all");
    const params = {};
    if (cat !== "all") params.category = cat;
    setSearchParams(params);
    setFiltersOpen(false);
  };

  const handleSubCategoryChange = (sub) => {
    setSubCategory(sub);
    const params = {};
    if (category !== "all") params.category = category;
    if (sub !== "all") params.subCategory = sub;
    setSearchParams(params);
  };

  const currentCategoryObj = categories.find((c) => c.slug === category);
  const availableSubCategories = currentCategoryObj?.subCategories || [];

  return (
    <div className="min-h-screen bg-cream">
      <KhadijaNavbar />

      {/* HEADER */}
      <section className="pt-24 md:pt-32 lg:pt-36 pb-6 md:pb-8 px-4 md:px-8 max-w-7xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-gold tracking-[0.3em] text-[10px] md:text-xs mb-2 md:mb-3"
        >
          SHOP
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-3xl md:text-5xl text-maroon mb-3 md:mb-4"
        >
          {currentCategoryObj ? currentCategoryObj.name : "The Collection"}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-charcoal/60 text-xs md:text-sm max-w-xl mx-auto px-4"
        >
          {currentCategoryObj?.description ||
            "Bridal, formal & eastern wear — crafted with precision, made for your moment."}
        </motion.p>
      </section>

      {/* MOBILE FILTER TOGGLE */}
      <section className="px-4 md:hidden mb-4">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full flex items-center justify-between bg-white border border-gold/20 px-4 py-3 text-sm"
        >
          <span className="flex items-center gap-2 text-charcoal">
            <Filter size={16} /> Filters & Categories
          </span>
          <motion.span
            animate={{ rotate: filtersOpen ? 180 : 0 }}
            className="text-maroon"
          >
            ▼
          </motion.span>
        </button>
      </section>

      {/* FILTERS */}
      <AnimatePresence>
        {(filtersOpen || window.innerWidth >= 768) && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 md:px-8 max-w-7xl mx-auto mb-8 overflow-hidden md:!h-auto md:!opacity-100"
          >
            <div className="bg-white border border-gold/20 p-3 md:p-6 flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gold/30 bg-cream/50 focus:outline-none focus:border-maroon text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter
                  size={16}
                  className="text-charcoal/60 hidden md:block"
                />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="flex-1 md:flex-initial border border-gold/30 bg-cream/50 px-3 py-2.5 text-sm focus:outline-none focus:border-maroon"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2 mt-4 md:mt-5">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`px-3 md:px-5 py-1.5 md:py-2 text-[10px] md:text-xs tracking-wider border transition ${
                  category === "all"
                    ? "bg-maroon text-white border-maroon"
                    : "bg-white text-charcoal border-gold/30 hover:border-maroon"
                }`}
              >
                ALL
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  onClick={() => handleCategoryChange(c.slug)}
                  className={`px-3 md:px-5 py-1.5 md:py-2 text-[10px] md:text-xs tracking-wider border transition ${
                    category === c.slug
                      ? "bg-maroon text-white border-maroon"
                      : "bg-white text-charcoal border-gold/30 hover:border-maroon"
                  }`}
                >
                  {c.name.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Sub-categories */}
            {availableSubCategories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gold/20"
              >
                <p className="text-[9px] md:text-[10px] tracking-widest text-charcoal/50 mb-2">
                  REFINE BY STYLE
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSubCategoryChange("all")}
                    className={`px-3 md:px-4 py-1.5 text-[10px] md:text-[11px] tracking-wider border transition ${
                      subCategory === "all"
                        ? "bg-gold text-white border-gold"
                        : "bg-cream text-charcoal border-gold/30 hover:border-gold"
                    }`}
                  >
                    ALL STYLES
                  </button>
                  {availableSubCategories.map((sub) => (
                    <button
                      key={sub.slug}
                      onClick={() => handleSubCategoryChange(sub.slug)}
                      className={`px-3 md:px-4 py-1.5 text-[10px] md:text-[11px] tracking-wider border transition ${
                        subCategory === sub.slug
                          ? "bg-gold text-white border-gold"
                          : "bg-cream text-charcoal border-gold/30 hover:border-gold"
                      }`}
                    >
                      {sub.name.toUpperCase()}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* PRODUCTS */}
      <section className="px-3 md:px-8 max-w-7xl mx-auto pb-20">
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-10 h-10 border-4 border-maroon/30 border-t-maroon rounded-full animate-spin" />
            <p className="mt-4 text-charcoal/60 text-sm">Loading pieces...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20 max-w-md mx-auto px-4">
            <p className="text-maroon mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-maroon text-white px-6 py-2 text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20 px-4">
            <p className="font-serif text-xl md:text-2xl text-maroon mb-2">
              No pieces found
            </p>
            <p className="text-charcoal/60 text-sm mb-6">
              Try a different category or search term.
            </p>
            <Link
              to="/custom"
              className="inline-block bg-maroon text-white px-6 md:px-8 py-3 text-sm tracking-wide hover:bg-gold transition"
            >
              Request a Custom Design
            </Link>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <p className="text-charcoal/50 text-[10px] md:text-xs mb-4 md:mb-6">
              Showing {products.length} piece{products.length !== 1 && "s"}
            </p>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6"
            >
              {products.map((p) => (
                <motion.div key={p._id} variants={staggerItem}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </section>

     
    </div>
  );
}

/* ============ PRODUCT CARD ============ */
function ProductCard({ product }) {
  const image =
    product.images?.[0] ||
    "https://placehold.co/600x800/FAF7F2/8B1538?text=Khadija";
  const price = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const waMessage = encodeURIComponent(
    `Assalam-o-Alaikum! I'm interested in "${product.name}" (Rs. ${price}). Please share details.`
  );

  return (
    <div className="group bg-white border border-gold/10 hover:border-gold/40 transition hover:shadow-xl duration-500 h-full flex flex-col">
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative overflow-hidden aspect-[3/4] bg-cream">
          <motion.img
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.7 }}
            src={image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 md:top-3 left-2 md:left-3 flex flex-col gap-1">
            {product.tag && (
              <span className="bg-maroon text-white text-[8px] md:text-[10px] tracking-wider px-1.5 md:px-2.5 py-0.5 md:py-1">
                {product.tag.toUpperCase()}
              </span>
            )}
            {hasDiscount && (
              <span className="bg-gold text-white text-[8px] md:text-[10px] tracking-wider px-1.5 md:px-2.5 py-0.5 md:py-1">
                -{discountPercent}%
              </span>
            )}
            {!product.inStock && (
              <span className="bg-charcoal text-white text-[8px] md:text-[10px] tracking-wider px-1.5 md:px-2.5 py-0.5 md:py-1">
                SOLD
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="p-2.5 md:p-4 flex-1 flex flex-col">
        <p className="text-[8px] md:text-[10px] tracking-widest text-gold mb-0.5 md:mb-1 line-clamp-1">
          {product.category?.toUpperCase()}
          {product.subCategory && ` • ${product.subCategory.toUpperCase()}`}
        </p>

        <h3 className="font-serif text-xs md:text-lg text-charcoal leading-snug mb-1.5 md:mb-2 line-clamp-2 group-hover:text-maroon transition">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3 flex-wrap">
          <span className="text-maroon font-medium text-xs md:text-sm">
            Rs. {price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-charcoal/40 line-through text-[10px] md:text-xs">
              Rs. {product.price.toLocaleString()}
            </span>
          )}
        </div>

        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2 md:mb-3">
            <Star size={10} className="fill-gold text-gold md:w-3 md:h-3" />
            <span className="text-[10px] md:text-xs text-charcoal/70">
              {product.rating.toFixed(1)} ({product.reviewsCount})
            </span>
          </div>
        )}

        <div className="flex gap-1.5 md:gap-2 mt-auto">
          <Link
            to={`/product/${product._id}`}
            className="flex-1 text-center border border-maroon text-maroon px-1 md:px-2 text-[10px] md:text-xs py-1.5 md:py-2 tracking-wider hover:bg-maroon hover:text-white transition"
          >
            VIEW
          </Link>
          <a
            href={`https://wa.me/923363406330?text=${waMessage}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-center bg-green-600 text-white text-[10px] md:text-xs py-1.5 md:py-2 tracking-wider hover:bg-green-700 transition flex items-center justify-center gap-1"
          >
            <MessageCircle size={10} className="md:w-3 md:h-3" />
            <span className="hidden xs:inline">ORDER</span>
          </a>
        </div>
      </div>
    </div>
  );
}