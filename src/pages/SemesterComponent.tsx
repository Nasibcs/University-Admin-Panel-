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

const SemesterComponent = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isFormExpanded, setIsFormExpanded] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.year || !formData.semester || !formData.facultyId || !formData.departmentId) return;

    const updatedSemester: Semester = {
      id: editId || uuid(),
      name: formData.name,
      year: formData.year,
      semester: formData.semester,
      books: formData.books.split(",").map((b) => b.trim()),
      description: formData.description,
      facultyId: formData.facultyId,
      departmentId: formData.departmentId,
      startDate: formData.startDate,
      endDate: formData.endDate
    };

    if (editId) {
      setSemesters((prev) => prev.map((s) => (s.id === editId ? updatedSemester : s)));
      setEditId(null);
    } else {
      setSemesters([...semesters, updatedSemester]);
    }

    // Reset form
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

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this semester?")) {
      setSemesters((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const filteredDepartments = departments.filter((d) => d.facultyId === formData.facultyId);
  const filteredSemesters = semesters.filter(
    (s) => s.facultyId === formData.facultyId && s.departmentId === formData.departmentId
  );

  const filteredTeachers = teachers.filter((t) => t.departmentId === formData.departmentId);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <FaCalendarAlt className="text-2xl md:text-3xl text-blue-600" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-300">Semester Management</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Form Section - Collapsible on mobile */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div 
              className={`p-4 md:p-6 cursor-pointer lg:cursor-auto ${isFormExpanded ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
              onClick={() => setIsFormExpanded(!isFormExpanded)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2 dark:text-gray-300">
                  {editId ? (
                    <>
                      <FaEdit className="text-blue-500" />
                      <span>Edit Semester</span>
                    </>
                  ) : (
                    <>
                      <FaBook className="text-green-500" />
                      <span>Add Semester</span>
                    </>
                  )}
                </h3>
                <button 
                  className="lg:hidden text-blue-600 dark:text-blue-400"
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
              className={`${isFormExpanded ? 'block' : 'hidden'} lg:block p-4 md:p-6 space-y-4`}
            >
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="dark:text-gray-300 block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <FaUniversity className="text-blue-500" />
                    Faculty
                  </label>
                  <select
                    name="facultyId"
                    value={formData.facultyId}
                    onChange={handleInputChange}
                    className="dark:bg-gray-800 dark:text-gray-300 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
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
                  <label className="dark:text-gray-300 block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <FaGraduationCap className="text-blue-500" />
                    Department
                  </label>
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    disabled={!formData.facultyId}
                    className="dark:text-gray-300 dark:bg-gray-800 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 text-sm md:text-base"
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
                <label className="dark:text-gray-300 block text-sm font-medium text-gray-700 mb-1">Semester Name</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., First Semester"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="dark:text-gray-300 block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="e.g., 2023-2024"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="dark:text-gray-300 block text-sm font-medium text-gray-700 mb-1">Semester Type</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="dark:text-gray-300 dark:bg-gray-800 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
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
                  <label className="dark:text-gray-300 block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="dark:text-gray-300 block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="dark:text-gray-300 block text-sm font-medium text-gray-700 mb-1">Textbooks (comma separated)</label>
                <input
                  type="text"
                  name="books"
                  value={formData.books}
                  onChange={handleInputChange}
                  placeholder="e.g., Introduction to CS, Calculus I"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                />
              </div>

              <div>
                <label className="dark:text-gray-300 block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Semester objectives, notes..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="submit"
                  disabled={!formData.departmentId}
                  className={`w-full py-2 px-4 rounded-md text-white font-medium text-sm md:text-base ${
                    editId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
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
                    className="w-full py-2 px-4 rounded-md bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 text-sm md:text-base"
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
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 dark:text-gray-300 dark:bg-gray-800">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
                <FaBook className="text-blue-500" />
                <span>Semesters</span>
                <span className="ml-auto text-xs md:text-sm font-normal text-gray-500 dark:text-gray-400">
                  {filteredSemesters.length} semester(s)
                </span>
              </h3>

              {filteredSemesters.length === 0 ? (
                <div className="text-center py-6 md:py-8 text-gray-500 dark:text-gray-400">
                  <FaBook className="mx-auto text-3xl md:text-4xl text-gray-300 mb-2" />
                  <p>No semesters found for selected department.</p>
                  <p className="text-xs md:text-sm">Select a faculty and department to view semesters.</p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {filteredSemesters.map((semester) => (
                    <div 
                      key={semester.id} 
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-base md:text-lg font-bold text-blue-700 dark:text-blue-500">
                            {semester.name} ({semester.year})
                          </h4>
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {semester.semester} Semester
                            {semester.startDate && semester.endDate && (
                              <span className="ml-1 md:ml-2 text-gray-500 dark:text-gray-400">
                                ({new Date(semester.startDate).toLocaleDateString()} - {new Date(semester.endDate).toLocaleDateString()})
                              </span>
                            )}
                          </p>
                          <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                            {semester.description}
                          </p>
                          {semester.books.length > 0 && (
                            <div className="mt-1 md:mt-2">
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">TEXTBOOKS:</p>
                              <div className="flex flex-wrap gap-1">
                                {semester.books.slice(0, 3).map((book, index) => (
                                  <span 
                                    key={index} 
                                    className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded"
                                  >
                                    {book}
                                  </span>
                                ))}
                                {semester.books.length > 3 && (
                                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded">
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
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title="Edit"
                          >
                            <FaEdit className="text-sm md:text-base" />
                          </button>
                          <button
                            onClick={() => handleDelete(semester.id)}
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
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6 dark:bg-gray-800">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
                  <FaChalkboardTeacher className="text-blue-500" />
                  <span>Department Teachers</span>
                  <span className="ml-auto text-xs md:text-sm font-normal text-gray-500 dark:text-gray-400">
                    {filteredTeachers.length} teacher(s)
                  </span>
                </h3>

                {filteredTeachers.length === 0 ? (
                  <div className="text-center py-6 md:py-8 text-gray-500 dark:text-gray-400">
                    <FaChalkboardTeacher className="mx-auto text-3xl md:text-4xl text-gray-300 mb-2" />
                    <p>No teachers assigned to this department.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {filteredTeachers.map((teacher) => (
                      <Link
                        key={teacher.id}
                        to={`/teacher/${teacher.id}`}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-200 dark:hover:border-blue-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center flex-shrink-0">
                            <FaChalkboardTeacher className="text-sm md:text-base" />
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="font-medium text-gray-800 dark:text-gray-300 text-sm md:text-base truncate">
                              {teacher.fullName}
                            </h4>
                            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">View profile →</p>
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
  );
};

export default SemesterComponent;