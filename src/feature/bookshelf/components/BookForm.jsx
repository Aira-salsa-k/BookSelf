import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookSchema } from "../schemas/bookSchema";
import { useBookStore } from "../stores/useBookStore";
import { UploadCloud, CheckCircle, Star, Plus } from "lucide-react";
import clsx from "clsx";

export function BookForm({ editData, onCloseEdit }) {
  const addBook = useBookStore((state) => state.addBook);
  const updateBook = useBookStore((state) => state.updateBook);
  const [imagePreview, setImagePreview] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      year: new Date().getFullYear(),
      isComplete: false,
      image: "",
      rating: 0,
      review: "",
    },
  });

  const currentRating = watch("rating");

  // Load data if editing
  useEffect(() => {
    if (editData) {
      reset({
        title: editData.title,
        author: editData.author,
        year: editData.year,
        isComplete: editData.isComplete,
        image: editData.image || "",
        rating: editData.rating || 0,
        review: editData.review || "",
      });
      setImagePreview(editData.image || "");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [editData, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        setImagePreview(base64);
        setValue("image", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    if (editData) {
      updateBook(editData.id, data);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onCloseEdit(); // clear edit mode and close modal
      }, 1500);
    } else {
      addBook(data);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        reset();
        setImagePreview("");
        onCloseEdit(); // auto close modal after adding
      }, 1500);
    }
  };

  const handleCancel = () => {
    reset();
    setImagePreview("");
    onCloseEdit();
  };

  const isComplete = watch("isComplete");

  return (
    <div className="w-full bg-[#111111] border border-white/10 shadow-2xl overflow-hidden rounded-3xl pb-4">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-white/10 bg-white/5">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          {editData ? "Edit Book Details" : "Add New Book"}
        </h2>
        <button
          onClick={onCloseEdit}
          type="button"
          className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <div className="p-8 relative">
        {/* Success Alert */}
        <div
          className={clsx(
            "absolute top-0 left-0 right-0 bg-teal-500/20 border-b border-teal-500/50 text-teal-300 text-center py-2 flex items-center justify-center gap-2 transform transition-all duration-300 z-20",
            isSuccess
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0",
          )}
        >
          <CheckCircle size={18} />
          {editData
            ? "Book updated successfully!"
            : "Book added to library successfully!"}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 flex-col justify-center mt-2"
        >
          {/* Main Layout Grid */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Cover Image */}
            <div className="space-y-3 md:w-1/3 flex flex-col items-center">
              <label className="block text-sm font-medium text-white/90 self-start">
                Book Cover
              </label>
              <div className="relative border-2 border-dashed border-white/20 rounded-2xl text-center hover:border-teal-500 transition-colors cursor-pointer w-full flex flex-col items-center justify-center min-h-[260px] bg-white/5 overflow-hidden group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover rounded shadow-lg opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <p className="text-white font-medium text-sm flex items-center gap-2">
                        <UploadCloud size={16} /> Change Cover
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="p-6 flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      <UploadCloud className="h-6 w-6 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/90">
                        Click to upload
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {errors.image && (
                <p className="text-red-400 text-xs mt-1 w-full text-left">
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* Right: Form Data */}
            <div className="space-y-5 md:w-2/3 flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    {...register("title")}
                    className={clsx(
                      "w-full px-4 py-2.5 bg-white/5 border rounded-xl text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-1 focus:border-teal-500 hover:bg-white/10",
                      errors.title
                        ? "border-red-500 focus:ring-red-500"
                        : "border-white/10 focus:ring-teal-500",
                    )}
                    placeholder="Enter book title"
                  />
                  {errors.title && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">
                    Author *
                  </label>
                  <input
                    type="text"
                    {...register("author")}
                    className={clsx(
                      "w-full px-4 py-2.5 bg-white/5 border rounded-xl text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-1 focus:border-teal-500 hover:bg-white/10",
                      errors.author
                        ? "border-red-500 focus:ring-red-500"
                        : "border-white/10 focus:ring-teal-500",
                    )}
                    placeholder="Enter author name"
                  />
                  {errors.author && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.author.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">
                    Publication Year
                  </label>
                  <input
                    type="number"
                    {...register("year")}
                    className={clsx(
                      "w-full px-4 py-2.5 bg-white/5 border rounded-xl text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-1 focus:border-teal-500 hover:bg-white/10",
                      errors.year
                        ? "border-red-500 focus:ring-red-500"
                        : "border-white/10 focus:ring-teal-500",
                    )}
                    placeholder="2024"
                  />
                  {errors.year && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.year.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">
                    Reading Status
                  </label>
                  <div
                    className="flex items-center justify-between h-[46px] w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 cursor-pointer transition-colors hover:bg-white/10"
                    onClick={() => setValue("isComplete", !isComplete)}
                  >
                    <span className="text-white/90 text-sm font-medium select-none text-gray-300">
                      {isComplete ? "Finished" : "Currently Reading"}
                    </span>
                    <div
                      className={clsx(
                        "w-11 h-6 rounded-full transition-colors flex items-center",
                        isComplete ? "bg-teal-500" : "bg-white/20",
                      )}
                    >
                      <div
                        className={clsx(
                          "w-4 h-4 rounded-full bg-white transition-transform mx-1",
                          isComplete ? "translate-x-5" : "translate-x-0",
                        )}
                      ></div>
                    </div>
                    {/* Hidden actual input */}
                    <input
                      type="checkbox"
                      className="hidden"
                      {...register("isComplete")}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  Rating
                </label>
                <div className="flex gap-2 h-10 items-center bg-white/5 border border-white/10 rounded-xl px-4 w-max">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setValue("rating", star)}
                      className="focus:outline-none transform transition-transform active:scale-90 hover:scale-110"
                    >
                      <Star
                        size={22}
                        fill={star <= currentRating ? "currentColor" : "none"}
                        className={clsx(
                          "transition-colors",
                          star <= currentRating
                            ? "text-yellow-400"
                            : "text-gray-600",
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  Short Review
                </label>
                <textarea
                  {...register("review")}
                  rows={2}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 resize-none hover:bg-white/10"
                  placeholder="What did you think about this book?"
                />
                {errors.review && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.review.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-6 border-t border-white/10 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-transparent border border-white/20 hover:bg-white/10 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 text-teal-950 font-medium py-1.5 px-3 rounded-lg transition-all duration-200 shadow flex items-center justify-center gap-1 text-sm sm:py-2 sm:px-5"
            >
              <CheckCircle size={14} className="sm:hidden" />
              <CheckCircle size={16} className="hidden sm:block" />
              <span>{editData ? "Save" : "Add"}</span>
              <span className="hidden sm:inline">
                {editData ? " Changes" : " to Library"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
