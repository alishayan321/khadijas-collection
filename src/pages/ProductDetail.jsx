import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ArrowLeft,
  MessageCircle,
  Minus,
  Plus,
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useCart } from "../store/cart";
import { KhadijaNavbar } from "./Home";

const API = "http://localhost:5000/api";
const WHATSAPP = "923363406330";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCart((s) => s.addItem);
  const cartItems = useCart((s) => s.items);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(`${API}/products/${id}`);
        if (data.success) {
          setProduct(data.product);
          if (data.product.sizes?.length) {
            setSelectedSize(data.product.sizes[0]);
          }
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error(err);
        setError("Product load nahi ho saka");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    setSelectedImage(0);
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first");
      return;
    }
    for (let i = 0; i < qty; i++) {
      addItem({
        _id: product._id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.images?.[0],
        size: selectedSize,
        slug: product.slug,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert("Please select a size first");
      return;
    }
    handleAddToCart();
    setTimeout(() => navigate("/cart"), 400);
  };

  const waMessage = encodeURIComponent(
    `Assalam-o-Alaikum! I'm interested in "${product?.name}" (Size: ${selectedSize}, Qty: ${qty}). Please share details.`
  );

  /* LOADING */
  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <KhadijaNavbar />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-maroon/30 border-t-maroon rounded-full animate-spin" />
            <p className="mt-4 text-charcoal/60 text-sm">Loading piece...</p>
          </div>
        </div>
      </div>
    );
  }

  /* ERROR */
  if (error || !product) {
    return (
      <div className="min-h-screen bg-cream">
        <KhadijaNavbar />
        <div className="pt-40 px-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <p className="font-serif text-3xl text-maroon mb-4">
              {error || "Product not found"}
            </p>
            <Link
              to="/shop"
              className="inline-block bg-maroon text-white px-8 py-3 text-sm tracking-wide hover:bg-gold transition"
            >
              Back to Shop
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const price = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
  const images =
    product.images?.length > 0
      ? product.images
      : ["https://placehold.co/800x1000/FAF7F2/8B1538?text=Khadija"];

  const goNext = () => {
    setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
  };

  const goPrev = () => {
    setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  return (
    <div className="min-h-screen bg-cream pb-24">
      <KhadijaNavbar />

      {/* Breadcrumb */}
      <div className="pt-24 md:pt-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-charcoal/60 hover:text-maroon text-xs md:text-sm transition-colors mb-3"
          >
            <ArrowLeft size={14} /> Back to Shop
          </Link>
          <div className="text-[10px] md:text-xs text-charcoal/50 tracking-wide">
            <Link to="/" className="hover:text-maroon">HOME</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-maroon">SHOP</Link>
            <span className="mx-2">/</span>
            <span className="text-charcoal uppercase">{product.category}</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* GALLERY */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <div
              className="relative aspect-[3/4] max-w-md mx-auto lg:max-w-full bg-white overflow-hidden border border-gold/10 group"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover select-none"
                  draggable={false}
                />
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transition md:opacity-0 md:group-hover:opacity-100"
                  >
                    <ChevronLeft size={20} className="text-maroon" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transition md:opacity-0 md:group-hover:opacity-100"
                  >
                    <ChevronRight size={20} className="text-maroon" />
                  </button>
                  <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] tracking-widest px-2.5 py-1">
                    {selectedImage + 1} / {images.length}
                  </div>
                </>
              )}

              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.tag && (
                  <span className="bg-maroon text-white text-[10px] tracking-widest px-3 py-1.5">
                    {product.tag.toUpperCase()}
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-gold text-white text-[10px] tracking-widest px-3 py-1.5">
                    -{discountPercent}% OFF
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(i)}
                      className={`transition-all duration-300 rounded-full ${
                        selectedImage === i
                          ? "w-6 h-1.5 bg-white"
                          : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 md:gap-3 mt-3 md:mt-4 overflow-x-auto pb-2 max-w-md mx-auto lg:max-w-full justify-center lg:justify-start">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-14 h-16 md:w-20 md:h-24 border-2 transition ${
                      selectedImage === i
                        ? "border-maroon"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* DETAILS */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-md mx-auto lg:max-w-full w-full"
          >
            <p className="text-gold tracking-[0.3em] text-[10px] md:text-xs mb-2 md:mb-3">
              {product.category?.toUpperCase()}
              {product.subCategory && ` • ${product.subCategory.toUpperCase()}`}
            </p>

            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl text-maroon leading-tight mb-3 md:mb-4">
              {product.name}
            </h1>

            {product.rating > 0 && (
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={
                        s <= Math.round(product.rating)
                          ? "fill-gold text-gold"
                          : "text-charcoal/20"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-charcoal/60">
                  {product.rating.toFixed(1)} ({product.reviewsCount})
                </span>
              </div>
            )}

            <div className="flex items-baseline gap-2 md:gap-3 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gold/20 flex-wrap">
              <span className="text-2xl md:text-3xl lg:text-4xl font-medium text-maroon">
                Rs. {price.toLocaleString()}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base md:text-lg text-charcoal/40 line-through">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] bg-gold/20 text-maroon px-2 py-1">
                    Save Rs.{" "}
                    {(product.price - product.salePrice).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {product.description && (
              <p className="text-charcoal/70 text-sm leading-relaxed mb-4 md:mb-6">
                {product.description}
              </p>
            )}

            {product.fabric && (
              <div className="mb-4 md:mb-6">
                <p className="text-[10px] md:text-xs tracking-widest text-charcoal/50 mb-1">
                  FABRIC
                </p>
                <p className="text-sm text-charcoal">{product.fabric}</p>
              </div>
            )}

            {product.sizes?.length > 0 && (
              <div className="mb-4 md:mb-6">
                <div className="flex justify-between items-center mb-2 md:mb-3">
                  <p className="text-[10px] md:text-xs tracking-widest text-charcoal/50">
                    SELECT SIZE
                  </p>
                  <Link
                    to="/custom"
                    className="text-[10px] md:text-xs text-maroon underline hover:text-gold"
                  >
                    Need custom size?
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[2.5rem] md:min-w-[3rem] px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm border transition ${
                        selectedSize === s
                          ? "bg-maroon text-white border-maroon"
                          : "bg-white text-charcoal border-gold/30 hover:border-maroon"
                      }`}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4 md:mb-6">
              <p className="text-[10px] md:text-xs tracking-widest text-charcoal/50 mb-2 md:mb-3">
                QUANTITY
              </p>
              <div className="flex items-center border border-gold/30 w-fit">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-2.5 md:p-3 hover:bg-cream transition"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 md:px-6 text-charcoal font-medium text-sm md:text-base">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="p-2.5 md:p-3 hover:bg-cream transition"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full bg-maroon text-white py-3 md:py-4 tracking-widest text-xs md:text-sm hover:bg-gold transition disabled:opacity-50 shadow-md shine-btn"
              >
                {product.inStock ? "BUY NOW" : "SOLD OUT"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full border border-maroon text-maroon py-3 md:py-4 tracking-widest text-xs md:text-sm hover:bg-maroon hover:text-white transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {added ? (
                  <>
                    <Check size={14} /> ADDED TO BAG
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} /> ADD TO BAG
                  </>
                )}
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href={`https://wa.me/${WHATSAPP}?text=${waMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-green-600 text-white py-3 md:py-4 tracking-widest text-xs md:text-sm hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle size={14} /> ORDER ON WHATSAPP
              </motion.a>

              {product.isCustomizable && (
                <motion.div whileHover={{ scale: 1.02, y: -2 }}>
                  <Link
                    to="/custom"
                    className="w-full border border-gold text-gold py-3 md:py-4 tracking-widest text-xs md:text-sm hover:bg-gold hover:text-white transition flex items-center justify-center gap-2"
                  >
                    <Sparkles size={14} /> CUSTOMIZE THIS DESIGN
                  </Link>
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-3 pt-4 md:pt-6 border-t border-gold/20">
              <div className="text-center">
                <Truck size={18} className="text-maroon mx-auto mb-1.5 md:mb-2" />
                <p className="text-[9px] md:text-[10px] tracking-wide text-charcoal/60">
                  NATIONWIDE DELIVERY
                </p>
              </div>
              <div className="text-center">
                <ShieldCheck size={18} className="text-maroon mx-auto mb-1.5 md:mb-2" />
                <p className="text-[9px] md:text-[10px] tracking-wide text-charcoal/60">
                  PREMIUM QUALITY
                </p>
              </div>
              <div className="text-center">
                <RefreshCw size={18} className="text-maroon mx-auto mb-1.5 md:mb-2" />
                <p className="text-[9px] md:text-[10px] tracking-wide text-charcoal/60">
                  EASY EXCHANGE
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating WhatsApp */}
      <motion.a
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        whileHover={{ scale: 1.15, rotate: 8 }}
        href={`https://wa.me/${WHATSAPP}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-green-600 text-white p-3 md:p-4 rounded-full shadow-2xl hover:bg-green-700 transition z-50 pulse-glow"
      >
        <MessageCircle size={20} />
      </motion.a>
    </div>
  );
}