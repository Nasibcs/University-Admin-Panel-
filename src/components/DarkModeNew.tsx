import { useEffect, useState } from "react";
import { CiDark, CiLight } from "react-icons/ci";

export default function DarkModeNew() {
    const [theme, setTheme] = useState(() => {
        // Initialize theme from localStorage or use light as default
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem("theme");
            return savedTheme || "light";
        }
        return "light";
    });
    
    useEffect(() => {
        // Apply the theme class to the HTML element
        const html = document.documentElement;
        if (theme === "dark") {
            html.classList.add("dark");
        } else {
            html.classList.remove("dark");
        }
        // Save to localStorage
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === "dark" ? "light" : "dark");
    };

    return (
        <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="bg-gray-900 dark:bg-yellow-400 p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 w-full mt-2"
        >
            {theme === "dark" ? (
                <CiLight className="text-2xl text-black" />
            ) : (
                <CiDark className="text-2xl text-white" />
            )}
        </button>
    );
}