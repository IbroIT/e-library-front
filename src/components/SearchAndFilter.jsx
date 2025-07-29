import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";

const SearchAndFilter = ({ categories, onSearch, onFilter }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCategoryToggle = (categoryId) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newSelection);
    onFilter(newSelection);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <motion.div 
      className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
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
            placeholder="Search books..."
          />
        </motion.div>
        
        <motion.div className="relative">
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaFilter />
            Filters
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
                className="absolute z-10 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl p-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-white font-medium mb-3">Filter by categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <motion.label 
                      key={category.id}
                      className="flex items-center space-x-2 cursor-pointer"
                      whileHover={{ x: 5 }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-300">{category.name_ru}</span>
                    </motion.label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SearchAndFilter;