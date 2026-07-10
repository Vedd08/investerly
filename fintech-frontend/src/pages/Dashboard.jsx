import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Download, Search, Loader2, Database, LogOut, FileText, AlertCircle, User } from 'lucide-react';
import gsap from 'gsap';
import { generateCorporateReport } from '../utils/generateCorporateReport';
import api from '../utils/api';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user, loading: authLoading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const tableRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  // GSAP animation for table rows
  useEffect(() => {
    if (!loading && reports.length > 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll('.animate-row');
      gsap.fromTo(rows, 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [loading, reports]);

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports');
      const data = res.data;
      if (data.success) {
        setReports(data.data);
      } else {
        setError('Failed to fetch reports.');
      }
    } catch (err) {
      setError('An error occurred while fetching your dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (report) => {
    // Regenerate the PDF using the stored reportData
    generateCorporateReport(report.reportData, user?.name);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (authLoading || loading) return <div className="loading-screen text-center mt-5"><Loader2 className="spinner" size={40} color="var(--color-accent)" /></div>;

  return (
    <div className="dashboard-container">
      
      {/* Clean SaaS Header */}
      <div className="dashboard-header">
        <div className="container">
          <div className="saas-header-content">
            <div className="saas-welcome">
              <div className="saas-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <h1 className="saas-title">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
                <p className="saas-subtitle">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
            
            <div className="saas-actions">
              <Link to="/proposal-generator" className="btn-saas-primary">
                <Search size={18} /> Create Proposal
              </Link>
              <button onClick={handleLogout} className="btn-saas-outline">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Stats Cards (Optional, adds SaaS feel) */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Database size={24} />
            </div>
            <div className="stat-info">
              <h4>Total Proposals</h4>
              <p>{reports.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
              <User size={24} />
            </div>
            <div className="stat-info">
              <h4>Account Type</h4>
              <p>Pro</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger mb-4 d-inline-flex align-items-center" style={{ borderRadius: '12px' }}>
            <AlertCircle size={20} className="me-2" /> {error}
          </div>
        )}

        <div className="reports-container">
          <div className="reports-header">
            <Database size={28} />
            <span>Corporate Research Repository</span>
          </div>
          
          {reports.length === 0 ? (
            <div className="empty-dashboard">
              <div className="empty-icon">
                <FileText size={40} />
              </div>
              <h4 className="fw-bold mb-2">No Proposals Generated</h4>
              <p className="text-muted mb-4">Your repository is empty. Start your first client proposal.</p>
              <Link to="/proposal-generator" className="search-btn d-inline-flex text-decoration-none mx-auto" style={{ width: 'auto' }}>
                <Search size={18} /> Create Proposal
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="premium-table" ref={tableRef}>
                <thead>
                  <tr>
                    <th>Subject Name</th>
                    <th>Profession / Title</th>
                    <th>Date Generated</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report._id} className="animate-row">
                      <td>{report.personName}</td>
                      <td><span className="subject-profession">{report.reportData?.basicInfo?.profession || 'N/A'}</span></td>
                      <td>
                        <span className="date-badge">
                          {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex justify-content-end gap-2">
                          <button 
                            onClick={() => navigate('/proposal-viewer', { state: { reportData: report.reportData } })}
                            className="btn-action-primary"
                          >
                            <Search size={16} /> View Interactive
                          </button>
                          <button 
                            onClick={() => handleDownload(report)}
                            className="btn-action-outline"
                          >
                            <Download size={16} /> Export PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;