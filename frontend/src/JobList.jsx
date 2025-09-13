import JobCard from "./JobCard.jsx";

function JobList({ jobs, filters, setFilters, onJobDeleted, onEdit }) {
  const removeFilter = (filterKey, valueToRemove = null) => {
    if (filterKey === "tags" && valueToRemove) {
      setFilters((prev) => ({
        ...prev,
        tags: prev.tags.filter((tag) => tag !== valueToRemove),
      }));
    } else if (["location", "job_type"].includes(filterKey)) {
      setFilters((prev) => ({ ...prev, [filterKey]: "All" }));
    }
  };
  const activeFiltersExist =
    (filters.location && filters.location !== "All") ||
    (filters.job_type && filters.job_type !== "All") ||
    (filters.tags && filters.tags.length > 0);
  return (
    <div>
      {activeFiltersExist && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg flex items-center flex-wrap gap-2">
          <h4 className="font-semibold text-sm text-gray-800">
            Active Filters:
          </h4>
          {filters.location !== "All" && (
            <Chip
              label={filters.location}
              onRemove={() => removeFilter("location")}
            />
          )}
          {filters.job_type !== "All" && (
            <Chip
              label={filters.job_type}
              onRemove={() => removeFilter("job_type")}
            />
          )}
          {filters.tags?.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onRemove={() => removeFilter("tags", tag)}
            />
          ))}
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Job Listings</h1>
        <span className="text-sm text-gray-500 font-medium">
          Showing {jobs.length} results
        </span>
      </div>
      <div className="space-y-4">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={onEdit}
              onDelete={onJobDeleted}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border">
            <h3 className="text-lg font-semibold text-gray-700">
              No Jobs Found
            </h3>
            <p className="text-gray-500 mt-1">
              Try adjusting your filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span className="flex items-center bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
      {label}
      <button
        onClick={onRemove}
        className="ml-2 font-bold text-blue-600 hover:text-blue-800"
      >
        &times;
      </button>
    </span>
  );
}

export default JobList;
