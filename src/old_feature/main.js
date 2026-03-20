const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF";

function isStorageExist() {
	if (typeof Storage === "undefined") {
		alert("browser kamu tidak mendukung local storage");
		return false;
	}
	return true;
}

document.addEventListener("DOMContentLoaded", function () {
	const submitForm = document.getElementById("bookForm");
	const imageInput = document.getElementById("bookFormImage");
	const preview = document.getElementById("bookImagePreview");
	const UploadPrompt= document.getElementById("uploadPrompt");
	const fileName = document.getElementById('fileName');

	imageInput.addEventListener("change", function () {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
	  fileName.textContent = file.name;
      preview.style.display = "block";
	  uploadPrompt.classList.add("hidden");// atau pakai `classList.remove("hidden")` kalau kamu pakai Tailwind
// Sembunyikan prompt upload
    };
    reader.readAsDataURL(file);
  } else {
    preview.style.display = "none";
  }
	});

	submitForm.addEventListener("submit", function (event) {
		event.preventDefault();
		addBook();
	});

	const searchInput = document.getElementById("searchBookTitle");
	searchInput.addEventListener("input", function () {
		document.dispatchEvent(new Event(RENDER_EVENT));
	});

	if (isStorageExist()) {
		loadDataFromStorage(); 
	}
});
function saveData() {
	if (isStorageExist()) {
		const parsed = JSON.stringify(books);
		localStorage.setItem(STORAGE_KEY, parsed);

	}
}

function loadDataFromStorage() {
	const serializedData = localStorage.getItem(STORAGE_KEY);
	console.log("Data dari localStorage:", serializedData);
	let data = JSON.parse(serializedData);

	if (data !== null) {
		books.length = 0;
		for (const book of data) {
			books.push(book);
		}
	}
	document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBook() {
	const titleBook = document.getElementById("bookFormTitle").value;
	const authorBook = document.getElementById("bookFormAuthor").value;
	const yearBook = parseInt(document.getElementById("bookFormYear").value);
	const completedBook = document.getElementById("bookFormIsComplete").checked;
	const imageInput = document.getElementById("bookFormImage");
	const imageFile = imageInput?.files[0];
	console.log(imageInput);


	if (imageFile){

		const reader = new FileReader();
		reader.onload = function (event) {
			const imageBase64 = event.target.result;
			const generatedID = generateId();
			const bookObject = generateBookObject(
				generatedID,
				titleBook,
				authorBook,
				yearBook,
				completedBook,
				imageBase64
			);

			
			
				books.push(bookObject);
				document.dispatchEvent(new Event(RENDER_EVENT));
				saveData();
			};
			reader.readAsDataURL(imageFile);//konversi file gambar menjadi base64
			resetFormUI();
		}else {
		const generatedID = generateId();
		const bookObject = generateBookObject(
			generatedID,
			titleBook,
			authorBook,
			yearBook,
			completedBook,
			null
		);

		if (bookObject.title === "" || bookObject.author === "") {
			alert("Judul dan Penulis tidak boleh kosong!");
			return;
		}

		if (bookObject.year < 0) {
			alert("Tahun tidak boleh negatif!");
			return;
		}

		if (bookObject.year > new Date().getFullYear()) {
			alert("Tahun tidak boleh lebih dari tahun ini!");
			return;
		}

		if (bookObject.title.length > 50) {
			alert("Judul buku terlalu panjang, maksimal 50 karakter!");
			return;
		}

		if (bookObject.author.length > 30) {
			alert("Nama penulis terlalu panjang, maksimal 30 karakter!");
			return;
		}

		
			books.push(bookObject);
			document.dispatchEvent(new Event(RENDER_EVENT));
			saveData();

			document.getElementById("bookForm").reset();
			
		

			resetFormUI();
				
	}
}

function generateId() {
	return +new Date();
}

function generateBookObject(id, title, author, year, isComplete, imageBase64) {
	return {
		id,
		title,
		author,
		year,
		isComplete,
		image: imageBase64 || null
	};
}

document.addEventListener(RENDER_EVENT, function () {

	const incompletedBook = document.getElementById("incompleteBookList");
	incompletedBook.innerHTML = "";

	const completedBooks = document.getElementById("completeBookList");
	completedBooks.innerHTML = "";

	const searchValue = document
		.getElementById("searchBookTitle")
		.value.toLowerCase();

	let bookFound = false;

	for (const bookItem of books) {
		if (!bookItem.title.toLowerCase().includes(searchValue)) continue;

		const bookElement = makeBook(bookItem);
		if (!bookItem.isComplete) incompletedBook.append(bookElement);
		else completedBooks.append(bookElement);

		bookFound = true;
	}

	const notFoundMessage = document.getElementById("notFoundMessage");
	if (!bookFound && searchValue !== "") {
		notFoundMessage.style.display = "block";
	} else {
		notFoundMessage.style.display = "none";
	}


});



function makeBook(bookItem) {
	const bookContainer = document.createElement("div");
	bookContainer.setAttribute("data-bookid", bookItem.id);
	bookContainer.setAttribute("data-testid", "bookItem");
	bookContainer.className =
		"group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300";

	const innerFlex = document.createElement("div");
	innerFlex.className = "flex gap-4";

	// Gambar atau ikon buku
	const imageWrapper = document.createElement("div");
	imageWrapper.className = "flex-shrink-0";

	let thumbnail;
	if (bookItem.image) {
		thumbnail = document.createElement("img");
		thumbnail.src = bookItem.image;
		thumbnail.alt = "Gambar Buku";
		thumbnail.className = "w-20 h-22 rounded-lg object-cover";
		thumbnail.setAttribute("data-testid", "bookItemImage");
	} else {
		thumbnail = document.createElement("div");
		thumbnail.className =
			"w-16 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-2xl";
		thumbnail.textContent = "📖";
	}
	imageWrapper.appendChild(thumbnail);

	// Konten buku
	const contentWrapper = document.createElement("div");
	contentWrapper.className = "flex-1 min-w-0";

	const title = document.createElement("h4");
	title.innerText = bookItem.title;
	title.setAttribute("data-testid", "bookItemTitle");
	title.className = "font-semibold text-white mb-1 truncate";

	const author = document.createElement("p");
	author.innerText = `by ${bookItem.author}`;
	author.setAttribute("data-testid", "bookItemAuthor");
	author.className = "text-gray-400 text-sm mb-1";

	const year = document.createElement("p");
	year.innerText = `${bookItem.year}`;
	year.setAttribute("data-testid", "bookItemYear");
	year.className = "text-gray-500 text-xs mb-3";

	// Tombol-tombol aksi
	const buttonWrapper = document.createElement("div");
	buttonWrapper.className = "flex flex-wrap gap-2";

	const toggleButton = document.createElement("button");
	toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
	toggleButton.textContent = bookItem.isComplete
		? "Mark Unread"
		: "Mark Complete";
	toggleButton.className =
		"text-xs bg-accent/20 text-accent hover:bg-accent hover:text-white px-3 py-1 rounded-full transition-colors";

	toggleButton.addEventListener("click", function () {
		bookItem.isComplete
			? uncompleteReadingBook(bookItem.id)
			: completeReadingBook(bookItem.id);
	});

	const editButton = document.createElement("button");
	editButton.textContent = "Edit";
	editButton.setAttribute("data-testid", "bookItemEditButton");
	editButton.className =
		"text-xs bg-white/10 text-white hover:bg-white hover:text-black px-3 py-1 rounded-full transition-colors";

		editButton.addEventListener("click", function handleEditClick() {
			// Buat input fields
			const inputTitle = document.createElement("input");
			inputTitle.type = "text";
			inputTitle.value = bookItem.title;
			inputTitle.className = "w-full px-3 py-2 rounded bg-white/10 text-white border border-white/20";
		  
			const inputAuthor = document.createElement("input");
			inputAuthor.type = "text";
			inputAuthor.value = bookItem.author;
			inputAuthor.className = "w-full px-3 py-2 rounded bg-white/10 text-white border border-white/20";
		  
			const inputYear = document.createElement("input");
			inputYear.type = "number";
			inputYear.value = bookItem.year;
			inputYear.className = "w-full px-3 py-2 rounded bg-white/10 text-white border border-white/20";
		  
			const saveButton = document.createElement("button");
			saveButton.textContent = "Save";
			saveButton.className =
			  "mt-2 bg-teal-500 text-white px-4 py-1 rounded hover:bg-teal-600 transition";
		  
			const inputWrapper = document.createElement("div");
			inputWrapper.className = "space-y-2";
			inputWrapper.append(inputTitle, inputAuthor, inputYear, saveButton);
		  
			// Hapus isi lama dan tampilkan editor
			contentWrapper.innerHTML = "";
			contentWrapper.appendChild(inputWrapper);
		  
			// Disable edit button agar tidak dipencet berkali-kali
			editButton.disabled = true;
		  
			saveButton.addEventListener("click", () => {
			  // Update data
			  bookItem.title = inputTitle.value;
			  bookItem.author = inputAuthor.value;
			  bookItem.year = inputYear.value;
		  
			  saveData();
			  document.dispatchEvent(new Event(RENDER_EVENT));
			});
		  });
		  

	const deleteButton = document.createElement("button");
	deleteButton.textContent = "Delete";
	deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
	deleteButton.className =
		"text-xs bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1 rounded-full transition-colors";

	deleteButton.addEventListener("click", function () {
		deleteBook(bookItem.id);
	});

	buttonWrapper.append(toggleButton, editButton, deleteButton);

	// Susun elemen
	contentWrapper.append(title, author, year, buttonWrapper);
	innerFlex.append(imageWrapper, contentWrapper);
	bookContainer.appendChild(innerFlex);

	return bookContainer;
}



document.addEventListener(SAVED_EVENT, function () {
	console.log(localStorage.getItem(STORAGE_KEY));
});

function findBook(bookId) {
	for (const bookItem of books) {
		if (bookItem.id === bookId) {
			return bookItem;
		}
	}

	return null;
}

function findBookIndex(bookId) {
	for (const index in books) {
		if (books[index].id === bookId) {
			return index;
		}
	}

	return -1;
}

function deleteBook(bookId) {
	const bookTarget = findBookIndex(bookId);
	if (bookTarget === -1) return;

	books.splice(bookTarget, 1);
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}

function completeReadingBook(bookId) {
	const bookTarget = findBook(bookId);
	if (bookTarget === null) return;

	bookTarget.isComplete = true;
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}

function uncompleteReadingBook(bookId) {
	const bookTarget = findBook(bookId);
	if (bookTarget === null) return;

	bookTarget.isComplete = false;
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}
function resetFormUI() {
	
	const form = document.getElementById("bookForm");
	document.getElementById("bookForm").reset();
	
	const imageInput = document.getElementById("bookFormImage");
	// Reset preview gambar
	const previewImg = document.getElementById("bookImagePreview");
	const fileName = document.getElementById("fileName");
	const uploadPrompt = document.getElementById("uploadPrompt");

	// Reset image preview dan input file
	imageInput.value = ""; // ini penting agar "change" bisa terpicu lagi
// tampilkan ulang prompt upload
	// previewImg.classList.add("hidden");
	uploadPrompt.classList.remove("hidden");

	if (previewImg) {
		previewImg.src = "";
		previewImg.style.display = "none";
	}

	if (fileName) {
		fileName.textContent = "";
	}

	// if (uploadPrompt) {
	// 	uploadPrompt.classList.remove("hidden");
	// }



	window.scrollTo({ top: 0, behavior: "smooth" });

	Swal.fire({
		icon: 'success',
		title: 'Success!',
		text: 'Buku berhasil ditambahkan.',
		showConfirmButton: false,
		timer: 6000, // Tampil 3 detik
		timerProgressBar: true,
		customClass: {
			popup: 'rounded-xl', // <== inilah yang bikin rounded
		  },
		didOpen: (toast) => {
		  toast.style.transition = 'all 0.4s ease-in-out'; // Smooth masuk
		},
		willClose: (toast) => {
		  toast.style.transition = 'all 0.4s ease-in-out'; // Smooth keluar
		}
	  });
	  
		
}
