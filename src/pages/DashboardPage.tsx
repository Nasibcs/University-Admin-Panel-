import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiBook,
  FiCalendar,
  FiHome,
  FiUsers,
  FiBookOpen,
} from "react-icons/fi";

type EntityCounts = {
  faculties: number;
  departments: number;
  teachers: number;
  semesters: number;
  books: number;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const statsContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
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
  const [activeTab, setActiveTab] = useState("overview");

  const fetchCounts = () => {
    const faculties = JSON.parse(localStorage.getItem("faculties") || "[]");
    const departments = JSON.parse(localStorage.getItem("departments") || "[]");
    const teachers = JSON.parse(localStorage.getItem("teachers") || "[]");
    const semesters = JSON.parse(localStorage.getItem("semesters") || "[]");
    const books = JSON.parse(localStorage.getItem("books") || "[]");

    setCounts({
      faculties: faculties.length,
      departments: departments.length,
      teachers: teachers.length,
      semesters: semesters.length,
      books: books.length,
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchCounts();

    const handleStorageChange = () => {
      fetchCounts();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("data-changed", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("data-changed", handleStorageChange);
    };
  }, []);

  const stats = [
    {
      id: "faculties",
      title: "Faculties",
      icon: <FiHome className="text-xl" />,
      color:
        "bg-blue-50 dark:bg-blue-800 text-blue-600 dark:text-blue-200 border-blue-100 dark:border-blue-700",
      hover: "hover:bg-blue-100 dark:hover:bg-blue-700",
      link: "/dashboard/faculties",
    },
    {
      id: "departments",
      title: "Departments",
      icon: <FiUsers className="text-xl" />,
      color:
        "bg-purple-50 dark:bg-purple-800 text-purple-600 dark:text-purple-200 border-purple-100 dark:border-purple-700",
      hover: "hover:bg-purple-100 dark:hover:bg-purple-700",
      link: "/dashboard/departments",
    },
    {
      id: "teachers",
      title: "Teachers",
      icon: <FiUsers className="text-xl" />,
      color:
        "bg-green-50 dark:bg-green-800 text-green-600 dark:text-green-200 border-green-100 dark:border-green-700",
      hover: "hover:bg-green-100 dark:hover:bg-green-700",
      link: "/dashboard/teachers",
    },
    {
      id: "semesters",
      title: "Semesters",
      icon: <FiCalendar className="text-xl" />,
      color:
        "bg-amber-50 dark:bg-amber-700 text-amber-600 dark:text-amber-200 border-amber-100 dark:border-amber-600",
      hover: "hover:bg-amber-100 dark:hover:bg-amber-600",
      link: "/dashboard/semesters",
    },
    {
      id: "books",
      title: "Books",
      icon: <FiBook className="text-xl" />,
      color:
        "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600",
      hover: "hover:bg-gray-300 dark:hover:bg-gray-600",
      link: "/dashboard/books",
    },
  ];

  const quickActions = [
    {
      icon: <FiBookOpen className="text-lg" />,
      label: "Add New Book",
      link: "/dashboard/books",
      bg: "bg-blue-50 dark:bg-blue-800",
      text: "text-blue-600 dark:text-blue-200",
      hover: "hover:bg-blue-100 dark:hover:bg-blue-700",
    },
    {
      icon: <FiUsers className="text-lg" />,
      label: "Register Teacher",
      link: "/dashboard/teachers",
      bg: "bg-green-50 dark:bg-green-800",
      text: "text-green-600 dark:text-green-200",
      hover: "hover:bg-green-100 dark:hover:bg-green-700",
    },
    {
      icon: <FiHome className="text-lg" />,
      label: "Create Faculty",
      link: "/dashboard/faculties",
      bg: "bg-purple-50 dark:bg-purple-800",
      text: "text-purple-600 dark:text-purple-200",
      hover: "hover:bg-purple-100 dark:hover:bg-purple-700",
    },
    {
      icon: <FiCalendar className="text-lg" />,
      label: "New Semester",
      link: "/dashboard/semesters",
      bg: "bg-amber-50 dark:bg-amber-700",
      text: "text-amber-600 dark:text-amber-200",
      hover: "hover:bg-amber-100 dark:hover:bg-amber-600",
    },
  ];

  const tabs = [
    {
      id: "overview",
      icon: <FiHome className="mr-2" />,
      label: "Overview",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <header className="sticky top-0 z-20 bg-white shadow-sm dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-200 sm:text-2xl lg:text-3xl">
              University Dashboard
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-300 sm:hidden">
              Manage university data easily
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="mb-6 overflow-x-auto pb-1">
          <nav className="flex min-w-max gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center rounded-lg px-4 py-2 text-sm transition-colors sm:text-base ${
                  activeTab === tab.id
                    ? "bg-blue-50 font-medium text-blue-600 dark:bg-blue-800 dark:text-blue-200"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <motion.div
          className="mb-8 grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
          variants={statsContainer}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat) => (
            <NavLink to={stat.link} key={stat.id}>
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className={`${stat.color} ${stat.hover} h-full cursor-pointer rounded-xl border transition-colors`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="mb-1 truncate text-sm font-medium opacity-90">
                        {stat.title}
                      </p>

                      {loading ? (
                        <motion.div className="h-7 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-600" />
                      ) : (
                        <h3 className="text-2xl font-bold sm:text-3xl">
                          {counts[stat.id as keyof EntityCounts]}
                        </h3>
                      )}
                    </div>

                    <div className="rounded-lg bg-white/60 p-2 dark:bg-gray-800/70">
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </motion.div>
            </NavLink>
          ))}
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-200 sm:text-xl">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 gap-3 dark:text-gray-300 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
            {quickActions.map((action, index) => (
              <NavLink to={action.link} key={index} title={action.label}>
                <motion.button
                  type="button"
                  className={`${action.bg} ${action.hover} flex w-full items-center gap-3 rounded-xl border border-gray-100 p-4 text-left transition-colors dark:border-gray-700 sm:flex-col sm:text-center`}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className={`${action.text} rounded-full p-3`}>
                    {action.icon}
                  </div>

                  <span className="text-sm font-medium sm:text-center">
                    {action.label}
                  </span>
                </motion.button>
              </NavLink>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;