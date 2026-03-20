import React from "react";
import { useBookStore } from "../stores/useBookStore";
import { BookCard } from "./BookCard";
import { Library } from "lucide-react";

export function BookList({ onEdit }) {
  const books = useBookStore((state) => state.books);
  const searchQuery = useBookStore((state) => state.searchQuery);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const incompleteBooks = filteredBooks.filter((book) => !book.isComplete);
  const completeBooks = filteredBooks.filter((book) => book.isComplete);

  if (filteredBooks.length === 0 && searchQuery) {
    return (
      <div className="text-center py-12 text-gray-400 bg-white/5 rounded-3xl border border-white/10">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <Library size={32} className="opacity-50" />
        </div>
        <p className="text-lg">No books found matching "{searchQuery}".</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Currently Reading */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 pt-4">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            Currently Reading
            <span className="text-sm font-normal px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">
              {incompleteBooks.length}
            </span>
          </h3>
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_4px_rgba(250,204,21,0.4)]"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {incompleteBooks.length > 0 ? (
            incompleteBooks.map((book) => (
              <BookCard key={book.id} book={book} onEdit={onEdit} />
            ))
          ) : (
            <p className="text-gray-500 italic py-4 col-span-full">
              No books in progress.
            </p>
          )}
        </div>
      </div>

      {/* Completed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            Completed
            <span className="text-sm font-normal px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-400">
              {completeBooks.length}
            </span>
          </h3>
          <div className="w-3 h-3 bg-teal-400 rounded-full shadow-[0_0_10px_4px_rgba(45,212,191,0.3)]"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completeBooks.length > 0 ? (
            completeBooks.map((book) => (
              <BookCard key={book.id} book={book} onEdit={onEdit} />
            ))
          ) : (
            <p className="text-gray-500 italic py-4 col-span-full">
              No completed books yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
