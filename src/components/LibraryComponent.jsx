import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch, FaBook, FaFilter, FaBookOpen, FaChevronDown, FaSpinner } from "react-icons/fa";


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
  // Загрузка данных с бэкенда
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentLanguage = i18n.language;
      
      // Загружаем книги и категории одновременно
      const [booksResponse, categoriesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/books/?language=${currentLanguage}`),
        fetch(`${API_BASE_URL}/categories/?language=${currentLanguage}`)
      ]);

      if (!booksResponse.ok || !categoriesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const booksData = await booksResponse.json();
      const categoriesData = await categoriesResponse.json();

      // ДОБАВИМ ОТЛАДОЧНУЮ ИНФОРМАЦИЮ
      console.log('📚 Books data from API:', booksData);
      console.log('🏷️ Categories data from API:', categoriesData);
      
      // Проверим структуру первой книги и первой категории
      if (booksData.length > 0) {
        console.log('🔍 First book structure:', booksData[0]);
        console.log('🔍 Book category structure:', booksData[0].category);
      }
      if (categoriesData.length > 0) {
        console.log('🔍 First category structure:', categoriesData[0]);
      }

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

  // Получаем текущую переведенную категорию - ИСПРАВЛЕННАЯ ВЕРСИЯ
  const currentCategoryLabel = useMemo(() => {
    if (selectedCategory === "all") {
      return t("library.categories.all");
    }
    // ИСПРАВЛЕНИЕ: ищем по id вместо key
    const category = categories.find(cat => cat.id.toString() === selectedCategory);
    return category ? category.name : t("library.categories.all");
  }, [selectedCategory, categories, t]);

  // Фильтрация книг - ИСПРАВЛЕННАЯ ВЕРСИЯ
  const filteredBooks = useMemo(() => {
  console.log('🔍 Starting filtration...');
  console.log('📖 Total books:', books.length);
  console.log('🎯 Selected category:', selectedCategory);
  console.log('🔎 Search query:', searchQuery);

  const result = books.filter(book => {
    // Безопасные проверки
    const bookTitle = book.title || '';
    const bookAuthor = book.author || '';
    const bookDescription = book.description || '';
    
    // Поиск по тексту
    const matchesSearch = bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        bookAuthor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        bookDescription.toLowerCase().includes(searchQuery.toLowerCase());

    // Фильтрация по категории - РАЗНЫЕ ВАРИАНТЫ
    let matchesCategory = false;
    
    if (selectedCategory === "all") {
      matchesCategory = true;
    } else {
      // Пробуем разные варианты доступа к category id
      const categoryId = 
        book.category?.id ||           // book.category.id
        book.category_id ||            // book.category_id
        book.category?.toString() ||   // book.category (просто id)
        null;

      console.log(`📗 Book "${bookTitle}" category info:`, {
        category: book.category,
        category_id: book.category_id,
        computedId: categoryId,
        selectedCategory: selectedCategory
      });

      matchesCategory = categoryId?.toString() === selectedCategory;
    }

    console.log(`📘 Book "${bookTitle}": search=${matchesSearch}, category=${matchesCategory}`);
    
    return matchesSearch && matchesCategory;
  });

  console.log('✅ Filtered books result:', result.length);
  console.log('📋 Filtered books:', result);
  
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
            <div><FaSpinner /></div>
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
          className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-gray-700"
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

            {/* Кнопка фильтров */}
            <div className="relative w-full lg:w-auto" ref={filterRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full lg:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <FaFilter />
                <span>{t("library.filters")}</span>
                <motion.span
                  animate={{ rotate: isFilterOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaChevronDown />
                </motion.span>
              </motion.button>

              {/* Выпадающий список фильтров - ИСПРАВЛЕННАЯ ВЕРСИЯ */}
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-[calc(100%+8px)] right-0 w-full lg:w-64 bg-gray-800/90 backdrop-blur-lg rounded-xl border border-gray-600 shadow-2xl z-[9999] overflow-hidden"
                    >

                    <div className="max-h-64 overflow-y-auto">
                      {/* Опция "Все" */}
                      <button
                        onClick={() => {
                          setSelectedCategory("all");
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                          selectedCategory === "all"
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 hover:bg-gray-700/50"
                        }`}
                      >
                        {t("library.categories.all")}
                      </button>
                      
                      {/* Категории с бэкенда - ИСПРАВЛЕНИЕ: используем category.id */}
                      {categories.map((category) => (
                        <button
                          key={category.id} // Используем id как ключ
                          onClick={() => {
                            setSelectedCategory(category.id.toString()); // Используем id
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                            selectedCategory === category.id.toString() // Сравниваем с id
                              ? "bg-blue-600 text-white"
                              : "text-gray-300 hover:bg-gray-700/50"
                          }`}
                        >
                          {category.name}
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
              className="mt-4 flex items-center gap-2"
            >
              <span className="text-blue-300">{t("library.chosenCategory")}</span>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                {currentCategoryLabel}
              </span>
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                {t("library.actionReset")}
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
          <div className="bg-gray-900/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
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
          
          <div className="bg-gray-900/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
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
                className="bg-gray-900/30 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all duration-300"
                onHoverStart={() => setHoveredBook(book.id)}
                onHoverEnd={() => setHoveredBook(null)}
              >
                <div className="p-6">
                  {/* Категория */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      {book.category_name}
                    </span>
                    <span className="text-yellow-400 text-sm font-semibold">
                      {book.year}
                    </span>
                  </div>

                  {/* Заголовок и автор */}
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-blue-300 mb-4 flex items-center gap-2">
                    <FaBook className="text-sm" />
                    {book.author}
                  </p>

                  {/* Описание */}
                  <p className="text-gray-300 text-sm mb-6 line-clamp-3">
                    {book.description}
                  </p>

                  {/* Кнопка чтения */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRead(book.pdf_url || book.pdf_file)}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-600/25"
                  >
                    <FaBookOpen />
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
    </div>
  );
};

export default LibraryComponent;