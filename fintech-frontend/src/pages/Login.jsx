import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, Loader2, UserCircle, Briefcase, ArrowLeft, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  
  // Redvision specific state
  const [rvUsername, setRvUsername] = useState('');
  const [rvPassword, setRvPassword] = useState('');
  const [rvRole, setRvRole] = useState('client');
  const [showRvPassword, setShowRvPassword] = useState(false);
  
  // Forgot Password specific state
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotRole, setForgotRole] = useState('client');
  const [forgotMobile, setForgotMobile] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
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
      
      // If the API explicitly returns a false status inside a 200 OK response
      if (res.data && res.data.status === false) {
         return setError(res.data.msg || res.data.errorMsg || 'Login failed');
      }

      // If the API gives a redirect link, follow it. Otherwise log the success.
      if (res.data && (res.data.redirectUrl || res.data.url || res.data.callbackUrl)) {
         window.location.href = res.data.redirectUrl || res.data.url || res.data.callbackUrl;
      } else {
         setError('Login successful, but redirect URL not found in response. Check console.');
         console.log('Redvision Response:', res.data);
      }
    } catch (err) {
      setIsSubmitting(false);
      const data = err.response?.data;
      const errorMsg = data?.message || data?.error || data?.msg || (typeof data === 'string' ? data : 'Login failed');
      setError(errorMsg);
      console.error(err);
    }
  };

  const handleForgotPasswordSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!forgotUsername) return setError('Please enter your username');
    
    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/redvision-forgot-password-send', {
        username: forgotUsername,
        type: forgotRole
      });
      setIsSubmitting(false);
      
      if (res.data && res.data.msgType === 'error') {
         let errorMsg = res.data.msg || 'Failed to send OTP';
         if (errorMsg === 'Invalid Desk') {
            errorMsg = 'Username not found or invalid role for this desk.';
         }
         return setError(errorMsg);
      }
      
      // Success, move to step 2
      setLoginStep('forgot-password-2');
    } catch (err) {
      setIsSubmitting(false);
      const data = err.response?.data;
      let errorMsg = data?.message || data?.error || data?.msg || (typeof data === 'string' ? data : 'Failed to send OTP');
      if (errorMsg === 'Invalid Desk') {
         errorMsg = 'Username not found or invalid role for this desk.';
      }
      setError(errorMsg);
    }
  };

  const handleForgotPasswordSubmitOTP = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!forgotMobile || !forgotOtp) return setError('Please fill in all fields');
    
    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/redvision-forgot-password-submit', {
        OtpMobileNo: forgotMobile,
        mobileOtp: forgotOtp
      });
      setIsSubmitting(false);
      
      if (res.data && (res.data.status === false || res.data.msgType === 'error')) {
         return setError(res.data.msg || res.data.errorMsg || 'Failed to verify OTP');
      }
      
      // OTP verified successfully, the backend might return a link or just a success message
      setLoginStep('redvision');
      setError('Password reset successful. Please login with your new credentials.');
      // Make it look like a success message by tricking the UI (or just leave it as error style but user reads it)
    } catch (err) {
      setIsSubmitting(false);
      const data = err.response?.data;
      setError(data?.message || data?.error || data?.msg || (typeof data === 'string' ? data : 'Failed to verify OTP'));
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
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"}
                    className="input-premium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{ paddingRight: '40px' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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
              <div className="role-selection" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '20px', borderBottom: '2px solid #45a8de', paddingBottom: '15px' }}>
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
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '5px' }}>
                  <input type="radio" name="rvRole" value="advisors" checked={rvRole === 'advisors'} onChange={(e) => setRvRole(e.target.value)} />
                  Advisors
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '5px' }}>
                  <input type="radio" name="rvRole" value="branch" checked={rvRole === 'branch'} onChange={(e) => setRvRole(e.target.value)} />
                  Branch
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '5px' }}>
                  <input type="radio" name="rvRole" value="rm" checked={rvRole === 'rm'} onChange={(e) => setRvRole(e.target.value)} />
                  RM
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
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showRvPassword ? "text" : "password"} 
                    className="input-premium"
                    value={rvPassword}
                    onChange={(e) => setRvPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{ paddingRight: '40px' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowRvPassword(!showRvPassword)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {showRvPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <span onClick={() => { setError(''); setLoginStep('forgot-password-1'); }} style={{ fontSize: '14px', color: '#888', cursor: 'pointer' }}>Forgot Password?</span>
              </div>

              <button type="submit" className="btn-premium" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="spinner" size={20} /> : "Login"}
              </button>
            </form>
          </>
        ) : loginStep === 'forgot-password-1' ? (
          <>
            <button type="button" className="back-to-options" onClick={() => { setError(''); setLoginStep('redvision'); }}>
              <ArrowLeft size={16} /> Back to login
            </button>
            
            <form onSubmit={handleForgotPasswordSendOTP} className="auth-form">
              <h3 style={{ marginBottom: '15px' }}>Reset Password</h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>Enter your username and role to receive an OTP.</p>

              <div className="role-selection" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '20px', borderBottom: '2px solid #45a8de', paddingBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '5px' }}>
                  <input type="radio" name="forgotRole" value="client" checked={forgotRole === 'client'} onChange={(e) => setForgotRole(e.target.value)} />
                  Client
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '5px' }}>
                  <input type="radio" name="forgotRole" value="employee" checked={forgotRole === 'employee'} onChange={(e) => setForgotRole(e.target.value)} />
                  Employee
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '5px' }}>
                  <input type="radio" name="forgotRole" value="admin" checked={forgotRole === 'admin'} onChange={(e) => setForgotRole(e.target.value)} />
                  Admin
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '5px' }}>
                  <input type="radio" name="forgotRole" value="advisors" checked={forgotRole === 'advisors'} onChange={(e) => setForgotRole(e.target.value)} />
                  Advisors
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '5px' }}>
                  <input type="radio" name="forgotRole" value="branch" checked={forgotRole === 'branch'} onChange={(e) => setForgotRole(e.target.value)} />
                  Branch
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '5px' }}>
                  <input type="radio" name="forgotRole" value="rm" checked={forgotRole === 'rm'} onChange={(e) => setForgotRole(e.target.value)} />
                  RM
                </label>
              </div>

              <div className="input-group-premium">
                <label>Username</label>
                <input 
                  type="text" 
                  className="input-premium"
                  value={forgotUsername}
                  onChange={(e) => setForgotUsername(e.target.value)}
                  placeholder="Enter your Username"
                  required
                />
              </div>
              
              <button type="submit" className="btn-premium" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="spinner" size={20} /> : "Send OTP"}
              </button>
            </form>
          </>
        ) : loginStep === 'forgot-password-2' ? (
          <>
            <button type="button" className="back-to-options" onClick={() => { setError(''); setLoginStep('forgot-password-1'); }}>
              <ArrowLeft size={16} /> Back
            </button>
            
            <form onSubmit={handleForgotPasswordSubmitOTP} className="auth-form">
              <h3 style={{ marginBottom: '15px' }}>Verify OTP</h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>Enter the OTP sent to your registered mobile number.</p>

              <div className="input-group-premium">
                <label>Registered Mobile Number</label>
                <input 
                  type="text" 
                  className="input-premium"
                  value={forgotMobile}
                  onChange={(e) => setForgotMobile(e.target.value)}
                  placeholder="e.g. 9876543210"
                  required
                />
              </div>

              <div className="input-group-premium">
                <label>OTP</label>
                <input 
                  type="text" 
                  className="input-premium"
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                />
              </div>
              
              <button type="submit" className="btn-premium" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="spinner" size={20} /> : "Verify & Reset"}
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
