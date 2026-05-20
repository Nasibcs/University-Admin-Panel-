import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type FacultyToast = {
  variant: "success" | "error";
  title: string;
  message: string;
};

type Faculty = {
  id: string;
  name: string;
  dean: string;
  establishedYear: string;
  description: string;
  logo: string;
};

type DeleteTarget = {
  id: string;
  name: string;
} | null;

const API_ORIGIN =
  typeof import.meta.env.VITE_API_URL === "string" &&
  import.meta.env.VITE_API_URL.length > 0
    ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
    : "http://localhost:8081";

const MAX_LOGO_BYTES = 3 * 1024 * 1024;
const LOGO_ACCEPT =
  "image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp";
const FACULTY_LOCAL_CACHE_KEY = "faculties";

function syncFacultyLocalCache(list: Faculty[]) {
  try {
    localStorage.setItem(FACULTY_LOCAL_CACHE_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

async function parseApiError(res: Response): Promise<string> {
  const text = await res.text();

  try {
    const j = JSON.parse(text) as {
      message?: string;
      errors?: Record<string, string>;
    };

    if (j.message && j.errors && Object.keys(j.errors).length > 0) {
      const parts = Object.entries(j.errors).map(([k, v]) => `${k}: ${v}`);
      return `${j.message} — ${parts.join(" · ")}`;
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
    return `Image must be 3 MB or smaller. Current size is ${Math.round(
      file.size / 1024
    )} KB.`;
  }

  return null;
}

async function uploadFacultyLogoToServer(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_ORIGIN}/api/uploads/faculty-logo`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Upload failed (${res.status})`);
  }

  const data = (await res.json()) as { logoUrl: string };

  if (!data.logoUrl) {
    throw new Error("Invalid upload response.");
  }

  return data.logoUrl;
}

function resizeImageFileToDataUrl(
  file: File,
  maxEdge = 440,
  quality = 0.86
): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      const scale = Math.min(1, maxEdge / Math.max(width, height));

      width = Math.round(width * scale);
      height = Math.round(height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Cannot process image."));
        return;
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not load the selected image."));
    };

    img.src = objectUrl;
  });
}

async function resolveLogoForSubmit(
  pendingLogoFile: File | null,
  existingLogoUrl: string
): Promise<string> {
  if (pendingLogoFile) {
    try {
      return await uploadFacultyLogoToServer(pendingLogoFile);
    } catch {
      return await resizeImageFileToDataUrl(pendingLogoFile);
    }
  }

  if (!existingLogoUrl) {
    throw new Error("Please choose a faculty logo.");
  }

  return existingLogoUrl;
}

const DeleteConfirmModal = ({
  faculty,
  onCancel,
  onConfirm,
  loading,
}: {
  faculty: DeleteTarget;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}) => {
  if (!faculty) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={loading ? undefined : onCancel}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.22 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-700/80 dark:bg-slate-900"
      >
        <div className="bg-gradient-to-r from-slate-800 via-teal-700 to-amber-500 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 shadow-lg ring-1 ring-white/25">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>

            <div>
              <h3 className="text-lg font-bold">Confirm Delete</h3>
              <p className="text-sm text-white/85">
                This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm leading-6 text-slate-600 dark:text-stone-300">
            Are you sure you want to delete
            <span className="mx-1 font-bold text-slate-900 dark:text-white">
              {faculty.name}
            </span>
            from the faculties list?
          </p>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-stone-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:from-red-700 hover:to-rose-600 disabled:opacity-60"
            >
              {loading ? "Deleting..." : "Yes, Delete Faculty"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FacultyPage = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  const [name, setName] = useState("");
  const [dean, setDean] = useState("");
  const [establishedYear, setEstablishedYear] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);
  const [blobPreviewUrl, setBlobPreviewUrl] = useState<string | null>(null);

  const [toast, setToast] = useState<FacultyToast | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (!blobPreviewUrl || !blobPreviewUrl.startsWith("blob:")) return;
      URL.revokeObjectURL(blobPreviewUrl);
    };
  }, [blobPreviewUrl]);

  useEffect(() => {
    if (!toast) return;

    const t = window.setTimeout(() => setToast(null), 5200);

    return () => window.clearTimeout(t);
  }, [toast]);

  const showErrorToast = (message: string) => {
    setToast({
      variant: "error",
      title: "Error",
      message,
    });
  };

  const showSuccessToast = (message: string) => {
    setToast({
      variant: "success",
      title: "Success",
      message,
    });
  };

  const loadFaculties = useCallback(async () => {
    setListLoading(true);
    setListError(null);

    try {
      const res = await fetch(`${API_ORIGIN}/api/faculties`);

      if (!res.ok) {
        throw new Error(await parseApiError(res));
      }

      const list = (await res.json()) as Faculty[];

      setFaculties(list);
      syncFacultyLocalCache(list);
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : "Something went wrong while loading faculties. Please try again.";

      setListError(msg);
      setFaculties([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFaculties();
  }, [loadFaculties]);

  const revokeBlobPreviewAndReset = () => {
    setBlobPreviewUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });

    setPendingLogoFile(null);
  };

  const onPickLogoFiles = (list: FileList | null) => {
    const file = list?.[0];

    if (!file) return;

    const msg = validateLogoFile(file);

    if (msg) {
      showErrorToast(msg);
      return;
    }

    setToast(null);

    setBlobPreviewUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });

    setPendingLogoFile(file);
  };

  const clearForm = () => {
    setName("");
    setDean("");
    setEstablishedYear("");
    setDescription("");
    setLogo("");
    revokeBlobPreviewAndReset();
    setEditId(null);
    setIsFormExpanded(false);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    if (
      !name.trim() ||
      !dean.trim() ||
      !establishedYear.trim() ||
      !description.trim()
    ) {
      showErrorToast("Please fill all required fields.");
      return;
    }

    if (!pendingLogoFile && !logo) {
      showErrorToast("Please add a faculty logo.");
      return;
    }

    const isDuplicate = faculties.some(
      (f) =>
        f.name.toLowerCase() === name.trim().toLowerCase() && f.id !== editId
    );

    if (isDuplicate) {
      showErrorToast("A faculty with this name already exists.");
      return;
    }

    const wasEditing = Boolean(editId);

    setIsSubmitting(true);

    try {
      const finalLogo = await resolveLogoForSubmit(pendingLogoFile, logo);

      if (!/^(https?:\/\/|\/|data:image\/)/i.test(finalLogo)) {
        showErrorToast("Please choose a valid faculty logo image and try again.");
        return;
      }

      const payload = {
        name: name.trim(),
        dean: dean.trim(),
        establishedYear: establishedYear.trim(),
        description: description.trim(),
        logo: finalLogo,
      };

      if (wasEditing && editId) {
        const res = await fetch(`${API_ORIGIN}/api/faculties/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(await parseApiError(res));
      } else {
        const res = await fetch(`${API_ORIGIN}/api/faculties`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(await parseApiError(res));
      }

      await loadFaculties();
      clearForm();

      showSuccessToast(
        wasEditing
          ? "Faculty updated successfully."
          : "Faculty added successfully."
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save faculty.";
      showErrorToast(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (id: string) => {
    const faculty = faculties.find((f) => f.id === id);

    if (!faculty) {
      showErrorToast("Faculty not found.");
      return;
    }

    setName(faculty.name);
    setDean(faculty.dean);
    setEstablishedYear(faculty.establishedYear);
    setDescription(faculty.description);
    setLogo(faculty.logo);
    revokeBlobPreviewAndReset();
    setEditId(faculty.id);
    setIsFormExpanded(true);

    showSuccessToast("Edit mode opened. Update the faculty information and save it.");

    document
      .getElementById("faculty-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    const faculty = faculties.find((f) => f.id === id);

    if (!faculty) {
      showErrorToast("Faculty not found.");
      return;
    }

    setDeleteTarget({
      id: faculty.id,
      name: faculty.name,
    });
  };

  const confirmDeleteFaculty = async () => {
    if (!deleteTarget) return;

    setDeletingId(deleteTarget.id);

    try {
      const res = await fetch(`${API_ORIGIN}/api/faculties/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!res.ok && res.status !== 404) {
        throw new Error(await parseApiError(res));
      }

      const storedDepartments = JSON.parse(
        localStorage.getItem("departments") || "[]"
      );

      localStorage.setItem(
        "departments",
        JSON.stringify(
          storedDepartments.filter(
            (d: { facultyId: string }) => d.facultyId !== deleteTarget.id
          )
        )
      );

      const storedTeachers = JSON.parse(localStorage.getItem("teachers") || "[]");

      localStorage.setItem(
        "teachers",
        JSON.stringify(
          storedTeachers.filter(
            (t: { facultyId: string }) => t.facultyId !== deleteTarget.id
          )
        )
      );

      await loadFaculties();

      if (editId === deleteTarget.id) clearForm();

      showSuccessToast(`${deleteTarget.name} deleted successfully.`);
    } catch (e) {
      showErrorToast(
        e instanceof Error ? e.message : "Failed to delete faculty."
      );
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-stone-100 via-slate-50 to-stone-100 p-4 md:p-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <AnimatePresence>
        <DeleteConfirmModal
          faculty={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDeleteFaculty}
          loading={Boolean(deletingId)}
        />
      </AnimatePresence>

      <div
        className="pointer-events-none fixed left-4 right-4 top-4 z-[100] flex justify-center sm:left-auto sm:right-6 sm:w-auto sm:justify-end md:top-6"
        aria-live="polite"
      >
        <AnimatePresence mode="sync">
          {toast && (
            <motion.div
              layout
              role="alert"
              initial={{ opacity: 0, y: -18, scale: 0.92, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{
                opacity: 0,
                y: -12,
                scale: 0.95,
                transition: { duration: 0.22 },
              }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="pointer-events-auto w-full max-w-md"
            >
              <div
                className={`flex gap-4 overflow-hidden rounded-2xl border p-4 shadow-2xl ring-2 backdrop-blur-md ${
                  toast.variant === "success"
                    ? "border-teal-200/80 bg-teal-50/95 shadow-teal-900/15 ring-teal-500/20 dark:border-teal-800/55 dark:bg-slate-900/92 dark:shadow-black/40 dark:ring-teal-500/15"
                    : "border-red-200/85 bg-red-50/96 shadow-red-900/12 ring-red-500/25 dark:border-red-900/50 dark:bg-slate-900/94 dark:ring-red-500/15"
                }`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-inner ${
                    toast.variant === "success"
                      ? "bg-teal-600 text-white shadow-teal-900/35 dark:bg-teal-600"
                      : "bg-red-600 text-white shadow-red-900/35 dark:bg-red-600"
                  }`}
                  aria-hidden
                >
                  {toast.variant === "success" ? (
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </span>

                <div className="min-w-0 flex-1 pt-0.5">
                  <p
                    className={`text-base font-bold leading-tight tracking-tight ${
                      toast.variant === "success"
                        ? "text-teal-950 dark:text-teal-100"
                        : "text-red-950 dark:text-red-100"
                    }`}
                  >
                    {toast.title}
                  </p>

                  <p
                    className={`mt-1.5 text-sm leading-relaxed ${
                      toast.variant === "success"
                        ? "text-teal-900/90 dark:text-teal-200/90"
                        : "text-red-900/90 dark:text-red-200/90"
                    }`}
                  >
                    {toast.message}
                  </p>

                  {toast.variant === "success" && (
                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-teal-200/70 dark:bg-teal-950/70">
                      <motion.div
                        className="h-full rounded-full bg-teal-600 dark:bg-teal-400"
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 5.1, ease: "linear" }}
                      />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setToast(null)}
                  className={`shrink-0 rounded-lg p-1.5 transition-colors ${
                    toast.variant === "success"
                      ? "text-teal-700 hover:bg-teal-200/55 dark:text-teal-300 dark:hover:bg-teal-950/70"
                      : "text-red-700 hover:bg-red-200/55 dark:text-red-300 dark:hover:bg-red-950/60"
                  }`}
                  aria-label="Close notification"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 flex items-center text-2xl font-bold tracking-tight text-slate-900 md:mb-8 md:text-3xl dark:text-stone-100">
          <span className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-amber-400 shadow-md shadow-slate-900/15 ring-1 ring-amber-500/30 md:h-12 md:w-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 stroke-current md:h-7 md:w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </span>
          Faculty Management
        </h2>

        {listError && (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200/90 bg-red-50/95 p-4 shadow-sm ring-1 ring-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:ring-red-900/40 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-red-900 dark:text-red-100">
              {listError}
            </p>

            <button
              type="button"
              onClick={() => loadFaculties()}
              className="shrink-0 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow transition-colors hover:bg-red-800"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-lg shadow-slate-900/5 backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/80 md:mb-10">
          <div
            className={`cursor-pointer p-4 md:cursor-auto md:p-6 ${
              isFormExpanded
                ? "border-b border-slate-200/80 dark:border-slate-700/80"
                : ""
            }`}
            onClick={() => setIsFormExpanded(!isFormExpanded)}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-stone-100">
                {editId ? "Edit Faculty" : "Create New Faculty"}
              </h3>

              <button
                type="button"
                className="text-slate-600 md:hidden dark:text-teal-400"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFormExpanded(!isFormExpanded);
                }}
              >
                {isFormExpanded ? "▲" : "▼"}
              </button>
            </div>
          </div>

          <form
            id="faculty-form"
            onSubmit={handleSubmit}
            className={`${
              isFormExpanded ? "block" : "hidden"
            } rounded-b-2xl border-t-0 border-slate-200/60 bg-gradient-to-br from-stone-50/90 to-slate-100/50 p-4 md:block md:p-6 dark:border-slate-700/60 dark:from-slate-900/60 dark:to-slate-900/30`}
          >
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
              <div className="sm:col-span-6 md:col-span-3">
                <label
                  htmlFor="faculty-name"
                  className="block text-sm font-medium text-slate-700 dark:text-stone-200"
                >
                  Faculty Name
                </label>

                <input
                  type="text"
                  id="faculty-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-200/90 bg-white/80 px-3 py-2.5 shadow-sm transition-colors placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/25 dark:border-slate-600 dark:bg-slate-950/40 dark:text-stone-100"
                  required
                />
              </div>

              <div className="sm:col-span-6 md:col-span-3">
                <label
                  htmlFor="dean"
                  className="block text-sm font-medium text-slate-700 dark:text-stone-200"
                >
                  Dean
                </label>

                <input
                  type="text"
                  id="dean"
                  value={dean}
                  onChange={(e) => setDean(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-200/90 bg-white/80 px-3 py-2.5 shadow-sm transition-colors focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/25 dark:border-slate-600 dark:bg-slate-950/40 dark:text-stone-100"
                  required
                />
              </div>

              <div className="sm:col-span-6 md:col-span-3">
                <label
                  htmlFor="established-year"
                  className="block text-sm font-medium text-slate-700 dark:text-stone-200"
                >
                  Established Year
                </label>

                <input
                  type="text"
                  id="established-year"
                  value={establishedYear}
                  onChange={(e) => setEstablishedYear(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-200/90 bg-white/80 px-3 py-2.5 shadow-sm transition-colors focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/25 dark:border-slate-600 dark:bg-slate-950/40 dark:text-stone-100"
                  required
                />
              </div>

              <div className="sm:col-span-6">
                <span className="block text-sm font-medium text-slate-700 dark:text-stone-200">
                  Faculty Logo
                </span>

                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      document.getElementById("faculty-logo-input")?.click()
                    }
                    className={`flex-1 cursor-pointer rounded-xl border-2 border-dashed px-4 py-6 text-center outline-none transition-all hover:border-teal-500/70 hover:bg-teal-50/40 dark:border-slate-600 dark:hover:border-teal-500/60 dark:hover:bg-teal-950/25 ${
                      blobPreviewUrl || logo
                        ? "border-teal-600/35 bg-white/90 dark:bg-slate-900/70"
                        : "border-slate-300/90 bg-white/70 dark:bg-slate-900/35"
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-800 dark:text-stone-100">
                      Browse or drop image here
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      PNG · JPEG · GIF · WebP · max 3 MB
                    </p>
                  </div>

                  {(blobPreviewUrl || logo) && (
                    <div className="flex shrink-0 flex-col items-center gap-2">
                      <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-900/10 ring-1 ring-slate-900/5 dark:border-slate-600 dark:bg-slate-950">
                        <img
                          src={blobPreviewUrl || logo}
                          alt="Logo preview"
                          className="h-full w-full object-cover"
                        />

                        {pendingLogoFile && (
                          <span className="absolute bottom-1 right-1 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200 shadow ring-1 ring-amber-500/40">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <input
                  id="faculty-logo-input"
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
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-slate-700 dark:text-stone-200"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-200/90 bg-white/80 px-3 py-2.5 shadow-sm transition-colors focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/25 dark:border-slate-600 dark:bg-slate-950/40 dark:text-stone-100"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              {editId && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-stone-200 dark:hover:bg-slate-700 md:px-4 md:py-2"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center rounded-lg border border-teal-800/20 bg-teal-700 px-3 py-1.5 text-sm font-semibold text-white shadow-md shadow-teal-900/20 transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-teal-600 dark:hover:bg-teal-500 md:px-4 md:py-2"
              >
                {isSubmitting ? "Saving…" : editId ? "Update" : "Add Faculty"}
              </button>
            </div>
          </form>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/80 md:p-7">
          <h3 className="flex items-center border-b border-slate-200/90 pb-3 text-xl font-bold tracking-tight text-slate-900 dark:border-slate-700 dark:text-stone-100 md:text-2xl">
            List of Faculties
          </h3>

          {listLoading ? (
            <div className="mt-8 flex flex-col items-center justify-center gap-4 py-16">
              <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-teal-200 border-t-teal-700 dark:border-slate-600 dark:border-t-teal-400" />

              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Loading faculties…
              </p>
            </div>
          ) : faculties.length === 0 ? (
            <div className="mt-5 rounded-xl border border-amber-200/60 bg-amber-50/80 p-4 shadow-inner shadow-amber-900/5 dark:border-amber-900/30 dark:bg-amber-950/25">
              <p className="text-sm font-medium text-amber-950 dark:text-amber-100">
                No faculties found yet. Create one using the form above.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-1 md:mt-8 md:grid-cols-2 lg:grid-cols-3">
              {faculties.map((faculty) => (
                <div
                  key={faculty.id}
                  className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-md shadow-slate-900/8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/10 dark:border-slate-700/90 dark:bg-slate-900/65"
                >
                  <div className="absolute right-2 top-2 z-10 rounded-md border border-amber-500/35 bg-gradient-to-br from-amber-100 to-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-950 shadow-sm dark:border-amber-600/40 dark:from-slate-800 dark:to-slate-900 dark:text-amber-200">
                    Est. {faculty.establishedYear}
                  </div>

                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-900 p-4 text-white md:p-5">
                    <h4 className="line-clamp-2 pr-10 text-lg font-bold leading-snug md:text-xl">
                      {faculty.name}
                    </h4>
                  </div>

                  <div className="p-3 dark:bg-transparent md:p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <p className="line-clamp-2 text-sm text-slate-700 dark:text-stone-100 md:text-base">
                        <span className="font-semibold text-slate-900 dark:text-stone-100">
                          Dean:
                        </span>{" "}
                        {faculty.dean}
                      </p>
                    </div>

                    {faculty.logo && (
                      <div className="mb-4 flex justify-center">
                        <img
                          src={faculty.logo}
                          alt={`${faculty.name} logo`}
                          className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-slate-200/90 dark:border-slate-800 dark:ring-slate-600 md:h-24 md:w-24"
                        />
                      </div>
                    )}

                    <div className="mb-4 rounded-lg border border-slate-100 bg-stone-50/90 p-3 dark:border-slate-700 dark:bg-slate-950/50">
                      <p className="line-clamp-3 text-xs italic leading-relaxed text-slate-700 dark:text-slate-300 md:text-sm">
                        {faculty.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-700/80">
                      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {new Date().toLocaleDateString()}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(faculty.id)}
                          className="flex items-center rounded-lg bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-900 transition-colors hover:bg-teal-200 dark:bg-teal-900/35 dark:text-teal-100 dark:hover:bg-teal-900/55 md:px-3 md:py-1 md:text-sm"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={deletingId === faculty.id}
                          onClick={() => handleDelete(faculty.id)}
                          className="flex items-center rounded-lg border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-800 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200 dark:hover:bg-red-950/65 md:px-3 md:py-1 md:text-sm"
                        >
                          {deletingId === faculty.id ? "Deleting…" : "Delete"}
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
    </div>
  );
};

export default FacultyPage;