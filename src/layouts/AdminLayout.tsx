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

  const sidebarNavClass = ({ isActive }: { isActive: boolean }) =>
    [
      "flex items-center gap-3 rounded-xl border-l-[3px] p-3 text-sm transition-all duration-150",
      isActive
        ? "border-amber-400 bg-white/12 font-semibold text-white shadow-sm ring-1 ring-white/10"
        : "border-transparent text-stone-300 hover:bg-white/6 hover:text-stone-100",
    ].join(" ");

  return (
    <div className="flex h-screen overflow-hidden bg-stone-100 dark:bg-slate-950">
      {/* Sidebar */}
    <aside
  ref={sidebarRef}
  className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950 shadow-xl shadow-slate-900/35 ring-1 ring-white/[0.06] md:translate-x-0 md:static ${
    sidebarOpen ? "translate-x-0" : "-translate-x-full"
  } transform transition-transform duration-300 ease-out`}
>
  <div className="flex flex-1 flex-col">
    <div className="flex items-center gap-3 border-b border-white/10 p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-amber-400 shadow-md shadow-black/25 ring-1 ring-amber-500/30">
      <FaUniversity className="text-xl" />
      </div>
      <div className="min-w-0">
      <span className="block truncate text-[15px] font-bold tracking-tight text-white">Admin Panel</span>
      <span className="block truncate text-[11px] font-medium uppercase tracking-wider text-teal-200/85">University suite</span>
      </div>
    </div>
    
    <nav className="flex flex-grow flex-col gap-1 p-4">
      <NavLink to="/dashboard" end className={sidebarNavClass}>
        <MdDashboard className="shrink-0 text-lg opacity-90" />
        Dashboard
      </NavLink>
      <NavLink to="/dashboard/faculties" className={sidebarNavClass}>
        <FaGraduationCap className="shrink-0 text-lg opacity-90" />
        Faculties
      </NavLink>
      <NavLink to="/dashboard/departments" className={sidebarNavClass}>
        <MdSchool className="shrink-0 text-lg opacity-90" />
        Departments
      </NavLink>
      <NavLink to="/dashboard/teachers" className={sidebarNavClass}>
        <FaChalkboardTeacher className="shrink-0 text-lg opacity-90" />
        Teachers
      </NavLink>
      <NavLink to="/dashboard/semesters" className={sidebarNavClass}>
        <FaBook className="shrink-0 text-lg opacity-90" />
        Semesters
      </NavLink>
      <NavLink to="/dashboard/books" className={sidebarNavClass}>
        <MdLibraryBooks className="shrink-0 text-lg opacity-90" />
        Books
      </NavLink>
    </nav>

    {/* Bottom Section */}
    <div className="border-t border-white/10 p-4">
      <button
        onClick={() => setProfileModalOpen(true)}
        type="button"
        className="mb-4 flex w-full items-center gap-3 rounded-xl border border-white/10 p-3 text-left text-sm font-medium text-stone-200 transition-colors hover:bg-white/8 hover:text-white"
      >
        <MdSettings className="shrink-0 text-lg opacity-90" />
        Profile Settings
      </button>
      
      <div className="text-center text-sm text-stone-300">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-teal-200/75">Need help?</p>
        <a 
          href="https://wa.me/+93795582109" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 font-semibold text-white shadow-md shadow-black/25 transition-colors hover:bg-emerald-700"
        >
          <FaWhatsapp className="text-lg" />
          WhatsApp
        </a>
        <p className="mt-3 max-w-[11rem] mx-auto truncate text-[11px] text-stone-400">nasibburhan4@gmail.com</p>
      </div>
    </div>

    <div className="flex justify-center border-t border-white/10 p-4">
      <DarkModeNew />
    </div>
   
  </div>
</aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */} 
        <header className="flex items-center justify-between border-b border-slate-200/90 bg-white/95 p-4 shadow-sm shadow-slate-900/[0.03] backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 md:hidden">
          <button 
            onClick={toggleSidebar} 
            type="button"
            className="rounded-full p-2 text-xl text-teal-800 transition-colors hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-slate-800"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-stone-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-amber-400 ring-1 ring-amber-500/25"><FaUniversity className="text-sm" /></span>
            Admin
          </h2>
     
          <button 
            onClick={handleLogout} 
            type="button"
            className="rounded-lg bg-red-700 px-3 py-1.5 text-sm font-semibold text-white shadow shadow-red-900/25 transition-colors hover:bg-red-800"
          >
            Logout
          </button>
     
        </header>
         
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between border-b border-slate-200/90 bg-white/95 px-6 py-4 shadow-sm shadow-slate-900/[0.04] backdrop-blur dark:border-slate-700 dark:bg-slate-900/85">
          <h2 className="flex items-center gap-3 text-xl font-semibold tracking-tight text-slate-900 dark:text-stone-100">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-lg text-amber-400 shadow-md ring-1 ring-amber-500/25">
              <FaUniversity aria-hidden />
            </span>
            <span>Administration</span>
          </h2>
          <div className="flex items-center gap-6">
            <div 
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-2 pl-6 transition-colors hover:border-slate-200 hover:bg-stone-50 dark:border-transparent dark:hover:border-slate-600 dark:hover:bg-slate-800/70"
              onClick={() => setProfileModalOpen(true)}
              onKeyDown={(e) => e.key === "Enter" && setProfileModalOpen(true)}
              role="button"
              tabIndex={0}
            >
              <div className="relative">
                {profile.profilePicture ? (
                  <img 
                    src={profile.profilePicture} 
                    alt="" 
                    className="h-10 w-10 rounded-full border-2 border-slate-200 object-cover dark:border-slate-600"
                  />
                ) : (
                  <FaUserCircle className="text-3xl text-teal-700 dark:text-teal-500" aria-hidden />
                )}
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800 dark:text-stone-100">{profile.username}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              type="button"
              className="flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 font-semibold text-white shadow-md shadow-red-900/20 transition-colors hover:bg-red-800"
            >
              Logout
            </button>
          </div>
        </header>
         
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-stone-100 via-slate-50 to-stone-100 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 md:p-6">
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
                        className="h-32 w-32 rounded-full border-4 border-teal-100 object-cover dark:border-slate-600"
                      />
                    ) : (
                      <FaUserCircle className="text-8xl text-teal-700 dark:text-teal-500" />
                    )}
                    <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-teal-700 p-2 text-white shadow-md transition-colors hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500">
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
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/25 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={tempProfile.email}
                    onChange={(e) => setTempProfile({...tempProfile, email: e.target.value})}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/25 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/25 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter current password"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/25 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/25 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                    className="flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2 font-semibold text-white shadow-md shadow-teal-900/25 transition-colors hover:bg-teal-800"
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
