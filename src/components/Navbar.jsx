export default function Navbar() {
    return (
      <nav className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-400 p-2 rounded-lg">
              <img 
                src="/university-logo.png" 
                alt="University Logo" 
                className="h-10"
              />
            </div>
            <span className="font-bold text-xl">Университетская Библиотека</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-yellow-300 font-medium transition">Главная</a>
            <a href="#" className="hover:text-yellow-300 font-medium transition">О нас</a>
            <a href="#" className="hover:text-yellow-300 font-medium transition">Контакты</a>
          </div>
        </div>
      </nav>
    );
  }