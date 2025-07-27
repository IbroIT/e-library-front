import { useEffect, useState } from 'react';
import { getBooks } from '../api/books';
import BookCard from '../components/BookCard';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooks()
      .then(res => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-blue-800 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-6">Электронная библиотека университета</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Доступ к учебным материалам, научным работам и литературе
          </p>
        </div>
      </section>

      {/* Books Section */}
      <section className="py-16 bg-gray-50 flex-grow">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Каталог книг</h2>
          
          {books.length === 0 ? (
            <div className="text-center text-gray-500">
              Нет доступных книг
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}