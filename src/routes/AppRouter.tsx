import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import LoginPage from "../pages/LoginPage";
import FacultyPage from "../pages/FacultyPage";
import DepartmentComponent from "../pages/DepartmentComponent";
import TeachersComponent from "../pages/TeachersComponent";
import SemesterComponent from "../pages/SemesterComponent";
import Book from "../features/Book/Book";
import DashboardComponent from "../pages/DashboardPage";

const AppRouter = () => {
  return (
    <div className="dark:bg-gray-900 min-h-screen">
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route path="/dashboard" element={<AdminLayout />}>
            <Route index element={<DashboardComponent />} />
            <Route path="faculties" element={<FacultyPage />} />{" "}
            {/* ⬅ درست شوی */}
            <Route path="departments" element={<DepartmentComponent />} />{" "}
            {/* ⬅ درست شوی */}
            <Route path="semesters" element={<SemesterComponent />} />{" "}
            {/* ⬅ درست شوی */}
            <Route path="books" element={<Book />} /> {/* ⬅ درست شوی */}
            <Route
              path="departments/:departmentId"
              element={<DepartmentComponent />}
            />
            <Route path="teachers" element={<TeachersComponent />} />
            {/* نورې داخلي صفحې وروسته دلته ورزیاتېږي */}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default AppRouter;