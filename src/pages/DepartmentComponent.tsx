import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Department = {
  id: string;
  name: string;
  establishedYear: string;
  dean: string;
  semesters: string;
  description: string;
  facultyId: string;
  facultyName?: string;
  logo: string;
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

const API_ORIGIN =
  typeof import.meta.env.VITE_API_URL === "string" && import.meta.env.VITE_API_URL.length > 0
    ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
    : "http://localhost:8081";

const DEPARTMENT_LOCAL_CACHE_KEY = "departments";
const FACULTY_LOCAL_CACHE_KEY = "faculties";
const MAX_LOGO_BYTES = 3 * 1024 * 1024;
const LOGO_ACCEPT = "image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp";

function syncLocalCache<T>(key: string, list: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    /* quota / private mode */
  }
}

function readLocalCache<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return fallback;
  }
}

async function parseApiError(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const j = JSON.parse(text) as { message?: string; errors?: Record<string, string> };
    if (j.message && j.errors && Object.keys(j.errors).length > 0) {
      const parts = Object.entries(j.errors).map(([k, v]) => `${k}: ${v}`);
      return `${j.message} - ${parts.join(" / ")}`;
    }
    if (j.message) return j.message;
  } catch {
    /* plain text body */
  }
  return text.trim() || `HTTP ${res.status}`;
}

function validateLogoFile(file: File): string | null {
  const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowed.includes(file.type)) {
    return "Please choose a JPEG, PNG, GIF, or WebP image.";
  }
  if (file.size > MAX_LOGO_BYTES) {
    return `Image must be 3 MB or smaller (currently ${Math.round(file.size / 1024)} KB).`;
  }
  return null;
}

async function uploadDepartmentLogoToServer(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_ORIGIN}/api/uploads/department-logo`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await parseApiError(res));
  const data = (await res.json()) as { logoUrl: string };
  if (!data.logoUrl) throw new Error("Invalid upload response.");
  return data.logoUrl;
}

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
  const [departments, setDepartments] = useState<Department[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [teachersData, setTeachersData] = useLocalStorage<Teacher[]>("teachers", []);

  const [facultyIdForDepartment, setFacultyIdForDepartment] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [establishedYear, setEstablishedYear] = useState("");
  const [dean, setDean] = useState("");
  const [semesters, setSemesters] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);
  const [blobPreviewUrl, setBlobPreviewUrl] = useState<string | null>(null);
  const [editingDepartmentId, setEditingDepartmentId] = useState<string | null>(null);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadFaculties = useCallback(async () => {
    try {
      const res = await fetch(`${API_ORIGIN}/api/faculties`);
      if (!res.ok) throw new Error(await parseApiError(res));
      const list = (await res.json()) as Faculty[];
      setFaculties(list);
      syncLocalCache(FACULTY_LOCAL_CACHE_KEY, list);
    } catch (error) {
      console.error("Faculty API error:", error);
      setFaculties(readLocalCache<Faculty[]>(FACULTY_LOCAL_CACHE_KEY, []));
    }
  }, []);

  const loadDepartments = useCallback(async () => {
    try {
      const res = await fetch(`${API_ORIGIN}/api/departments`);
      if (!res.ok) throw new Error(await parseApiError(res));
      const list = (await res.json()) as Department[];
      setDepartments(list);
      syncLocalCache(DEPARTMENT_LOCAL_CACHE_KEY, list);
    } catch (error) {
      console.warn("Department API unavailable. Using local cache.", error);
      setDepartments(readLocalCache<Department[]>(DEPARTMENT_LOCAL_CACHE_KEY, []));
    }
  }, []);

  useEffect(() => {
    let active = true;
    setListLoading(true);

    Promise.all([loadFaculties(), loadDepartments()])
      .finally(() => {
        if (active) setListLoading(false);
      });

    return () => {
      active = false;
    };
  }, [loadFaculties, loadDepartments]);

  useEffect(() => {
    return () => {
      if (blobPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(blobPreviewUrl);
    };
  }, [blobPreviewUrl]);

  const clearForm = () => {
    setDepartmentName("");
    setEstablishedYear("");
    setDean("");
    setSemesters("");
    setDescription("");
    setLogo("");
    setBlobPreviewUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });
    setPendingLogoFile(null);
    setEditingDepartmentId(null);
    setIsFormExpanded(false);
    setIsSubmitting(false);
  };

  const onPickLogoFiles = (list: FileList | null) => {
    const file = list?.[0];
    if (!file) return;
    const message = validateLogoFile(file);
    if (message) {
      console.error("Department logo validation error:", message);
      return;
    }
    setBlobPreviewUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setPendingLogoFile(file);
  };

  const saveDepartmentsLocally = (nextDepartments: Department[]) => {
    setDepartments(nextDepartments);
    syncLocalCache(DEPARTMENT_LOCAL_CACHE_KEY, nextDepartments);
  };

  const deleteDepartmentFromLocalCache = (id: string) => {
    saveDepartmentsLocally(departments.filter((dept) => dept.id !== id));
    setTeachersData(teachersData.filter((teacher) => teacher.departmentId !== id));
    if (editingDepartmentId === id) clearForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyIdForDepartment) return;

    setIsSubmitting(true);

    const payload = {
      name: departmentName.trim(),
      establishedYear: establishedYear.trim(),
      dean: dean.trim(),
      semesters: semesters.trim(),
      description: description.trim(),
      facultyId: facultyIdForDepartment,
      logo,
    };

    try {
      const finalLogo = pendingLogoFile ? await uploadDepartmentLogoToServer(pendingLogoFile) : logo;
      if (!finalLogo) {
        throw new Error("Please choose a department logo.");
      }

      const res = await fetch(
        editingDepartmentId
          ? `${API_ORIGIN}/api/departments/${editingDepartmentId}`
          : `${API_ORIGIN}/api/departments`,
        {
          method: editingDepartmentId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, logo: finalLogo }),
        },
      );

      if (!res.ok) {
        throw new Error(await parseApiError(res));
      }
      await loadDepartments();
      clearForm();
    } catch (error) {
      console.error("Department save error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (id: string) => {
    const dept = departments.find((d) => d.id === id);
    if (dept) {
      setDepartmentName(dept.name);
      setEstablishedYear(dept.establishedYear);
      setDean(dept.dean);
      setSemesters(dept.semesters);
      setDescription(dept.description);
      setLogo(dept.logo || "");
      setBlobPreviewUrl((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return null;
      });
      setPendingLogoFile(null);
      setEditingDepartmentId(dept.id);
      setFacultyIdForDepartment(dept.facultyId);
      setIsFormExpanded(true);
      document.getElementById("department-form")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this department?");
    if (!confirmed) return;

    setDeletingId(id);

    try {
      const res = await fetch(`${API_ORIGIN}/api/departments/${id}`, { method: "DELETE" });
      if (res.status === 404) {
        deleteDepartmentFromLocalCache(id);
        return;
      }
      if (!res.ok) throw new Error(await parseApiError(res));

      deleteDepartmentFromLocalCache(id);
      await loadDepartments();
    } catch (error) {
      console.error("Department delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredDepartments = facultyIdForDepartment
    ? departments.filter((d) => d.facultyId === facultyIdForDepartment)
    : [];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto dark:bg-slate-900/80 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-slate-900 flex items-center dark:text-stone-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 mr-2 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
        Department Management
      </h2>

      <div className="bg-white/90 dark:bg-slate-900/80 rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-6 border border-slate-200/80 dark:border-slate-700/80">
        <label htmlFor="faculty-select" className="block text-sm font-medium text-slate-700 mb-2 dark:text-stone-200">
          Select Faculty
        </label>
        <select
          id="faculty-select"
          value={facultyIdForDepartment}
          onChange={(e) => {
            setFacultyIdForDepartment(e.target.value);
            setIsFormExpanded(false);
          }}
          className="block w-full px-3 py-2 md:px-4 md:py-2 border border-slate-200/90 dark:border-slate-700 rounded-md shadow-sm focus:ring-teal-600/25 focus:border-teal-600 dark:bg-slate-800/80 dark:text-stone-100 text-sm md:text-base"
        >
          <option value="">Select a Faculty</option>
          {faculties.map((faculty) => (
            <option key={faculty.id} value={faculty.id}>
              {faculty.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white/90 dark:bg-slate-900/80 rounded-lg shadow-md mb-6 border border-slate-200/80 dark:border-slate-700/80">
        <div
          className={`p-4 md:p-6 cursor-pointer md:cursor-auto ${isFormExpanded ? "border-b border-slate-200/80 dark:border-slate-700/80" : ""}`}
          onClick={() => setIsFormExpanded(!isFormExpanded)}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-slate-800 dark:text-stone-100">
              {editingDepartmentId ? "Edit Department" : "Create New Department"}
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
          id="department-form"
          onSubmit={handleSubmit}
          className={`${isFormExpanded ? "block" : "hidden"} md:block bg-gradient-to-br from-stone-50/90 to-slate-100/50 dark:bg-slate-900/80 p-4 md:p-6 rounded-b-lg`}
        >
          <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
            <div className="sm:col-span-6 md:sm:col-span-3">
              <label htmlFor="department-name" className="block text-sm font-medium text-slate-700 dark:text-stone-200">
                Department Name
              </label>
              <input
                type="text"
                id="department-name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                disabled={!facultyIdForDepartment || isSubmitting}
                className="mt-1 block w-full px-3 py-2 border border-slate-200/90 rounded-md shadow-sm focus:ring-teal-600/25 focus:border-teal-600 dark:bg-slate-800/80 dark:text-stone-100"
                required
              />
            </div>

            <div className="sm:col-span-6 md:sm:col-span-3">
              <label htmlFor="established-year" className="block text-sm font-medium text-slate-700 dark:text-stone-200">
                Established Year
              </label>
              <input
                type="text"
                id="established-year"
                value={establishedYear}
                onChange={(e) => setEstablishedYear(e.target.value)}
                disabled={!facultyIdForDepartment || isSubmitting}
                className="mt-1 block w-full px-3 py-2 border border-slate-200/90 rounded-md shadow-sm focus:ring-teal-600/25 focus:border-teal-600 dark:bg-slate-800/80 dark:text-stone-100"
                required
              />
            </div>

            <div className="sm:col-span-6 md:sm:col-span-3">
              <label htmlFor="dean" className="block text-sm font-medium text-slate-700 dark:text-stone-200">
                Dean
              </label>
              <input
                type="text"
                id="dean"
                value={dean}
                onChange={(e) => setDean(e.target.value)}
                disabled={!facultyIdForDepartment || isSubmitting}
                className="mt-1 block w-full px-3 py-2 border border-slate-200/90 rounded-md shadow-sm focus:ring-teal-600/25 focus:border-teal-600 dark:bg-slate-800/80 dark:text-stone-100"
                required
              />
            </div>

            <div className="sm:col-span-6 md:sm:col-span-3">
              <label htmlFor="semesters" className="block text-sm font-medium text-slate-700 dark:text-stone-200">
                Semesters
              </label>
              <input
                type="text"
                id="semesters"
                value={semesters}
                onChange={(e) => setSemesters(e.target.value)}
                disabled={!facultyIdForDepartment || isSubmitting}
                className="mt-1 block w-full px-3 py-2 border border-slate-200/90 rounded-md shadow-sm focus:ring-teal-600/25 focus:border-teal-600 dark:bg-slate-800/80 dark:text-stone-100"
                required
              />
            </div>

            <div className="sm:col-span-6">
              <span className="block text-sm font-medium text-slate-700 dark:text-stone-200">
                Department Logo
              </span>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
                <button
                  type="button"
                  disabled={!facultyIdForDepartment || isSubmitting}
                  onClick={() => document.getElementById("department-logo-input")?.click()}
                  className="flex-1 rounded-xl border-2 border-dashed border-slate-300/90 bg-white/70 px-4 py-6 text-center transition-all hover:border-teal-500/70 hover:bg-teal-50/40 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900/35 dark:hover:border-teal-500/60 dark:hover:bg-teal-950/25"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto h-9 w-9 text-teal-700 dark:text-teal-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M9 4h6m-6 0a2 2 0 00-2 2v2m8-4a2 2 0 012 2v2M6 8h12v10a2 2 0 01-2 2H8a2 2 0 01-2-2V8z"
                    />
                  </svg>
                  <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-stone-100">
                    Browse department logo
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">PNG, JPEG, GIF, WebP - max 3 MB</p>
                </button>

                {(blobPreviewUrl || logo) && (
                  <div className="flex shrink-0 flex-col items-center gap-2">
                    <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-900/10 ring-1 ring-slate-900/5 dark:border-slate-600 dark:bg-slate-950">
                      <img
                        src={blobPreviewUrl || logo}
                        alt="Department logo preview"
                        className="h-full w-full object-cover"
                      />
                      {pendingLogoFile && (
                        <span className="absolute bottom-1 right-1 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200 shadow ring-1 ring-amber-500/40">
                          New
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => document.getElementById("department-logo-input")?.click()}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:border-teal-600/40 hover:bg-teal-50/70 dark:border-slate-600 dark:bg-slate-900 dark:text-stone-200 dark:hover:bg-slate-800"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>
              <input
                id="department-logo-input"
                type="file"
                accept={LOGO_ACCEPT}
                className="sr-only"
                onChange={(e) => {
                  onPickLogoFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-stone-200">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!facultyIdForDepartment || isSubmitting}
                className="mt-1 block w-full px-3 py-2 border border-slate-200/90 rounded-md shadow-sm focus:ring-teal-600/25 focus:border-teal-600 dark:bg-slate-800/80 dark:text-stone-100"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            {editingDepartmentId && (
              <button
                type="button"
                onClick={clearForm}
                disabled={isSubmitting}
                className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 border border-slate-200/90 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white/90 hover:bg-gradient-to-br from-stone-50/90 to-slate-100/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-teal-600/25"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!facultyIdForDepartment || isSubmitting}
              className={`inline-flex items-center px-3 py-1 md:px-4 md:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-700 hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-teal-600/25 ${
                !facultyIdForDepartment || isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Saving..." : editingDepartmentId ? "Update" : "Add Department"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white/90 dark:bg-slate-900/80 rounded-lg shadow-md p-4 md:p-6 border border-slate-200/80 dark:border-slate-700/80">
        <h3 className="text-xl md:text-2xl font-bold text-slate-900 border-b pb-2 flex items-center dark:text-stone-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 mr-2 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Departments List
        </h3>

        {listLoading ? (
          <div className="mt-8 flex flex-col items-center justify-center gap-4 py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-teal-200 border-t-teal-700 dark:border-slate-600 dark:border-t-teal-400" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Loading departments...</p>
          </div>
        ) : facultyIdForDepartment === "" ? (
          <div className="bg-teal-50 dark:bg-teal-950/30 border-l-4 border-teal-500 p-4 rounded mt-4">
            <p className="text-teal-900 dark:text-teal-200">Please select a faculty to view its departments.</p>
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 p-4 rounded mt-4">
            <p className="text-amber-900 dark:text-amber-200">No departments found for this faculty. Create one using the form above.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 md:mt-6">
            {filteredDepartments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 bg-slate-800 text-white text-xs px-2 py-1 transform rotate-3 shadow-md">
                  Since {dept.establishedYear}
                </div>

                <div className="bg-gradient-to-r from-slate-800 to-teal-700 p-3 md:p-4 text-white">
                  <h4 className="text-lg md:text-xl font-bold line-clamp-1">{dept.name} Department</h4>
                  <p className="text-xs md:text-sm opacity-90">{dept.facultyName || faculties.find((f) => f.id === dept.facultyId)?.name || "Unknown Faculty"}</p>
                </div>

                <div className="p-3 md:p-4">
                  {dept.logo && (
                    <div className="mb-3 flex justify-center">
                      <img
                        src={dept.logo}
                        alt={`${dept.name} logo`}
                        className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-slate-200/90 md:h-20 md:w-20 dark:border-slate-800 dark:ring-slate-600"
                      />
                    </div>
                  )}
                  <p className="mb-2 text-sm text-slate-700 dark:text-stone-200 line-clamp-1">
                    <span className="font-medium">Dean:</span> {dept.dean}
                  </p>
                  <p className="mb-2 text-sm text-slate-700 dark:text-stone-200 line-clamp-1">
                    <span className="font-medium">Semesters:</span> {dept.semesters}
                  </p>
                  <p className="mb-3 text-sm text-slate-700 dark:text-stone-200">
                    <span className="font-medium">Teachers:</span> {teachersData.filter((t) => t.departmentId === dept.id).length}
                  </p>

                  {teachersData.filter((t) => t.departmentId === dept.id).length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-xs md:text-sm font-semibold text-slate-600 dark:text-stone-200 mb-1">Key Members:</h5>
                      <div className="space-y-1">
                        {teachersData
                          .filter((t) => t.departmentId === dept.id)
                          .slice(0, 3)
                          .map((teacher) => (
                            <Link
                              to={`/teacher/${teacher.id}`}
                              key={teacher.id}
                              className="flex items-center text-teal-700 hover:text-teal-900 transition-colors dark:text-amber-500 text-xs md:text-sm"
                            >
                              <span className="line-clamp-1">{teacher.fullName}</span>
                            </Link>
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-gradient-to-br from-stone-50/90 to-slate-100/50 dark:bg-slate-800/70 p-2 md:p-3 rounded-md mb-3">
                    <p className="text-xs md:text-sm text-slate-700 dark:text-stone-200 italic line-clamp-3">
                      {dept.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-200/80 dark:border-slate-700 pt-2">
                    <div className="text-xs text-slate-500 dark:text-stone-400">
                      Updated: {new Date().toLocaleDateString()}
                    </div>
                    <div className="flex space-x-1 md:space-x-2">
                      <button
                        onClick={() => handleEdit(dept.id)}
                        className="text-xs px-2 py-1 bg-teal-50 text-teal-700 rounded hover:bg-teal-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        disabled={deletingId === dept.id}
                        onClick={() => handleDelete(dept.id)}
                        className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        {deletingId === dept.id ? "Deleting..." : "Delete"}
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
