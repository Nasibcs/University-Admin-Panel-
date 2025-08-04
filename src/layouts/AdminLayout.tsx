import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FaBars, FaTimes, FaUserCircle, FaBook, FaGraduationCap, FaChalkboardTeacher, FaUniversity, FaCamera, FaSave, FaWhatsapp } from "react-icons/fa";
import { MdDashboard, MdLibraryBooks, MdSchool, MdSettings } from "react-icons/md";
import DarkModeNew from "../components/DarkModeNew";

interface AdminProfile {
  username: string;
  email: string;
  profilePicture: string;
}

const AdminLayout = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("admin-token");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profile, setProfile] = useState<AdminProfile>({
    username: "nasib",
    email: "nasib@gmail.com",
    profilePicture: ""
  });
  const [tempProfile, setTempProfile] = useState<AdminProfile>({ ...profile });
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const sidebarRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
    const savedProfile = localStorage.getItem("admin-profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setTempProfile(JSON.parse(savedProfile));
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !(sidebarRef.current as any).contains(event.target)) {
        setSidebarOpen(false);
      }
      if (modalRef.current && !(modalRef.current as any).contains(event.target) && profileModalOpen) {
        setProfileModalOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileModalOpen]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    navigate("/");
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTempProfile({
            ...tempProfile,
            profilePicture: event.target.result as string
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentPassword || newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        alert("New passwords don't match!");
        return;
      }
      if (newPassword.length < 8) {
        alert("Password must be at least 8 characters long");
        return;
      }
      alert("Password changed successfully!");
    }
    
    const updatedProfile = { ...tempProfile };
    setProfile(updatedProfile);
    localStorage.setItem("admin-profile", JSON.stringify(updatedProfile));
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    
    setProfileModalOpen(false);
    setFileInputKey(Date.now());
  };

  return (
    <div className="dark:bg-gray-900 flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed z-40 top-0 left-0 h-full w-72 bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-2xl rounded-r-3xl border-r-2 border-indigo-700 dark:border-gray-800 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static flex flex-col`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Logo Section */}
          <div className="flex items-center gap-3 p-6 pb-4 border-b border-indigo-700 dark:border-gray-700">
            <img src="/favicon/favicon.svg" alt="Logo" className="w-10 h-10 rounded-full shadow-lg border-2 border-indigo-400 dark:border-gray-700 bg-white" />
            <span className="text-2xl font-bold text-white tracking-wide">Univ Admin</span>
          </div>

          {/* Dark Mode Toggle - Desktop */}
          <div className="hidden md:flex items-center justify-center p-3 border-b border-indigo-700 dark:border-gray-700">
            <DarkModeNew />
          </div>

          {/* Navigation Section */}
          <nav className="flex flex-col gap-2 p-4">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl text-indigo-100 hover:bg-indigo-600 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm ${
                isActive ? "bg-indigo-700 dark:bg-gray-700 font-semibold shadow-md" : ""
              }`}
            >
              <MdDashboard className="text-xl" />
              Dashboard
            </NavLink>
            <NavLink 
              to="/dashboard/faculties" 
              className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl text-indigo-100 hover:bg-indigo-600 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm ${
                isActive ? "bg-indigo-700 dark:bg-gray-700 font-semibold shadow-md" : ""
              }`}
            >
              <FaGraduationCap className="text-xl" />
              Faculties
            </NavLink>
            <NavLink 
              to="/dashboard/departments" 
              className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl text-indigo-100 hover:bg-indigo-600 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm ${
                isActive ? "bg-indigo-700 dark:bg-gray-700 font-semibold shadow-md" : ""
              }`}
            >
              <MdSchool className="text-xl" />
              Departments
            </NavLink>
            <NavLink 
              to="/dashboard/teachers" 
              className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl text-indigo-100 hover:bg-indigo-600 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm ${
                isActive ? "bg-indigo-700 dark:bg-gray-700 font-semibold shadow-md" : ""
              }`}
            >
              <FaChalkboardTeacher className="text-xl" />
              Teachers
            </NavLink>
            <NavLink 
              to="/dashboard/semesters" 
              className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl text-indigo-100 hover:bg-indigo-600 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm ${
                isActive ? "bg-indigo-700 dark:bg-gray-700 font-semibold shadow-md" : ""
              }`}
            >
              <FaBook className="text-xl" />
              Semesters
            </NavLink>
            <NavLink 
              to="/dashboard/books" 
              className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl text-indigo-100 hover:bg-indigo-600 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm ${
                isActive ? "bg-indigo-700 dark:bg-gray-700 font-semibold shadow-md" : ""
              }`}
            >
              <MdLibraryBooks className="text-xl" />
              Books
            </NavLink>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-indigo-700 dark:border-gray-700">
          {/* Profile Settings Button */}
          <button
            onClick={() => setProfileModalOpen(true)}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-indigo-100 hover:bg-indigo-700 dark:hover:bg-gray-700 transition-colors mb-3"
          >
            <MdSettings className="text-lg" />
            Profile Settings
          </button>
          
          {/* Contact Developer Section */}
          <div className="mt-4 text-center text-indigo-100 text-sm">
            <p className="mb-2">Need help? Contact developer:</p>
            <a 
              href="https://wa.me/93795582109" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              <FaWhatsapp className="text-lg" />
              WhatsApp Support
            </a>
            <p className="mt-2 text-xs opacity-80">Email:nasibburhan4@gmail.com</p>
          </div>
          
          {/* Dark Mode Toggle - Mobile */}
          <div className="md:hidden mt-4 flex justify-center">
            <DarkModeNew />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */} 
        <header className="flex justify-between items-center p-4 shadow-md bg-white dark:bg-gray-800 border-b dark:border-gray-700 md:hidden">
          <button 
            onClick={toggleSidebar} 
            className="text-indigo-600 dark:text-indigo-400 text-2xl hover:bg-indigo-50 dark:hover:bg-gray-700 p-2 rounded-full"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h2 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FaUniversity className="text-indigo-600 dark:text-indigo-400" />
            Admin
          </h2>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm shadow"
          >
            Logout
          </button>
        </header>
         
        {/* Desktop Header */}
        <header className="hidden md:flex justify-between items-center px-6 py-4 shadow-md bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <FaUniversity className="text-indigo-600 dark:text-indigo-400" />
            <span>Administration Panel</span>
          </h2>
          <div className="flex items-center gap-6">
            {/* Profile */}
            <div 
              className="flex items-center gap-3 border-l border-gray-200 dark:border-gray-700 pl-4 cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 p-2 rounded-lg"
              onClick={() => setProfileModalOpen(true)}
            >
              <div className="relative">
                {profile.profilePicture ? (
                  <img 
                    src={profile.profilePicture} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-indigo-600 dark:text-indigo-400 text-3xl" />
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{profile.username}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
              </div>
            </div>

            {/* Logout */}
            <button 
              onClick={handleLogout} 
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
            >
              <span>Logout</span>
            </button>
          </div>
        </header>
         
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-blue-50 to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Profile Settings Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Profile Settings</h3>
                <button 
                  onClick={() => setProfileModalOpen(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleProfileUpdate}>
                {/* Profile Picture */}
                <div className="mb-6 flex flex-col items-center">
                  <div className="relative mb-4">
                    {tempProfile.profilePicture ? (
                      <img 
                        src={tempProfile.profilePicture} 
                        alt="Profile Preview" 
                        className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 dark:border-gray-700"
                      />
                    ) : (
                      <FaUserCircle className="text-indigo-500 dark:text-indigo-400 text-8xl" />
                    )}
                    <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700">
                      <FaCamera />
                      <input 
                        key={fileInputKey}
                        type="file" 
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Click camera icon to change profile picture</p>
                </div>

                {/* Username */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                  <input
                    type="text"
                    value={tempProfile.username}
                    onChange={(e) => setTempProfile({...tempProfile, username: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={tempProfile.email}
                    onChange={(e) => setTempProfile({...tempProfile, email: e.target.value})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Password Change Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Change Password</h4>
                  
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter current password"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileModalOpen(false);
                      setTempProfile({ ...profile });
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
                  >
                    <FaSave />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;