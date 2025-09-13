import React, { useState } from "react";

// A reusable component to handle the expand/collapse UI
function CollapsibleSection({ title, children, defaultCollapsed = false }) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className="">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex justify-between items-center py-3 text-left font-semibold text-gray-800 focus:outline-none"
      >
        <span>{title}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${
            isCollapsed ? "" : "rotate-180"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {!isCollapsed && <div className="">{children}</div>}
    </div>
  );
}

export default CollapsibleSection;
