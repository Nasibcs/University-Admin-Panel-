import { useEffect, useMemo, useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiBook,
  FiBookOpen,
  FiCalendar,
  FiHome,
  FiPlus,
  FiUsers,
} from "react-icons/fi";
import { MdSchool } from "react-icons/md";

type EntityCounts = {
  faculties: number;
  departments: number;
  teachers: number;
  semesters: number;
  books: number;
};

type StatItem = {
  id: keyof EntityCounts;
  title: string;
  label: string;
  icon: ReactNode;
  link: string;
  surface: string;
  iconBox: string;
  text: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8081";

const readLocalListLength = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item && Array.isArray(JSON.parse(item)) ? (JSON.parse(item) as unknown[]).length : 0;
  } catch {
    return 0;
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: "easeOut" },
  },
};

const Dashboard = () => {
  const [counts, setCounts] = useState<EntityCounts>({
    faculties: 0,
    departments: 0,
    teachers: 0,
    semesters: 0,
    books: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchCounts = async () => {
    setLoading(true);

    const fetchListLength = async (key: string, path: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}${path}`);
        if (!response.ok) {
          throw new Error("Failed to load count");
        }
        const data = await response.json();
        return Array.isArray(data) ? data.length : readLocalListLength(key);
      } catch {
        return readLocalListLength(key);
      }
    };

    const [faculties, departments, teachers, semesters, books] = await Promise.all([
      fetchListLength("faculties", "/api/faculties"),
      fetchListLength("departments", "/api/departments"),
      fetchListLength("teachers", "/api/teachers"),
      fetchListLength("semesters", "/api/semesters"),
      fetchListLength("books", "/api/books"),
    ]);

    setCounts({ faculties, departments, teachers, semesters, books });
    setLoading(false);
  };

  useEffect(() => {
    void fetchCounts();

    const handleStorageChange = () => {
      void fetchCounts();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("data-changed", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("data-changed", handleStorageChange);
    };
  }, []);

  const totalRecords = useMemo(
    () => Object.values(counts).reduce((sum, value) => sum + value, 0),
    [counts]
  );

  const stats: StatItem[] = [
    {
      id: "faculties",
      title: "Faculties",
      label: "Academic faculties",
      icon: <FiHome />,
      link: "/dashboard/faculties",
      surface:
        "border-teal-100 bg-teal-50/80 hover:border-teal-200 dark:border-teal-900/40 dark:bg-teal-950/20",
      iconBox:
        "bg-white text-teal-700 ring-teal-100 dark:bg-slate-900 dark:text-teal-300 dark:ring-teal-900/50",
      text: "text-teal-700 dark:text-teal-300",
    },
    {
      id: "departments",
      title: "Departments",
      label: "Faculty departments",
      icon: <MdSchool />,
      link: "/dashboard/departments",
      surface:
        "border-amber-100 bg-amber-50/80 hover:border-amber-200 dark:border-amber-900/40 dark:bg-amber-950/20",
      iconBox:
        "bg-white text-amber-700 ring-amber-100 dark:bg-slate-900 dark:text-amber-300 dark:ring-amber-900/50",
      text: "text-amber-700 dark:text-amber-300",
    },
    {
      id: "teachers",
      title: "Teachers",
      label: "Registered teachers",
      icon: <FiUsers />,
      link: "/dashboard/teachers",
      surface:
        "border-emerald-100 bg-emerald-50/80 hover:border-emerald-200 dark:border-emerald-900/40 dark:bg-emerald-950/20",
      iconBox:
        "bg-white text-emerald-700 ring-emerald-100 dark:bg-slate-900 dark:text-emerald-300 dark:ring-emerald-900/50",
      text: "text-emerald-700 dark:text-emerald-300",
    },
    {
      id: "semesters",
      title: "Semesters",
      label: "Study semesters",
      icon: <FiCalendar />,
      link: "/dashboard/semesters",
      surface:
        "border-sky-100 bg-sky-50/80 hover:border-sky-200 dark:border-sky-900/40 dark:bg-sky-950/20",
      iconBox:
        "bg-white text-sky-700 ring-sky-100 dark:bg-slate-900 dark:text-sky-300 dark:ring-sky-900/50",
      text: "text-sky-700 dark:text-sky-300",
    },
    {
      id: "books",
      title: "Books",
      label: "Library resources",
      icon: <FiBook />,
      link: "/dashboard/books",
      surface:
        "border-rose-100 bg-rose-50/80 hover:border-rose-200 dark:border-rose-900/40 dark:bg-rose-950/20",
      iconBox:
        "bg-white text-rose-700 ring-rose-100 dark:bg-slate-900 dark:text-rose-300 dark:ring-rose-900/50",
      text: "text-rose-700 dark:text-rose-300",
    },
  ];

  const quickActions = [
    {
      icon: <FiHome />,
      label: "Create Faculty",
      description: "Add a new faculty profile",
      link: "/dashboard/faculties",
    },
    {
      icon: <MdSchool />,
      label: "Add Department",
      description: "Organize departments by faculty",
      link: "/dashboard/departments",
    },
    {
      icon: <FiUsers />,
      label: "Register Teacher",
      description: "Save teacher information",
      link: "/dashboard/teachers",
    },
    {
      icon: <FiBookOpen />,
      label: "Add Book",
      description: "Grow the book collection",
      link: "/dashboard/books",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-slate-50 to-teal-50/40 px-4 py-6 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-6 overflow-hidden rounded-3xl border border-slate-200/70 bg-white/85 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/80 md:mb-8">
          <div className="grid gap-0 lg:grid-cols-[1.5fr_0.9fr]">
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900 to-slate-800 p-6 text-white md:p-8">
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-amber-300/20 blur-3xl" />
              <div className="absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-teal-300/20 blur-3xl" />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-amber-200 shadow-lg ring-1 ring-white/15">
                    <MdSchool className="text-3xl" />
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-100/80">
                      Admin Control Center
                    </p>
                    <h1 className="mt-1 text-2xl font-black tracking-tight md:text-4xl">
                      University Dashboard
                    </h1>
                  </div>
                </div>

                <p className="mt-5 max-w-2xl text-sm leading-6 text-stone-200 md:text-base">
                  Manage academic records with a clean, fast, and modern
                  dashboard experience.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <NavLink
                    to="/dashboard/faculties"
                    className="inline-flex items-center gap-2 rounded-2xl bg-amber-300 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-black/10 transition hover:bg-amber-200"
                  >
                    <FiPlus />
                    Start Adding Data
                  </NavLink>

                  <NavLink
                    to="/dashboard/books"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
                  >
                    View Library
                    <FiArrowRight />
                  </NavLink>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200/80 bg-gradient-to-br from-white to-stone-50 p-6 dark:border-slate-700/80 dark:from-slate-900 dark:to-slate-950 md:p-8 lg:border-l lg:border-t-0">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Total Records
              </p>

              <div className="mt-3 flex items-end gap-3">
                {loading ? (
                  <div className="h-14 w-28 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                ) : (
                  <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-stone-100">
                    {totalRecords}
                  </span>
                )}

                <span className="mb-2 rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-800 dark:bg-teal-950/65 dark:text-teal-200">
                  Live Data
                </span>
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                This number is calculated from faculties, departments, teachers,
                semesters, and books stored in your system.
              </p>
            </div>
          </div>
        </section>

        <motion.section
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.08 }}
        >
          {stats.map((stat) => (
            <NavLink to={stat.link} key={stat.id} className="group">
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className={`h-full rounded-3xl border p-5 shadow-sm shadow-slate-900/5 transition-all hover:shadow-xl hover:shadow-slate-900/10 dark:shadow-black/10 ${stat.surface}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-600 dark:text-stone-300">
                      {stat.title}
                    </p>

                    {loading ? (
                      <div className="mt-3 h-9 w-16 animate-pulse rounded-xl bg-white/70 dark:bg-slate-800" />
                    ) : (
                      <p
                        className={`mt-2 text-4xl font-black tracking-tight ${stat.text}`}
                      >
                        {counts[stat.id]}
                      </p>
                    )}

                    <p className="mt-1 truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </p>
                  </div>

                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl shadow-sm ring-1 ${stat.iconBox}`}
                  >
                    {stat.icon}
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-slate-400 opacity-0 transition group-hover:opacity-100 dark:text-slate-500">
                  Open
                  <FiArrowRight />
                </div>
              </motion.div>
            </NavLink>
          ))}
        </motion.section>

        <section className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/80 md:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-stone-100">
                Quick Actions
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Jump directly to your common admin tasks.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <NavLink
                to={action.link}
                key={action.label}
                className="group rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-stone-50 to-teal-50/50 p-4 transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-900/5 dark:border-slate-700/80 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/20 dark:hover:border-teal-800/60"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-100/80 text-lg text-teal-700 shadow-inner ring-1 ring-teal-200/70 dark:bg-teal-950/55 dark:text-teal-200 dark:ring-teal-800/50">
                    {action.icon}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 dark:text-stone-100">
                      {action.label}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">
                      {action.description}
                    </p>
                  </div>

                  <FiArrowRight className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-teal-700 dark:group-hover:text-teal-300" />
                </div>
              </NavLink>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;


