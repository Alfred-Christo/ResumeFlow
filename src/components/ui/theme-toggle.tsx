"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = window.document.documentElement;
    const saved = localStorage.getItem("theme");
    if (saved) {
      setTheme(saved);
      root.classList.toggle("dark", saved === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      root.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    root.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="ml-2 rounded-full p-2 bg-muted/60 hover:bg-muted transition-colors border border-border shadow button-glow"
      type="button"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-400" />
      ) : (
        <Moon className="h-5 w-5 text-blue-500" />
      )}
    </button>
  );
}
