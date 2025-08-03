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
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

const BookList = ({ books, onEdit, onDelete }: Props) => {
  return (
    <ul className="space-y-4">
      {books.map(book => (
        <li key={book.id} className="bg-white p-4 rounded shadow">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold">{book.name}</h3>
            <div className="space-x-2">
              <button onClick={() => onEdit(book)} className="bg-blue-500 text-white px-3 rounded">Edit</button>
              <button onClick={() => onDelete(book.id)} className="bg-red-500 text-white px-3 rounded">Delete</button>
            </div>
          </div>
          <p><strong>Author:</strong> {book.author}</p>
          <p>{book.description}</p>
          {book.thumbnail && <img src={book.thumbnail} alt="thumbnail" className="h-20 mt-2" />}
        </li>
      ))}
    </ul>
  );
};

export default BookList;
