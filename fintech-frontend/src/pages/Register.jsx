import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, Loader2 } from 'lucide-react';
import logo1 from '../assets/investerly_logo1-removebg-preview (1).svg';
import logo2 from '../assets/investerly_logo3-removebg-preview.svg';
import '../styles/login.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !contactNumber || !password) {
      return setError('Please fill in all fields');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setIsSubmitting(true);
    const res = await register(name, email, contactNumber, password);
    setIsSubmitting(false);

    if (res.success) {
      navigate('/welcome');
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-split-container">
      {/* LEFT SIDE - FORM */}
      <div className="auth-form-side">
        <Link to="/" className="auth-logo">
          <img src={logo1} alt="Investerly Logo 1" className="auth-logo-img logo1" />
          <img src={logo2} alt="Investerly Logo 2" className="auth-logo-img logo2" />
        </Link>

        <div className="auth-header">
          <h2 className="auth-title">Create an account</h2>
          <p className="auth-subtitle">Join us to generate premium research reports.</p>
        </div>

        {error && (
          <div className="premium-alert error">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group-premium">
            <label>Full Name</label>
            <input 
              type="text" 
              className="input-premium"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="input-group-premium">
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-premium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
          </div>

          <div className="input-group-premium">
            <label>Contact Number</label>
            <input 
              type="tel" 
              className="input-premium"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="e.g. +91 9876543210"
              required
            />
          </div>
          
          <div className="input-group-premium">
            <label>Password</label>
            <input 
              type="password" 
              className="input-premium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
            />
          </div>
          
          <button type="submit" className="btn-premium" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="spinner" size={20} /> : "Create Account"}
          </button>
        </form>

        <div className="auth-footer-premium">
          <p>Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
        </div>
      </div>

      {/* RIGHT SIDE - VISUAL */}
      <div className="auth-visual-side">
        <div className="visual-orb orb-primary" style={{ background: '#3b82f6' }}></div>
        <div className="visual-orb orb-secondary" style={{ background: '#8b5cf6' }}></div>
        <div className="visual-content">
          <h2>Your financial journey starts here.</h2>
          <p>Join thousands of investors and financial advisors leveraging Investerly to make smarter, data-driven decisions.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
