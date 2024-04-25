import { Lightbulb, LightbulbOff } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Theme() {
  const [isDark, setIsDark] = useState(
    typeof window !== "undefined" &&
      window.localStorage.getItem("theme") === "dark"
      ? true
      : false
  );

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const htmlEl = document.documentElement;
    if (
      localStorage.getItem("theme") &&
      localStorage.getItem("theme") === "dark"
    ) {
      htmlEl.classList.add(localStorage.getItem("theme"));
      setIsDark(true);
    } else {
      localStorage.setItem("theme", "light");
    }
  }, []);

  if (!isMounted) return false;

  const changeTheme = () => {
    const htmlEl = document.documentElement;
    if (localStorage.getItem("theme") === "light") {
      htmlEl.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    } else if (localStorage.getItem("theme") === "dark") {
      htmlEl.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    }
  };

  return (
    <div className="absolute top-4 right-4 md:right-auto md:left-4 z-50">
      {isDark ? (
        <>
          <button
            className="p-1 border border-yellow-500 shadow-xl shadow-yellow-500 rounded-full"
            onClick={changeTheme}
          >
            <Lightbulb className="text-yellow-500 w-7 h-7 rotate-180" />
          </button>
        </>
      ) : (
        <>
          <button
            className="p-1 border border-indigo-600 rounded-full"
            onClick={changeTheme}
          >
            <LightbulbOff className="text-indigo-600 w-7 h-7 rotate-180" />
          </button>
        </>
      )}
    </div>
  );
}
