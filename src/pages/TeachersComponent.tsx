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

type AlertMessage = {
  type: "success" | "error";
  title: string;
  message: string;
} | null;

type DeleteTarget = {
  id: string;
  fullName: string;
} | null;

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


// ========== TOAST ALERT COMPONENT ==========
const AlertBox = ({ alert, onClose }: { alert: AlertMessage; onClose: () => void }) => {
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
            <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-stone-300">{alert.message}</p>
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


// ========== MODERN DELETE CONFIRMATION MODAL ==========
const DeleteConfirmModal = ({
  teacher,
  onCancel,
  onConfirm
}: {
  teacher: DeleteTarget;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  if (!teacher) return null;

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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              </svg>
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
            <span className="mx-1 font-bold text-slate-900 dark:text-white">{teacher.fullName}</span>
            from the teachers list?
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
              Yes, Delete Teacher
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
    <div className="bg-white/90 dark:bg-slate-900/80 rounded-lg shadow-md overflow-hidden border border-slate-200/80 dark:border-slate-700/80">
      <div className="bg-gradient-to-r from-slate-800 via-teal-700 to-amber-500 p-4 text-white">
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
            <p className="text-sm text-slate-600 dark:text-stone-200 line-clamp-1">
              <span className="font-medium">Faculty:</span> {teacher.facultyName}
            </p>
            <p className="text-sm text-slate-600 dark:text-stone-200 line-clamp-1">
              <span className="font-medium">Department:</span> {teacher.departmentName}
            </p>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <p className="text-sm text-slate-600 dark:text-stone-200 flex items-center">
            <svg className="h-4 w-4 mr-2 text-slate-500 dark:text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {teacher.email}
          </p>
          <p className="text-sm text-slate-600 dark:text-stone-200 flex items-center">
            <svg className="h-4 w-4 mr-2 text-slate-500 dark:text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {teacher.phone}
          </p>
          <p className="text-sm text-slate-600 dark:text-stone-200 flex items-center">
            <svg className="h-4 w-4 mr-2 text-slate-500 dark:text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {teacher.address}
          </p>
          <p className="text-sm text-slate-600 dark:text-stone-200">
            <span className="font-medium">Research:</span> {teacher.research}
          </p>
        </div>
        
        <div className="flex justify-between items-center border-t border-slate-200/80 dark:border-slate-700/80 pt-3">
          <span className="text-xs text-slate-500 dark:text-stone-300">Age: {teacher.age}</span>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(teacher.id)}
              className="text-xs px-2 py-1 bg-amber-100 text-teal-700 rounded hover:bg-amber-200 transition-colors"
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
  const [alert, setAlert] = React.useState<AlertMessage>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<DeleteTarget>(null);

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

  React.useEffect(() => {
    if (!alert) return;

    const timer = window.setTimeout(() => {
      setAlert(null);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [alert]);

  // ========== HANDLERS ==========
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!selectedFacultyId) {
        setAlert({
          type: "error",
          title: "Faculty is required",
          message: "Please select a faculty before adding a teacher."
        });
        return;
      }

      if (!selectedDepartmentId) {
        setAlert({
          type: "error",
          title: "Department is required",
          message: "Please select a department before adding a teacher."
        });
        return;
      }

      const department = departments.find(d => d.id === selectedDepartmentId);
      const faculty = faculties.find(f => f.id === selectedFacultyId);

      if (!department || !faculty) {
        setAlert({
          type: "error",
          title: "Invalid selection",
          message: "Selected faculty or department was not found. Please select again."
        });
        return;
      }

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

      setAlert({
        type: "success",
        title: editingId ? "Teacher updated successfully" : "Teacher added successfully",
        message: editingId
          ? `${teacher.fullName} has been updated successfully.`
          : `${teacher.fullName} has been added to ${department.name} department.`
      });

      resetForm();
    } catch (error) {
      console.error("Teacher save error:", error);
      setAlert({
        type: "error",
        title: "Something went wrong",
        message: "Teacher information could not be saved. Please try again."
      });
    }
  };

  const handleEdit = (id: string) => {
    try {
      const teacher = teachers.find(t => t.id === id);

      if (!teacher) {
        setAlert({
          type: "error",
          title: "Teacher not found",
          message: "This teacher record could not be found for editing."
        });
        return;
      }

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

      setAlert({
        type: "success",
        title: "Edit mode opened",
        message: `${teacher.fullName} is ready for editing. Update the information and save it.`
      });
    } catch (error) {
      console.error("Teacher edit error:", error);
      setAlert({
        type: "error",
        title: "Edit failed",
        message: "Teacher information could not be opened for editing. Please try again."
      });
    }
  };

  const handleDelete = (id: string) => {
    const teacher = teachers.find(t => t.id === id);

    if (!teacher) {
      setAlert({
        type: "error",
        title: "Teacher not found",
        message: "This teacher record could not be found for deletion."
      });
      return;
    }

    setDeleteTarget({
      id: teacher.id,
      fullName: teacher.fullName
    });
  };

  const confirmDeleteTeacher = () => {
    if (!deleteTarget) return;

    try {
      setTeachers(prevTeachers => prevTeachers.filter(t => t.id !== deleteTarget.id));
      if (editingId === deleteTarget.id) {
        resetForm();
      }

      setAlert({
        type: "success",
        title: "Teacher deleted successfully",
        message: `${deleteTarget.fullName} has been deleted from the teachers list.`
      });
      setDeleteTarget(null);
    } catch (error) {
      console.error("Teacher delete error:", error);
      setAlert({
        type: "error",
        title: "Delete failed",
        message: "Teacher could not be deleted. Please try again."
      });
      setDeleteTarget(null);
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
    <div className="container mx-auto px-4 py-6 dark:bg-slate-900/80 min-h-screen" onClick={()=>{setDepartments}}>
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-stone-100 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 mr-2 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Teachers Management
        </h1>
        <p className="text-slate-600 dark:text-stone-200 mt-2 text-sm md:text-base">
          Add and manage teachers by selecting faculty and department
        </p>
      </header>

      <AlertBox alert={alert} onClose={() => setAlert(null)} />
      <DeleteConfirmModal
        teacher={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteTeacher}
      />

      {/* Faculty and Department Selection */}
      <div className="bg-white/90 dark:bg-slate-900/80 p-4 md:p-6 rounded-lg shadow-sm border border-slate-200/80 dark:border-slate-700/80 mb-6" onClick={()=>{setFaculties}}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-stone-200 mb-1">Faculty</label>
            <select
              value={selectedFacultyId}
              onChange={(e) => {
                setSelectedFacultyId(e.target.value);
                setSelectedDepartmentId("");
              }}
              className="block w-full px-3 py-2 border border-slate-200/90 dark:border-slate-700 rounded-md shadow-sm focus:ring-teal-600/25 focus:border-teal-600 dark:bg-slate-800/80 dark:text-stone-100 text-sm md:text-base"
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
            <label className="block text-sm font-medium text-slate-700 dark:text-stone-200 mb-1">Department</label>
            <select
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              disabled={!selectedFacultyId}
              className="block w-full px-3 py-2 border border-slate-200/90 dark:border-slate-700 rounded-md shadow-sm focus:ring-teal-600/25 focus:border-teal-600 disabled:opacity-50 dark:bg-slate-800/80 dark:text-stone-100 text-sm md:text-base"
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
      <div className="bg-white/90 dark:bg-slate-900/80 rounded-lg shadow-md mb-6 border border-slate-200/80 dark:border-slate-700/80">
        <div 
          className={`p-4 md:p-6 cursor-pointer md:cursor-auto ${isFormExpanded ? 'border-b border-slate-200/80 dark:border-slate-700/80' : ''}`}
          onClick={() => setIsFormExpanded(!isFormExpanded)}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-slate-900 dark:text-stone-100">
              {editingId ? "Edit Teacher" : "Add New Teacher"}
            </h3>
            <button 
              className="md:hidden text-amber-400 dark:text-teal-400"
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
          className={`${isFormExpanded ? 'block' : 'hidden'} md:block bg-gradient-to-br from-stone-50/90 to-slate-100/50 dark:bg-slate-900/80 p-4 md:p-6 rounded-b-lg`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-stone-200 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200/90 dark:border-slate-700 rounded-md shadow-sm focus:ring-teal-600/25 focus:border-teal-600 dark:bg-slate-800/80 dark:text-stone-100 text-sm md:text-base"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-stone-200 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200/90 dark:border-slate-700 rounded-md shadow-sm focus:ring-teal-600/25 focus:border-teal-600 dark:bg-slate-800/80 dark:text-stone-100 text-sm md:text-base"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-stone-200 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200/90 dark:border-slate-700 rounded-md shadow-sm focus:ring-teal-600/25 focus:border-teal-600 dark:bg-slate-800/80 dark:text-stone-100 text-sm md:text-base"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-stone-200 mb-1">Degree</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200/90 dark:border-slate-700 rounded-md shadow-sm focus:ring-teal-600/25 focus:border-teal-600 dark:bg-slate-800/80 dark:text-stone-100 text-sm md:text-base"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-stone-200 mb-1">Research Area</label>
              <input
                type="text"
                name="research"
                value={formData.research}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200/90 dark:border-slate-700 rounded-md shadow-sm focus:ring-teal-600/25 focus:border-teal-600 dark:bg-slate-800/80 dark:text-stone-100 text-sm md:text-base"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-stone-200 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200/90 dark:border-slate-700 rounded-md shadow-sm focus:ring-teal-600/25 focus:border-teal-600 dark:bg-slate-800/80 dark:text-stone-100 text-sm md:text-base"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-stone-200 mb-1">Age</label>
              <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200/90 dark:border-slate-700 rounded-md shadow-sm focus:ring-teal-600/25 focus:border-teal-600 dark:bg-slate-800/80 dark:text-stone-100 text-sm md:text-base"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-stone-200 mb-1">Avatar URL (optional)</label>
              <input
                type="text"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200/90 dark:border-slate-700 rounded-md shadow-sm focus:ring-teal-600/25 focus:border-teal-600 dark:bg-slate-800/80 dark:text-stone-100 text-sm md:text-base"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-1 md:px-4 md:py-2 border border-slate-200/90 dark:border-slate-700 rounded-md text-slate-700 dark:text-stone-200 hover:bg-stone-50/90 dark:hover:bg-slate-800/80 text-sm md:text-base"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!selectedDepartmentId}
              className={`px-3 py-1 md:px-4 md:py-2 bg-teal-700 text-white rounded-md hover:bg-teal-800 text-sm md:text-base ${
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
          <h2 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-stone-100">
            Teachers Directory
          </h2>
          {selectedFaculty && (
            <span className="text-sm text-slate-600 dark:text-stone-200 bg-amber-100 dark:bg-slate-800/80 px-3 py-1 rounded-full">
              {selectedFaculty.name}
              {selectedDepartment && ` / ${selectedDepartment.name}`}
            </span>
          )}
        </div>
        
        {filteredTeachers.length === 0 ? (
          <div className="bg-gradient-to-br from-stone-50/90 to-slate-100/50 dark:bg-slate-900/80 border-l-4 border-amber-400 dark:border-slate-700 p-4 rounded-lg">
            <p className="text-slate-700 dark:text-stone-200">
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