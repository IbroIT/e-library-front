import { motion, useAnimation, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaTelegram, FaVk, FaArrowRight, FaFacebook, FaInstagram } from "react-icons/fa";

const ContactsHero = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  const [glitch, setGlitch] = useState(false);
  
  const contacts = [
    { icon: <FaMapMarkerAlt className="text-red-400" />, value: "ул. Малдыбаева 24б", label: "Наш адрес" },
    { icon: <FaPhone className="text-blue-400" />, value: "+996 707 777 777", label: "Телефон"},
    { icon: <FaEnvelope className="text-yellow-400" />, value: "info@digitallib.ru", label: "Email"},
    { icon: <FaClock className="text-green-400" />, value: "Пн-Пт: 9:00 - 19:00", label: "Часы работы" }
  ];
  const [activeContact, setActiveContact] = useState(0);
  const contactControls = useAnimation();

  const socials = [
    { icon: <FaTelegram className="text-blue-400" size={24} />, name: "Telegram", url: "#" },
    { icon: <FaFacebook className="text-blue-500" size={24} />, name: "Facebook", url: "#" },
    { icon: <FaInstagram className="text-red-400" size={24} />, name: "Instagram", url: "#" },
    { icon: <FaEnvelope className="text-yellow-400" size={24} />, name: "Email", url: "#" }
  ];

  const title = "Контакты";
  const [displayedTitle, setDisplayedTitle] = useState("");

  useEffect(() => {
    const handleMouseMove = (e) => {
      x.set(e.clientX - window.innerWidth / 2);
      y.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);

    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 5000);

    let i = 0;
    const typing = setInterval(() => {
      if (i < title.length) {
        setDisplayedTitle(title.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 100);

    const contactInterval = setInterval(() => {
      contactControls.start({
        opacity: 0,
        y: 20,
        transition: { duration: 0.3 }
      }).then(() => {
        setActiveContact((prev) => (prev + 1) % contacts.length);
        contactControls.start({
          opacity: 1,
          y: 0,
          transition: { duration: 0.5 }
        });
      });
    }, 3000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(glitchInterval);
      clearInterval(typing);
      clearInterval(contactInterval);
    };
  }, []);

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 30% 50%, #1a1a2e 0%, #000 70%)",
            "radial-gradient(circle at 70% 50%, #16213e 0%, #000 70%)",
            "radial-gradient(circle at 50% 30%, #1f1f3d 0%, #000 70%)"
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="text-green-400/30 text-xs font-mono absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            y: [0, window.innerHeight + 100],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        >
          {Math.random() > 0.5 ? "0010110" : "1011001"}
        </motion.div>
      ))}

      <motion.div 
        className="h-full flex flex-col justify-center items-center relative z-10 px-4"
        style={{ rotateX, rotateY }}
      >
        <motion.div className="relative">
          <motion.h1
            className="text-5xl md:text-8xl font-extrabold text-center mb-8"
            animate={glitch ? {
              x: [0, 10, -10, 0],
              y: [0, -5, 5, 0],
              textShadow: [
                "0 0 10px #3b82f6",
                "0 0 20px #ec4899",
                "0 0 10px #10b981",
                "0 0 5px #ffffff"
              ]
            } : {
              textShadow: "0 0 10px rgba(59, 130, 246, 0.5)"
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              {displayedTitle}
              <motion.span 
                className="ml-2 inline-block w-3 h-16 bg-white"
                animate={{ opacity: [0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
            </span>
          </motion.h1>
          
          {glitch && (
            <motion.div
              className="absolute inset-0 bg-white/10 mix-blend-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-xl md:text-3xl text-blue-300 mb-12 max-w-2xl text-center"
        >
          Свяжитесь с нами удобным для вас способом
        </motion.p>

        <div className="relative h-40 w-full max-w-lg mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeContact}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            >
              <div className="text-4xl">
                {contacts[activeContact].icon}
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  {contacts[activeContact].value}
                </div>
                <div className="text-lg text-blue-300 mb-4">{contacts[activeContact].label}</div>
                
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h3 className="text-xl text-center text-white mb-4">Мы в соцсетях</h3>
            <div className="flex justify-center gap-6">
              {socials.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center group"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center mb-2 group-hover:bg-blue-500/20 transition-colors">
                    {social.icon}
                  </div>
                  <span className="text-sm text-blue-300">{social.name}</span>
                </motion.a>
              ))}
            </div>
          </div>


        </motion.div>
      </motion.div>

      
    </div>
  );
};

export default ContactsHero;