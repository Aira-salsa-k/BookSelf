import React from "react";
import { useBookStore } from "../stores/useBookStore";
import {
  BookOpen,
  Star,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  MoreVertical,
  RotateCcw,
} from "lucide-react";

export function BookCard({ book, onEdit }) {
  const toggleReadStatus = useBookStore((state) => state.toggleReadStatus);
  const deleteBook = useBookStore((state) => state.deleteBook);

  return (
    <div className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 sm:p-6 hover:bg-white/10 transition-all duration-300 h-full flex flex-col">
      <div className="flex gap-4 sm:gap-5 flex-1 min-w-0">
        {/* Book Cover Container */}
        <div className="flex-shrink-0">
          {book.image ? (
            <img
              src={book.image}
              alt={book.title}
              className="w-20 h-28 sm:w-24 sm:h-32 rounded-lg object-cover shadow-lg"
            />
          ) : (
            <div
              className={`w-20 h-28 sm:w-24 sm:h-32 rounded-lg flex items-center justify-center text-3xl shadow-inner ${book.isComplete ? "bg-teal-600/50" : "bg-yellow-600/50"}`}
            >
              <BookOpen size={32} className="text-white opacity-80" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Title & Stats */}
          <div className="mb-2">
            <h4
              className="font-bold text-white text-sm sm:text-base md:text-lg leading-tight mb-1 line-clamp-2"
              title={book.title}
            >
              {book.title}
            </h4>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  fill={star <= (book.rating || 0) ? "currentColor" : "none"}
                  className={
                    star <= (book.rating || 0)
                      ? "text-yellow-400"
                      : "text-gray-600"
                  }
                />
              ))}
            </div>
          </div>

          <p className="text-gray-300/80 text-xs sm:text-sm mb-1 truncate">
            by {book.author}
          </p>
          <p className="text-gray-500 text-[10px] sm:text-xs mb-3 font-medium">
            {book.year}
          </p>

          {book.review && (
            <div className="mt-1">
              <p className="text-gray-300 text-xs sm:text-sm italic line-clamp-3 bg-white/5 p-2 rounded-lg border border-white/5 leading-relaxed overflow-hidden">
                "{book.review}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions Section */}
      <div className="flex flex-wrap items-center justify-between mt-4 gap-3 pt-4 border-t border-white/10">
        {/* Left Action: Feedback/Read Status */}
        <button
          onClick={() => toggleReadStatus(book.id)}
          className={`flex items-center gap-2 text-xs px-4 py-2 rounded-full transition-all font-bold group/btn
            ${
              book.isComplete
                ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black border border-yellow-500/30"
                : "bg-teal-500/10 text-teal-400 hover:bg-teal-500 hover:text-white border border-teal-500/30"
            }`}
        >
          {book.isComplete ? (
            <RotateCcw
              size={14}
              className="group-active/btn:rotate-180 transition-transform"
            />
          ) : (
            <CheckCircle size={14} />
          )}
          <span>{book.isComplete ? "Mark Unread" : "Mark Complete"}</span>
        </button>

        {/* Right Group: Management Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(book)}
            className="p-2 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white rounded-xl transition-all border border-white/10 hover:scale-110 active:scale-95"
            title="Edit Book"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => deleteBook(book.id)}
            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/20 hover:scale-110 active:scale-95"
            title="Delete Book"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
