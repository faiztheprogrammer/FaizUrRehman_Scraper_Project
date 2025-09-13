import React, { useState } from "react";

// Pass onEdit and onDelete props correctly from JobList
function JobCard({ job, onEdit, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [areTagsExpanded, setAreTagsExpanded] = useState(false);

  const allTags = job.tags
    ? job.tags
        .split(",")
        .map((t) => t.trim())
        .filter(
          (tag) => tag && tag.toLowerCase() !== job.job_type.toLowerCase()
        )
    : [];
  const visibleTags = areTagsExpanded ? allTags : allTags.slice(0, 5);

  const handleDelete = () => {
    setIsMenuOpen(false);
    // Call the onDelete prop passed from JobList, which is ultimately handleDeleteJob in App
    onDelete(job.id);
  };

  const handleEdit = () => {
    setIsMenuOpen(false);
    onEdit(job);
  };

  return (
    <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
          <div className="text-md text-gray-700 mt-1 flex items-center flex-wrap gap-x-2">
            <span className="font-semibold">{job.job_type}</span>
            <span className="text-gray-400">•</span>
            <span>{job.company}</span>
            <span className="text-gray-400">•</span>
            <span>{job.location}</span>
            <span className="text-gray-400">•</span>
            <span>Posted on {job.posting_date}</span>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          {isMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10"
              onMouseLeave={() => setIsMenuOpen(false)}
            >
              <button
                onClick={handleEdit}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        {visibleTags.map((tag, index) => (
          <span
            key={index}
            className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
        {allTags.length > 5 && !areTagsExpanded && (
          <button
            onClick={() => setAreTagsExpanded(true)}
            className="text-xs text-blue-600 font-semibold hover:underline"
          >
            +{allTags.length - 5} more
          </button>
        )}
      </div>
    </div>
  );
}

export default JobCard;
