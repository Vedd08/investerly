import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit2, Trash2, X, Users, Eye } from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/users`;

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      contactNumber: user.contactNumber || ''
    });
    setEditingId(user._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };
  
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        fetchUsers();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Users Manager</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Manage registered clients and their information.
          </p>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
        ) : users.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No users found.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>Registered At</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={{ fontWeight: 500 }}>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.contactNumber || 'N/A'}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-btns" style={{ justifyContent: 'flex-end' }}>
                      <button className="btn-icon" onClick={() => openViewModal(user)} title="View Details" style={{ color: 'var(--primary)' }}>
                        <Eye size={18} />
                      </button>
                      <button className="btn-icon" onClick={() => openModal(user)} title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button className="btn-icon text-danger" onClick={() => handleDelete(user._id)} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit User</h2>
              <button className="btn-icon" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <input 
                  type="tel" 
                  name="contactNumber" 
                  value={formData.contactNumber} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isViewModalOpen && selectedUser && (
        <div className="modal-overlay" onClick={closeViewModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="btn-icon" onClick={closeViewModal}>
                <X size={20} />
              </button>
            </div>
            
            <div className="user-details-view" style={{ padding: '1rem 0' }}>
              <div className="detail-row" style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0.75rem 0' }}>
                <strong style={{ width: '150px', color: 'var(--text-secondary)' }}>User ID:</strong>
                <span>{selectedUser._id}</span>
              </div>
              <div className="detail-row" style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0.75rem 0' }}>
                <strong style={{ width: '150px', color: 'var(--text-secondary)' }}>Full Name:</strong>
                <span>{selectedUser.name}</span>
              </div>
              <div className="detail-row" style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0.75rem 0' }}>
                <strong style={{ width: '150px', color: 'var(--text-secondary)' }}>Email Address:</strong>
                <span>{selectedUser.email}</span>
              </div>
              <div className="detail-row" style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0.75rem 0' }}>
                <strong style={{ width: '150px', color: 'var(--text-secondary)' }}>Contact Number:</strong>
                <span>{selectedUser.contactNumber || 'N/A'}</span>
              </div>
              <div className="detail-row" style={{ display: 'flex', padding: '0.75rem 0' }}>
                <strong style={{ width: '150px', color: 'var(--text-secondary)' }}>Registered On:</strong>
                <span>{new Date(selectedUser.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-primary" onClick={closeViewModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManager;
