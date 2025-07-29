import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaDownload } from "react-icons/fa";
import { getBookDetails } from "../api/books";

const BookCard = ({ book }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await getBookDetails(book.id);
      window.open(response.data.file, '_blank');
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <motion.div 
      className="relative bg-gray-900 rounded-xl overflow-hidden border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="h-48 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
        {book.cover ? (
          <motion.img 
            src={book.cover} 
            alt={lang === 'ru' ? book.title_ru : book.title_kg}
            className="h-full w-full object-cover"
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <motion.span 
            className="text-blue-400 text-6xl"
            animate={isHovered ? { rotate: 5, scale: 1.1 } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            📚
          </motion.span>
        )}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0"
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        />
      </div>
      
      <div className="p-5">
        <motion.h3 
          className="text-xl font-bold text-white mb-2"
          whileHover={{ color: "#60a5fa" }}
        >
          {lang === 'ru' ? book.title_ru : book.title_kg}
        </motion.h3>
        <p className="text-gray-400 mb-3">
          {lang === 'ru' ? book.author_ru : book.author_kg}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {book.categories?.map(category => (
            <motion.span 
              key={category.id} 
              className="px-3 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-full"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.7)" }}
            >
              {lang === 'ru' ? category.name_ru : category.name_kg}
            </motion.span>
          ))}
        </div>
        
        <motion.button 
          onClick={handleDownload}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
          whileTap={{ scale: 0.98 }}
        >
          <FaDownload />
          Download
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BookCard;