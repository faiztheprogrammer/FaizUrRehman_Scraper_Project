import React from "react";
import JobForm from "./JobForm.jsx";

function JobEditModal({ job, onClose, onJobUpdated }) {
  if (!job) return null;

  return (
    // Modal backdrop - when clicked, it will close the modal
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose} // Add onClick to the backdrop
    >
      {/* Modal content container - stop propagation to prevent closing when clicking inside */}
      <div
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl relative"
        onClick={(e) => e.stopPropagation()} // Prevents clicks inside the modal from closing it
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>

        <JobForm
          onJobAction={onJobUpdated}
          existingJob={job}
          isEditing={true}
        />
      </div>
    </div>
  );
}

export default JobEditModal;
