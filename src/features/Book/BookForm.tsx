import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";

interface Book {
  id: string;
  name: string;
  author: string;
  description: string;
  thumbnail: string;
  facultyId: string;
  departmentId: string;
  semesterId: string;
}

interface Props {
  onSave: (book: Book) => void;
  editingBook: Book | null;
  selectedFaculty: string;
  selectedDepartment: string;
  selectedSemester: string;
  onCancelEdit: () => void;
}

const BookForm = ({ onSave, editingBook, selectedFaculty, selectedDepartment, selectedSemester, onCancelEdit }: Props) => {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  useEffect(() => {
    if (editingBook) {
      setName(editingBook.name);
      setAuthor(editingBook.author);
      setDescription(editingBook.description);
      setThumbnail(editingBook.thumbnail);
    } else {
      setName(""); setAuthor(""); setDescription(""); setThumbnail("");
    }
  }, [editingBook]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !author || !description || !thumbnail) return;

    const book: Book = {
      id: editingBook?.id ?? uuid(),
      name,
      author,
      description,
      thumbnail,
      facultyId: selectedFaculty,
      departmentId: selectedDepartment,
      semesterId: selectedSemester,
    };

    onSave(book);
    setName(""); setAuthor(""); setDescription(""); setThumbnail("");
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Book Name" className="border px-3 py-2 rounded" />
      <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author" className="border px-3 py-2 rounded" />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="border px-3 py-2 rounded md:col-span-2" />
      <input value={thumbnail} onChange={e => setThumbnail(e.target.value)} placeholder="Thumbnail URL" className="border px-3 py-2 rounded md:col-span-2" />

      <div className="flex gap-4 md:col-span-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingBook ? "Update Book" : "Add Book"}
        </button>
        {editingBook && (
          <button type="button" onClick={onCancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default BookForm;
