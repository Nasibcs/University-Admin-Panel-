import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";

type Department = {
  id: string;
  name: string;
  establishedYear: string;
  dean: string;
  semesters: string;
  description: string;
  facultyId: string;
};

type Faculty = {
  id: string;
  name: string;
};

type Teacher = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  degree: string;
  research: string;
  departmentId: string;
};

// Custom hook for localStorage persistence
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
};

const DepartmentComponent = () => {
  // State with localStorage persistence
  const [departments, setDepartments] = useLocalStorage<Department[]>("departments", []);
  const [faculties] = useLocalStorage<Faculty[]>("faculties", []);
  const [teachersData, setTeachersData] = useLocalStorage<Teacher[]>("teachers", []);
  
  const [facultyIdForDepartment, setFacultyIdForDepartment] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [establishedYear, setEstablishedYear] = useState("");
  const [dean, setDean] = useState("");
  const [semesters, setSemesters] = useState("");
  const [description, setDescription] = useState("");
  const [editingDepartmentId, setEditingDepartmentId] = useState<string | null>(null);
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  const clearForm = () => {
    setDepartmentName("");
    setEstablishedYear("");
    setDean("");
    setSemesters("");
    setDescription("");
    setEditingDepartmentId(null);
    setIsFormExpanded(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!facultyIdForDepartment) return;

    if (editingDepartmentId) {
      const updated = departments.map((dept) =>
        dept.id === editingDepartmentId
          ? {
              ...dept,
              name: departmentName,
              establishedYear,
              dean,
              semesters,
              description,
            }
          : dept
      );
      setDepartments(updated);
    } else { 
      const newDepartment: Department = {
        id: uuid(),
        name: departmentName,
        establishedYear,
        dean,
        semesters,
        description,
        facultyId: facultyIdForDepartment,
      };
      setDepartments([...departments, newDepartment]);
    }

    clearForm();
  };

  const handleEdit = (id: string) => {
    const dept = departments.find((d) => d.id === id);
    if (dept) {
      setDepartmentName(dept.name);
      setEstablishedYear(dept.establishedYear);
      setDean(dept.dean);
      setSemesters(dept.semesters);
      setDescription(dept.description);
      setEditingDepartmentId(dept.id);
      setFacultyIdForDepartment(dept.facultyId);
      setIsFormExpanded(true);
      
      // Scroll to form
      document.getElementById("department-form")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this department?");
    if (confirmed) {
      // Delete department
      const filtered = departments.filter((d) => d.id !== id);
      setDepartments(filtered);

      // Delete teachers from this department
      const updatedTeachers = teachersData.filter((t) => t.departmentId !== id);
      setTeachersData(updatedTeachers);
    }
  };

  const filteredDepartments = facultyIdForDepartment
    ? departments.filter((d) => d.facultyId === facultyIdForDepartment)
    : [];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto dark:bg-gray-800 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 flex items-center dark:text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
        Department Management
      </h2>

      {/* Faculty Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-6 border border-gray-200 dark:border-gray-700">
        <label htmlFor="faculty-select" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
          Select Faculty
        </label>
        <select
          id="faculty-select"
          value={facultyIdForDepartment}
          onChange={(e) => {
            setFacultyIdForDepartment(e.target.value);
            setIsFormExpanded(false);
          }}
          className="block w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm md:text-base"
        >
          <option value="">Select a Faculty</option>
          {faculties.map((faculty) => (
            <option key={faculty.id} value={faculty.id}>
              {faculty.name}
            </option>
          ))}
        </select>
      </div>

      {/* Department Form - Collapsible on mobile */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 border border-gray-200 dark:border-gray-700">
        <div 
          className={`p-4 md:p-6 cursor-pointer md:cursor-auto ${isFormExpanded ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
          onClick={() => setIsFormExpanded(!isFormExpanded)}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {editingDepartmentId ? "Edit Department" : "Create New Department"}
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
          id="department-form"
          onSubmit={handleSubmit}
          className={`${isFormExpanded ? 'block' : 'hidden'} md:block bg-gray-50 dark:bg-gray-800 p-4 md:p-6 rounded-b-lg`}
        >
          <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
            <div className="sm:col-span-6 md:sm:col-span-3">
              <label htmlFor="department-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Department Name
              </label>
              <input
                type="text"
                id="department-name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                disabled={!facultyIdForDepartment}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="sm:col-span-6 md:sm:col-span-3">
              <label htmlFor="established-year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Established Year
              </label>
              <input
                type="text"
                id="established-year"
                value={establishedYear}
                onChange={(e) => setEstablishedYear(e.target.value)}
                disabled={!facultyIdForDepartment}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="sm:col-span-6 md:sm:col-span-3">
              <label htmlFor="dean" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Dean
              </label>
              <input
                type="text"
                id="dean"
                value={dean}
                onChange={(e) => setDean(e.target.value)}
                disabled={!facultyIdForDepartment}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="sm:col-span-6 md:sm:col-span-3">
              <label htmlFor="semesters" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Semesters
              </label>
              <input
                type="text"
                id="semesters"
                value={semesters}
                onChange={(e) => setSemesters(e.target.value)}
                disabled={!facultyIdForDepartment}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!facultyIdForDepartment}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            {editingDepartmentId && (
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
              disabled={!facultyIdForDepartment}
              className={`inline-flex items-center px-3 py-1 md:px-4 md:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                !facultyIdForDepartment ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {editingDepartmentId ? (
                <>
                  <svg className="-ml-1 mr-1 h-4 w-4 md:h-5 md:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <span className="hidden md:inline">Update</span>
                </>
              ) : (
                <>
                  <svg className="-ml-1 mr-1 h-4 w-4 md:h-5 md:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden md:inline">Add Department</span>
                  <span className="md:hidden">Add</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 border-b pb-2 flex items-center dark:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Departments List
        </h3>

        {facultyIdForDepartment === "" ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded mt-4">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-blue-700 dark:text-blue-300">Please select a faculty to view its departments.</p>
            </div>
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded mt-4">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-yellow-700 dark:text-yellow-300">No departments found for this faculty. Create one using the form above.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 md:mt-6">
            {filteredDepartments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 bg-indigo-700 text-white text-xs px-2 py-1 transform rotate-3 shadow-md">
                  Since {dept.establishedYear}
                </div>
                
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-3 md:p-4 text-white">
                  <h4 className="text-lg md:text-xl font-bold line-clamp-1">{dept.name} Department</h4>
                  <p className="text-xs md:text-sm opacity-90">{faculties.find(f => f.id === dept.facultyId)?.name || "Unknown Faculty"}</p>
                </div>
                
                <div className="p-3 md:p-4">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-gray-500 mr-1 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1">
                      <span className="font-medium">Dean:</span> {dept.dean}
                    </p>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-gray-500 mr-1 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1">
                      <span className="font-medium">Semesters:</span> {dept.semesters}
                    </p>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-gray-500 mr-1 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Teachers:</span> {teachersData.filter((t) => t.departmentId === dept.id).length}
                    </p>
                  </div>
                  
                  {teachersData.filter((t) => t.departmentId === dept.id).length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Key Members:</h5>
                      <div className="space-y-1">
                        {teachersData
                          .filter((t) => t.departmentId === dept.id)
                          .slice(0, 3) // Show only first 3 teachers
                          .map((teacher) => (
                            <Link
                              to={`/teacher/${teacher.id}`}
                              key={teacher.id}
                              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors dark:text-yellow-500 text-xs md:text-sm"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="line-clamp-1">{teacher.fullName}</span>
                            </Link>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 dark:bg-gray-600 p-2 md:p-3 rounded-md mb-3">
                    <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 italic line-clamp-3">
                      {dept.description}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-600 pt-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Updated: {new Date().toLocaleDateString()}
                    </div>
                    <div className="flex space-x-1 md:space-x-2">
                      <button
                        onClick={() => handleEdit(dept.id)}
                        className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(dept.id)}
                        className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      >
                        Delete
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

export default DepartmentComponent;