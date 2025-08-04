import { useState } from "react";
import { v4 as uuid } from "uuid";

type Faculty = {
  id: string;
  name: string;
  dean: string;
  establishedYear: string;
  description: string;
  logo: string;
};

// Custom hook for localStorage persistence with explicit return type
const useLocalStorage = <T extends unknown>(
  key: string, 
  initialValue: T
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === "undefined") return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
};

const FacultyPage = () => {
  // State with localStorage persistence
  const [faculties, setFaculties] = useLocalStorage<Faculty[]>("faculties", []);
  
  // Form states
  const [name, setName] = useState("");
  const [dean, setDean] = useState("");
  const [establishedYear, setEstablishedYear] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  const clearForm = () => {
    setName("");
    setDean("");
    setEstablishedYear("");
    setDescription("");
    setLogo("");
    setEditId(null);
    setIsFormExpanded(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!name.trim() || !dean || !establishedYear || !description || !logo) {
      setError("All fields are required!");
      return;
    }

    // Check for duplicate faculty (case-insensitive)
    const isDuplicate = faculties.some(
      (f) =>
        f.name.toLowerCase() === name.trim().toLowerCase() && f.id !== editId
    );

    if (isDuplicate) {
      setError("This faculty already exists!");
      return;
    }

    // Create or update faculty
    const newFaculty: Faculty = {
      id: editId ?? uuid(),
      name: name.trim(),
      dean,
      establishedYear,
      description,
      logo,
    };

    if (editId) {
      // Update existing faculty - now properly typed
      setFaculties(faculties.map((f) => (f.id === editId ? newFaculty : f)));
    } else {
      // Add new faculty
      setFaculties([...faculties, newFaculty]);
    }

    clearForm();
  };

  const handleEdit = (id: string) => {
    const faculty = faculties.find((f) => f.id === id);
    if (faculty) {
      setName(faculty.name);
      setDean(faculty.dean);
      setEstablishedYear(faculty.establishedYear);
      setDescription(faculty.description);
      setLogo(faculty.logo);
      setEditId(faculty.id);
      setIsFormExpanded(true);
      
      // Scroll to form
      document.getElementById("faculty-form")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this faculty?");
    if (confirmed) {
      // Delete faculty
      setFaculties(faculties.filter((f) => f.id !== id));

      // Also delete related departments
      const storedDepartments = JSON.parse(localStorage.getItem("departments") || "[]");
      const filteredDepartments = storedDepartments.filter((d: any) => d.facultyId !== id);
      localStorage.setItem("departments", JSON.stringify(filteredDepartments));

      // Also delete related teachers
      const storedTeachers = JSON.parse(localStorage.getItem("teachers") || "[]");
      const filteredTeachers = storedTeachers.filter((t: any) => t.facultyId !== id);
      localStorage.setItem("teachers", JSON.stringify(filteredTeachers));

      // Clear form if needed
      if (editId === id) {
        clearForm();
      }
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto dark:bg-gray-800 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 flex items-center dark:text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
        Faculty Management
      </h2>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 md:mb-6 rounded">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Faculty Form - Collapsible on mobile */}
      <div className="bg-white rounded-lg shadow-md mb-6 md:mb-8 dark:bg-gray-800">
        <div 
          className={`p-4 md:p-6 cursor-pointer md:cursor-auto ${isFormExpanded ? 'border-b border-gray-200' : ''}`}
          onClick={() => setIsFormExpanded(!isFormExpanded)}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-300">
              {editId ? "Edit Faculty" : "Create New Faculty"}
            </h3>
            <button 
              className="md:hidden text-indigo-600 dark:text-indigo-400"
              onClick={(e) => {
                e.stopPropagation();
                setIsFormExpanded(!isFormExpanded);
              }}
            >
              {isFormExpanded ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <form
          id="faculty-form"
          onSubmit={handleSubmit}
          className={`${isFormExpanded ? 'block' : 'hidden'} md:block bg-gray-50 p-4 md:p-6 rounded-b-lg border border-gray-200 dark:bg-gray-800`}
        >
          <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
            <div className="sm:col-span-6 md:sm:col-span-3">
              <label htmlFor="faculty-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Faculty Name 
              </label>
              <input
                type="text"
                id="faculty-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="sm:col-span-6 md:sm:col-span-3">
              <label htmlFor="dean" className="dark:text-gray-300 block text-sm font-medium text-gray-700">
                Dean 
              </label>
              <input
                type="text"
                id="dean"
                value={dean}
                onChange={(e) => setDean(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="sm:col-span-6 md:sm:col-span-3">
              <label htmlFor="established-year" className="dark:text-gray-300 block text-sm font-medium text-gray-700">
                Established Year 
              </label>
              <input
                type="text"
                id="established-year"
                value={establishedYear}
                onChange={(e) => setEstablishedYear(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="sm:col-span-6 md:sm:col-span-3">
              <label htmlFor="logo" className="dark:text-gray-300 block text-sm font-medium text-gray-700">
                Logo URL 
              </label>
              <input
                type="text"
                id="logo"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="dark:text-gray-300 block text-sm font-medium text-gray-700">
                Description 
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            {editId && (
              <button
                type="button"
                onClick={clearForm}
                className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-600"
            >
              {editId ? (
                <>
                  <svg className="-ml-1 mr-1 h-4 w-4 md:h-5 md:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <span className="hidden md:inline">Update</span>
                </>
              ) : (
                <>
                  <svg className="-ml-1 mr-1 h-4 w-4 md:h-5 md:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden md:inline">Add Faculty</span>
                  <span className="md:hidden">Add</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Faculties List */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 dark:bg-gray-800">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b pb-2 flex items-center dark:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 mr-2 dark:text-indigo-500 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          List of Faculties
        </h3>

        {faculties.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mt-4">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-yellow-700">No faculties found. Create one using the form above.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 md:mt-6">
            {faculties.map((faculty) => (
              <div
                key={faculty.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative dark:bg-gray-700"
              >
                <div className="absolute top-0 right-0 bg-indigo-700 text-white text-xs px-2 py-1 transform rotate-3 shadow-md">
                  Since {faculty.establishedYear}
                </div>
                
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-3 md:p-4 text-white">
                  <h4 className="text-lg md:text-xl font-bold dark:text-gray-100 line-clamp-1">{faculty.name}</h4>
                </div>
                
                <div className="p-3 md:p-4 dark:bg-gray-700">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="dark:text-gray-100 h-4 w-4 md:h-5 md:w-5 text-gray-500 mr-1 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-100 line-clamp-1">
                      <span className="font-medium">Dean:</span> {faculty.dean}
                    </p>
                  </div>
                  
                  {faculty.logo && (
                    <div className="flex justify-center mb-3">
                      <img
                        src={faculty.logo}
                        alt={`${faculty.name} logo`}
                        className="h-16 w-16 md:h-24 md:w-24 rounded-full object-cover border-4 border-gray-200 shadow-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/100";
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="bg-gray-50 p-2 md:p-3 rounded-md mb-3 dark:bg-gray-600">
                    <p className="text-xs md:text-sm text-gray-700 italic dark:text-yellow-400 line-clamp-3">
                      {faculty.description}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                    <div className="text-xs text-gray-500 dark:text-gray-200">
                      Updated: {new Date().toLocaleDateString()}
                    </div>
                    <div className="flex space-x-1 md:space-x-2">
                      <button
                        onClick={() => handleEdit(faculty.id)}
                        className="flex items-center px-2 py-0.5 md:px-3 md:py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors text-xs md:text-sm font-medium"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="hidden md:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(faculty.id)}
                        className="flex items-center px-2 py-0.5 md:px-3 md:py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-xs md:text-sm font-medium"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="hidden md:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyPage;