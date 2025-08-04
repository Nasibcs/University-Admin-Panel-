import React from "react";
import { v4 as uuid } from "uuid";
import { TeacherCart } from "./TeacherCart";

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
    if (!selectedFacultyId) return [];
    if (selectedDepartmentId) {
      return teachers.filter(t => t.departmentId === selectedDepartmentId);
    }
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

    setTeachers((prevTeachers: Teacher[]) => 
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
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this teacher?")) {
      setTeachers((prevTeachers: Teacher[]) => prevTeachers.filter(t => t.id !== id));
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

  // ========== RENDER ==========
  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teachers Management System</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage university teachers and their profiles
        </p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {editingId ? "Edit Teacher" : "Add New Teacher"}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Faculty</label>
            <select
              value={selectedFacultyId}
              onChange={(e) => {
                setSelectedFacultyId(e.target.value);
                setSelectedDepartmentId("");
              }}
              className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Faculty</option>
              {faculties.map(faculty => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
            <select
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              disabled={!selectedFacultyId}
              className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Department</option>
              {filteredDepartments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
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

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Teachers Directory</h2>
        
        {filteredTeachers.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-400 dark:border-gray-600 p-4 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">
              {selectedDepartmentId 
                ? "No teachers found in this department" 
                : "No teachers found. Please add teachers or select a department."}
            </p>
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