import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaDownload, FaCalendarAlt, FaUserEdit } from "react-icons/fa";
import { Document, Page } from "react-pdf";
import * as pdfjs from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js';
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const BookCard = ({ book }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [isHovered, setIsHovered] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!book.file) {
      console.error("No file available for download");
      return;
    }

    const fileUrl = book.file.startsWith("http")
      ? book.file
      : `${window.location.origin}${book.file}`;

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = `${book.title || "book"}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPdfUrl = () => {
    if (!book.file) return null;
    return book.file.startsWith("http")
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
            alt={lang === "ru" ? book.title_ru : book.title_kg}
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
          {lang === "ru" ? book.title_ru : book.title_kg}
        </motion.h3>

        {/* Author with icon */}
        <div className="flex items-center text-gray-400 mb-2">
          <FaUserEdit className="mr-2" />
          <span>{lang === "ru" ? book.author_ru : book.author_kg}</span>
        </div>

        {/* Publication year with icon */}
        {book.year && (
          <div className="flex items-center text-gray-400 mb-3">
            <FaCalendarAlt className="mr-2" />
            <span>{book.year}</span>
          </div>
        )}

        {/* Description */}
        {book.description && (
          <div className="mb-4">
            <p className="font-semibold text-gray-300 mb-1">
              {lang === "ru" ? "Описание" : "Description"}:
            </p>
            <p className="text-gray-400 text-sm">
              {book.description}
            </p>
          </div>
        )}

        {/* PDF Viewer */}
        {showPdf && pdfUrl && (
          <div className="mb-4 border border-gray-700 rounded-lg p-2 max-h-96 overflow-y-auto">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              className="pdf-viewer"
              loading={<div className="text-center py-4 text-gray-400">Загрузка PDF...</div>}
              error={<div className="text-center py-4 text-red-400">Ошибка загрузки PDF</div>}
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={300}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="mb-2 border border-gray-600"
                  loading={
                    <div className="text-center py-2 text-gray-400">Загрузка страницы {index + 1}...</div>
                  }
                />
              ))}
            </Document>
          </div>
        )}

        <motion.button
          onClick={handleDownload}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 mt-4"
          whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
          whileTap={{ scale: 0.98 }}
        >
          <FaDownload />
          {lang === "ru" ? "Скачать" : "Жүктөп алуу"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BookCard;