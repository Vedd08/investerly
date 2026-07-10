import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, Loader2 } from 'lucide-react';
import logo1 from '../assets/investerly_logo1-removebg-preview (1).svg';
import logo2 from '../assets/investerly_logo3-removebg-preview.svg';
import '../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      return setError('Please fill in all fields');
    }

    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      navigate('/welcome');
    } else {
      setError(res.message || 'Login failed');
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
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to access your financial tools and proposals.</p>
        </div>

        {error && (
          <div className="premium-alert error">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
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
            <label>Password</label>
            <input 
              type="password" 
              className="input-premium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button type="submit" className="btn-premium" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="spinner" size={20} /> : "Sign In"}
          </button>
        </form>

        <div className="auth-footer-premium">
          <p>Don't have an account? <Link to="/register" className="auth-link">Create one</Link></p>
        </div>
      </div>

      {/* RIGHT SIDE - VISUAL */}
      <div className="auth-visual-side">
        <div className="visual-orb orb-primary"></div>
        <div className="visual-orb orb-secondary"></div>
        <div className="visual-content">
          <h2>Accelerate your financial growth.</h2>
          <p>Generate institutional-grade proposals, track portfolios, and analyze markets with our premium suite of tools designed for serious investors.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
