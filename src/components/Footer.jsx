export default function Footer() {
    return (
      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="bg-yellow-400 p-2 rounded-lg inline-block">
                <img 
                  src="/university-logo-white.png" 
                  alt="University Logo" 
                  className="h-8"
                />
              </div>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-yellow-300 transition">Главная</a>
              <a href="#" className="hover:text-yellow-300 transition">О нас</a>
              <a href="#" className="hover:text-yellow-300 transition">Контакты</a>
            </div>
          </div>
          <div className="border-t border-blue-700 mt-6 pt-6 text-center text-blue-200">
            <p>© {new Date().getFullYear()} Университетская Библиотека. Все права защищены.</p>
          </div>
        </div>
      </footer>
    );
  }