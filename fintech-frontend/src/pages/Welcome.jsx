import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FileText, LayoutDashboard, ArrowRight, Calculator, Globe } from 'lucide-react';
import gsap from 'gsap';
import '../styles/welcome.css';

const Welcome = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && containerRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo('.welcome-title', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
      .fromTo('.welcome-subtitle', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo('.welcome-card', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "back.out(1.2)" },
        "-=0.2"
      );
    }
  }, [user]);

  if (loading || !user) return null;

  return (
    <div className="welcome-container" ref={containerRef}>
      <div className="welcome-bg-elements">
        <div className="welcome-orb orb-1"></div>
        <div className="welcome-orb orb-2"></div>
      </div>

      <div className="welcome-content">
        <div className="welcome-header">
          <h1 className="welcome-title">Welcome, {user.name.split(' ')[0]}!</h1>
          <p className="welcome-subtitle">
            What would you like to accomplish today? Choose a path below to get started.
          </p>
        </div>

        <div className="welcome-options">
          {/* Primary Action: Generate Proposal */}
          <Link to="/proposal-generator" className="welcome-card primary">
            <div className="card-icon">
              <FileText size={40} />
            </div>
            <h3 className="card-title">Generate a Proposal</h3>
            <p className="card-desc">
              Create a personalized, comprehensive financial report for a client or yourself in just a few clicks.
            </p>
            <div className="card-action">
              Start Generator <ArrowRight size={18} />
            </div>
          </Link>

          {/* Secondary Action: Dashboard */}
          <Link to="/dashboard" className="welcome-card">
            <div className="card-icon">
              <LayoutDashboard size={40} color="#3b82f6" />
            </div>
            <h3 className="card-title">Previous Proposals</h3>
            <p className="card-desc">
              Access your repository of previously generated proposals, client profiles, and account settings.
            </p>
            <div className="card-action" style={{ color: '#3b82f6' }}>
              View Proposals <ArrowRight size={18} />
            </div>
          </Link>
          
          {/* Secondary Action: Calculators */}
          <Link to="/tools" className="welcome-card">
            <div className="card-icon">
              <Calculator size={40} color="#64748b" />
            </div>
            <h3 className="card-title">Explore Tools</h3>
            <p className="card-desc">
              Use our suite of financial calculators for SIPs, loans, and retirement planning.
            </p>
            <div className="card-action" style={{ color: '#64748b' }}>
              View Calculators <ArrowRight size={18} />
            </div>
          </Link>

          {/* External Action: Admin Dashboard */}
          <a href="https://investerly.in/login.php" target="_blank" rel="noopener noreferrer" className="welcome-card">
            <div className="card-icon">
              <Globe size={40} color="#10b981" />
            </div>
            <h3 className="card-title">Admin Dashboard</h3>
            <p className="card-desc">
              Access the main Investerly admin panel to manage testimonials and other site settings.
            </p>
            <div className="card-action" style={{ color: '#10b981' }}>
              Go to Admin <ArrowRight size={18} />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
