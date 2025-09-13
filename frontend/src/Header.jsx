import React, { useState, useEffect } from "react";

function Header({ onAddJobClick }) {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 transition-all duration-300 ${
        hasScrolled ? "py-2" : "py-4"
      }`}
    >
      <nav className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          <span className="text-slate-700">ActuarialAxis</span>
        </div>
        <button
          onClick={onAddJobClick}
          className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Add a New Job
        </button>
      </nav>
    </header>
  );
}

export default Header;
