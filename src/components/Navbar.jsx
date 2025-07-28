import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo2.png';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function HeroNavbar() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <motion.nav 
        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-6 px-8 flex items-center justify-between md:justify-around shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Логотип и название */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-12 mr-3" />
          </Link>
        </div>

        {/* Навигационные ссылки (десктоп) */}
        <div className="hidden md:flex space-x-10">
          <motion.div whileHover={{ scale: 1.1 }}>
            <Link 
              to="/" 
              className="text-white hover:text-blue-200 transition duration-300 font-medium text-lg"
            >
              {t('navbar.home')}
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Link 
              to="/contacts" 
              className="text-white hover:text-blue-200 transition duration-300 font-medium text-lg"
            >
              {t('navbar.contacts')}
            </Link>
          </motion.div>
        </div>

        {/* Блок с языками и бургер-меню */}
        <div className="flex items-center space-x-4">
          {/* Выбор языка с флагами */}
          <div className="hidden md:flex space-x-4">
            <motion.button
              onClick={() => changeLanguage('ru')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-1 rounded-full ${i18n.language === 'ru' ? 'ring-2 ring-white' : ''}`}
              title="Русский"
            >
              <img 
                src="https://flagcdn.com/w40/ru.png" 
                alt="Russian" 
                className="w-8 h-6 object-cover rounded"
              />
            </motion.button>
            
            <motion.button
              onClick={() => changeLanguage('kg')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-1 rounded-full ${i18n.language === 'kg' ? 'ring-2 ring-white' : ''}`}
              title="Кыргызча"
            >
              <img 
                src="https://flagcdn.com/w40/kg.png" 
                alt="Kyrgyz" 
                className="w-8 h-6 object-cover rounded"
              />
            </motion.button>
          </div>

          {/* Бургер-меню (мобильная версия) */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={toggleMenu}
          >
            <div className="w-8 flex flex-col space-y-2">
              <motion.span 
                animate={{ 
                  rotate: isMenuOpen ? 45 : 0,
                  y: isMenuOpen ? 8 : 0
                }}
                className="h-1 bg-white rounded-full"
              ></motion.span>
              <motion.span 
                animate={{ opacity: isMenuOpen ? 0 : 1 }}
                className="h-1 bg-white rounded-full"
              ></motion.span>
              <motion.span 
                animate={{ 
                  rotate: isMenuOpen ? -45 : 0,
                  y: isMenuOpen ? -8 : 0
                }}
                className="h-1 bg-white rounded-full"
              ></motion.span>
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Мобильное меню (появляется при клике) */}
      <motion.div 
        className="md:hidden bg-blue-600 shadow-lg"
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isMenuOpen ? 1 : 0,
          height: isMenuOpen ? 'auto' : 0
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        <div className="flex flex-col px-8 py-4 space-y-4">
          <Link 
            to="/" 
            className="text-white hover:text-blue-200 transition duration-300 font-medium text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            {t('navbar.home')}
          </Link>
          <Link 
            to="/contacts" 
            className="text-white hover:text-blue-200 transition duration-300 font-medium text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            {t('navbar.contacts')}
          </Link>
          <div className="flex space-x-4 pt-2">
            <button
              onClick={() => {
                changeLanguage('ru');
                setIsMenuOpen(false);
              }}
              className={`p-1 rounded-full ${i18n.language === 'ru' ? 'ring-2 ring-white' : ''}`}
              title="Русский"
            >
              <img 
                src="https://flagcdn.com/w40/ru.png" 
                alt="Russian" 
                className="w-8 h-6 object-cover rounded"
              />
            </button>
            <button
              onClick={() => {
                changeLanguage('kg');
                setIsMenuOpen(false);
              }}
              className={`p-1 rounded-full ${i18n.language === 'kg' ? 'ring-2 ring-white' : ''}`}
              title="Кыргызча"
            >
              <img 
                src="https://flagcdn.com/w40/kg.png" 
                alt="Kyrgyz" 
                className="w-8 h-6 object-cover rounded"
              />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}