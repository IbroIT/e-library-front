import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function BookCard({ book }) {
  const [showPdf, setShowPdf] = useState(false);
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
      {/* Обложка книги */}
      <div className="h-48 bg-blue-50 flex items-center justify-center">
        {book.cover ? (
          <img 
            src={book.cover} 
            alt={`Обложка ${book.title}`} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="bg-blue-800 text-white p-4 rounded-full">
            <span className="text-2xl font-bold">{book.title.charAt(0)}</span>
          </div>
        )}
      </div>
      
      {/* Контент карточки */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{book.title}</h3>
        <p className="text-gray-600 mb-2"><span className="font-semibold">Автор:</span> {book.author}</p>
        <p className="text-gray-600 mb-4"><span className="font-semibold">Год:</span> {book.year || 'Не указан'}</p>
        
        {book.description && (
          <div className="mb-4">
            <p className="font-semibold text-gray-700 mb-1">Описание:</p>
            <p className="text-gray-600 text-sm line-clamp-3">{book.description}</p>
          </div>
        )}

        {/* PDF Viewer (по клику на "Читать") */}
        {showPdf && (
          <div className="mb-4 border border-gray-200 rounded-lg p-2">
            <Document
              file={`http://localhost:8000${book.file}`}
              onLoadSuccess={onDocumentLoadSuccess}
              className="pdf-viewer"
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Page 
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={300}
                  renderTextLayer={false}
                  className="mb-2 border border-gray-100"
                />
              ))}
            </Document>
          </div>
        )}

        <div className="flex space-x-3">
          <button 
            onClick={() => setShowPdf(!showPdf)}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            {showPdf ? 'Скрыть' : 'Читать'}
          </button>
          <a 
            href={`http://localhost:8000${book.file}`} 
            download
            className="border border-blue-700 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
          >
            Скачать
          </a>
        </div>
      </div>
    </div>
  );
}