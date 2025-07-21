import { useState } from 'react';
import { Doctor } from '@/types';

export interface DoctorSearchPaginationProps {
  doctors: Doctor[];
  onFilteredDoctorsChange: (doctors: Doctor[]) => void;
}

function DoctorSearchPagination({ doctors, onFilteredDoctorsChange }: DoctorSearchPaginationProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const itemsPerPage = 5;

  // Apply filters and search
  const filteredDoctors = doctors.filter((doctor) => {
    // Apply filter
    if (filter === 'available' && !doctor.isAvailable) return false;
    // Apply search
    if (
      searchTerm &&
      !doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !doctor.specialties?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDoctors.slice(indexOfFirstItem, indexOfLastItem);

  // Update parent component with filtered and paginated doctors
  useState(() => {
    onFilteredDoctorsChange(currentItems);
  }, [currentItems, onFilteredDoctorsChange]);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle filter change
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="mb-3">
      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search doctors by name or specialty..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page when search changes
          }}
          className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Filter Buttons */}
      <div className="overflow-x-auto scrollbar-hide py-1 mb-3">
        <div className="flex space-x-2 whitespace-nowrap pb-1">
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'available' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => handleFilterChange('available')}
          >
            Available
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'top' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => handleFilterChange('top')}
          >
            Top Rated
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'new' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => handleFilterChange('new')}
          >
            New
          </button>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex space-x-1">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              &laquo;
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Show limited number of page buttons
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNumber
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              }
              // Show ellipsis
              if (
                (pageNumber === currentPage - 2 && pageNumber > 2) ||
                (pageNumber === currentPage + 2 && pageNumber < totalPages - 1)
              ) {
                return (
                  <span key={pageNumber} className="px-2 py-1">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              &raquo;
            </button>
          </div>
        </div>
      )}

      {/* Results summary */}
      <div className="text-sm text-gray-500 mt-2 text-center">
        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredDoctors.length)} of {filteredDoctors.length}{' '}
        doctors
      </div>
    </div>
  );
}

export default DoctorSearchPagination;
