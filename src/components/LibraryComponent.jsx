import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch, FaBook, FaFilter, FaBookOpen, FaChevronDown } from "react-icons/fa";

const LibraryComponent = () => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hoveredBook, setHoveredBook] = useState(null);
  const filterRef = useRef(null);

  // Используем ключи категорий вместо переведенных значений
  const categoryKeys = useMemo(() => ["all", "classic", "dystopia", "fantasy", "scienceFiction"], []);

  // Моковые данные книг с переводом
  const books = useMemo(() => [
    {
      id: "1",
      title: t("library.books.masterAndMargarita.title"),
      description: t("library.books.masterAndMargarita.description"),
      author: t("library.books.masterAndMargarita.author"),
      year: 1966,
      category: "classic",
      pdfUrl: "/books/master-i-margarita.pdf"
    },
    {
      id: "2",
      title: t("library.books.crimeAndPunishment.title"),
      description: t("library.books.crimeAndPunishment.description"),
      author: t("library.books.crimeAndPunishment.author"),
      year: 1866,
      category: "classic",
      pdfUrl: "/books/prestuplenie-i-nakazanie.pdf"
    },
    {
      id: "3",
      title: t("library.books.nineteenEightyFour.title"),
      description: t("library.books.nineteenEightyFour.description"),
      author: t("library.books.nineteenEightyFour.author"),
      year: 1949,
      category: "dystopia",
      pdfUrl: "/books/1984.pdf"
    },
    {
      id: "4",
      title: t("library.books.harryPotter1.title"),
      description: t("library.books.harryPotter1.description"),
      author: t("library.books.harryPotter1.author"),
      year: 1997,
      category: "fantasy",
      pdfUrl: "/books/harry-potter-1.pdf"
    },
    {
      id: "5",
      title: t("library.books.warAndPeace.title"),
      description: t("library.books.warAndPeace.description"),
      author: t("library.books.warAndPeace.author"),
      year: 1869,
      category: "classic",
      pdfUrl: "/books/voina-i-mir.pdf"
    },
    {
      id: "6",
      title: t("library.books.hitchhikersGuide.title"),
      description: t("library.books.hitchhikersGuide.description"),
      author: t("library.books.hitchhikersGuide.author"),
      year: 1979,
      category: "scienceFiction",
      pdfUrl: "/books/hitchhikers-guide.pdf"
    }
  ], [t]);

  // Получаем переведенные категории
  const categories = useMemo(() => {
    return categoryKeys.map(key => ({
      key,
      label: t(`library.categories.${key}`)
    }));
  }, [categoryKeys, t]);

  // Получаем текущую переведенную категорию
  const currentCategoryLabel = useMemo(() => {
    const category = categories.find(cat => cat.key === selectedCategory);
    return category ? category.label : t("library.categories.all");
  }, [selectedCategory, categories, t]);

  // Фильтрация книг
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          book.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
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

  // Обработчик для чтения книги
  const handleRead = (pdfUrl) => {
    window.open(pdfUrl, '_blank');
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

            {/* Кнопка фильтров для всех устройств */}
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

              {/* Выпадающий список фильтров */}
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-full lg:w-64 bg-gray-800/90 backdrop-blur-lg rounded-xl border border-gray-600 shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="max-h-64 overflow-y-auto">
                      {categories.map((category) => (
                        <button
                          key={category.key}
                          onClick={() => {
                            setSelectedCategory(category.key);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                            selectedCategory === category.key
                              ? "bg-blue-600 text-white"
                              : "text-gray-300 hover:bg-gray-700/50"
                          }`}
                        >
                          {category.label}
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
                      {t(`library.categories.${book.category}`)}
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
                    onClick={() => handleRead(book.pdfUrl)}
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