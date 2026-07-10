import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/footer.css";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    // First, ensure all elements are visible by default
    gsap.set(".footer-section, .footer-divider, .footer-bottom", {
      opacity: 1,
      y: 0,
      scaleX: 1
    });

    const ctx = gsap.context(() => {
      // Simple fade-in animation for footer sections
      gsap.from(".footer-section", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
          once: true
        },
        onComplete: () => {
          // Ensure elements stay at full opacity after animation
          gsap.set(".footer-section", { clearProps: "opacity,y" });
        }
      });

      // Simple divider animation
      gsap.from(".footer-divider", {
        scaleX: 0,
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true
        },
        onComplete: () => {
          gsap.set(".footer-divider", { clearProps: "scaleX" });
        }
      });

      // Bottom section animation
      gsap.from(".footer-bottom", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
          once: true
        },
        onComplete: () => {
          gsap.set(".footer-bottom", { clearProps: "opacity,y" });
        }
      });

    }, footerRef);

    return () => ctx.revert();
  }, []);

  // Professional SVG Icons
const SocialIcons = {
  Facebook: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  Instagram: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  ),
  Twitter: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  LinkedIn: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
};

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.45 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 5.53 5.53l1.62-1.85a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const PenToolIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19l7-7 3 3-7 7-3-3z"/>
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
    <path d="M2 2l7.586 7.586"/>
    <circle cx="11" cy="11" r="2"/>
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const socialLinks = [
  { Icon: SocialIcons.Facebook, name: "Facebook", url: "https://facebook.com/investerly" },
  { Icon: SocialIcons.Instagram, name: "Instagram", url: "https://instagram.com/investerly" },
  { Icon: SocialIcons.Twitter, name: "Twitter", url: "https://twitter.com/investerly" },
  { Icon: SocialIcons.LinkedIn, name: "LinkedIn", url: "https://linkedin.com/company/investerly" },
];

  return (
    <footer className="footer" ref={footerRef}>
      <div className="container">
        
        {/* MAIN FOOTER CONTENT */}
        <div className="footer-grid">
          
          {/* BRAND SECTION */}
          <div className="footer-section footer-brand">
            <h4 className="footer-logo">
              <span className="logo-text">INVESTERLY</span>
              <span className="logo-badge">MFAI Registered</span>
            </h4>
            <p className="footer-desc">
              Investment and insurance advisory platform focused on long-term
              financial clarity, discipline, and trust. We help individuals and 
              businesses make informed financial decisions.
            </p>
            
            {/* SOCIAL LINKS */}
            <div className="footer-social">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.url} 
                  className="social-link"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.Icon />
                </a>
              ))}
            </div>
          </div>

          {/* SERVICES */}
          <div className="footer-section">
            <h5>Our Services</h5>
            <ul className="footer-links-list">
              <li><Link to="/services/mutual-funds">Mutual Funds</Link></li>
              <li><Link to="/services/sip">Systematic Investment Plan (SIP)</Link></li>
              <li><Link to="/services/aif">Alternative Investment Funds (AIF)</Link></li>
              <li><Link to="/services/life-insurance">Life Insurance</Link></li>
              <li><Link to="/services/health-insurance">Health Insurance</Link></li>
              <li><Link to="/services/vehicle-insurance">Vehicle Insurance</Link></li>
            </ul>
          </div>

          {/* TOOLS & RESOURCES */}
          <div className="footer-section">
            <h5>Financial Tools</h5>
            <ul className="footer-links-list">
              <li><Link to="/tools/sip-calculator">SIP Calculator</Link></li>
              <li><Link to="/tools/lumpsum-calculator">Lumpsum Calculator</Link></li>
              <li><Link to="/tools/emi-calculator">EMI Calculator</Link></li>
              <li><Link to="/tools/retirement-calculator">Retirement Calculator</Link></li>
              <li><Link to="/tools/tax-calculator">Tax Calculator</Link></li>
              <li><Link to="/tools/marriage-calculator">Marriage Calculator</Link></li>
              <li><Link to="/tools/education-calculator">Education Calculator</Link></li>
              <li><Link to="/tools/car-loan-calculator">Car Loan Calculator</Link></li>
            </ul>
          </div>

          {/* CONTACT & SUPPORT */}
          <div className="footer-section">
            <h5>Get in Touch</h5>
            <ul className="contact-list">
              <li className="contact-item">
                <span className="contact-icon"><MailIcon /></span>
                <a href="mailto:admin@investerly.in">admin@investerly.in</a>
              </li>
              <li className="contact-item">
                <span className="contact-icon"><PhoneIcon /></span>
                <a href="tel:+917778882822">+91 7778882822</a>
              </li>
              <li className="contact-item">
                <span className="contact-icon"><LocationIcon /></span>
                <span>6003, World Trade Center, Ring Road Surat 395007.</span>
              </li>
            </ul>
            
            <div className="footer-buttons">
              <Link to="/contact" className="footer-btn footer-btn-primary">
                <span>Contact Us</span>
                <span className="btn-arrow">→</span>
              </Link>
              <Link to="/partner" className="footer-btn footer-btn-outline">
                <span>Partner With Us</span>
                <span className="btn-arrow">↗</span>
              </Link>
            </div>

            <div className="footer-timing">
              <span className="timing-icon"><ClockIcon /></span>
              <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
            </div>

            {/* Design Credit */}
            <div className="footer-design-credit">
              <span className="credit-icon"><PenToolIcon /></span>
              <span>Design by </span>
              <a 
                href="https://logicmindsbyparii.com/index.php" 
                target="_blank" 
                rel="noopener noreferrer"
                className="credit-link"
              >
                Logic Minds by Parii
              </a>
            </div>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="footer-divider"></div>

        {/* LEGAL & DISCLAIMER */}
        <div className="footer-bottom">
          <div className="footer-bottom-row">
            <p className="copyright">
              © {new Date().getFullYear()} <strong>Investerly</strong>. All rights reserved.
            </p>
            <div className="footer-legal-links">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <span className="separator">|</span>
              <Link to="/terms">Terms of Use</Link>
              <span className="separator">|</span>
              <Link to="/disclaimer">Disclaimer</Link>
            </div>
          </div>
          
          <p className="footer-disclaimer">
            <span className="disclaimer-icon"><AlertIcon /></span>
            Mutual fund investments are subject to market risks. Read all scheme 
            related documents carefully before investing. Insurance is subject to 
            policy terms and conditions.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;