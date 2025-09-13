import CollapsibleSection from "./CollapsibleSection.jsx";

function SidebarFilters({ filters, setFilters, locations, jobTypes, tags }) {
  const handleInputChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    setFilters((prev) => {
      const currentTags = prev.tags || [];
      if (checked) {
        return { ...prev, tags: [...currentTags, value] };
      } else {
        return { ...prev, tags: currentTags.filter((tag) => tag !== value) };
      }
    });
  };

  const resetFilters = () => {
    setFilters({
      keyword: filters.keyword,
      location: "All",
      job_type: "All",
      sort: "newest",
      tags: [],
    });
  };

  return (
    <div className="p-6 bg-white border rounded-xl shadow-sm lg:sticky lg:top-20">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-slate-900">Filters</h3>
        <button
          type="button"
          onClick={resetFilters}
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          Reset
        </button>
      </div>

      <CollapsibleSection title="Location">
        <select
          name="location"
          value={filters.location}
          onChange={handleInputChange}
          className="w-full mt-2 p-2 border rounded-md"
        >
          <option value="All">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc.length > 25 ? `${loc.substring(0, 22)}...` : loc}
            </option>
          ))}
        </select>
      </CollapsibleSection>

      <CollapsibleSection title="Job Type">
        <select
          name="job_type"
          value={filters.job_type}
          onChange={handleInputChange}
          className="w-full mt-2 p-2 border rounded-md"
        >
          <option value="All">All Job Types</option>
          {jobTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </CollapsibleSection>

      <CollapsibleSection title="Sort By">
        <select
          name="sort"
          value={filters.sort}
          onChange={handleInputChange}
          className="w-full mt-2 p-2 border rounded-md"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </CollapsibleSection>

      <CollapsibleSection title="Tags" defaultCollapsed={true}>
        <div className="space-y-1 max-h-60 overflow-y-auto pr-2 mt-2">
          {tags.map((tag) => (
            <label
              key={tag}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                value={tag}
                checked={filters.tags?.includes(tag)}
                onChange={handleTagChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-800">{tag}</span>
            </label>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}

export default SidebarFilters;
