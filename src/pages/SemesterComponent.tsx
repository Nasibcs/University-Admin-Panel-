import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";
import { FaBook, FaCalendarAlt, FaChalkboardTeacher, FaEdit, FaTrash, FaUniversity, FaGraduationCap } from "react-icons/fa";

type Semester = {
  id: string;
  name: string;
  year: string;
  semester: string;
  books: string[];
  description: string;
  facultyId: string;
  departmentId: string;
  startDate?: string;
  endDate?: string;
};

type Faculty = { id: string; name: string };
type Department = { id: string; name: string; facultyId: string };
type Teacher = {
  id: string;
  fullName: string;
  departmentId: string;
};

type AlertMessage = {
  type: "success" | "error";
  title: string;
  message: string;
} | null;

type DeleteTarget = {
  id: string;
  name: string;
} | null;

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
          <div className={`h-full animate-[toastProgress_4s_linear_forwards] ${isSuccess ? "bg-teal-600" : "bg-red-600"}`} />
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

const DeleteConfirmModal = ({
  semester,
  onCancel,
  onConfirm
}: {
  semester: DeleteTarget;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  if (!semester) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={onCancel} />

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
            <span className="mx-1 font-bold text-slate-900 dark:text-white">{semester.name}</span>
            from the semesters list?
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
              Yes, Delete Semester
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

const SemesterComponent = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [alert, setAlert] = useState<AlertMessage>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  const [formData, setFormData] = useState<Omit<Semester, 'id' | 'books'> & { books: string }>({
    name: "",
    year: "",
    semester: "",
    books: "",
    description: "",
    facultyId: "",
    departmentId: "",
    startDate: "",
    endDate: ""
  });

  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const savedFaculties = localStorage.getItem("faculties");
    const savedDepartments = localStorage.getItem("departments");
    const savedSemesters = localStorage.getItem("semesters");
    const savedTeachers = localStorage.getItem("teachers");

    if (savedFaculties) setFaculties(JSON.parse(savedFaculties));
    if (savedDepartments) setDepartments(JSON.parse(savedDepartments));
    if (savedSemesters) setSemesters(JSON.parse(savedSemesters));
    if (savedTeachers) setTeachers(JSON.parse(savedTeachers));
  }, []);

  useEffect(() => {
    localStorage.setItem("semesters", JSON.stringify(semesters));
  }, [semesters]);

  useEffect(() => {
    if (!alert) return;

    const timer = window.setTimeout(() => {
      setAlert(null);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [alert]);

  const showToast = (type: "success" | "error", title: string, message: string) => {
    setAlert({ type, title, message });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.year || !formData.semester || !formData.facultyId || !formData.departmentId) {
      showToast("error", "Required fields missing", "Please fill all required semester information before saving.");
      return;
    }

    try {
      const semesterName = formData.name.trim();
      const updatedSemester: Semester = {
        id: editId || uuid(),
        name: semesterName,
        year: formData.year,
        semester: formData.semester,
        books: formData.books.split(",").map((b) => b.trim()).filter(Boolean),
        description: formData.description,
        facultyId: formData.facultyId,
        departmentId: formData.departmentId,
        startDate: formData.startDate,
        endDate: formData.endDate
      };

      if (editId) {
        setSemesters((prev) => prev.map((s) => (s.id === editId ? updatedSemester : s)));
        setEditId(null);
        showToast("success", "Semester updated successfully", `${semesterName} has been updated successfully.`);
      } else {
        setSemesters((prev) => [...prev, updatedSemester]);
        showToast("success", "Semester added successfully", `${semesterName} has been added to the semester list.`);
      }

      setFormData({
        name: "",
        year: "",
        semester: "",
        books: "",
        description: "",
        facultyId: "",
        departmentId: "",
        startDate: "",
        endDate: ""
      });
      setIsFormExpanded(false);
    } catch (error) {
      console.error("Semester save error:", error);
      showToast("error", "Semester save failed", "Semester could not be saved. Please try again.");
    }
  };

  const handleEdit = (semester: Semester) => {
    setEditId(semester.id);
    setFormData({
      name: semester.name,
      year: semester.year,
      semester: semester.semester,
      books: semester.books.join(", "),
      description: semester.description,
      facultyId: semester.facultyId,
      departmentId: semester.departmentId,
      startDate: semester.startDate || "",
      endDate: semester.endDate || ""
    });
    setIsFormExpanded(true);
    document.getElementById("semesters-form")?.scrollIntoView({behavior:"smooth"});
  };

  const handleDelete = (semester: Semester) => {
    setDeleteTarget({ id: semester.id, name: semester.name });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    try {
      setSemesters((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      if (editId === deleteTarget.id) {
        setEditId(null);
        setFormData({
          name: "",
          year: "",
          semester: "",
          books: "",
          description: "",
          facultyId: "",
          departmentId: "",
          startDate: "",
          endDate: ""
        });
      }
      showToast("success", "Semester deleted successfully", `${deleteTarget.name} has been deleted from the semester list.`);
    } catch (error) {
      console.error("Semester delete error:", error);
      showToast("error", "Semester delete failed", "Semester could not be deleted. Please try again.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredDepartments = departments.filter((d) => d.facultyId === formData.facultyId);
  const filteredSemesters = semesters.filter(
    (s) => s.facultyId === formData.facultyId && s.departmentId === formData.departmentId
  );

  const filteredTeachers = teachers.filter((t) => t.departmentId === formData.departmentId);

  return (
    <>
      <AlertBox alert={alert} onClose={() => setAlert(null)} />
      <DeleteConfirmModal
        semester={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

    <div className="p-4 md:p-6 bg-stone-50 min-h-screen dark:bg-slate-900/80">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <FaCalendarAlt className="text-2xl md:text-3xl text-amber-400" />
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-stone-100">Semester Management</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Form Section - Collapsible on mobile */}
          <div className="lg:col-span-1 bg-white/90 rounded-lg shadow-md border border-slate-200/80 dark:border-slate-700/80 dark:bg-slate-900/80">
            <div 
              className={`p-4 md:p-6 cursor-pointer lg:cursor-auto ${isFormExpanded ? 'border-b border-slate-200/80 dark:border-slate-700/80' : ''}`}
              onClick={() => setIsFormExpanded(!isFormExpanded)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-stone-100">
                  {editId ? (
                    <>
                      <FaEdit className="text-amber-400" />
                      <span>Edit Semester</span>
                    </>
                  ) : (
                    <>
                      <FaBook className="text-teal-700 dark:text-teal-400" />
                      <span>Add Semester</span>
                    </>
                  )}
                </h3>
                <button 
                  className="lg:hidden text-amber-400 dark:text-teal-400"
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
              id="semesters-form" 
              className={`${isFormExpanded ? 'block' : 'hidden'} lg:block bg-gradient-to-br from-stone-50/90 to-slate-100/50 dark:bg-slate-900/80 p-4 md:p-6 space-y-4 rounded-b-lg`}
            >
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="dark:text-stone-200 block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                    <FaUniversity className="text-amber-400" />
                    Faculty
                  </label>
                  <select
                    name="facultyId"
                    value={formData.facultyId}
                    onChange={handleInputChange}
                    className="dark:bg-slate-800/80 dark:text-stone-100 w-full border border-slate-200/90 dark:border-slate-700 rounded-md px-3 py-2 shadow-sm focus:ring-teal-600/25 focus:border-teal-600 text-sm md:text-base"
                  >
                    <option value="">Select Faculty</option>
                    {faculties.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="dark:text-stone-200 block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                    <FaGraduationCap className="text-amber-400" />
                    Department
                  </label>
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    disabled={!formData.facultyId}
                    className="dark:text-stone-100 dark:bg-slate-800/80 w-full border border-slate-200/90 dark:border-slate-700 rounded-md px-3 py-2 shadow-sm focus:ring-teal-600/25 focus:border-teal-600 disabled:opacity-50 text-sm md:text-base"
                  >
                    <option value="">Select Department</option>
                    {filteredDepartments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="dark:text-stone-200 block text-sm font-medium text-slate-700 mb-1">Semester Name</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., First Semester"
                  className="w-full border border-slate-200/90 dark:border-slate-700 rounded-md px-3 py-2 shadow-sm focus:ring-teal-600/25 focus:border-teal-600 dark:bg-slate-800/80 dark:text-stone-100 text-sm md:text-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="dark:text-stone-200 block text-sm font-medium text-slate-700 mb-1">Academic Year</label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="e.g., 2023-2024"
                    className="w-full border border-slate-200/90 dark:border-slate-700 rounded-md px-3 py-2 shadow-sm focus:ring-teal-600/25 focus:border-teal-600 dark:bg-slate-800/80 dark:text-stone-100 text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="dark:text-stone-200 block text-sm font-medium text-slate-700 mb-1">Semester Type</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="dark:text-stone-100 dark:bg-slate-800/80 w-full border border-slate-200/90 dark:border-slate-700 rounded-md px-3 py-2 shadow-sm focus:ring-teal-600/25 focus:border-teal-600 text-sm md:text-base"
                  >
                    <option value="">Select</option>
                    <option value="Fall">Fall</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                    <option value="Winter">Winter</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="dark:text-stone-200 block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200/90 dark:border-slate-700 rounded-md px-3 py-2 shadow-sm focus:ring-teal-600/25 focus:border-teal-600 dark:bg-slate-800/80 dark:text-stone-100 text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="dark:text-stone-200 block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200/90 dark:border-slate-700 rounded-md px-3 py-2 shadow-sm focus:ring-teal-600/25 focus:border-teal-600 dark:bg-slate-800/80 dark:text-stone-100 text-sm md:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="dark:text-stone-200 block text-sm font-medium text-slate-700 mb-1">Textbooks (comma separated)</label>
                <input
                  type="text"
                  name="books"
                  value={formData.books}
                  onChange={handleInputChange}
                  placeholder="e.g., Introduction to CS, Calculus I"
                  className="w-full border border-slate-200/90 dark:border-slate-700 rounded-md px-3 py-2 shadow-sm focus:ring-teal-600/25 focus:border-teal-600 dark:bg-slate-800/80 dark:text-stone-100 text-sm md:text-base"
                />
              </div>

              <div>
                <label className="dark:text-stone-200 block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Semester objectives, notes..."
                  rows={3}
                  className="w-full border border-slate-200/90 dark:border-slate-700 rounded-md px-3 py-2 shadow-sm focus:ring-teal-600/25 focus:border-teal-600 dark:bg-slate-800/80 dark:text-stone-100 text-sm md:text-base"
                />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="submit"
                  disabled={!formData.departmentId}
                  className={`w-full py-2 px-4 rounded-md text-white font-medium text-sm md:text-base transition-colors ${
                    editId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-teal-700 hover:bg-teal-800'
                  } disabled:opacity-50`}
                >
                  {editId ? 'Update Semester' : 'Add Semester'}
                </button>

                {editId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(null);
                      setFormData({
                        name: "",
                        year: "",
                        semester: "",
                        books: "",
                        description: "",
                        facultyId: "",
                        departmentId: "",
                        startDate: "",
                        endDate: ""
                      });
                      setIsFormExpanded(false);
                    }}
                    className="w-full py-2 px-4 rounded-md border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-stone-200 font-medium hover:bg-stone-50/90 dark:hover:bg-slate-800/80 text-sm md:text-base"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Semesters List */}
            <div className="bg-white/90 rounded-lg shadow-md p-4 md:p-6 border border-slate-200/80 dark:text-stone-100 dark:bg-slate-900/80 dark:border-slate-700/80">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2 text-slate-900 dark:text-stone-100">
                <FaBook className="text-amber-400" />
                <span>Semesters</span>
                <span className="ml-auto text-xs md:text-sm font-normal text-slate-500 dark:text-stone-300">
                  {filteredSemesters.length} semester(s)
                </span>
              </h3>

              {filteredSemesters.length === 0 ? (
                <div className="text-center py-6 md:py-8 text-slate-500 dark:text-stone-300">
                  <FaBook className="mx-auto text-3xl md:text-4xl text-amber-300 mb-2" />
                  <p>No semesters found for selected department.</p>
                  <p className="text-xs md:text-sm">Select a faculty and department to view semesters.</p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {filteredSemesters.map((semester) => (
                    <div 
                      key={semester.id} 
                      className="border border-slate-200/80 dark:border-slate-700/80 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-stone-50/90 to-slate-100/50 dark:bg-slate-900/80"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-base md:text-lg font-bold text-teal-700 dark:text-teal-400">
                            {semester.name} ({semester.year})
                          </h4>
                          <p className="text-xs md:text-sm text-slate-600 dark:text-stone-300 mb-1">
                            {semester.semester} Semester
                            {semester.startDate && semester.endDate && (
                              <span className="ml-1 md:ml-2 text-slate-500 dark:text-stone-300">
                                ({new Date(semester.startDate).toLocaleDateString()} - {new Date(semester.endDate).toLocaleDateString()})
                              </span>
                            )}
                          </p>
                          <p className="text-xs md:text-sm text-slate-700 dark:text-stone-200 mb-2 line-clamp-2">
                            {semester.description}
                          </p>
                          {semester.books.length > 0 && (
                            <div className="mt-1 md:mt-2">
                              <p className="text-xs font-medium text-slate-500 dark:text-stone-300 mb-1">TEXTBOOKS:</p>
                              <div className="flex flex-wrap gap-1">
                                {semester.books.slice(0, 3).map((book, index) => (
                                  <span 
                                    key={index} 
                                    className="bg-amber-100 dark:bg-slate-800/80 text-teal-700 dark:text-stone-200 text-xs px-2 py-1 rounded"
                                  >
                                    {book}
                                  </span>
                                ))}
                                {semester.books.length > 3 && (
                                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-stone-300 text-xs px-2 py-1 rounded">
                                    +{semester.books.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1 md:gap-2 ml-2">
                          <button
                            onClick={() => handleEdit(semester)}
                            className="text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 p-1 rounded-full hover:bg-amber-100 dark:hover:bg-slate-800/80"
                            title="Edit"
                          >
                            <FaEdit className="text-sm md:text-base" />
                          </button>
                          <button
                            onClick={() => handleDelete(semester)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Delete"
                          >
                            <FaTrash className="text-sm md:text-base" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Teachers List */}
            {formData.departmentId && (
              <div className="bg-white/90 rounded-lg shadow-md p-4 md:p-6 border border-slate-200/80 dark:bg-slate-900/80 dark:border-slate-700/80">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2 text-slate-900 dark:text-stone-100">
                  <FaChalkboardTeacher className="text-amber-400" />
                  <span>Department Teachers</span>
                  <span className="ml-auto text-xs md:text-sm font-normal text-slate-500 dark:text-stone-300">
                    {filteredTeachers.length} teacher(s)
                  </span>
                </h3>

                {filteredTeachers.length === 0 ? (
                  <div className="text-center py-6 md:py-8 text-slate-500 dark:text-stone-300">
                    <FaChalkboardTeacher className="mx-auto text-3xl md:text-4xl text-amber-300 mb-2" />
                    <p>No teachers assigned to this department.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {filteredTeachers.map((teacher) => (
                      <Link
                        key={teacher.id}
                        to={`/teacher/${teacher.id}`}
                        className="border border-slate-200/80 dark:border-slate-700/80 rounded-lg p-3 hover:bg-amber-100/70 dark:hover:bg-slate-800/80 hover:border-amber-300 dark:hover:border-teal-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="bg-amber-100 dark:bg-slate-800/80 text-teal-700 dark:text-teal-400 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center flex-shrink-0">
                            <FaChalkboardTeacher className="text-sm md:text-base" />
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="font-medium text-slate-800 dark:text-stone-100 text-sm md:text-base truncate">
                              {teacher.fullName}
                            </h4>
                            <p className="text-xs md:text-sm text-slate-500 dark:text-stone-300">View profile -&gt;</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SemesterComponent;
