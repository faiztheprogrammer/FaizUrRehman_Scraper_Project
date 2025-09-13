import React, { useState, useEffect, useRef } from "react";
import Header from "./Header.jsx";
import HeroSection from "./HeroSection.jsx";
import SidebarFilters from "./SidebarFilters.jsx";
import JobList from "./JobList.jsx";
import JobEditModal from "./JobEditModal.jsx";
import JobAddModal from "./JobAddModal.jsx";
import apiClient from "./api.jsx";

function App() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    location: "All",
    job_type: "All",
    sort: "newest",
    tags: [],
  });
  const [availableLocations, setAvailableLocations] = useState([]);
  const [availableJobTypes, setAvailableJobTypes] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const isInitialMount = useRef(true);

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.keyword) params.append("keyword", filters.keyword);
      if (filters.location && filters.location !== "All")
        params.append("location", filters.location);
      if (filters.job_type && filters.job_type !== "All")
        params.append("job_type", filters.job_type);
      if (filters.tags && filters.tags.length > 0)
        params.append("tags", filters.tags.join(","));
      if (filters.sort) params.append("sort", filters.sort);
      const response = await apiClient.get("/jobs", { params });
      setJobs(response.data);
    } catch (err) {
      console.error("Failed to fetch jobs.", err);
    }
  };

  const fetchMasterData = async () => {
    try {
      const response = await apiClient.get("/jobs");
      const allJobs = response.data;
      setAvailableLocations([
        ...new Set(allJobs.map((j) => j.location).filter(Boolean)),
      ]);
      setAvailableJobTypes([
        ...new Set(allJobs.map((j) => j.job_type).filter(Boolean)),
      ]);
      const allTags = new Set();
      allJobs.forEach((j) => {
        if (j.tags)
          j.tags.split(",").forEach((tag) => {
            if (tag.trim()) allTags.add(tag.trim());
          });
      });
      setAvailableTags([...allTags].sort());
    } catch (error) {
      console.error("Failed to fetch master data", error);
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const debounceTimer = setTimeout(() => {
      fetchJobs();
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [filters]);

  useEffect(() => {
    fetchMasterData();
    fetchJobs();
  }, []);

  const refreshData = () => {
    setIsAddModalOpen(false);
    setEditingJob(null);
    fetchMasterData();
    fetchJobs();
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await apiClient.delete(`/jobs/${jobId}`);
      refreshData();
    } catch (error) {
      console.error("Failed to delete job:", error);
      alert("Could not delete the job.");
    }
  };

  const setKeywordFilter = (keyword) => {
    setFilters((prev) => ({ ...prev, keyword }));
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Header onAddJobClick={() => setIsAddModalOpen(true)} />
      <main className="container mx-auto p-4 md:p-8">
        <HeroSection keyword={filters.keyword} setKeyword={setKeywordFilter} />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <SidebarFilters
              filters={filters}
              setFilters={setFilters}
              locations={availableLocations}
              jobTypes={availableJobTypes}
              tags={availableTags}
            />
          </aside>
          <section className="lg:col-span-3">
            <JobList
              jobs={jobs}
              filters={filters}
              setFilters={setFilters}
              onJobDeleted={handleDeleteJob}
              onEdit={setEditingJob}
            />
          </section>
        </div>
      </main>
      {isAddModalOpen && (
        <JobAddModal
          onClose={() => setIsAddModalOpen(false)}
          onJobAdded={refreshData}
        />
      )}
      <JobEditModal
        job={editingJob}
        onClose={() => setEditingJob(null)}
        onJobUpdated={refreshData}
      />
    </div>
  );
}

export default App;
