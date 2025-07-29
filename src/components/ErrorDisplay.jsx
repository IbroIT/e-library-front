import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const ErrorDisplay = ({ error, onRetry }) => {
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
          onClick={onRetry}
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
};

export default ErrorDisplay;