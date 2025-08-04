import { useEffect, useState } from "react";
import { CiDark, CiLight } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";

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
        <motion.button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="relative bg-gradient-to-br from-gray-700 to-gray-900 dark:from-yellow-300 dark:to-yellow-500 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-8 h-8 flex items-center justify-center overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Animated background */}
            <motion.div 
                className="absolute inset-0 rounded-full"
                initial={false}
                animate={{
                    backgroundColor: theme === "dark" ? "#fcd34d" : "#1f2937",
                }}
                transition={{ duration: 0.3 }}
            />
            
            {/* Sun/Moon icons with animation */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={theme}
                    initial={{ opacity: 0, rotate: theme === "dark" ? 90 : -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: theme === "dark" ? -90 : 90 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10"
                >
                    {theme === "dark" ? (
                        <CiLight className="text-2xl text-gray-900" />
                    ) : (
                        <CiDark className="text-2xl text-gray-100" />
                    )}
                </motion.div>
            </AnimatePresence>
            
            {/* Glow effect */}
            <motion.div
                className="absolute inset-0 rounded-full opacity-0 dark:opacity-20"
                animate={{
                    boxShadow: theme === "dark" ? "0 0 20px 5px rgba(252, 211, 77, 0.5)" : "none"
                }}
                transition={{ duration: 0.3 }}
            />
        </motion.button>
    );
}