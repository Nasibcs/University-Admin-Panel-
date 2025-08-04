import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { FaBook, FaPen, FaTrash, FaUniversity, FaGraduationCap, FaCalendarAlt, FaTimes } from "react-icons/fa";

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

interface Faculty { id: string; name: string }
interface Department { id: string; name: string; facultyId: string }
interface Semester { id: string; name: string; departmentId: string }

// ========== BOOK FORM COMPONENT ==========
interface BookFormProps {
  onSave: (book: Book) => void;
  ingBook: Book | null;
  selectedFaculty: string;
  selectedDepartment: string;
  selectedSemester: string;
  onCancel: () => void;
}

const BookForm = ({ onSave, ingBook, selectedFaculty, selectedDepartment, selectedSemester, onCancel }: BookFormProps) => {
  const [formData, setFormData] = useState<Omit<Book, 'id'>>({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 dark:text-white">
        <FaBook className="text-blue-500" />
        {ingBook ? " Book Details" : "Add New Book"}
      </h3>

      <form id="books-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Book Title *</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Introduction to Computer Science"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author *</label>
          <input
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="e.g., John Doe"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ISBN</label>
          <input
            name="isbn"
            value={formData.isbn || ""}
            onChange={handleChange}
            placeholder="e.g., 978-3-16-148410-0"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ion</label>
          <input
            name="ion"
            value={formData.ion || ""}
            onChange={handleChange}
            placeholder="e.g., 5th ion"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publication Year</label>
          <input
            name="publicationYear"
            value={formData.publicationYear || ""}
            onChange={handleChange}
            placeholder="e.g., 2022"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Image URL</label>
          <input
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            placeholder="https://example.com/book-cover.jpg"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the book..."
            rows={3}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            className={`flex-1 py-2 px-4 rounded-md text-white font-medium flex items-center justify-center gap-2 ${
              ingBook ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            <FaBook />
            {ingBook ? "Update Book" : "Add Book"}
          </button>
          
          {ingBook && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 px-4 rounded-md bg-gray-200 dark:bg-gray-600 dark:text-white text-gray-800 font-medium hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center gap-2"
            >
              <FaTimes/>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
 
// ========== BOOK LIST COMPONENT ==========
interface BookListProps {
  books: Book[];
  on: (book: Book) => void;
  onDelete: (id: string) => void;
}

const BookList = ({ books, on, onDelete}: BookListProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h3 className="text-xl font-semibold flex items-center gap-2 dark:text-white">
          <FaBook className="text-blue-500" />
          <span>Book Collection</span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
            ({books.length} book{books.length !== 1 ? 's' : ''})
          </span>
        </h3>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <FaBook className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-3" />
          <p>No books found in this semester.</p>
          <p className="text-sm">Add books using the form above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map(book => (
            <div key={book.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow dark:bg-gray-700">
              {book.thumbnail && (
                <div className="h-48 bg-gray-100 dark:bg-gray-600 overflow-hidden flex items-center justify-center">
                  <img 
                    src={book.thumbnail} 
                    alt={`Cover of ${book.name}`} 
                    className="object-contain h-full w-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x200?text=No+Cover';
                    }}
                  />
                </div>
              )}
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{book.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">by {book.author}</p>
                
                {book.isbn && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span className="font-medium">ISBN:</span> {book.isbn}
                  </p>
                )}
                
                {book.ion && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span className="font-medium">ion:</span> {book.ion}
                  </p>
                )}
                
                {book.publicationYear && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span className="font-medium">Published:</span> {book.publicationYear}
                  </p>
                )}
                
                {book.description && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">{book.description}</p>
                )}
                
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => on(book)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-600"
                    title=""
                  >
                    <FaPen size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(book.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-full hover:bg-red-50 dark:hover:bg-gray-600"
                    title="Delete"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ========== MAIN BOOK COMPONENT ==========
const Book = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [ingBook, setingBook] = useState<Book | null>(null);

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

  const handleSave = (book: Book) => {
    setBooks(prev =>
      prev.some(b => b.id === book.id)
        ? prev.map(b => (b.id === book.id ? book : b))
        : [...prev, book]
    );
    setingBook(null);
  };

  const handleDelete = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const filteredDepartments = departments.filter(d => d.facultyId === selectedFaculty);
  const filteredSemesters = semesters.filter(s => s.departmentId === selectedDepartment);
  const filteredBooks = books.filter(b => 
    b.facultyId === selectedFaculty && 
    b.departmentId === selectedDepartment && 
    b.semesterId === selectedSemester
  );

  return (
    <div className="container mx-auto p-4 md:p-6 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <FaBook className="text-3xl text-blue-600 dark:text-blue-400" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Library Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">
            Filters
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                <FaUniversity className="text-blue-500" />
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
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Faculty</option>
                {faculties.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                <FaGraduationCap className="text-blue-500" />
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={e => {
                  setSelectedDepartment(e.target.value);
                  setSelectedSemester("");
                  setingBook(null);
                }}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 dark:bg-gray-700 dark:text-white"
                disabled={!selectedFaculty}
              >
                <option value="">Select Department</option>
                {filteredDepartments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                <FaCalendarAlt className="text-blue-500" />
                Semester
              </label>
              <select
                value={selectedSemester}
                onChange={e => {
                  setSelectedSemester(e.target.value);
                  setingBook(null);
                }}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 dark:bg-gray-700 dark:text-white"
                disabled={!selectedDepartment}
              >
                <option value="">Select Semester</option>
                {filteredSemesters.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
              <FaBook className="mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">Select Faculty, Department and Semester</h3>
              <p className="text-gray-500 dark:text-gray-400">Please select a faculty, department and semester to view or add books.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Book;