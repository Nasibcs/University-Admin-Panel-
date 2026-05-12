import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import {
  FaBook,
  FaPen,
  FaTrash,
  FaUniversity,
  FaGraduationCap,
  FaCalendarAlt,
  FaTimes
} from "react-icons/fa";

// ========== TYPES ==========
interface Book {
  id: string;
  name: string;
  author: string;
  description: string;
  thumbnail: string;
  facultyId: string;
  departmentId: string;
  semesterId: string;
  isbn?: string;
  ion?: string;
  publicationYear?: string;
}

interface Faculty {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
  facultyId: string;
}

interface Semester {
  id: string;
  name: string;
  departmentId: string;
}

type AlertMessage = {
  type: "success" | "error";
  title: string;
  message: string;
} | null;

type DeleteBookTarget = {
  id: string;
  name: string;
} | null;

// ========== ALERT COMPONENT ==========
const AlertBox = ({
  alert,
  onClose
}: {
  alert: AlertMessage;
  onClose: () => void;
}) => {
  if (!alert) return null;

  const isSuccess = alert.type === "success";

  return (
    <div className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm animate-[toastSlideIn_0.35s_ease-out] md:right-6 md:top-6">
      <div
        className={`overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl ${
          isSuccess
            ? "border-teal-200/80 bg-white/95 text-slate-900 shadow-teal-900/10 dark:border-teal-500/30 dark:bg-slate-900/95 dark:text-stone-100"
            : "border-red-200/80 bg-white/95 text-slate-900 shadow-red-900/10 dark:border-red-500/30 dark:bg-slate-900/95 dark:text-stone-100"
        }`}
      >
        <div className="flex items-start gap-3 p-4">
          <div
            className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl text-white shadow-lg ${
              isSuccess
                ? "bg-gradient-to-br from-teal-600 to-emerald-500 shadow-teal-600/25"
                : "bg-gradient-to-br from-red-600 to-rose-500 shadow-red-600/25"
            }`}
          >
            {isSuccess ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 111.414-1.414l2.543 2.543 6.543-6.543a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.5a.75.75 0 00-1.5 0v4a.75.75 0 001.5 0v-4zM10 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold md:text-base">{alert.title}</h4>
            <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-stone-300">
              {alert.message}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-stone-100"
            aria-label="Close notification"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full animate-[toastProgress_4s_linear_forwards] ${
              isSuccess ? "bg-teal-600" : "bg-red-600"
            }`}
          />
        </div>
      </div>

      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(24px) translateY(-8px) scale(0.96); }
          to { opacity: 1; transform: translateX(0) translateY(0) scale(1); }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

// ========== DELETE CONFIRM MODAL ==========
const DeleteBookConfirmModal = ({
  book,
  onCancel,
  onConfirm
}: {
  book: DeleteBookTarget;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative w-full max-w-md animate-[modalPop_0.25s_ease-out] overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-950/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-stone-100">
        <div className="bg-gradient-to-r from-slate-800 via-teal-700 to-amber-500 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 shadow-lg ring-1 ring-white/25">
              <FaTrash className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-lg font-bold">Confirm Delete</h3>
              <p className="text-sm text-white/85">This action cannot be undone.</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm leading-6 text-slate-600 dark:text-stone-300">
            Are you sure you want to delete
            <span className="mx-1 font-bold text-slate-900 dark:text-white">
              {book.name}
            </span>
            from the books list?
          </p>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-stone-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:from-red-700 hover:to-rose-600"
            >
              Yes, Delete Book
            </button>
          </div>
        </div>

        <style>{`
          @keyframes modalPop {
            from { opacity: 0; transform: translateY(14px) scale(0.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
};

// ========== BOOK FORM ==========
interface BookFormProps {
  onSave: (book: Book) => void;
  ingBook: Book | null;
  selectedFaculty: string;
  selectedDepartment: string;
  selectedSemester: string;
  onCancel: () => void;
}

const BookForm = ({
  onSave,
  ingBook,
  selectedFaculty,
  selectedDepartment,
  selectedSemester,
  onCancel
}: BookFormProps) => {
  const [formData, setFormData] = useState<Omit<Book, "id">>({
    name: "",
    author: "",
    description: "",
    thumbnail: "",
    facultyId: selectedFaculty,
    departmentId: selectedDepartment,
    semesterId: selectedSemester,
    isbn: "",
    ion: "",
    publicationYear: ""
  });

  useEffect(() => {
    if (ingBook) {
      setFormData(ingBook);
    } else {
      setFormData({
        name: "",
        author: "",
        description: "",
        thumbnail: "",
        facultyId: selectedFaculty,
        departmentId: selectedDepartment,
        semesterId: selectedSemester,
        isbn: "",
        ion: "",
        publicationYear: ""
      });
    }
  }, [ingBook, selectedFaculty, selectedDepartment, selectedSemester]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.author) return;

    const book: Book = {
      ...formData,
      id: ingBook?.id || uuid(),
      facultyId: selectedFaculty,
      departmentId: selectedDepartment,
      semesterId: selectedSemester
    };

    onSave(book);

    if (!ingBook) {
      setFormData({
        name: "",
        author: "",
        description: "",
        thumbnail: "",
        facultyId: selectedFaculty,
        departmentId: selectedDepartment,
        semesterId: selectedSemester,
        isbn: "",
        ion: "",
        publicationYear: ""
      });
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white/90 shadow-md dark:border-slate-700/80 dark:bg-slate-900/80">
      <div className="bg-gradient-to-r from-slate-800 via-teal-700 to-amber-500 px-6 py-5 text-white">
        <h3 className="flex items-center gap-2 text-xl font-bold">
          <FaBook className="text-amber-300" />
          {ingBook ? "Book Details" : "Add New Book"}
        </h3>
        <p className="mt-1 text-sm text-white/85">
          Add and manage books for the selected semester.
        </p>
      </div>

      <form
        id="books-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 bg-gradient-to-br from-stone-50/90 to-slate-100/50 p-4 md:grid-cols-2 md:p-6 dark:bg-slate-900/80"
      >
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-stone-200">
            Book Title *
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Introduction to Computer Science"
            className="w-full rounded-md border border-slate-200/90 px-3 py-2 text-sm shadow-sm focus:border-teal-600 focus:ring-teal-600/25 dark:border-slate-700 dark:bg-slate-800/80 dark:text-stone-100 md:text-base"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-stone-200">
            Author *
          </label>
          <input
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="e.g., John Doe"
            className="w-full rounded-md border border-slate-200/90 px-3 py-2 text-sm shadow-sm focus:border-teal-600 focus:ring-teal-600/25 dark:border-slate-700 dark:bg-slate-800/80 dark:text-stone-100 md:text-base"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-stone-200">
            ISBN
          </label>
          <input
            name="isbn"
            value={formData.isbn || ""}
            onChange={handleChange}
            placeholder="e.g., 978-3-16-148410-0"
            className="w-full rounded-md border border-slate-200/90 px-3 py-2 text-sm shadow-sm focus:border-teal-600 focus:ring-teal-600/25 dark:border-slate-700 dark:bg-slate-800/80 dark:text-stone-100 md:text-base"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-stone-200">
            ion
          </label>
          <input
            name="ion"
            value={formData.ion || ""}
            onChange={handleChange}
            placeholder="e.g., 5th ion"
            className="w-full rounded-md border border-slate-200/90 px-3 py-2 text-sm shadow-sm focus:border-teal-600 focus:ring-teal-600/25 dark:border-slate-700 dark:bg-slate-800/80 dark:text-stone-100 md:text-base"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-stone-200">
            Publication Year
          </label>
          <input
            name="publicationYear"
            value={formData.publicationYear || ""}
            onChange={handleChange}
            placeholder="e.g., 2022"
            className="w-full rounded-md border border-slate-200/90 px-3 py-2 text-sm shadow-sm focus:border-teal-600 focus:ring-teal-600/25 dark:border-slate-700 dark:bg-slate-800/80 dark:text-stone-100 md:text-base"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-stone-200">
            Cover Image URL
          </label>
          <input
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            placeholder="https://example.com/book-cover.jpg"
            className="w-full rounded-md border border-slate-200/90 px-3 py-2 text-sm shadow-sm focus:border-teal-600 focus:ring-teal-600/25 dark:border-slate-700 dark:bg-slate-800/80 dark:text-stone-100 md:text-base"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-stone-200">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the book..."
            rows={3}
            className="w-full rounded-md border border-slate-200/90 px-3 py-2 text-sm shadow-sm focus:border-teal-600 focus:ring-teal-600/25 dark:border-slate-700 dark:bg-slate-800/80 dark:text-stone-100 md:text-base"
          />
        </div>

        <div className="flex gap-3 md:col-span-2">
          <button
            type="submit"
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-2 font-medium text-white transition hover:bg-teal-800"
          >
            <FaBook />
            {ingBook ? "Update Book" : "Add Book"}
          </button>

          {ingBook && (
            <button
              type="button"
              onClick={onCancel}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-slate-200/90 px-4 py-2 font-medium text-slate-700 transition hover:bg-stone-50/90 dark:border-slate-700 dark:text-stone-200 dark:hover:bg-slate-800/80"
            >
              <FaTimes />
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// ========== BOOK LIST ==========
interface BookListProps {
  books: Book[];
  on: (book: Book) => void;
  onDelete: (id: string) => void;
}

const BookList = ({ books, on, onDelete }: BookListProps) => {
  return (
    <div className="rounded-lg border border-slate-200/80 bg-white/90 p-6 shadow-md dark:border-slate-700/80 dark:bg-slate-900/80">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-stone-100">
          <FaBook className="text-amber-400" />
          <span>Book Collection</span>
          <span className="ml-2 text-sm font-normal text-slate-500 dark:text-stone-300">
            ({books.length} book{books.length !== 1 ? "s" : ""})
          </span>
        </h3>
      </div>

      {books.length === 0 ? (
        <div className="rounded-lg border-l-4 border-amber-400 bg-gradient-to-br from-stone-50/90 to-slate-100/50 p-8 text-center dark:border-slate-700 dark:bg-slate-900/80">
          <FaBook className="mx-auto mb-3 text-4xl text-amber-400" />
          <p className="text-slate-700 dark:text-stone-200">
            No books found in this semester.
          </p>
          <p className="text-sm text-slate-500 dark:text-stone-300">
            Add books using the form above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {books.map(book => (
            <div
              key={book.id}
              className="overflow-hidden rounded-lg border border-slate-200/80 bg-white/90 shadow-md transition hover:shadow-lg dark:border-slate-700/80 dark:bg-slate-900/80"
            >
              <div className="bg-gradient-to-r from-slate-800 via-teal-700 to-amber-500 p-4 text-white">
                <h3 className="line-clamp-1 text-lg font-bold">{book.name}</h3>
                <p className="text-sm opacity-90">by {book.author}</p>
              </div>

              {book.thumbnail && (
                <div className="flex h-48 items-center justify-center overflow-hidden bg-stone-50/90 dark:bg-slate-800/80">
                  <img
                    src={book.thumbnail}
                    alt={`Cover of ${book.name}`}
                    className="h-full w-full object-contain"
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/150x200?text=No+Cover";
                    }}
                  />
                </div>
              )}

              <div className="p-4">
                {book.isbn && (
                  <p className="mb-1 text-xs text-slate-500 dark:text-stone-300">
                    <span className="font-medium">ISBN:</span> {book.isbn}
                  </p>
                )}

                {book.ion && (
                  <p className="mb-1 text-xs text-slate-500 dark:text-stone-300">
                    <span className="font-medium">ion:</span> {book.ion}
                  </p>
                )}

                {book.publicationYear && (
                  <p className="mb-2 text-xs text-slate-500 dark:text-stone-300">
                    <span className="font-medium">Published:</span>{" "}
                    {book.publicationYear}
                  </p>
                )}

                {book.description && (
                  <p className="mb-3 line-clamp-2 text-sm text-slate-600 dark:text-stone-200">
                    {book.description}
                  </p>
                )}

                <div className="flex items-center justify-between border-t border-slate-200/80 pt-3 dark:border-slate-700/80">
                  <span className="text-xs text-slate-500 dark:text-stone-300">
                    Book Record
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => on(book)}
                      className="rounded bg-amber-100 px-2 py-1 text-xs text-teal-700 transition hover:bg-amber-200"
                      title="Edit"
                    >
                      <FaPen size={14} />
                    </button>

                    <button
                      onClick={() => onDelete(book.id)}
                      className="rounded bg-red-100 px-2 py-1 text-xs text-red-700 transition hover:bg-red-200"
                      title="Delete"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ========== MAIN COMPONENT ==========
const Book = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [ingBook, setingBook] = useState<Book | null>(null);

  const [alert, setAlert] = useState<AlertMessage>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteBookTarget>(null);

  useEffect(() => {
    const f = localStorage.getItem("faculties");
    const d = localStorage.getItem("departments");
    const s = localStorage.getItem("semesters");
    const b = localStorage.getItem("books");

    if (f) setFaculties(JSON.parse(f));
    if (d) setDepartments(JSON.parse(d));
    if (s) setSemesters(JSON.parse(s));
    if (b) setBooks(JSON.parse(b));
  }, []);

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    if (!alert) return;

    const timer = window.setTimeout(() => {
      setAlert(null);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [alert]);

  const handleSave = (book: Book) => {
    setBooks(prev =>
      prev.some(b => b.id === book.id)
        ? prev.map(b => (b.id === book.id ? book : b))
        : [...prev, book]
    );

    setAlert({
      type: "success",
      title: ingBook ? "Book updated successfully" : "Book added successfully",
      message: ingBook
        ? `${book.name} has been updated successfully.`
        : `${book.name} has been added successfully.`
    });

    setingBook(null);
  };

  const handleDelete = (id: string) => {
    const book = books.find(b => b.id === id);

    if (!book) {
      setAlert({
        type: "error",
        title: "Book not found",
        message: "This book record could not be found for deletion."
      });
      return;
    }

    setDeleteTarget({
      id: book.id,
      name: book.name
    });
  };

  const confirmDeleteBook = () => {
    if (!deleteTarget) return;

    try {
      setBooks(prev => prev.filter(b => b.id !== deleteTarget.id));

      if (ingBook?.id === deleteTarget.id) {
        setingBook(null);
      }

      setAlert({
        type: "success",
        title: "Book deleted successfully",
        message: `${deleteTarget.name} has been deleted from the books list.`
      });

      setDeleteTarget(null);
    } catch {
      setAlert({
        type: "error",
        title: "Delete failed",
        message: "Book could not be deleted. Please try again."
      });

      setDeleteTarget(null);
    }
  };

  const filteredDepartments = departments.filter(
    d => d.facultyId === selectedFaculty
  );

  const filteredSemesters = semesters.filter(
    s => s.departmentId === selectedDepartment
  );

  const filteredBooks = books.filter(
    b =>
      b.facultyId === selectedFaculty &&
      b.departmentId === selectedDepartment &&
      b.semesterId === selectedSemester
  );

  return (
    <div className="container mx-auto min-h-screen px-4 py-6 dark:bg-slate-900/80">
      <header className="mb-6">
        <h1 className="flex items-center text-2xl font-bold text-slate-900 dark:text-stone-100 md:text-3xl">
          <FaBook className="mr-2 text-amber-400" />
          Library Management
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-stone-200 md:text-base">
          Add and manage books by selecting faculty, department and semester.
        </p>
      </header>

      <AlertBox alert={alert} onClose={() => setAlert(null)} />

      <DeleteBookConfirmModal
        book={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteBook}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="h-fit rounded-lg border border-slate-200/80 bg-white/90 p-4 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/80 md:p-6 lg:col-span-1">
          <div className="mb-4 rounded-lg bg-gradient-to-r from-slate-800 via-teal-700 to-amber-500 p-4 text-white">
            <h3 className="text-lg font-bold">Library Management</h3>
            <p className="text-sm text-white/85">Filter books here</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-stone-200">
                <FaUniversity className="text-amber-400" />
                Faculty
              </label>

              <select
                value={selectedFaculty}
                onChange={e => {
                  setSelectedFaculty(e.target.value);
                  setSelectedDepartment("");
                  setSelectedSemester("");
                  setingBook(null);
                }}
                className="w-full rounded-md border border-slate-200/90 px-3 py-2 text-sm shadow-sm focus:border-teal-600 focus:ring-teal-600/25 dark:border-slate-700 dark:bg-slate-800/80 dark:text-stone-100 md:text-base"
              >
                <option value="">Select Faculty</option>
                {faculties.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-stone-200">
                <FaGraduationCap className="text-amber-400" />
                Department
              </label>

              <select
                value={selectedDepartment}
                onChange={e => {
                  setSelectedDepartment(e.target.value);
                  setSelectedSemester("");
                  setingBook(null);
                }}
                disabled={!selectedFaculty}
                className="w-full rounded-md border border-slate-200/90 px-3 py-2 text-sm shadow-sm focus:border-teal-600 focus:ring-teal-600/25 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/80 dark:text-stone-100 md:text-base"
              >
                <option value="">Select Department</option>
                {filteredDepartments.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-stone-200">
                <FaCalendarAlt className="text-amber-400" />
                Semester
              </label>

              <select
                value={selectedSemester}
                onChange={e => {
                  setSelectedSemester(e.target.value);
                  setingBook(null);
                }}
                disabled={!selectedDepartment}
                className="w-full rounded-md border border-slate-200/90 px-3 py-2 text-sm shadow-sm focus:border-teal-600 focus:ring-teal-600/25 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/80 dark:text-stone-100 md:text-base"
              >
                <option value="">Select Semester</option>
                {filteredSemesters.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-3">
          {selectedSemester ? (
            <>
              <BookForm
                onSave={handleSave}
                ingBook={ingBook}
                selectedFaculty={selectedFaculty}
                selectedDepartment={selectedDepartment}
                selectedSemester={selectedSemester}
                onCancel={() => setingBook(null)}
              />

              <BookList
                books={filteredBooks}
                on={setingBook}
                onDelete={handleDelete}
              />
            </>
          ) : (
            <div className="rounded-lg border border-slate-200/80 bg-white/90 p-12 text-center shadow-md dark:border-slate-700/80 dark:bg-slate-900/80">
              <FaBook className="mx-auto mb-4 text-5xl text-amber-400" />
              <h3 className="mb-2 text-xl font-semibold text-slate-800 dark:text-stone-100">
                Select Faculty, Department and Semester
              </h3>
              <p className="text-slate-500 dark:text-stone-300">
                Please select a faculty, department and semester to view or add
                books.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Book;