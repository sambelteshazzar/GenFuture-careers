import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getApplications,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats
} from '../services/applications';
import {
  ClipboardDocumentListIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const STATUS_OPTIONS = [
  { value: 'planning', label: 'Planning', color: 'gray' },
  { value: 'applying', label: 'Applying', color: 'blue' },
  { value: 'submitted', label: 'Submitted', color: 'yellow' },
  { value: 'accepted', label: 'Accepted', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'waitlisted', label: 'Waitlisted', color: 'orange' },
];

const ApplicationTracker = ({ userId }) => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    universityName: '',
    courseName: '',
    deadline: '',
  });

  useEffect(() => {
    if (userId) {
      loadApplications();
      loadStats();
    }
  }, [userId]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await getApplications(userId);
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getApplicationStats(userId);
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.universityName.trim()) return;

    try {
      await createApplication(
        userId,
        null,
        formData.universityName,
        formData.courseName || null,
        formData.deadline || null
      );
      setFormData({ universityName: '', courseName: '', deadline: '' });
      setShowAddForm(false);
      loadApplications();
      loadStats();
    } catch (error) {
      console.error('Error creating application:', error);
      alert('Failed to create application');
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      loadApplications();
      loadStats();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (applicationId) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      await deleteApplication(applicationId);
      loadApplications();
      loadStats();
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Failed to delete application');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'submitted':
      case 'applying':
        return <ClockIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <ClipboardDocumentListIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    const option = STATUS_OPTIONS.find(opt => opt.value === status);
    return option ? option.color : 'gray';
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="application-tracker">
      <div className="tracker-header">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ClipboardDocumentListIcon className="w-6 h-6 text-blue-500" />
          Application Tracker
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="add-btn"
        >
          <PlusIcon className="w-5 h-5" />
          Add Application
        </button>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-blue-600">{stats.submitted}</div>
            <div className="stat-label">Submitted</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-green-600">{stats.accepted}</div>
            <div className="stat-label">Accepted</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-gray-600">{stats.planning}</div>
            <div className="stat-label">Planning</div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="add-form"
          >
            <input
              type="text"
              placeholder="University Name *"
              value={formData.universityName}
              onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
              required
              className="form-input"
            />
            <input
              type="text"
              placeholder="Course/Program Name"
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              className="form-input"
            />
            <input
              type="date"
              placeholder="Deadline"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="form-input"
            />
            <div className="form-actions">
              <button type="submit" className="submit-btn">Add</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="cancel-btn">Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <ClipboardDocumentListIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No applications yet</p>
          <p className="text-sm text-gray-400">Start tracking your university applications!</p>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <motion.div
              key={app.id}
              className="application-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="app-header">
                <div className="app-icon">{getStatusIcon(app.status)}</div>
                <div className="app-content">
                  <h4 className="app-title">{app.university_name}</h4>
                  {app.course_name && (
                    <p className="app-course">{app.course_name}</p>
                  )}
                  {app.deadline && (
                    <p className="app-deadline">Deadline: {formatDate(app.deadline)}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="delete-btn"
                  title="Delete application"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>

              <select
                value={app.status}
                onChange={(e) => handleStatusChange(app.id, e.target.value)}
                className={`status-select status-${getStatusColor(app.status)}`}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </motion.div>
          ))}
        </div>
      )}

      <style>{`
        .application-tracker {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .tracker-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .add-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          padding: 1rem;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          text-align: center;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: #111827;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .add-form {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-input {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 0.75rem;
        }

        .submit-btn {
          flex: 1;
          padding: 0.75rem;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }

        .cancel-btn {
          flex: 1;
          padding: 0.75rem;
          background: white;
          color: #6b7280;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }

        .loading-state, .empty-state {
          text-align: center;
          padding: 3rem 1rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .applications-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 600px;
          overflow-y: auto;
        }

        .application-card {
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .application-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
        }

        .app-header {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .app-icon {
          flex-shrink: 0;
        }

        .app-content {
          flex: 1;
          min-width: 0;
        }

        .app-title {
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.25rem;
        }

        .app-course {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .app-deadline {
          font-size: 0.75rem;
          color: #ef4444;
          font-weight: 600;
        }

        .delete-btn {
          padding: 0.5rem;
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .delete-btn:hover {
          background: #fee2e2;
          color: #ef4444;
        }

        .status-select {
          width: 100%;
          padding: 0.5rem;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .status-select:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .status-gray { border-color: #9ca3af; color: #6b7280; }
        .status-blue { border-color: #3b82f6; color: #2563eb; }
        .status-yellow { border-color: #eab308; color: #ca8a04; }
        .status-green { border-color: #22c55e; color: #16a34a; }
        .status-red { border-color: #ef4444; color: #dc2626; }
        .status-orange { border-color: #f97316; color: #ea580c; }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default ApplicationTracker;
