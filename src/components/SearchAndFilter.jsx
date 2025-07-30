import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";

const translations = {
  ru: {
    searchPlaceholder: "Поиск книг...",
    filters: "Фильтры",
    filterByCategories: "Фильтр по категориям",
    selectedFilters: "Выбрано:",
    clearAll: "Очистить все"
  },
  kg: {
    searchPlaceholder: "Китеп издөө...",
    filters: "Фильтрлер",
    filterByCategories: "Категориялар боюнча фильтр",
    selectedFilters: "Тандалды:",
    clearAll: "Баарын тазалоо"
  }
};

const SearchAndFilter = ({ categories, onSearch, onFilter, language = 'ru' }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const t = translations[language] || translations.ru;

  const handleCategoryToggle = (categoryId) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newSelection);
    onFilter(newSelection);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    onFilter([]);
  };

  const removeFilter = (categoryId) => {
    const newSelection = selectedCategories.filter(id => id !== categoryId);
    setSelectedCategories(newSelection);
    onFilter(newSelection);
  };

  return (
    <motion.div 
      className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex flex-col gap-4">
        {/* Поиск и кнопка фильтра */}
        <div className="flex flex-col md:flex-row gap-6">
          <motion.div className="relative flex-1">
            <motion.div 
              className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              animate={searchTerm ? { opacity: 0 } : { opacity: 1 }}
            >
              <FaSearch className="text-gray-500" />
            </motion.div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-gray-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t.searchPlaceholder}
            />
          </motion.div>
          
          <motion.div className="relative">
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center gap-2 text-white py-3 px-4 rounded-lg transition-colors ${
                selectedCategories.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaFilter />
              {t.filters}
              {selectedCategories.length > 0 && (
                <span className="ml-1 bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {selectedCategories.length}
                </span>
              )}
              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ▼
              </motion.span>
            </motion.button>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  className="absolute z-10 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl p-4 right-0"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-white font-medium">{t.filterByCategories}</h3>
                    {selectedCategories.length > 0 && (
                      <button 
                        onClick={clearAllFilters}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        {t.clearAll}
                      </button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {categories.map(category => (
                      <motion.label 
                        key={category.id}
                        className="flex items-center space-x-2 cursor-pointer group"
                        whileHover={{ x: 5 }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => handleCategoryToggle(category.id)}
                          className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-300 group-hover:text-white">
                          {language === 'kg' ? category.name_kg : category.name_ru}
                        </span>
                      </motion.label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Отображение выбранных фильтров */}
        {selectedCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 items-center"
          >
            <span className="text-gray-400 text-sm">{t.selectedFilters}</span>
            {selectedCategories.map(categoryId => {
              const category = categories.find(c => c.id === categoryId);
              return (
                <motion.div
                  key={categoryId}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-blue-600 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                >
                  {language === 'kg' ? category?.name_kg : category?.name_ru}
                  <button 
                    onClick={() => removeFilter(categoryId)}
                    className="hover:text-blue-200"
                  >
                    <FaTimes size={12} />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SearchAndFilter;