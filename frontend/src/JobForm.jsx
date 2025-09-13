import React, { useState, useEffect } from "react";
import apiClient from "./api.jsx";

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function JobForm({ onJobAction, existingJob, isEditing = false }) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [tags, setTags] = useState("");
  const [postingDate, setPostingDate] = useState(getTodayDateString());
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditing && existingJob) {
      setTitle(existingJob.title);
      setCompany(existingJob.company);
      setLocation(existingJob.location);
      setJobType(existingJob.job_type || "Full-time");
      setTags(existingJob.tags || "");
      const date = existingJob.posting_date
        ? new Date(existingJob.posting_date).toISOString().split("T")[0]
        : getTodayDateString();
      setPostingDate(date);
    } else {
      setPostingDate(getTodayDateString());
    }
  }, [isEditing, existingJob]);

  const validateForm = () => {
    const errors = {};
    if (!title.trim()) errors.title = "Title is required.";
    if (!company.trim()) errors.company = "Company is required.";
    if (!location.trim()) errors.location = "Location is required.";
    if (!postingDate) errors.postingDate = "Posting date is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!validateForm()) return;

    setIsLoading(true);
    const jobData = {
      title,
      company,
      location,
      job_type: jobType,
      tags,
      posting_date: postingDate,
    };

    try {
      let response;
      if (isEditing) {
        response = await apiClient.put(`/jobs/${existingJob.id}`, jobData);
        setSuccess(`Job "${response.data.title}" updated successfully!`);
      } else {
        response = await apiClient.post("/jobs", jobData);
        setSuccess(`Job "${response.data.title}" added successfully!`);
      }
      if (!isEditing) {
        setTitle("");
        setCompany("");
        setLocation("");
        setTags("");
        setPostingDate(getTodayDateString());
      }
      if (onJobAction) onJobAction();
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={
        !isEditing
          ? "p-6 bg-white border rounded-xl shadow-sm space-y-4"
          : "space-y-4"
      }
    >
      <h2 className="text-2xl font-bold text-gray-800">
        {isEditing ? `Editing Job` : "Add a New Job"}
      </h2>
      {success && (
        <div className="p-3 bg-green-100 text-green-800 rounded-lg">
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-100 text-red-800 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
        {/* All input fields ... */}
        <div className="md:col-span-1">
          <input
            type="text"
            placeholder="Job Title *"
            value={title}
            className={`w-full p-2 border rounded-md ${
              formErrors.title ? "border-red-500" : "border-gray-300"
            }`}
            onChange={(e) => setTitle(e.target.value)}
          />
          <p className="text-red-500 text-xs mt-1 h-4">
            {formErrors.title || ""}
          </p>
        </div>
        <div className="md:col-span-1">
          <input
            type="text"
            placeholder="Company *"
            value={company}
            className={`w-full p-2 border rounded-md ${
              formErrors.company ? "border-red-500" : "border-gray-300"
            }`}
            onChange={(e) => setCompany(e.target.value)}
          />
          <p className="text-red-500 text-xs mt-1 h-4">
            {formErrors.company || ""}
          </p>
        </div>
        <div className="md:col-span-1">
          <input
            type="text"
            placeholder="Location *"
            value={location}
            className={`w-full p-2 border rounded-md ${
              formErrors.location ? "border-red-500" : "border-gray-300"
            }`}
            onChange={(e) => setLocation(e.target.value)}
          />
          <p className="text-red-500 text-xs mt-1 h-4">
            {formErrors.location || ""}
          </p>
        </div>
        <div className="md:col-span-1">
          <input
            type="date"
            value={postingDate}
            className={`w-full p-2 border rounded-md ${
              formErrors.postingDate ? "border-red-500" : "border-gray-300"
            }`}
            onChange={(e) => setPostingDate(e.target.value)}
          />
          <p className="text-red-500 text-xs mt-1 h-4">
            {formErrors.postingDate || ""}
          </p>
        </div>
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-2 border rounded-md border-gray-300"
        />
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="w-full p-2 border rounded-md border-gray-300"
        >
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Internship</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-4 px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
      >
        {isLoading
          ? isEditing
            ? "Saving..."
            : "Adding..."
          : isEditing
          ? "Save Changes"
          : "Add Job"}
      </button>
    </form>
  );
}
export default JobForm;
