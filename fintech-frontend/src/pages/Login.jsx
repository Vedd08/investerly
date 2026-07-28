import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, Loader2, UserCircle, Briefcase, ArrowLeft } from 'lucide-react';
import api from '../utils/api';
import logo1 from '../assets/investerly_logo1-removebg-preview (1).svg';
import logo2 from '../assets/investerly_logo3-removebg-preview.svg';
import '../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginStep, setLoginStep] = useState('select'); // 'select', 'form', or 'redvision'
  
  // Redvision specific state
  const [rvUsername, setRvUsername] = useState('');
  const [rvPassword, setRvPassword] = useState('');
  const [rvRole, setRvRole] = useState('client');
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

  const handleRedvisionSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!rvUsername || !rvPassword) {
      return setError('Please fill in all fields');
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/redvision-login', {
        username: rvUsername,
        password: rvPassword,
        loginFor: rvRole,
        domain: window.location.hostname
      });
      
      setIsSubmitting(false);
      
      // If the API gives a redirect link, follow it. Otherwise log the success.
      if (res.data && (res.data.redirectUrl || res.data.url || res.data.callbackUrl)) {
         window.location.href = res.data.redirectUrl || res.data.url || res.data.callbackUrl;
      } else {
         setError('Login successful, but redirect URL not found in response. Check console.');
         console.log('Redvision Response:', res.data);
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err.response?.data?.message || err.response?.data || 'Login failed');
      console.error(err);
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
          <p className="auth-subtitle">
            {loginStep === 'select' ? 'Select a portal to access your account.' : 'Sign in to access your proposals.'}
          </p>
        </div>

        {error && (
          <div className="premium-alert error">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {loginStep === 'select' ? (
          <div className="login-selection-container">
            <div 
              className="login-card" 
              onClick={() => setLoginStep('redvision')}
            >
              <div className="login-card-icon">
                <UserCircle size={28} />
              </div>
              <div className="login-card-content">
                <h3>Client Wealth Portal</h3>
                <p>Access your legacy investments and portfolio dashboard.</p>
              </div>
            </div>

            <div 
              className="login-card"
              onClick={() => setLoginStep('form')}
            >
              <div className="login-card-icon">
                <Briefcase size={28} />
              </div>
              <div className="login-card-content">
                <h3>Proposal & Reports Portal</h3>
                <p>Generate institutional-grade financial proposals.</p>
              </div>
            </div>
            
            <div className="auth-footer-premium" style={{ marginTop: '2rem' }}>
              <p>Don't have an account? <Link to="/register" className="auth-link">Create one</Link></p>
            </div>
          </div>
        ) : loginStep === 'form' ? (
          <>
            <button type="button" className="back-to-options" onClick={() => setLoginStep('select')}>
              <ArrowLeft size={16} /> Back to options
            </button>
            
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
          </>
        ) : loginStep === 'redvision' ? (
          <>
            <button type="button" className="back-to-options" onClick={() => setLoginStep('select')}>
              <ArrowLeft size={16} /> Back to options
            </button>
            
            <form onSubmit={handleRedvisionSubmit} className="auth-form">
              <div className="role-selection" style={{ display: 'flex', gap: '15px', marginBottom: '20px', borderBottom: '2px solid #45a8de', paddingBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '5px' }}>
                  <input type="radio" name="rvRole" value="client" checked={rvRole === 'client'} onChange={(e) => setRvRole(e.target.value)} />
                  Client
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '5px' }}>
                  <input type="radio" name="rvRole" value="employee" checked={rvRole === 'employee'} onChange={(e) => setRvRole(e.target.value)} />
                  Employee
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '5px' }}>
                  <input type="radio" name="rvRole" value="admin" checked={rvRole === 'admin'} onChange={(e) => setRvRole(e.target.value)} />
                  Admin
                </label>
              </div>

              <div className="input-group-premium">
                <label>Username</label>
                <input 
                  type="text" 
                  className="input-premium"
                  value={rvUsername}
                  onChange={(e) => setRvUsername(e.target.value)}
                  placeholder="Enter your Username"
                  required
                />
              </div>
              
              <div className="input-group-premium">
                <label>Password</label>
                <input 
                  type="password" 
                  className="input-premium"
                  value={rvPassword}
                  onChange={(e) => setRvPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <span style={{ fontSize: '14px', color: '#888', cursor: 'pointer' }}>Forgot Password?</span>
              </div>

              <button type="submit" className="btn-premium" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="spinner" size={20} /> : "Login"}
              </button>
            </form>
          </>
        ) : null}
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
