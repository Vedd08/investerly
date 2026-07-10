import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import gsap from "gsap";
import { 
  Home, BarChart3, Shield, Settings, ClipboardList, TrendingUp, Landmark, 
  Heart, BookOpen, Receipt, Mail, User, LogOut, Lock, Handshake, Phone, Search
} from "lucide-react";
import "../../styles/navbar.mobile.css";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/investerly_logo3-removebg-preview.png";

const MobileNavbar = ({ scrolled }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [generalOpen, setGeneralOpen] = useState(false);
  const [investmentToolsOpen, setInvestmentToolsOpen] = useState(false);
  const [loanToolsOpen, setLoanToolsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  const userName = user?.name || user?.email || 'Account';

  const menuRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    gsap.to(navRef.current, {
      background: scrolled ? "rgba(255, 255, 255, 0.95)" : "var(--color-bg-white)",
      backdropFilter: scrolled ? "blur(10px)" : "none",
      duration: 0.3,
      ease: "power2.out"
    });

    if (menuOpen) {
      gsap.to(menuRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power3.out"
      });
    } else {
      gsap.to(menuRef.current, {
        x: "100%",
        opacity: 0,
        duration: 0.25,
        ease: "power2.in"
      });
    }
  }, [scrolled, menuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setServicesOpen(false);
    setGeneralOpen(false);
    setToolsOpen(false);
    setInvestmentToolsOpen(false);
    setLoanToolsOpen(false);
  };

  const handleLinkClick = () => {
    closeMenu();
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  return (
    <header className="navbar mobile-navbar" ref={navRef}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img src={logo} alt="Investerly" className="navbar-logo" />
        </Link>

        <button
          className={`nav-toggle ${menuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div className="hamburger">
            <span className="line line1"></span>
            <span className="line line2"></span>
            <span className="line line3"></span>
          </div>
        </button>
      </div>

      {menuOpen && (
        <div
          className="mobile-overlay"
          onClick={closeMenu}
        />
      )}

      <nav
        className={`mobile-menu ${menuOpen ? 'open' : ''}`}
        ref={menuRef}
      >
        <div className="mobile-menu-header">
          <div className="mobile-brand">
            <img src={logo} alt="Investerly" className="mobile-menu-logo" />
            <div className="mobile-brand-text">
              <span className="brand-text">INVESTERLY</span>
              <span className="brand-subtitle">Financial Advisory</span>
            </div>
          </div>
          <button className="close-menu" onClick={closeMenu}>×</button>
        </div>

        <div className="mobile-menu-content">
          <NavLink
            to="/"
            className="mobile-nav-link"
            onClick={handleLinkClick}
          >
            <span className="link-icon"><Home size={18} /></span>
            <span className="link-text">Home</span>
          </NavLink>

          {/* Services Section */}
          <div className="mobile-dropdown">
            <div
              className={`mobile-dropdown-btn ${servicesOpen ? 'open' : ''}`}
              onClick={() => setServicesOpen(!servicesOpen)}
            >
              <span className="btn-icon"><BarChart3 size={18} /></span>
              <span className="btn-text">Services</span>
              <span className="btn-arrow">{servicesOpen ? '⌃' : '⌄'}</span>
            </div>

            <div className={`mobile-dropdown-content ${servicesOpen ? 'open' : ''}`}>
              <NavLink
                to="/services/mutual-funds"
                className="mobile-dropdown-item"
                onClick={handleLinkClick}
              >
                <span className="item-bullet">•</span>
                Mutual Funds (SIP)
              </NavLink>
              <NavLink
                to="/services/sif"
                className="mobile-dropdown-item"
                onClick={handleLinkClick}
              >
                <span className="item-bullet">•</span>
                SIF
              </NavLink>
              <NavLink
                to="/services/aif"
                className="mobile-dropdown-item"
                onClick={handleLinkClick}
              >
                <span className="item-bullet">•</span>
                AIF
              </NavLink>
              <NavLink
                to="/services/pms"
                className="mobile-dropdown-item"
                onClick={handleLinkClick}
              >
                <span className="item-bullet">•</span>
                PMS
              </NavLink>

              {/* General Insurance Nested */}
              <div className="mobile-nested-dropdown">
                <div
                  className={`mobile-nested-btn ${generalOpen ? 'open' : ''}`}
                  onClick={() => setGeneralOpen(!generalOpen)}
                >
                  <span className="btn-icon"><Shield size={18} /></span>
                  <span className="btn-text">General Insurance</span>
                  <span className="btn-arrow">{generalOpen ? '⌃' : '⌄'}</span>
                </div>

                <div className={`mobile-nested-content ${generalOpen ? 'open' : ''}`}>
                  <NavLink
                    to="/services/health-insurance"
                    className="mobile-nested-item"
                    onClick={handleLinkClick}
                  >
                    Health Insurance
                  </NavLink>
                  <NavLink
                    to="/services/vehicle-insurance"
                    className="mobile-nested-item"
                    onClick={handleLinkClick}
                  >
                    Vehicle Insurance
                  </NavLink>
                  <NavLink
                    to="/services/fire-insurance"
                    className="mobile-nested-item"
                    onClick={handleLinkClick}
                  >
                    Fire Insurance
                  </NavLink>
                  <NavLink
                    to="/services/accident-insurance"
                    className="mobile-nested-item"
                    onClick={handleLinkClick}
                  >
                    Accident Insurance
                  </NavLink>
                </div>
              </div>

              <NavLink
                to="/services/life-insurance"
                className="mobile-dropdown-item"
                onClick={handleLinkClick}
              >
                <span className="item-bullet">•</span>
                Life Insurance
              </NavLink>
            </div>
          </div>

          {/* Tools Section */}
          <div className="mobile-dropdown">
            <div
              className={`mobile-dropdown-btn ${toolsOpen ? 'open' : ''}`}
              onClick={() => setToolsOpen(!toolsOpen)}
            >
              <span className="btn-icon"><Settings size={18} /></span>
              <span className="btn-text">Tools</span>
              <span className="btn-arrow">{toolsOpen ? '⌃' : '⌄'}</span>
            </div>

            <div className={`mobile-dropdown-content ${toolsOpen ? 'open' : ''}`}>

              {/* View All Tools - Featured Link */}
              <NavLink to="/tools" className="mobile-dropdown-item featured" onClick={handleLinkClick}>
                <span className="item-icon"><ClipboardList size={18} /></span>
                <span className="item-text">All Tools Overview</span>
                <span className="item-arrow">→</span>
              </NavLink>

              <div className="mobile-divider"></div>

              {/* Investment Tools Subsection */}
              <div className="mobile-subsection">
                <div
                  className={`mobile-subsection-btn ${investmentToolsOpen ? 'open' : ''}`}
                  onClick={() => setInvestmentToolsOpen(!investmentToolsOpen)}
                >
                  <span className="subsection-icon"><TrendingUp size={18} /></span>
                  <span className="subsection-text">Investment</span>
                  <span className="subsection-arrow">{investmentToolsOpen ? '⌃' : '⌄'}</span>
                </div>

                <div className={`mobile-subsection-content ${investmentToolsOpen ? 'open' : ''}`}>
                  <NavLink to="/tools/sip-calculator" className="mobile-subsection-item" onClick={handleLinkClick}>
                    SIP Calculator
                  </NavLink>
                  <NavLink to="/tools/lumpsum-calculator" className="mobile-subsection-item" onClick={handleLinkClick}>
                    Lumpsum Calculator
                  </NavLink>
                  <NavLink to="/tools/retirement-calculator" className="mobile-subsection-item" onClick={handleLinkClick}>
                    Retirement Calculator
                  </NavLink>
                </div>
              </div>

              {/* Loan Tools Subsection */}
              <div className="mobile-subsection">
                <div
                  className={`mobile-subsection-btn ${loanToolsOpen ? 'open' : ''}`}
                  onClick={() => setLoanToolsOpen(!loanToolsOpen)}
                >
                  <span className="subsection-icon"><Landmark size={18} /></span>
                  <span className="subsection-text">Loans</span>
                  <span className="subsection-arrow">{loanToolsOpen ? '⌃' : '⌄'}</span>
                </div>

                <div className={`mobile-subsection-content ${loanToolsOpen ? 'open' : ''}`}>
                  <NavLink to="/tools/emi-calculator" className="mobile-subsection-item" onClick={handleLinkClick}>
                    EMI Calculator
                  </NavLink>
                  <NavLink to="/tools/home-loan-calculator" className="mobile-subsection-item" onClick={handleLinkClick}>
                    Home Loan Calculator
                  </NavLink>
                  <NavLink to="/tools/car-loan-calculator" className="mobile-subsection-item" onClick={handleLinkClick}>
                    Car Loan Calculator
                  </NavLink>
                </div>
              </div>

              {/* Individual Tools */}
              <NavLink to="/tools/marriage-calculator" className="mobile-dropdown-item" onClick={handleLinkClick}>
                <span className="item-icon"><Heart size={18} /></span>
                Marriage Calculator
              </NavLink>
              <NavLink to="/tools/education-calculator" className="mobile-dropdown-item" onClick={handleLinkClick}>
                <span className="item-icon"><BookOpen size={18} /></span>
                Education Calculator
              </NavLink>
              <NavLink to="/tools/life-insurance-calculator" className="mobile-dropdown-item" onClick={handleLinkClick}>
                <span className="item-icon"><Shield size={18} /></span>
                Life Insurance Calculator
              </NavLink>
              <NavLink to="/tools/tax-calculator" className="mobile-dropdown-item" onClick={handleLinkClick}>
                <span className="item-icon"><Receipt size={18} /></span>
                Tax Calculator
              </NavLink>
              <NavLink to="/tools/sip-performance" className="mobile-dropdown-item" onClick={handleLinkClick}>
                <span className="item-icon"><BarChart3 size={18} /></span>
                SIP Performance
              </NavLink>
              <NavLink to="/tools/fund-performance" className="mobile-dropdown-item" onClick={handleLinkClick}>
                <span className="item-icon"><TrendingUp size={18} /></span>
                Fund Performance
              </NavLink>
            </div>
          </div>

          <NavLink
            to="/contact"
            className="mobile-nav-link"
            onClick={handleLinkClick}
          >
            <span className="link-icon"><Mail size={18} /></span>
            <span className="link-text">Contact</span>
          </NavLink>

          {/* Login / Account Section */}
          {isLoggedIn ? (
            <>
              <div className="mobile-user-info">
                <span className="user-icon"><User size={18} /></span>
                <span className="user-name">{userName}</span>
              </div>
              <NavLink to="/dashboard" className="mobile-nav-link" onClick={handleLinkClick}>
                <span className="link-icon"><BarChart3 size={18} /></span>
                <span className="link-text">Dashboard</span>
              </NavLink>
              <Link to="/proposal-generator" className="mobile-link" onClick={() => setMenuOpen(false)}>
                <div className="link-icon" style={{ background: 'rgba(47, 179, 74, 0.1)' }}><Search size={20} color="var(--color-accent)"/></div>
                <span className="link-text" style={{ color: 'var(--color-accent)' }}>Proposal Generator</span>
              </Link>
              <NavLink to="/profile" className="mobile-nav-link" onClick={handleLinkClick}>
                <span className="link-icon"><User size={18} /></span>
                <span className="link-text">My Profile</span>
              </NavLink>
              <button onClick={handleLogout} className="mobile-logout-btn">
                <span className="btn-icon"><LogOut size={18} /></span>
                <span>Logout</span>
              </button>
            </>
          ) : (
            <NavLink to="/login" className="mobile-nav-link login-link" onClick={handleLinkClick}>
              <span className="link-icon"><Lock size={18} /></span>
              <span className="link-text">Login</span>
            </NavLink>
          )}

          <NavLink
            to="/partner"
            className="mobile-nav-cta"
            onClick={handleLinkClick}
          >
            <span className="cta-icon"><Handshake size={18} /></span>
            <span className="cta-text">Partner With Us</span>
            <span className="cta-arrow">→</span>
          </NavLink>
        </div>

        <div className="mobile-menu-footer">
          <div className="contact-info">
            <p className="contact-label">Need Help?</p>
            <a href="tel:+917778882822" className="contact-phone" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={14} /> +91 7778882822
            </a>
            <a href="mailto:admin@investerly.in" className="contact-email" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={14} /> admin@investerly.in
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default MobileNavbar;