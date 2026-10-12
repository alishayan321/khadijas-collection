import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

export default function BridalHero() {
  const containerRef = useRef(null);

  /* ============ SCROLL PROGRESS ============ */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  /* ============ TEXT TRANSFORMS ============ */
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const textX = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  /* ============ IMAGE TRANSFORMS ============ */
  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 1.1, 1.25]
  );
  const imageX = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [0, -3]);

  /* ============ BG TRANSFORMS ============ */
  const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 30% 50%, #FAF7F2 0%, #F5EFE6 40%, #E8DCC8 100%)",
      }}
    >
      {/* ====================================================
          BACKGROUND DECORATION
      ==================================================== */}
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0"
      >
        {/* Gold glow circles */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-maroon/15 blur-3xl"
        />

        {/* Decorative SVG lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="15"
            x2="100"
            y2="15"
            stroke="#C9A961"
            strokeWidth="0.08"
          />
          <line
            x1="0"
            y1="85"
            x2="100"
            y2="85"
            stroke="#C9A961"
            strokeWidth="0.08"
          />
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="#C9A961"
            strokeWidth="0.08"
          />
        </svg>
      </motion.div>

      {/* ====================================================
          FLOATING PARTICLES
      ==================================================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              y: "110vh",
              x: `${5 + i * 6}%`,
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              y: "-10vh",
              opacity: [0, 0.8, 0.8, 0],
              scale: [0.5, 1, 1, 0.5],
              x: [`${5 + i * 6}%`, `${3 + i * 6}%`],
            }}
            transition={{
              duration: 12 + (i % 5) * 3,
              repeat: Infinity,
              delay: i * 1,
              ease: "linear",
            }}
            className={`absolute rounded-full ${
              i % 3 === 0
                ? "w-2 h-2 bg-gold"
                : i % 3 === 1
                ? "w-1.5 h-1.5 bg-maroon/60"
                : "w-1 h-1 bg-gold/80"
            }`}
          />
        ))}
      </div>

      {/* ====================================================
          MAIN CONTENT — SPLIT LAYOUT
      ==================================================== */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 items-center gap-8 pt-20">
        {/* ============ LEFT: TEXT ============ */}
        <motion.div
          style={{
            opacity: textOpacity,
            x: textX,
            scale: textScale,
          }}
          className="text-center md:text-left"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-gold tracking-[0.5em] text-xs md:text-sm mb-4"
          >
            KHADIJA'S COLLECTION
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium leading-[1.1] mb-6 text-maroon"
          >
            Bridal Elegance,
            <br />
            <span className="italic gold-text">Crafted for You.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-charcoal/70 text-base md:text-lg mb-8 max-w-lg mx-auto md:mx-0"
          >
            Exclusive abaya, bridal, wedding & party wear for women.
            Custom stitching available.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/shop"
                className="block bg-maroon text-white px-8 py-3.5 tracking-widest text-sm hover:bg-gold transition shadow-lg shine-btn"
              >
                SHOP COLLECTION
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/custom"
                className="block border-2 border-maroon text-maroon px-8 py-3.5 tracking-widest text-sm hover:bg-maroon hover:text-white transition"
              >
                CUSTOM DESIGN
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ============ RIGHT: BRIDE IMAGE ============ */}
        <motion.div
          style={{
            scale: imageScale,
            x: imageX,
            y: imageY,
            rotate: imageRotate,
          }}
          className="relative flex justify-center md:justify-end"
        >
          {/* Glow behind image */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 m-auto w-[80%] h-[80%] rounded-full bg-gold/30 blur-3xl"
          />

          {/* Main bride image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 1.4,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative"
          >
            {/* Floating motion */}
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <img
                src="/images/hero-bride-v2.png"
                alt="Khadija's Collection Bridal"
                className="relative max-h-[75vh] w-auto object-contain rounded-sm"
                style={{
                  filter:
                    "drop-shadow(0 25px 60px rgba(139,21,56,0.35)) drop-shadow(0 10px 30px rgba(201,169,97,0.2))",
                }}
                draggable={false}
              />

              {/* Shimmer overlay */}
              <motion.div
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 4,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)",
                  mixBlendMode: "overlay",
                }}
              />
            </motion.div>

            {/* Decorative corner frames */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="absolute -top-4 -left-4 w-16 h-16 border-t-2 border-l-2 border-gold"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="absolute -bottom-4 -right-4 w-16 h-16 border-b-2 border-r-2 border-gold"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ====================================================
          SCROLL INDICATOR
      ==================================================== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        style={{ opacity: textOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <p className="text-[10px] tracking-[0.3em] text-maroon/60">
            SCROLL
          </p>
          <div className="w-6 h-10 border-2 border-maroon/40 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-maroon/60 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}