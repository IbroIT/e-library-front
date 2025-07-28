import { motion } from "framer-motion";
import { FaPaperPlane, FaUser, FaEnvelope, FaComment, FaArrowRight, FaMapMarkerAlt, FaPhone, FaClock } from "react-icons/fa";

const ContactSection = () => {
  // Карта Университета Салымбекова
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2924.028544108504!2d74.5975975!3d42.8441282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x389ec987f324329b%3A0x2cd99bcd0df5fc1f!2z0KHQsNC70LjQvNCx0LjQu9GM0L3QvtCz0L4g0KPQvdC40LLQtdGA0YHQuNGC0LXRgg!5e0!3m2!1sru!2skg!4v1712345678901!5m2!1sru!2skg";

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-4 md:p-8 gap-8">
      {/* Левая часть - Карта Университета Салымбекова */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md h-[550px] rounded-2xl overflow-hidden shadow-xl relative"
      >
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          className="rounded-2xl"
          aria-label="Карта Университета Салымбекова"
        ></iframe>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/80 to-transparent p-4 pt-6">
          <div className="flex flex-col gap-2 text-white">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-red-400 text-xl mt-1" />
              <div>
                <p className="font-bold text-lg">Университет Салымбекова</p>
                <p className="text-sm opacity-90">г. Бишкек, ул. Салымбекова 34</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-2">
              <FaPhone className="text-blue-300 opacity-80" />
              <p className="text-sm">+996 (312) 54-19-15</p>
            </div>
            
            <div className="flex items-center gap-3">
              <FaClock className="text-blue-300 opacity-80" />
              <p className="text-sm">Пн-Пт: 8:30 - 17:30</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Правая часть - Форма */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-blue-400/20 shadow-lg shadow-blue-500/10"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaPaperPlane className="text-cyan-400 text-2xl" />
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Свяжитесь с нами
          </h3>
        </div>

        <form className="space-y-5">
          <motion.div whileFocus={{ scale: 1.02 }} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-blue-400/80" />
            </div>
            <input
              type="text"
              placeholder="Ваше имя"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-blue-400/30 rounded-lg text-white placeholder-blue-300/70 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
            />
          </motion.div>

          <motion.div whileFocus={{ scale: 1.02 }} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-blue-400/80" />
            </div>
            <input
              type="email"
              placeholder="Ваш email"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-blue-400/30 rounded-lg text-white placeholder-blue-300/70 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
            />
          </motion.div>

          <motion.div whileFocus={{ scale: 1.02 }} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
              <FaComment className="text-blue-400/80" />
            </div>
            <textarea
              placeholder="Ваше сообщение"
              rows="4"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-blue-400/30 rounded-lg text-white placeholder-blue-300/70 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
            ></textarea>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg font-bold text-white flex items-center justify-center gap-2 group"
          >
            Отправить сообщение
            <motion.span className="inline-block group-hover:translate-x-1 transition-transform">
              <FaArrowRight />
            </motion.span>
          </motion.button>
        </form>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center text-sm text-blue-300/80"
        >
          Мы ответим вам в течение 24 часов
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ContactSection;