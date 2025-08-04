import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiBook,
  FiCalendar,
  FiHome,
  FiUsers,
  FiBookOpen,
} from "react-icons/fi";
// import DarkModeNew from "../components/DarkModeNew";

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
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
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
      color: "bg-blue-50 dark:bg-blue-800 text-blue-600 dark:text-blue-200 border-blue-100 dark:border-blue-700",
      hover: "hover:bg-blue-100 dark:hover:bg-blue-700",
      link: "dashboard/faculties",
    },
    {
      id: "departments",
      title: "Departments",
      icon: <FiUsers className="text-xl" />,
      color: "bg-purple-50 dark:bg-purple-800 text-purple-600 dark:text-purple-200 border-purple-100 dark:border-purple-700",
      hover: "hover:bg-purple-100 dark:hover:bg-purple-700",
      link: "dashboard/departments",
    },
    {
      id: "teachers",
      title: "Teachers",
      icon: <FiUsers className="text-xl" />,
      color: "bg-green-50 dark:bg-green-800 text-green-600 dark:text-green-200 border-green-100 dark:border-green-700",
      hover: "hover:bg-green-100 dark:hover:bg-green-700",
      link: "dashboard/teachers",
    },
    {
      id: "semesters",
      title: "Semesters",
      icon: <FiCalendar className="text-xl" />,
      color: "bg-amber-50 dark:bg-amber-700 text-amber-600 dark:text-amber-200 border-amber-100 dark:border-amber-600",
      hover: "hover:bg-amber-100 dark:hover:bg-amber-600",
      link: "dashboard/semesters",
    },
    {
      id: "books",
      title: "Books",
      icon: <FiBook className="text-xl" />,
      color: "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600",
      hover: "hover:bg-gray-300 dark:hover:bg-gray-600",
      link: "dashboard/books",
    },
  ];

  const quickActions = [
    {
      icon: <FiBookOpen className="text-lg" />,
      label: "Add New Book",
      link: "dashboard/books",
      bg: "bg-blue-50 dark:bg-blue-800",
      text: "text-blue-600 dark:text-blue-200",
      hover: "hover:bg-blue-100 dark:hover:bg-blue-700",
    },
    {
      icon: <FiUsers className="text-lg" />,
      label: "Register Teacher",
      link: "dashboard/teachers",
      bg: "bg-green-50 dark:bg-green-800",
      text: "text-green-600 dark:text-green-200",
      hover: "hover:bg-green-100 dark:hover:bg-green-700",
    },
    {
      icon: <FiHome className="text-lg" />,
      label: "Create Faculty",
      link: "dashboard/faculties",
      bg: "bg-purple-50 dark:bg-purple-800",
      text: "text-purple-600 dark:text-purple-200",
      hover: "hover:bg-purple-100 dark:hover:bg-purple-700",
    },
    {
      icon: <FiCalendar className="text-lg" />,
      label: "New Semester",
      link: "dashboard/semesters",
      bg: "bg-amber-50 dark:bg-amber-700",
      text: "text-amber-600 dark:text-amber-200",
      hover: "hover:bg-amber-100 dark:hover:bg-amber-600",
    },
  ];

  const tabs = [
    { id: "overview", icon: <FiHome className="mr-2" />, label: "Overview" },
  ];

  return (
    <div className="dark:bg-gray-800 min-h-screen bg-gray-50">
      <header className="dark:bg-gray-800 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="dark:text-gray-200 text-2xl font-bold text-gray-900">
              University Dashboard
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <nav className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-50 dark:bg-blue-800 text-blue-600 dark:text-blue-200 font-medium"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
          variants={statsContainer}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={cardVariants}
              whileHover="hover"
              className={`${stat.color} ${stat.hover} rounded-lg border transition-colors cursor-pointer`}
            >
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-90 mb-1">
                      {stat.title}
                    </p>
                    {loading ? (
                      <motion.div className="h-7 w-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
                    ) : (
                      <h3 className="text-2xl font-bold">
                        {counts[stat.id as keyof EntityCounts]}
                      </h3>
                    )}
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-gray-800 bg-opacity-50">
                    {stat.icon}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="dark:text-gray-200 text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 dark:text-gray-300">
            {quickActions.map((action, index) => (
              <Link to={action.link} key={index} title={action.label}>
                <motion.button
                  className={`${action.bg} ${action.hover} p-4 rounded-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center transition-colors w-full`}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    window.location.href = action.link;
                  }}
                >
                  <div className={`${action.text} p-3 rounded-full mb-2`}>
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </motion.button>
              </Link>
            ))}
          </div>
        </motion.div>
      </main>
      {/* Remove DarkModeNew and WhatsAppButton from DashboardPage. These should be in the sidebar for mobile/tablet screens only. */}
    </div>
  );
};

export default Dashboard;
