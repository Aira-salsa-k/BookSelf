import { create } from "zustand";
import { persist } from "zustand/middleware";

const DUMMY_DATA = [
  {
    id: 1710928000001,
    title: "The Visual MBA",
    author: "Jason Barron",
    year: 2024,
    isComplete: true,
    image: "/cover_mocks/b_1.png",
    review: "A fascinating journey through modern design principles.",
    rating: 3,
  },
  {
    id: 1710928000002,
    title: "Selalu Ada Ruang Untuk Pulang",
    author: "Karima Ifha",
    year: 2023,
    isComplete: false,
    image: "/cover_mocks/b_2.jpg",
    rating: 0,
  },
  {
    id: 1710928000003,
    title: "Kita Pergi Hari Ini",
    author: "Maudy Ayunda",
    year: 2022,
    isComplete: false,
    image: "/cover_mocks/b_3.jpg",
    rating: 0,
  },
  {
    id: 1710928000004,
    title: "Insecurity",
    author: "Alvi Syahrin",
    year: 2022,
    isComplete: true,
    image: "/cover_mocks/b_4.jpg",
    review: "everything is going to be okay",
    rating: 5,
  },
  {
    id: 1710928000005,
    title: "Self Healing",
    author: "Nadhifa Allya",
    year: 2022,
    isComplete: false,
    image: "/cover_mocks/b_5.jpg",
    rating: 0,
  },
];

export const useBookStore = create(
  persist(
    (set) => ({
      books: DUMMY_DATA, // Use DUMMY_DATA as initial if empty
      searchQuery: "",

      addBook: (book) =>
        set((state) => ({
          books: [...state.books, { ...book, id: Date.now() }],
        })),

      updateBook: (id, updatedBook) =>
        set((state) => ({
          books: state.books.map((book) =>
            book.id === id ? { ...book, ...updatedBook } : book,
          ),
        })),

      deleteBook: (id) =>
        set((state) => ({
          books: state.books.filter((book) => book.id !== id),
        })),

      toggleReadStatus: (id) =>
        set((state) => ({
          books: state.books.map((book) =>
            book.id === id ? { ...book, isComplete: !book.isComplete } : book,
          ),
        })),

      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: "BOOKSHELF",
    },
  ),
);
