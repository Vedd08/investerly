import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, LogOut } from 'lucide-react';
import logo1 from '../assets/logo1.svg';
import logo2 from '../assets/logo2.svg';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '2rem', padding: '0 0.5rem', height: '60px' }}>
        <img src={logo1} alt="Investerly Icon" style={{ height: '48px', width: 'auto', objectFit: 'contain', flexShrink: 0 }} />
        <img src={logo2} alt="Investerly Text" style={{ height: '36px', width: 'auto', objectFit: 'contain', transform: 'scale(2.5)', transformOrigin: 'left center' }} />
      </div>

      <nav style={{ flex: 1 }}>
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
          <MessageSquare size={20} />
          Testimonials
        </NavLink>
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <button className="nav-link" style={{ width: '100%', textAlign: 'left', color: 'var(--danger)' }}>
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
