import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaBook, FaArrowRight } from "react-icons/fa";
import { getBooks } from "../api/books";
import { getCategories } from "../api/category";
import SearchAndFilter from "./SearchAndFilter";
import BookList from "./BookList";

const LibraryPage = () => {
  const { t } = useTranslation();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, categoriesRes] = await Promise.all([
          getBooks(),
          getCategories()
        ]);
        setBooks(booksRes.data);
        setFilteredBooks(booksRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (term) => {
    if (!term) {
      setFilteredBooks(books);
      return;
    }
    const filtered = books.filter(book => 
      book.title_ru.toLowerCase().includes(term.toLowerCase()) || 
      book.title_kg.toLowerCase().includes(term.toLowerCase()) ||
      book.author_ru.toLowerCase().includes(term.toLowerCase()) ||
      book.author_kg.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const handleFilter = (categoryIds) => {
    getBooks(categoryIds)
      .then(res => setFilteredBooks(res.data))
      .catch(err => console.error('Filter error:', err));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div 
          className="bg-red-900/50 text-red-300 p-8 rounded-xl max-w-md text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h2 className="text-2xl font-bold mb-4">Error Loading Content</h2>
          <p>{error}</p>
          <motion.button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-red-700 hover:bg-red-600 rounded-lg flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowRight />
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pb-16">
      <div className="container mx-auto px-4 py-12">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Digital Library
        </motion.h1>
        
        <SearchAndFilter 
          categories={categories} 
          onSearch={handleSearch}
          onFilter={handleFilter}
        />
        
        {filteredBooks.length > 0 ? (
          <BookList books={filteredBooks} />
        ) : (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FaBook className="text-gray-600 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl text-gray-400 mb-2">No Books Found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;