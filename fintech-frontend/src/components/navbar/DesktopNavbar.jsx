import { NavLink, Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
import gsap from "gsap";
import { 
  TrendingUp, Shield, User, LayoutDashboard, Briefcase, LogOut, Lock, Search
} from "lucide-react";
import "../../styles/navbar.css";
import { AuthContext } from "../../context/AuthContext";

/* ✅ FIXED IMPORT PATH */
import logo1 from "../../assets/investerly_logo1-removebg-preview (1).svg";
import logo2 from "../../assets/investerly_logo3-removebg-preview.svg";

const DesktopNavbar = ({ scrolled }) => {
  const navRef = useRef(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Determine if logged in from context
  const isLoggedIn = !!user;
  const userRole = 'client'; // default role for now

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(navRef.current, {
        background: scrolled
          ? "rgba(255, 255, 255, 0.95)"
          : "var(--color-bg-white)",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        boxShadow: scrolled ? "0 4px 20px rgba(46, 63, 86, 0.1)" : "none",
        duration: 0.3,
        ease: "power2.out"
      });
      
      // Slight logo scale on scroll
      gsap.to(".navbar-logo", {
        scale: scrolled ? 0.95 : 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }, navRef);

    return () => ctx.revert();
  }, [scrolled]);

  const handleMouseEnter = (dropdownName) => {
    setActiveDropdown(dropdownName);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get dashboard link based on role
  const getDashboardLink = () => {
    switch(userRole) {
      case 'client': return '/dashboard';
      case 'employee': return '/employee-dashboard';
      case 'admin': return '/admin-dashboard';
      case 'advisor': return '/advisor-dashboard';
      case 'branch': return '/branch-dashboard';
      case 'rm': return '/rm-dashboard';
      default: return '/dashboard';
    }
  };

  // Get user display name
  const getUserName = () => {
    return user?.name || user?.email || 'Account';
  };

  return (
    <header className="navbar desktop-navbar" ref={navRef}>
      <div className="container navbar-inner">

        {/* ✅ TWO LOGOS WITH DIFFERENT SIZES */}
        <Link to="/" className="navbar-brand">
          <img 
            src={logo1} 
            alt="Investerly Logo 1" 
            className="navbar-logo logo1"
          />
          <img 
            src={logo2} 
            alt="Investerly Logo 2" 
            className="navbar-logo logo2"
          />
        </Link>

        <nav className="navbar-nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="link-text">Home</span>
            <span className="link-underline"></span>
          </NavLink>

          {/* Services Dropdown */}
          <div 
            className="nav-dropdown"
            onMouseEnter={() => handleMouseEnter('services')}
            onMouseLeave={handleMouseLeave}
          >
            <span className="nav-link">
              <span className="link-text">Services</span>
              <span className="link-underline"></span>
              <span className="dropdown-arrow">⌄</span>
            </span>

            <div className={`dropdown-menu wide ${activeDropdown === 'services' ? 'visible' : ''}`}>
              <div className="dropdown-column">
                <div className="dropdown-header">
                  <div className="header-icon"><TrendingUp size={18} /></div>
                  <strong>Investments</strong>
                </div>
                <NavLink to="/services/mutual-funds" className="dropdown-item">
                  <span className="item-icon">→</span>
                  Mutual Funds (SIP)
                </NavLink>
                <NavLink to="/services/sif" className="dropdown-item">
                  <span className="item-icon">→</span>
                  SIF
                </NavLink>
                <NavLink to="/services/aif" className="dropdown-item">
                  <span className="item-icon">→</span>
                  AIF
                </NavLink>
                {/* ✅ ADDED PMS */}
                <NavLink to="/services/pms" className="dropdown-item">
                  <span className="item-icon">→</span>
                  PMS
                </NavLink>
              </div>

              <div className="dropdown-column">
                <div className="dropdown-header">
                  <div className="header-icon"><Shield size={18} /></div>
                  <strong>Insurance</strong>
                </div>
                <NavLink to="/services/life-insurance" className="dropdown-item">
                  <span className="item-icon">→</span>
                  Life Insurance
                </NavLink>

                <div className="dropdown-nested">
                  <span className="dropdown-item nested-trigger">
                    <span className="item-icon">▸</span>
                    General Insurance
                    <span className="nested-arrow">›</span>
                  </span>
                  <div className="dropdown-nested-menu">
                    <NavLink to="/services/health-insurance" className="dropdown-item">
                      Health Insurance
                    </NavLink>
                    <NavLink to="/services/vehicle-insurance" className="dropdown-item">
                      Vehicle Insurance
                    </NavLink>
                    <NavLink to="/services/fire-insurance" className="dropdown-item">
                      Fire Insurance
                    </NavLink>
                    <NavLink to="/services/accident-insurance" className="dropdown-item">
                      Accident Insurance
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tools - Direct Link */}
          <NavLink 
            to="/tools" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="link-text">Tools</span>
            <span className="link-underline"></span>
          </NavLink>

          <NavLink 
            to="/contact" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="link-text">Contact</span>
            <span className="link-underline"></span>
          </NavLink>

          {/* Login / Dashboard Dropdown */}
          {isLoggedIn ? (
            <div 
              className="nav-dropdown account-dropdown-wrapper"
              onMouseEnter={() => handleMouseEnter('account')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="nav-link profile-trigger">
                <div className="profile-avatar-small">
                  <User size={16} />
                </div>
                <span className="profile-name-short">{getUserName().split(' ')[0]}</span>
                <span className="dropdown-arrow">⌄</span>
              </div>
              
              <div className={`dropdown-menu profile-menu ${activeDropdown === 'account' ? 'visible' : ''}`}>
                <div className="profile-menu-header">
                  <div className="profile-avatar-large">
                    {getUserName().charAt(0).toUpperCase()}
                  </div>
                  <div className="profile-details">
                    <span className="profile-fullname">{getUserName()}</span>
                    <span className="profile-role">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</span>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <div className="profile-menu-body">
                  <Link to={getDashboardLink()} className="dropdown-item profile-item">
                    <div className="item-icon-box"><LayoutDashboard size={16} /></div>
                    <div className="item-text-content">
                      <span className="item-title">Dashboard</span>
                      <span className="item-desc">Overview & Reports</span>
                    </div>
                  </Link>
                  <Link to="/proposal-generator" className="dropdown-item profile-item highlight-item">
                    <div className="item-icon-box"><Search size={16} /></div>
                    <div className="item-text-content">
                      <span className="item-title">New Proposal</span>
                      <span className="item-desc">Generate Intelligence</span>
                    </div>
                  </Link>
                </div>

                <div className="dropdown-divider"></div>
                
                <div className="profile-menu-footer">
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    <LogOut size={16} />
                    <span>Secure Logout</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="nav-link login-link"
            >
              <span className="link-text" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Lock size={16} /> Login</span>
              <span className="link-underline"></span>
            </Link>
          )}

          <NavLink to="/partner" className="nav-cta">
            <span className="cta-text">Partner With Us</span>
            <span className="cta-icon">→</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default DesktopNavbar;