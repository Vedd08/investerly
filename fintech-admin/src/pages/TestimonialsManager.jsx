import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Video, Image as ImageIcon, FileText } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/testimonials';

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    type: 'text',
    content: '',
    status: 'active'
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(API_URL);
      setTestimonials(response.data.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (testimonial = null) => {
    if (testimonial) {
      setFormData({
        name: testimonial.name,
        role: testimonial.role,
        type: testimonial.type,
        content: testimonial.content,
        status: testimonial.status
      });
      setEditingId(testimonial._id);
    } else {
      setFormData({ name: '', role: '', type: 'text', content: '', status: 'active' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchTestimonials();
      closeModal();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Failed to save testimonial');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchTestimonials();
      } catch (error) {
        console.error('Error deleting testimonial:', error);
      }
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'video': return <Video size={16} />;
      case 'photo': return <ImageIcon size={16} />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Testimonials Manager</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Manage video, photo, and text testimonials for your website.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} />
          Add Testimonial
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
        ) : testimonials.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No testimonials found. Click 'Add Testimonial' to create one.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role / Company</th>
                <th>Type</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t._id}>
                  <td style={{ fontWeight: 500 }}>{t.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{t.role}</td>
                  <td>
                    <span className={`badge badge-${t.type}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      {getTypeIcon(t.type)} {t.type}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${t.status}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns" style={{ justifyContent: 'flex-end' }}>
                      <button className="btn-icon" onClick={() => openModal(t)} title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDelete(t._id)} title="Delete">
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

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button className="btn-icon" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">Client Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g. John Doe"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Role or Company</label>
                <input 
                  type="text" 
                  name="role" 
                  value={formData.role} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g. CEO, TechCorp"
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Testimonial Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange}>
                    <option value="text">Text Quote</option>
                    <option value="photo">Photo + Quote</option>
                    <option value="video">Video URL</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  {formData.type === 'video' ? 'Video URL (YouTube/Vimeo)' : 
                   formData.type === 'photo' ? 'Image URL + Quote Text (or just Image URL)' : 
                   'Testimonial Content'}
                </label>
                <textarea 
                  name="content" 
                  value={formData.content} 
                  onChange={handleInputChange} 
                  required 
                  rows={4}
                  placeholder={formData.type === 'video' ? 'https://www.youtube.com/watch?v=...' : 'Enter the testimonial text or image URL here...'}
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Save Changes' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManager;
