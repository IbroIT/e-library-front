import { motion, AnimatePresence } from "framer-motion";
import BookCard from "./BookCard";

const BookList = ({ books }) => {
  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <AnimatePresence>
          {books.map((book, index) => (
            <BookCard 
              key={book.id} 
              book={book} 
              custom={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default BookList;