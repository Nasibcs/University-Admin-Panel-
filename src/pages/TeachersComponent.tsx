import React from "react";
import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";
import TeacherCart from "./TeacherCart";

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
};

type Department = {
  id: string;
  name: string;
  facultyId: string;
};

type Faculty = {
  id: string;
  name: string;
};

// ========== LOCAL STORAGE HOOK ==========
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
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

// ========== ACADEMIC ICON COMPONENT ==========
const AcademicIcon = ({ 
  icon, 
  className = "" 
}: { 
  icon: "email" | "phone" | "address" | "age" | "department" | "faculty" | "edit" | "delete" | "research";
  className?: string;
}) => {
  const icons = {
    email: (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    phone: (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    address: (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    age: (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    department: (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    faculty: (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
      </svg>
    ),
    edit: (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    delete: (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    research: (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  };
  
  return icons[icon];
};

// ========== MAIN COMPONENT ==========
const TeachersComponent = () => {
  // ========== STATE ==========
   const [teachers, setTeachers] = useLocalStorage<Teacher[]>("teachers", []);
  const [departments] = useLocalStorage<Department[]>("departments", []);
  const [faculties] = useLocalStorage<Faculty[]>("faculties", []);
  
  
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

   // ========== DERIVED VALUES ==========
  const filteredDepartments = selectedFacultyId 
    ? departments.filter(d => d.facultyId === selectedFacultyId) 
    : [];

  const filteredTeachers = React.useMemo(() => {
    if (!selectedFacultyId) {
      return []; // Return empty array when no faculty is selected
    }
    if (selectedDepartmentId) {
      return teachers.filter(t => t.departmentId === selectedDepartmentId);
    }
    // When only faculty is selected
    const departmentIds = departments
      .filter(d => d.facultyId === selectedFacultyId)
      .map(d => d.id);
    return teachers.filter(t => departmentIds.includes(t.departmentId));
  }, [teachers, selectedFacultyId, selectedDepartmentId, departments]);


  // ========== HANDLERS ==========
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDepartmentId) return;

    const department = departments.find(d => d.id === selectedDepartmentId);
    if (!department) return;

    const teacher: Teacher = {
      id: editingId || uuid(),
      departmentId: selectedDepartmentId,
      departmentName: department.name,
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
      document.getElementById("teachers-form")?.scrollIntoView({ behavior: "smooth" });

    }

  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this teacher?")) {
      setTeachers(prevTeachers => prevTeachers.filter(t => t.id !== id));
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
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Memoize the TeacherForm component to prevent unnecessary re-renders
  const TeacherForm = React.useMemo(() => () => (
    <form onSubmit={handleSubmit} id="teachers-form" className="dark:bg-gray-800 bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <h3 className="dark:text-gray-300 text-lg font-medium text-gray-900 mb-4">
        {editingId ? "Edit Teacher" : "Add New Teacher"}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FacultySelect />
        <DepartmentSelect />
        
        <div>
          <label className="dark:text-gray-300 block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="dark:text-gray-300 block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="dark:text-gray-300 block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="dark:text-gray-300 block text-sm font-medium text-gray-700 mb-1">Degree</label>
          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="dark:text-gray-300 block text-sm font-medium text-gray-700 mb-1">Research Area</label>
          <input
            type="text"
            name="research"
            value={formData.research}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="dark:text-gray-300 block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="dark:text-gray-300 block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input
            type="text"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="dark:text-gray-300 block text-sm font-medium text-gray-700 mb-1">Avatar URL (optional)</label>
          <input
            type="text"
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!selectedDepartmentId}
          className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${!selectedDepartmentId ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {editingId ? "Update Teacher" : "Add Teacher"}
        </button>
      </div>
    </form>
  ), [formData, selectedFacultyId, selectedDepartmentId, editingId]);

  const FacultySelect = React.memo(() => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Faculty
      </label>
      <select
        value={selectedFacultyId}
        onChange={(e) => {
          setSelectedFacultyId(e.target.value);
          setSelectedDepartmentId("");
        }}
        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">Select Faculty</option>
        {faculties.map(faculty => (
          <option key={faculty.id} value={faculty.id}>
            {faculty.name}
          </option>
        ))}
      </select>
    </div>
  ));

  const DepartmentSelect = React.memo(() => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Department
      </label>
      <select
        value={selectedDepartmentId}
        onChange={(e) => setSelectedDepartmentId(e.target.value)}
        disabled={!selectedFacultyId}
        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
      >
        <option value="">Select Department</option>
        {filteredDepartments.map(dept => (
          <option key={dept.id} value={dept.id}>
            {dept.name}
          </option>
        ))}
      </select>
    </div>
  ));

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <AcademicIcon 
            icon="faculty" 
            className="text-indigo-600 mr-3 h-8 w-8" 
          />
          Teachers Management System
        </h1>
        <p className="text-gray-600 mt-2">
          Manage university teachers and their profiles
        </p>
      </header>

      {TeacherForm()}

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <AcademicIcon 
            icon="department" 
            className="text-indigo-500 mr-2 h-6 w-6" 
          />
          Teachers Directory
        </h2>
        
        {filteredTeachers.length === 0 ? (
          <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-lg">
            <div className="flex items-start">
              <AcademicIcon 
                icon="research" 
                className="text-gray-500 mr-2 mt-0.5" 
              />
              <p className="text-gray-700">
                {selectedDepartmentId 
                  ? "No teachers found in this department" 
                  : "No teachers found. Please add teachers or select a department."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map(teacher => (
              <TeacherCart 
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