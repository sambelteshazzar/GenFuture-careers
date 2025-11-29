import React from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const SearchFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  filters, 
  setFilters,
  onSearch 
}) => {
  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  return (
    <motion.div 
      className="search-filters"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="search-container">
        {/* Main Search */}
        <div className="search-box">
          <MagnifyingGlassIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search universities, courses, or careers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            className="search-input"
          />
          <button className="search-button" onClick={onSearch}>
            Search
          </button>
        </div>

        {/* Filters */}
        <div className="filters-container">
          <div className="filter-icon">
            <FunnelIcon className="w-5 h-5" />
          </div>
          
          <div className="filters-row">
            <select
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              className="filter-select"
            >
              <option value="">All Countries</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="GH">Ghana</option>
              <option value="NG">Nigeria</option>
              <option value="KE">Kenya</option>
              <option value="ZA">South Africa</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="research">Research</option>
              <option value="community">Community</option>
            </select>

            <select
              value={filters.ranking}
              onChange={(e) => handleFilterChange('ranking', e.target.value)}
              className="filter-select"
            >
              <option value="">All Rankings</option>
              <option value="top100">Top 100</option>
              <option value="top500">Top 500</option>
              <option value="top1000">Top 1000</option>
            </select>

            <select
              value={filters.field}
              onChange={(e) => handleFilterChange('field', e.target.value)}
              className="filter-select"
            >
              <option value="">All Fields</option>
              <option value="engineering">Engineering</option>
              <option value="business">Business</option>
              <option value="medicine">Medicine</option>
              <option value="arts">Arts & Humanities</option>
              <option value="science">Natural Sciences</option>
              <option value="social">Social Sciences</option>
              <option value="technology">Technology</option>
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchFilters;