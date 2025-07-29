import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaDownload } from "react-icons/fa";
import { getBookDetails } from "../api/books";

const BookCard = ({ book }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [isHovered, setIsHovered] = useState(false);

  // Обработчик для кнопки "Скачать"
  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Проверяем, есть ли файл
    if (!book.file) {
      console.error('No file available for download');
      return;
    }

    // Создаем полный URL для скачивания
    const fileUrl = book.file.startsWith('http') 
      ? book.file 
      : `${window.location.origin}${book.file}`;

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `${book.title || 'book'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Получаем URL для PDF
  const getPdfUrl = () => {
    if (!book.file) return null;
    return book.file.startsWith('http') 
      ? book.file 
      : `${window.location.origin}${book.file}`;
  };

  const pdfUrl = getPdfUrl();

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
        
        {book.description && (
          <div className="mb-4">
            <p className="font-semibold text-gray-700 mb-1">Описание:</p>
            <p className="text-gray-600 text-sm line-clamp-3">{book.description}</p>
          </div>
        )}

        {/* PDF Viewer (по клику на "Читать") */}
        {showPdf && pdfUrl && (
          <div className="mb-4 border border-gray-200 rounded-lg p-2 max-h-96 overflow-y-auto">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              className="pdf-viewer"
              loading={<div className="text-center py-4">Загрузка PDF...</div>}
              error={<div className="text-center py-4 text-red-500">Ошибка загрузки PDF</div>}
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Page 
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={300}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="mb-2 border border-gray-100"
                  loading={<div className="text-center py-2">Загрузка страницы {index + 1}...</div>}
                />
              ))}
            </Document>
          </div>
        )}

        <div className="flex space-x-3">
          <button 
            onClick={() => setShowPdf(!showPdf)}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition flex-1"
            disabled={!book.file}
          >
            {showPdf ? 'Скрыть' : 'Читать'}
          </button>
          <button 
            onClick={handleDownload}
            className="border border-blue-700 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition flex-1"
            disabled={!book.file}
          >
            Скачать
          </button>
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