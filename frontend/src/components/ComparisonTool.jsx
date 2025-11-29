import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

const ComparisonTool = ({ items, itemType, onClose }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const addToComparison = (item) => {
    if (selectedItems.length < 3 && !selectedItems.find(i => i.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const removeFromComparison = (itemId) => {
    setSelectedItems(selectedItems.filter(i => i.id !== itemId));
  };

  const filteredItems = items.filter(item =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getComparisonFields = () => {
    if (itemType === 'university') {
      return [
        { key: 'country', label: 'Country' },
        { key: 'city', label: 'City' },
        { key: 'ranking', label: 'Ranking' },
        { key: 'type', label: 'Type' },
        { key: 'website', label: 'Website', isLink: true },
      ];
    } else if (itemType === 'course') {
      return [
        { key: 'duration', label: 'Duration' },
        { key: 'degree_type', label: 'Degree Type' },
        { key: 'field', label: 'Field' },
        { key: 'description', label: 'Description' },
      ];
    } else if (itemType === 'career') {
      return [
        { key: 'salary_range', label: 'Salary Range' },
        { key: 'growth_rate', label: 'Growth Rate' },
        { key: 'industry', label: 'Industry' },
        { key: 'description', label: 'Description' },
      ];
    }
    return [];
  };

  return (
    <motion.div
      className="comparison-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="comparison-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="modal-header">
          <h2 className="modal-title">Compare {itemType}s</h2>
          <button onClick={onClose} className="close-btn">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="modal-body">
          {selectedItems.length < 3 && (
            <div className="search-section">
              <input
                type="text"
                placeholder={`Search ${itemType}s to compare...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />

              <div className="items-grid">
                {filteredItems.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="item-card"
                    onClick={() => addToComparison(item)}
                  >
                    <div className="item-name">{item.name}</div>
                    <button className="add-item-btn">
                      <PlusIcon className="w-5 h-5" />
                      Add to compare
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedItems.length > 0 && (
            <div className="comparison-table">
              <table>
                <thead>
                  <tr>
                    <th className="field-column">Feature</th>
                    {selectedItems.map((item) => (
                      <th key={item.id} className="item-column">
                        <div className="item-header">
                          <span>{item.name}</span>
                          <button
                            onClick={() => removeFromComparison(item.id)}
                            className="remove-btn"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getComparisonFields().map((field) => (
                    <tr key={field.key}>
                      <td className="field-label">{field.label}</td>
                      {selectedItems.map((item) => (
                        <td key={item.id} className="field-value">
                          {field.isLink && item[field.key] ? (
                            <a
                              href={item[field.key]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="value-link"
                            >
                              Visit
                            </a>
                          ) : (
                            item[field.key] || '-'
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedItems.length === 0 && (
            <div className="empty-comparison">
              <p>Select up to 3 {itemType}s to compare</p>
            </div>
          )}
        </div>
      </motion.div>

      <style>{`
        .comparison-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .comparison-modal {
          background: white;
          border-radius: 16px;
          max-width: 1200px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #111827;
          text-transform: capitalize;
        }

        .close-btn {
          padding: 0.5rem;
          background: transparent;
          border: none;
          color: #6b7280;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .modal-body {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
        }

        .search-section {
          margin-bottom: 2rem;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }

        .item-card {
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .item-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
          transform: translateY(-2px);
        }

        .item-name {
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.5rem;
        }

        .add-item-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
        }

        .comparison-table {
          overflow-x: auto;
        }

        .comparison-table table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .comparison-table th,
        .comparison-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        .field-column {
          width: 150px;
          font-weight: 700;
          background: #f9fafb;
          position: sticky;
          left: 0;
          z-index: 10;
        }

        .item-column {
          min-width: 200px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
        }

        .remove-btn {
          padding: 0.25rem;
          background: rgba(239, 68, 68, 0.1);
          border: none;
          color: #ef4444;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .remove-btn:hover {
          background: #ef4444;
          color: white;
        }

        .field-label {
          font-weight: 600;
          color: #374151;
          background: #f9fafb;
          position: sticky;
          left: 0;
          z-index: 10;
        }

        .field-value {
          color: #6b7280;
        }

        .value-link {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 600;
        }

        .value-link:hover {
          text-decoration: underline;
        }

        .empty-comparison {
          text-align: center;
          padding: 4rem 2rem;
          color: #6b7280;
          font-size: 1.125rem;
        }

        @media (max-width: 768px) {
          .items-grid {
            grid-template-columns: 1fr;
          }

          .comparison-table {
            font-size: 0.875rem;
          }

          .comparison-table th,
          .comparison-table td {
            padding: 0.75rem;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default ComparisonTool;
