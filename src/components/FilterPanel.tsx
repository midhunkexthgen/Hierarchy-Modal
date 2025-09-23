import { Filter, X } from "lucide-react";
import { useState, useEffect } from "react";
import type { FilterConfig, AppliedFilter } from "../DashbiardExampleProps";
import FilterComponent from "./FilterComponent";

const FilterPanel: React.FC<{
  filters: FilterConfig[];
  appliedFilters: AppliedFilter[];
  onFiltersChange: (filters: AppliedFilter[]) => void;
  onClose: () => void;
}> = ({ filters, appliedFilters, onFiltersChange, onClose }) => {
  const [localFilters, setLocalFilters] =
    useState<AppliedFilter[]>(appliedFilters);

  useEffect(() => {
    setLocalFilters(appliedFilters);
  }, [appliedFilters]);

  const handleFilterChange = (filterId: string, value: any) => {
    setLocalFilters((prev) => {
      const existing = prev.find((f) => f.filterId === filterId);
      if (existing) {
        return prev.map((f) => (f.filterId === filterId ? { ...f, value } : f));
      } else {
        return [...prev, { filterId, value }];
      }
    });
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const resetFilters = () => {
    const defaultFilters = filters
      .filter((f) => f.defaultValue !== undefined)
      .map((f) => ({ filterId: f.id, value: f.defaultValue }));
    setLocalFilters(defaultFilters);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg min-w-64">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {filters.map((filter) => {
          const appliedFilter = localFilters.find(
            (f) => f.filterId === filter.id
          );
          return (
            <FilterComponent
              key={filter.id}
              filter={filter}
              value={appliedFilter?.value || filter.defaultValue}
              onChange={(value) => handleFilterChange(filter.id, value)}
            />
          );
        })}
      </div>

      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
        <button
          onClick={resetFilters}
          className="px-3 py-1 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={applyFilters}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex-1"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};
export default FilterPanel;