import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaBook,
  FaUserGraduate,
  FaCalendarAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

const LibraryFooter = () => {
  const { t } = useTranslation();

  const [glitch, setGlitch] = useState(false);
  const [activeStat, setActiveStat] = useState(0);
  const statControls = useAnimation();

  // Берем статистику и ссылки из переводов
  const stats = t("footer.stats", { returnObjects: true });
  const nav = t("footer.nav", { returnObjects: true });
  const legal = t("footer.legal", { returnObjects: true });

  // Иконки для статистики (фиксированные)
  const statIcons = [
    <FaBook className="text-yellow-400" />,
    <FaUserGraduate className="text-blue-400" />,
    <FaCalendarAlt className="text-red-400" />,
  ];

  // Интервалы для глича и переключения статистики
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 5000);

    const statInterval = setInterval(() => {
      statControls
        .start({ opacity: 0, y: 20, transition: { duration: 0.3 } })
        .then(() => {
          setActiveStat((prev) => (prev + 1) % stats.length);
          statControls.start({ opacity: 1, y: 0, transition: { duration: 0.5 } });
        });
    }, 3000);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(statInterval);
    };
  }, [statControls, stats.length]);

  return (
    <footer className="relative bg-black text-white pt-16 pb-8 overflow-hidden">
      {/* Фоновая анимация */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 30% 50%, #1a1a2e 0%, #000 70%)",
            "radial-gradient(circle at 70% 50%, #16213e 0%, #000 70%)",
            "radial-gradient(circle at 50% 30%, #1f1f3d 0%, #000 70%)",
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Анимированные символы на фоне */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="text-green-400/20 text-xs font-mono absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, window.innerHeight + 100],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        >
          {Math.random() > 0.5 ? "0010110" : "1011001"}
        </motion.div>
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          {/* Лого и описание */}
          <div className="max-w-md">
            <motion.div className="relative mb-6">
              <motion.h2
                className="text-3xl font-extrabold"
                animate={
                  glitch
                    ? {
                        x: [0, 2, -2, 0],
                        y: [0, -1, 1, 0],
                        textShadow: [
                          "0 0 5px #3b82f6",
                          "0 0 10px #ec4899",
                          "0 0 5px #10b981",
                          "0 0 2px #ffffff",
                        ],
                      }
                    : {
                        textShadow: "0 0 5px rgba(59, 130, 246, 0.5)",
                      }
                }
                transition={{ duration: 0.3 }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                  {t("footer.libraryTitle")}
                </span>
              </motion.h2>
            </motion.div>

            <motion.p
              className="text-blue-300 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {t("footer.description")}
            </motion.p>

            {/* Соцсети */}
            <div className="flex space-x-4 mb-8">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="text-white/70 hover:text-blue-400 text-xl"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>

            {/* Статистика */}
            <div className="relative h-20 w-full max-w-xs">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStat}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center gap-4"
                >
                  <div className="text-2xl">{statIcons[activeStat]}</div>
                  <div>
                    <div className="text-xl font-bold text-white">
                      {stats[activeStat].value}
                      <span className="text-yellow-400">{stats[activeStat].suffix}</span>
                    </div>
                    <div className="text-sm text-blue-300">{stats[activeStat].label}</div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Навигационные ссылки */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(nav).map(([sectionKey, sectionData], i) => (
  <motion.div
    key={sectionKey}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.1 }}
  >
    <h3 className="text-lg font-bold mb-4 text-blue-400">
      {sectionData.title}
    </h3>
    <ul className="space-y-2">
      {/* Safely handle items with optional chaining and fallback */}
      {(sectionData.items || []).map((item, j) => (
        <motion.li
          key={j}
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <a href="#" className="text-white/70 hover:text-white transition-colors">
            {item}
          </a>
        </motion.li>
      ))}
    </ul>
  </motion.div>
))}
          </div>
        </div>

        {/* Нижняя часть футера */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <motion.p
            className="text-white/50 mb-4 md:mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {t("footer.legal.copyright", { year: new Date().getFullYear() })}
          </motion.p>

          <div className="flex space-x-6">
            <motion.a
              href="#"
              className="text-white/50 hover:text-white text-sm"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {t("footer.legal.privacy")}
            </motion.a>
            <motion.a
              href="#"
              className="text-white/50 hover:text-white text-sm"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {t("footer.legal.terms")}
            </motion.a>
            <motion.a
              href="/Contacts"
              className="text-white/50 hover:text-white text-sm"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {t("footer.legal.contacts")}
            </motion.a>
          </div>
        </div>
      </div>

      {/* Анимированная волна */}
      <div className="absolute bottom-0 w-full">
        <svg viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="rgba(59, 130, 246, 0.2)"
          />
        </svg>
      </div>
    </footer>
  );
};

export default LibraryFooter;
