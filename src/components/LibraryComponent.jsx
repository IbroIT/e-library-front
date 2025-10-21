import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch, FaBook, FaFilter, FaBookOpen, FaChevronDown, FaSpinner, FaTimes } from "react-icons/fa";

const LibraryComponent = () => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hoveredBook, setHoveredBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const filterRef = useRef(null);

  // Базовый URL API
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  // Загрузка данных с бэкенда
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const currentLanguage = i18n.language;
        
        const [booksResponse, categoriesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/books/?language=${currentLanguage}`),
          fetch(`${API_BASE_URL}/categories/?language=${currentLanguage}`)
        ]);

        if (!booksResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const booksData = await booksResponse.json();
        const categoriesData = await categoriesResponse.json();

        console.log('📚 Books data from API:', booksData);
        console.log('🏷️ Categories data from API:', categoriesData);
        
        setBooks(booksData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(t('library.errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language, t]);

  // Получаем текущую переведенную категорию
  const currentCategoryLabel = useMemo(() => {
    if (selectedCategory === "all") {
      return t("library.categories.all");
    }
    const category = categories.find(cat => cat.id.toString() === selectedCategory);
    return category ? category.name : t("library.categories.all");
  }, [selectedCategory, categories, t]);

  // Фильтрация книг
  const filteredBooks = useMemo(() => {
    console.log('🔍 Starting filtration...');
    console.log('📖 Total books:', books.length);
    console.log('🎯 Selected category:', selectedCategory);
    console.log('🔎 Search query:', searchQuery);

    const result = books.filter(book => {
      const bookTitle = book.title || '';
      const bookAuthor = book.author || '';
      const bookDescription = book.description || '';
      
      const matchesSearch = bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bookAuthor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bookDescription.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesCategory = false;
      
      if (selectedCategory === "all") {
        matchesCategory = true;
      } else {
        const categoryId = 
          book.category?.id ||
          book.category_id ||
          book.category?.toString() ||
          null;

        matchesCategory = categoryId?.toString() === selectedCategory;
      }
      
      return matchesSearch && matchesCategory;
    });

    console.log('✅ Filtered books result:', result.length);
    return result;
  }, [books, searchQuery, selectedCategory]);

  // Анимация появления карточек
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const handleRead = (pdfUrl) => {
    console.log('PDF URL:', pdfUrl);
    
    if (pdfUrl && pdfUrl.startsWith('http')) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    } else if (pdfUrl) {
      const fullUrl = `${API_BASE_URL.replace('/api', '')}${pdfUrl}`;
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.error('PDF URL not available');
      alert('PDF файл недоступен');
    }
  };

  // Закрытие фильтров при клике вне области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Сбрасываем фильтр при изменении языка
  useEffect(() => {
    setSelectedCategory("all");
  }, [i18n.language]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-4xl text-blue-400 mb-4"
          >
            <FaSpinner />
          </motion.div>
          <p className="text-xl text-blue-300">{t('library.loading')}</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-2xl font-bold text-red-400 mb-4">
            {t('library.errors.title')}
          </h3>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-colors"
          >
            {t('library.actions.retry')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4">
      {/* Анимированный фон */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, #1a1a2e 0%, #000 70%)",
              "radial-gradient(circle at 80% 20%, #16213e 0%, #000 70%)",
              "radial-gradient(circle at 40% 80%, #1f1f3d 0%, #000 70%)"
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Анимированный код на фоне */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="text-green-400/20 text-xs font-mono absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, window.innerHeight + 100],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          >
            {Math.random() > 0.5 ? "010101" : "101010"}
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              {t("library.title")}
            </span>
          </h1>
          <p className="text-xl text-blue-300 max-w-2xl mx-auto">
            {t("library.subtitle")}
          </p>
        </motion.div>

        {/* Панель поиска и фильтров */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative z-50 bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-gray-700"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Поиск */}
            <div className="relative flex-1 w-full">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
              <input
                type="text"
                placeholder={t("library.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Улучшенная кнопка фильтров */}
            <div className="relative w-full lg:w-auto" ref={filterRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-600/25 border border-blue-400/30"
              >
                <FaFilter className="text-white" />
                <span className="font-semibold">{t("library.filters")}</span>
                <motion.span
                  animate={{ rotate: isFilterOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaChevronDown className="text-white" />
                </motion.span>
              </motion.button>

              {/* Улучшенный выпадающий список фильтров */}
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-3 w-full lg:w-72 bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-blue-500/30 shadow-2xl shadow-blue-500/20 z-[9999] overflow-hidden"
                  >
                    {/* Заголовок фильтра */}
                    <div className="p-4 border-b border-gray-700/50 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-white text-lg">{t("library.category")}</h3>
                        <button
                          onClick={() => setIsFilterOpen(false)}
                          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <FaTimes className="text-gray-400 hover:text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Список категорий с улучшенным скроллом */}
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                      {/* Опция "Все" */}
                      <button
                        onClick={() => {
                          setSelectedCategory("all");
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-4 border-b border-gray-700/30 transition-all group ${
                          selectedCategory === "all"
                            ? "bg-blue-600/20 text-white border-l-4 border-l-blue-400"
                            : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            selectedCategory === "all" ? "bg-blue-400" : "bg-gray-500 group-hover:bg-blue-400"
                          }`} />
                          <span className="font-medium">{t("library.categories.all")}</span>
                        </div>
                      </button>
                      
                      {/* Категории с бэкенда */}
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id.toString());
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-4 py-4 border-b border-gray-700/30 transition-all group ${
                            selectedCategory === category.id.toString()
                              ? "bg-blue-600/20 text-white border-l-4 border-l-blue-400"
                              : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              selectedCategory === category.id.toString() ? "bg-blue-400" : "bg-gray-500 group-hover:bg-blue-400"
                            }`} />
                            <span className="font-medium">{category.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Отображение выбранной категории */}
          {selectedCategory !== "all" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-3 p-3 bg-blue-600/20 rounded-lg border border-blue-500/30"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-blue-300 font-medium">{t("library.chosenCategory")}</span>
                <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full text-sm font-medium shadow-lg shadow-blue-600/25">
                  {currentCategoryLabel}
                </span>
              </div>
              <button
                onClick={() => setSelectedCategory("all")}
                className="ml-auto px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg text-sm font-medium transition-all duration-200 border border-red-500/30 hover:border-red-500/50 flex items-center gap-2"
              >
                <FaTimes className="text-xs" />
                <span>{t("library.actionReset")}</span>
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Статистика */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-gray-900/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <FaBook className="text-blue-400 text-2xl" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{books.length}</div>
                <div className="text-blue-300">{t("library.stats.totalBooks")}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <FaBookOpen className="text-green-400 text-2xl" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{filteredBooks.length}</div>
                <div className="text-green-300">{t("library.stats.foundBooks")}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <FaFilter className="text-purple-400 text-2xl" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{categories.length}</div>
                <div className="text-purple-300">{t("library.stats.categoriesCount")}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Сетка книг */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredBooks.map((book) => (
              <motion.div
                key={book.id}
                variants={itemVariants}
                layout
                className="bg-gray-900/30 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group"
                onHoverStart={() => setHoveredBook(book.id)}
                onHoverEnd={() => setHoveredBook(null)}
              >
                <div className="p-6">
                  {/* Категория и год */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium group-hover:bg-blue-500/30 transition-colors">
                      {book.category_name}
                    </span>
                    <span className="text-yellow-400 text-sm font-semibold bg-yellow-500/10 px-2 py-1 rounded-lg">
                      {book.year}
                    </span>
                  </div>

                  {/* Заголовок и автор */}
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-blue-300 mb-4 flex items-center gap-2">
                    <FaBook className="text-sm opacity-70" />
                    {book.author}
                  </p>

                  {/* Описание */}
                  <p className="text-gray-300 text-sm mb-6 line-clamp-3 group-hover:text-gray-200 transition-colors">
                    {book.description}
                  </p>

                  {/* Кнопка чтения */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRead(book.pdf_url || book.pdf_file)}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 font-semibold group"
                  >
                    <FaBookOpen className="group-hover:scale-110 transition-transform" />
                    <span>{t("library.actions.read")}</span>
                  </motion.button>
                </div>

                {/* Анимированный эффект при наведении */}
                <motion.div
                  className="h-1 bg-gradient-to-r from-cyan-400 to-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: hoveredBook === book.id ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Сообщение если ничего не найдено */}
        <AnimatePresence>
          {filteredBooks.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {t("library.noResults.title")}
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                {t("library.noResults.description")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Стили для кастомного скроллбара */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  );
};

export default LibraryComponent;