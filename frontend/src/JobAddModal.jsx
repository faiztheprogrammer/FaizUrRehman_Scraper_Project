import React from "react";
import JobForm from "./JobForm.jsx"; // Reusing form component

function JobAddModal({ onClose, onJobAdded }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>
        {/* The form is in 'create' mode, so we don't pass any existingJob prop */}
        <JobForm onJobAction={onJobAdded} isEditing={false} />
      </div>
    </div>
  );
}

export default JobAddModal;
