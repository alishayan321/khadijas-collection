import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Package,
  Truck,
  Ruler,
  Phone,
  ArrowRight,
  Check,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WHATSAPP = "923363406330";

/* ============ CONVERSATION FLOW ============ */
const FLOW = {
  start: {
    bot: "Assalam-o-Alaikum! 🌸 Welcome to Khadija's Collection. What would you like help with today?",
    options: [
      { id: "products", label: "Browse Products", icon: <Package size={14} /> },
      { id: "price", label: "Pricing & Discounts", icon: <Sparkles size={14} /> },
      { id: "custom", label: "Custom Order", icon: <Ruler size={14} /> },
      { id: "delivery", label: "Delivery Info", icon: <Truck size={14} /> },
      { id: "order", label: "Track My Order", icon: <HelpCircle size={14} /> },
      { id: "contact", label: "Talk to a Human", icon: <Phone size={14} /> },
    ],
  },
  products: {
    bot: "Our collection includes:\n\n• Abaya\n• Bridal\n• Wedding Wear\n• Party Wear\n• Formal\n\nWhich category interests you?",
    options: [
      { id: "view_shop", label: "View Full Shop", icon: <ArrowRight size={14} />, action: "link:/shop" },
      { id: "custom", label: "Want a Custom Design?", icon: <Ruler size={14} /> },
      { id: "back_start", label: "Ask Something Else", icon: <HelpCircle size={14} /> },
    ],
  },
  price: {
    bot: "Our pricing:\n\n• Ready-to-wear: Rs. 4,000 – 30,000\n• Bridal wear: Rs. 50,000 – 100,000+\n• Custom orders: quoted after design review\n\nWould you like to know more?",
    options: [
      { id: "view_shop", label: "View Collection", icon: <ArrowRight size={14} />, action: "link:/shop" },
      { id: "custom", label: "Get Custom Quote", icon: <Ruler size={14} /> },
      { id: "back_start", label: "Ask Something Else", icon: <HelpCircle size={14} /> },
    ],
  },
  custom: {
    bot: "Wonderful! We'd love to craft your dream outfit. ✨\n\nHere's how it works:\n1. Upload reference images\n2. Share measurements\n3. Get your quote in 24 hours\n\nShall we start?",
    options: [
      { id: "start_custom", label: "Start Custom Order", icon: <Ruler size={14} />, action: "link:/custom" },
      { id: "whatsapp", label: "Discuss on WhatsApp", icon: <MessageCircle size={14} />, action: "whatsapp" },
      { id: "back_start", label: "Ask Something Else", icon: <HelpCircle size={14} /> },
    ],
  },
  delivery: {
    bot: "Delivery details:\n\n• Pakistan: Rs. 250 flat\n• International shipping available\n• Self-pickup from Lahore studio\n\nNeed anything else?",
    options: [
      { id: "order", label: "Track My Order", icon: <HelpCircle size={14} /> },
      { id: "whatsapp", label: "Discuss on WhatsApp", icon: <MessageCircle size={14} />, action: "whatsapp" },
      { id: "back_start", label: "Ask Something Else", icon: <HelpCircle size={14} /> },
    ],
  },
  order: {
    bot: "Please share your order number (e.g., KC-2610-1234) or phone number.\n\nOur team will check your order status on WhatsApp.",
    options: [
      { id: "whatsapp", label: "Check on WhatsApp", icon: <MessageCircle size={14} />, action: "whatsapp" },
      { id: "back_start", label: "Ask Something Else", icon: <HelpCircle size={14} /> },
    ],
  },
  contact: {
    bot: "Sure! 🌸\n\nOur team is available:\n• Mon–Sat: 11 AM – 9 PM\n• Sunday: 3 PM – 10 PM\n\nClick below to reach us on WhatsApp instantly.",
    options: [
      { id: "whatsapp", label: "Chat on WhatsApp", icon: <MessageCircle size={14} />, action: "whatsapp" },
      { id: "back_start", label: "Ask Something Else", icon: <HelpCircle size={14} /> },
    ],
  },
};

export default function ChatBox() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentOptions, setCurrentOptions] = useState(FLOW.start.options);
  const [showInput, setShowInput] = useState(false);
  const messagesEndRef = useRef(null);

  /* Start conversation when chat opens */
  useEffect(() => {
    if (open && messages.length === 0) {
      setTimeout(() => {
        addMessage("bot", FLOW.start.bot);
        setCurrentOptions(FLOW.start.options);
      }, 300);
    }
  }, [open]);

  /* Auto-scroll */
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, currentOptions]);

  const addMessage = (from, text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        from,
        text,
        time: new Date(),
      },
    ]);
  };

  const handleOptionClick = (option) => {
    // Add user selection as a message
    addMessage("user", option.label);
    setCurrentOptions([]);

    // Handle action
    setTimeout(() => {
      if (option.action === "link:/shop") {
        setOpen(false);
        navigate("/shop");
        return;
      }
      if (option.action === "link:/custom") {
        setOpen(false);
        navigate("/custom");
        return;
      }
      if (option.action === "whatsapp") {
        openWhatsApp();
        // After WhatsApp, offer to continue
        addMessage(
          "bot",
          "Hope that helped! Is there anything else you'd like to know?"
        );
        setCurrentOptions([
          { id: "products", label: "Browse Products", icon: <Package size={14} /> },
          { id: "custom", label: "Custom Order", icon: <Ruler size={14} /> },
          { id: "back_start", label: "Main Menu", icon: <HelpCircle size={14} /> },
        ]);
        return;
      }

      // Navigate to flow
      if (option.id === "back_start") {
        addMessage("bot", FLOW.start.bot);
        setCurrentOptions(FLOW.start.options);
        return;
      }

      const step = FLOW[option.id];
      if (step) {
        setTimeout(() => {
          addMessage("bot", step.bot);
          setCurrentOptions(step.options);
        }, 500);
      }
    }, 400);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    addMessage("user", userText);
    setInput("");

    // Smart auto-reply based on keywords
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let reply = "";
      let options = [];

      if (
        lower.includes("custom") ||
        lower.includes("design") ||
        lower.includes("stitch")
      ) {
        reply =
          "Great! We love custom designs. ✨\n\nShare your reference image and measurements and we'll send a quote within 24 hours.";
        options = [
          { id: "start_custom", label: "Start Custom Order", icon: <Ruler size={14} />, action: "link:/custom" },
          { id: "whatsapp", label: "Discuss on WhatsApp", icon: <MessageCircle size={14} />, action: "whatsapp" },
        ];
      } else if (
        lower.includes("price") ||
        lower.includes("rate") ||
        lower.includes("cost") ||
        lower.includes("kitna")
      ) {
        reply =
          "Our pieces range from Rs. 4,000 to Rs. 100,000+. What type of outfit are you looking for?";
        options = [
          { id: "price", label: "See Full Pricing", icon: <Sparkles size={14} /> },
          { id: "whatsapp", label: "Get Personal Quote", icon: <MessageCircle size={14} />, action: "whatsapp" },
        ];
      } else if (
        lower.includes("deliver") ||
        lower.includes("ship") ||
        lower.includes("courier")
      ) {
        reply =
          "We deliver nationwide in Pakistan (Rs. 250 flat) and internationally. Self-pickup is also available.";
        options = [
          { id: "whatsapp", label: "Discuss on WhatsApp", icon: <MessageCircle size={14} />, action: "whatsapp" },
          { id: "back_start", label: "Main Menu", icon: <HelpCircle size={14} /> },
        ];
      } else if (
        lower.includes("abaya") ||
        lower.includes("bridal") ||
        lower.includes("wedding") ||
        lower.includes("party")
      ) {
        reply =
          "Nice choice! 🌸 Let me show you our collection. What's your budget range?";
        options = [
          { id: "view_shop", label: "View Collection", icon: <ArrowRight size={14} />, action: "link:/shop" },
          { id: "price", label: "See Pricing", icon: <Sparkles size={14} /> },
        ];
      } else if (
        lower.includes("hi") ||
        lower.includes("hello") ||
        lower.includes("salam") ||
        lower.includes("assalam")
      ) {
        reply = "Wa Alaikum Assalam! 🌸 How can I help you today?";
        options = FLOW.start.options;
      } else {
        reply =
          "Thank you for your message! 🙏\n\nFor a detailed answer, please click below to reach our team on WhatsApp. They'll reply within minutes.";
        options = [
          { id: "whatsapp", label: "Chat on WhatsApp", icon: <MessageCircle size={14} />, action: "whatsapp" },
          { id: "back_start", label: "Main Menu", icon: <HelpCircle size={14} /> },
        ];
      }

      addMessage("bot", reply);
      setCurrentOptions(options);
    }, 700);
  };

  const openWhatsApp = (customMessage) => {
    const text = encodeURIComponent(
      customMessage ||
        "Assalam-o-Alaikum! I'm chatting on your website and would like some assistance."
    );
    window.open(`https://wa.me/${WHATSAPP}?text=${text}`, "_blank");
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentOptions(FLOW.start.options);
    setTimeout(() => {
      addMessage("bot", FLOW.start.bot);
    }, 200);
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-maroon to-[#6B0F2A] text-white shadow-2xl flex items-center justify-center pulse-glow overflow-hidden border-2 border-gold/40"
            aria-label="Chat with us"
          >
            <img
              src="/images/logo.png"
              alt="Chat"
              className="w-9 h-9 md:w-11 md:h-11 object-contain"
              style={{
                filter:
                  "brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(15deg)",
              }}
            />
            <motion.span
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-gold/60"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm h-[540px] md:h-[600px] max-h-[calc(100vh-2rem)] bg-cream border border-gold/30 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* HEADER */}
            <div className="relative bg-gradient-to-br from-maroon to-[#6B0F2A] text-white p-4 flex items-center gap-3 flex-shrink-0">
              <motion.div
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute inset-0 opacity-15"
                style={{
                  background:
                    "linear-gradient(45deg, #C9A961, transparent, #C9A961)",
                  backgroundSize: "200% 200%",
                }}
              />

              <div className="relative w-12 h-12 rounded-full bg-cream border-2 border-gold/60 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img
                  src="/images/logo.png"
                  alt="Khadija's Collection"
                  className="w-10 h-10 object-contain"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-maroon rounded-full" />
              </div>

              <div className="relative flex-1 min-w-0">
                <h3 className="font-serif text-base leading-tight">
                  Khadija's Collection
                </h3>
                <p className="text-[10px] text-gold/90 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  Online · replies instantly
                </p>
              </div>

              <button
                onClick={clearChat}
                className="relative p-2 hover:bg-white/10 rounded transition"
                title="Restart chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
              </button>

              <button
                onClick={() => setOpen(false)}
                className="relative p-2 hover:bg-white/10 rounded transition"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-cream">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed shadow-sm whitespace-pre-line ${
                      msg.from === "user"
                        ? "bg-maroon text-white rounded-2xl rounded-br-sm"
                        : "bg-white text-charcoal rounded-2xl rounded-bl-sm border border-gold/20"
                    }`}
                  >
                    {msg.text}
                    <p
                      className={`text-[9px] mt-1 ${
                        msg.from === "user"
                          ? "text-white/60"
                          : "text-charcoal/40"
                      }`}
                    >
                      {msg.time.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* OPTIONS */}
              {currentOptions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="pt-1"
                >
                  <p className="text-[10px] tracking-widest text-charcoal/50 mb-2">
                    CHOOSE AN OPTION
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentOptions.map((opt) => (
                      <motion.button
                        key={opt.id}
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleOptionClick(opt)}
                        className="flex items-center gap-1.5 bg-white border border-gold/30 hover:border-maroon text-charcoal/80 hover:text-maroon text-xs px-3 py-2 transition"
                      >
                        {opt.icon}
                        {opt.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="flex-shrink-0 border-t border-gold/20 bg-white">
              {/* WhatsApp CTA */}
              <div className="px-4 pt-3 pb-2 border-b border-gold/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openWhatsApp()}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 text-xs tracking-widest hover:bg-green-700 transition"
                >
                  <MessageCircle size={14} /> CONTINUE ON WHATSAPP
                </motion.button>
              </div>

              {/* Input with toggle */}
              <div className="p-3">
                <button
                  onClick={() => setShowInput(!showInput)}
                  className="text-[10px] text-charcoal/50 hover:text-maroon mb-2 flex items-center gap-1 transition"
                >
                  {showInput ? "− Hide text input" : "+ Type your own message"}
                </button>

                <AnimatePresence>
                  {showInput && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleSend}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border border-gold/30 bg-cream/40 px-3 py-2.5 text-sm focus:outline-none focus:border-maroon"
                        autoFocus
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={!input.trim()}
                        className="bg-maroon text-white px-4 flex items-center justify-center hover:bg-gold transition disabled:opacity-50"
                      >
                        <Send size={16} />
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}