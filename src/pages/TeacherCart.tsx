import React from "react";
import { Link } from "react-router-dom";
import type { Teacher } from "../types";


interface TeacherCartProps {
  teacher: Teacher;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const AcademicIcon = ({ 
  icon, 
  className = "" 
}: { 
  icon: "email" | "phone" | "address" | "age" | "department" | "faculty" | "edit" | "delete" | "research";
  className?: string;
}) => {
  const icons = {
    email: (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    phone: (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    address: (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    age: (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    department: (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    faculty: (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
      </svg>
    ),
    edit: (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    delete: (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    research: (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  };
  
  return icons[icon];
};

export const TeacherCart: React.FC<TeacherCartProps> = ({ teacher, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 dark:bg-gray-800">
      {/* Header with avatar */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white">
        <div className="flex items-center">
          {teacher.avatarUrl ? (
            <img 
              src={teacher.avatarUrl} 
              alt={teacher.fullName}
              className="w-16 h-16 rounded-full border-2 border-white mr-4 object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white text-2xl font-bold mr-4">
              {teacher.fullName.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold">{teacher.fullName}</h3>
            <p className="text-sm opacity-90">{teacher.degree}</p>
          </div>
        </div>
      </div>
      
      {/* Body */}
      <div className="p-4">
        <div className="space-y-3 mb-4">
          <div className="flex items-center">
            <AcademicIcon className="text-gray-500 mr-2" icon="email" />
            <span className="text-gray-700">{teacher.email}</span>
          </div>
          
          <div className="flex items-center">
            <AcademicIcon className="text-gray-500 mr-2" icon="phone" />
            <span className="text-gray-700">{teacher.phone}</span>
          </div>
          
          <div className="flex items-center">
            <AcademicIcon className="text-gray-500 mr-2" icon="address" />
            <span className="text-gray-700">{teacher.address}</span>
          </div>
          
          <div className="flex items-center">
            <AcademicIcon className="text-gray-500 mr-2" icon="age" />
            <span className="text-gray-700">Age: {teacher.age}</span>
          </div>
        </div>
        
        {/* Research */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-600 mb-1">Research Focus:</h4>
          <p className="text-indigo-600 italic">{teacher.research}</p>
        </div>
        
        {/* Department */}
        <div className="mb-4">
          <span className="bg-blue-50 text-blue-800 text-xs px-3 py-1 rounded-full flex items-center">
            <AcademicIcon className="mr-1" icon="department" />
            {teacher.departmentName}
          </span>
        </div>
        
        {/* Actions */}
        <div className="flex justify-between items-center border-t border-gray-100 pt-3">
          <Link 
            to={`/teacher/${teacher.id}`}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            View Profile →
          </Link>
          <div className="flex space-x-2">
            <button 
              onClick={() => onEdit(teacher.id)}
              className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-xs"
            >
              <AcademicIcon className="mr-1" icon="edit" />
              Edit
            </button>
            <button 
              onClick={() => onDelete(teacher.id)}
              className="flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-xs"
            >
              <AcademicIcon className="mr-1" icon="delete" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
