import React, { useState } from "react";
import { BookForm } from "./components/BookForm";
import { SearchBar } from "./components/SearchBar";
import { BookList } from "./components/BookList";
import { Library, Plus } from "lucide-react";

export default function BookshelfFeature() {
  const [editingBook, setEditingBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingBook(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-[#0b0b0b] min-h-screen text-white font-inter relative pb-20 overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-[400px] h-[250px] bg-gradient-to-tr from-teal-500 via-cyan-300 to-white opacity-20 blur-[70px] rounded-[40%]"></div>
        <div className="absolute top-1/2 right-0 transform -translate-y-[30%] translate-x-1/2 w-[400px] h-[250px] bg-gradient-to-tr from-teal-500 via-cyan-300 to-white opacity-20 blur-[70px] rounded-[30%]"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0b0b0b]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-2 self-center md:self-auto">
              <Library className="text-teal-500" size={28} />
              {/* <img src="/src/assets/image.png" className="w-10 h-10" /> */}
              <span className="text-white">Book</span>
              <span className="text-teal-500">/shelf</span>
            </h1>
            <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
              <div className="w-full md:w-auto">
                <SearchBar />
              </div>
              <button
                onClick={handleAdd}
                className="w-full md:w-auto hover:bg-teal-500 hover:text-black transition-all bg-teal-500/10 text-teal-500 px-5 py-2.5 rounded-full flex items-center justify-center gap-2 text-sm font-bold border border-teal-500/20 whitespace-nowrap"
              >
                <Plus size={16} /> Add New Book
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10 w-full mt-4">
        <div id="library">
          <BookList onEdit={handleEdit} />
        </div>
      </main>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl z-10 custom-scrollbar">
            <BookForm editData={editingBook} onCloseEdit={closeModal} />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} xS-Projects Bookshelf App.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="https://nadantadev"
              className="hover:text-white transition-colors"
            >
              Nadanta dev
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
