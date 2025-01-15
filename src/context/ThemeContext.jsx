import { createContext, useState, useEffect } from "react";

// Membuat Context untuk tema
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("system"); // Default mengikuti OS

  useEffect(() => {
    // Cek preferensi tema di localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Jika tidak ada, cek preferensi tema OS
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDarkMode ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    // Menyimpan tema yang dipilih ke localStorage
    if (theme === "system") {
      // Jika memilih mengikuti OS, tidak ada perubahan tema yang diatur
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      document.documentElement.classList.toggle("dark", prefersDarkMode);
    } else {
      // Jika memilih dark atau light, terapkan tema sesuai pilihan
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  // Fungsi untuk mengubah tema
  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
