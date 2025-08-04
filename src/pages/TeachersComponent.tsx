import React from "react";
import { v4 as uuid } from "uuid";

// ========== TYPES ==========
type Teacher = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  degree: string;
  research: string;
  address: string;
  age: string;
  avatarUrl?: string;
  departmentName: string;
  departmentId: string;
  facultyName: string;
};

type Department = {
  id: string;
  name: string;
  facultyId: string;
  facultyName: string;
};

type Faculty = {
  id: string;
  name: string;
};

// ========== LOCAL STORAGE HOOK ==========
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] => {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      setStoredValue(prev => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
};

// ========== TEACHER CARD COMPONENT ==========
const TeacherCard = ({ 
  teacher, 
  onEdit, 
  onDelete 
}: { 
  teacher: Teacher; 
  onEdit: (id: string) => void; 
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-4 text-white">
        <h3 className="text-lg font-bold line-clamp-1">{teacher.fullName}</h3>
        <p className="text-sm opacity-90">{teacher.degree}</p>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="flex-shrink-0 mr-3">
            <img
              src={teacher.avatarUrl || "https://via.placeholder.com/150"}
              alt={teacher.fullName}
              className="h-12 w-12 rounded-full object-cover border-2 border-white shadow"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/150";
              }}
            />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
              <span className="font-medium">Faculty:</span> {teacher.facultyName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
              <span className="font-medium">Department:</span> {teacher.departmentName}
            </p>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
            <svg className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {teacher.email}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
            <svg className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {teacher.phone}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
            <svg className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {teacher.address}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Research:</span> {teacher.research}
          </p>
        </div>
        
        <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">Age: {teacher.age}</span>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(teacher.id)}
              className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(teacher.id)}
              className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== MAIN COMPONENT ==========
const TeachersComponent = () => {
  // ========== STATE ==========
  const [teachers, setTeachers] = useLocalStorage<Teacher[]>("teachers", []);
  const [departments, setDepartments] = useLocalStorage<Department[]>("departments", []);
  const [faculties, setFaculties] = useLocalStorage<Faculty[]>("faculties", []);
  
  const [selectedFacultyId, setSelectedFacultyId] = React.useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = React.useState("");
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    degree: "",
    research: "",
    address: "",
    age: "",
    avatarUrl: ""
  });
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [isFormExpanded, setIsFormExpanded] = React.useState(false);

  // ========== DERIVED VALUES ==========
  const filteredDepartments = selectedFacultyId 
    ? departments.filter(d => d.facultyId === selectedFacultyId) 
    : [];

  const filteredTeachers = React.useMemo(() => {
    if (!selectedFacultyId) return [];
    if (selectedDepartmentId) {
      return teachers.filter(t => t.departmentId === selectedDepartmentId);
    }
    const departmentIds = departments
      .filter(d => d.facultyId === selectedFacultyId)
      .map(d => d.id);
    return teachers.filter(t => departmentIds.includes(t.departmentId));
  }, [teachers, selectedFacultyId, selectedDepartmentId, departments]);

  const selectedFaculty = faculties.find(f => f.id === selectedFacultyId);
  const selectedDepartment = departments.find(d => d.id === selectedDepartmentId);

  // ========== HANDLERS ==========
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDepartmentId || !selectedFacultyId) return;

    const department = departments.find(d => d.id === selectedDepartmentId);
    const faculty = faculties.find(f => f.id === selectedFacultyId);
    if (!department || !faculty) return;

    const teacher: Teacher = {
      id: editingId || uuid(),
      departmentId: selectedDepartmentId,
      departmentName: department.name,
      facultyName: faculty.name,
      ...formData
    };

    setTeachers(prevTeachers => 
      editingId 
        ? prevTeachers.map(t => t.id === editingId ? teacher : t)
        : [...prevTeachers, teacher]
    );

    resetForm();
  };

  const handleEdit = (id: string) => {
    const teacher = teachers.find(t => t.id === id);
    if (teacher) {
      setFormData({
        fullName: teacher.fullName,
        email: teacher.email,
        phone: teacher.phone,
        degree: teacher.degree,
        research: teacher.research,
        address: teacher.address,
        age: teacher.age,
        avatarUrl: teacher.avatarUrl || ""
      });
      setSelectedDepartmentId(teacher.departmentId);
      setSelectedFacultyId(
        departments.find(d => d.id === teacher.departmentId)?.facultyId || ""
      );
      setEditingId(teacher.id);
      setIsFormExpanded(true);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      setTeachers(prevTeachers => prevTeachers.filter(t => t.id !== id));
      if (editingId === id) {
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      degree: "",
      research: "",
      address: "",
      age: "",
      avatarUrl: ""
    });
    setEditingId(null);
    setIsFormExpanded(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ========== RENDER ==========
  return (
    <div className="container mx-auto px-4 py-6 dark:bg-gray-900 min-h-screen" onClick={()=>{setDepartments}}>
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Teachers Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm md:text-base">
          Add and manage teachers by selecting faculty and department
        </p>
      </header>

      {/* Faculty and Department Selection */}
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6" onClick={()=>{setFaculties}}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Faculty</label>
            <select
              value={selectedFacultyId}
              onChange={(e) => {
                setSelectedFacultyId(e.target.value);
                setSelectedDepartmentId("");
              }}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm md:text-base"
            >
              <option value="">Select Faculty</option>
              {faculties.map(faculty => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
            <select
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              disabled={!selectedFacultyId}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 dark:bg-gray-700 dark:text-white text-sm md:text-base"
            >
              <option value="">Select Department</option>
              {filteredDepartments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Teacher Form - Collapsible on mobile */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 border border-gray-200 dark:border-gray-700">
        <div 
          className={`p-4 md:p-6 cursor-pointer md:cursor-auto ${isFormExpanded ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
          onClick={() => setIsFormExpanded(!isFormExpanded)}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {editingId ? "Edit Teacher" : "Add New Teacher"}
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
          onSubmit={handleSubmit}
          className={`${isFormExpanded ? 'block' : 'hidden'} md:block bg-gray-50 dark:bg-gray-800 p-4 md:p-6 rounded-b-lg`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm md:text-base"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm md:text-base"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm md:text-base"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Degree</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm md:text-base"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Research Area</label>
              <input
                type="text"
                name="research"
                value={formData.research}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm md:text-base"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm md:text-base"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age</label>
              <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm md:text-base"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Avatar URL (optional)</label>
              <input
                type="text"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm md:text-base"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-1 md:px-4 md:py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm md:text-base"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!selectedDepartmentId}
              className={`px-3 py-1 md:px-4 md:py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm md:text-base ${
                !selectedDepartmentId ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {editingId ? "Update" : "Add Teacher"}
            </button>
          </div>
        </form>
      </div>

      {/* Teachers List */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">
            Teachers Directory
          </h2>
          {selectedFaculty && (
            <span className="text-sm text-gray-600 dark:text-gray-300 bg-indigo-100 dark:bg-indigo-900 px-3 py-1 rounded-full">
              {selectedFaculty.name}
              {selectedDepartment && ` / ${selectedDepartment.name}`}
            </span>
          )}
        </div>
        
        {filteredTeachers.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-400 dark:border-gray-600 p-4 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">
              {selectedFacultyId 
                ? selectedDepartmentId
                  ? "No teachers found in this department"
                  : "No teachers found in this faculty. Select a department or add teachers."
                : "Please select a faculty to view teachers."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredTeachers.map(teacher => (
              <TeacherCard 
                key={teacher.id} 
                teacher={teacher} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TeachersComponent;