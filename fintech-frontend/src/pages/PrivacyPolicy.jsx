import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/privacy-policy.css";
import Footer from "../components/Footer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PrivacyPolicy = () => {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    gsap.set(".policy-hero-content, .policy-section, .policy-card, .policy-disclaimer, .policy-contact-card", {
      opacity: 1, y: 0, scale: 1, visibility: "visible",
    });

    const ctx = gsap.context(() => {
      gsap.from(".policy-hero-content", {
        scrollTrigger: { trigger: heroRef.current, start: "top 80%", toggleActions: "play none none none", once: true },
        y: 40, opacity: 0, duration: 1, ease: "power3.out",
        onComplete: () => gsap.set(".policy-hero-content", { clearProps: "opacity,y" }),
      });

      gsap.from(".policy-card", {
        scrollTrigger: { trigger: ".policy-grid", start: "top 80%", toggleActions: "play none none none", once: true },
        scale: 0.95, opacity: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.2)",
        onComplete: () => gsap.set(".policy-card", { clearProps: "opacity,scale" }),
      });

      gsap.from(".policy-disclaimer", {
        scrollTrigger: { trigger: ".policy-disclaimer", start: "top 85%", toggleActions: "play none none none", once: true },
        y: 30, opacity: 0, duration: 0.8, ease: "power3.out",
        onComplete: () => gsap.set(".policy-disclaimer", { clearProps: "opacity,y" }),
      });

      gsap.from(".policy-contact-card", {
        scrollTrigger: { trigger: ".policy-contact-card", start: "top 85%", toggleActions: "play none none none", once: true },
        scale: 0.95, opacity: 0, duration: 1, ease: "power3.out",
        onComplete: () => gsap.set(".policy-contact-card", { clearProps: "opacity,scale" }),
      });
    }, pageRef);

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); ctx.revert(); };
  }, []);

  const sections = [
    {
      icon: "👤",
      title: "What We Collect",
      description: "We may collect the following information when you use our platform.",
      points: [
        "Name and contact details including email address and phone number.",
        "Personal information when you register an account, make a purchase, or interact with certain features.",
        "Financial information required to process investment or insurance requests.",
        "Technical data such as IP address, browser type, and device information.",
        "Transaction history and investment portfolio details.",
      ],
    },
    {
      icon: "⚙️",
      title: "How We Use Your Information",
      description: "Your information helps us provide better and personalised services.",
      points: [
        "To provide access to the platform's features and functionalities.",
        "To personalise your experience and communicate about your account or transactions.",
        "To process investment requests and provide advisory services.",
        "To comply with regulatory requirements and legal obligations.",
        "To improve our services and develop new features.",
      ],
    },
    {
      icon: "📷",
      title: "Camera & Image Data",
      description: "We respect your privacy when using camera-related features.",
      points: [
        "Camera access is only used for document verification in Video KYC.",
        "Images captured or uploaded may be used for identity verification purposes.",
        "We do not share your image data with third parties unless required by law.",
        "We do not share image data unless necessary to provide requested services.",
        "You have full control over camera permissions from your device settings.",
      ],
    },
    {
      icon: "📍",
      title: "Use of Location Data",
      description: "Location data is used only to verify identity and grant platform access.",
      points: [
        "We access your location to verify your identity and grant platform access.",
        "Helps provide region-specific financial products and services.",
        "Location is not tracked continuously — accessed only when necessary.",
        "You can disable location access anytime from your device settings.",
      ],
    },
    {
      icon: "🔒",
      title: "Security",
      description: "We are committed to ensuring your information is secure.",
      points: [
        "Suitable physical, electronic, and managerial procedures are in place to safeguard data.",
        "All communications are encrypted using 256-bit encryption.",
        "Passwords are one-way encrypted before being stored in the database.",
        "Your data is not shared with anyone unless explicitly requested for a transaction.",
        "Data is continuously backed up to ensure continuity of operations.",
      ],
    },
    {
      icon: "🌐",
      title: "Links to Other Websites",
      description: "Our site may contain links to third-party websites.",
      points: [
        "We do not control third-party websites linked from our platform.",
        "We are not responsible for the privacy practices of external sites.",
        "Exercise caution and review the privacy statements of any site you visit.",
        "Linking to external sites does not constitute endorsement.",
      ],
    },
    {
      icon: "✅",
      title: "Controlling Your Personal Information",
      description: "You have complete control over your personal data.",
      points: [
        "If any information we hold is incorrect, email us at admin@investerly.in.",
        "We will promptly correct any information found to be inaccurate.",
        "You can update account details and manage communication preferences anytime.",
        "You can request account or data deletion through app settings or by contacting us.",
      ],
    },
    {
      icon: "🛡️",
      title: "Security Certifications",
      description: "We maintain industry-leading security standards.",
      points: [
        "All communications encrypted by 256-bit encryption.",
        "Data hosted with top-tier hosting service providers.",
        "Continuous data backup to ensure operational continuity.",
        "Regular security audits and compliance checks.",
        "Investerly is an AMFI Registered Mutual Fund Distributor.",
      ],
    },
  ];

  return (
    <div className="privacy-policy-page" ref={pageRef}>

      {/* Hero */}
      <section className="policy-hero" ref={heroRef}>
        <div className="container">
          <div className="policy-hero-content">
            <div className="hero-badge">
              <span className="badge-icon">🔒</span>
              <span>Your Privacy Matters</span>
            </div>
            <h1 className="hero-title">
              Privacy <span className="text-gradient">Policy</span>
            </h1>
            <p className="hero-description">
              We are committed to protecting your personal information and being transparent about how we use it.
            </p>
            <div className="hero-meta">
              <span className="meta-item">
                <span className="meta-icon">📅</span>
                Last Updated: March 2025
              </span>
              <span className="meta-item">
                <span className="meta-icon">📄</span>
                Version 2.0
              </span>
            </div>
          </div>
        </div>
        <div className="hero-pattern"></div>
      </section>

      {/* Intro */}
      <section className="policy-intro">
        <div className="container">
          <div className="intro-card">
            <div className="intro-icon">🛡️</div>
            <h3>Your Trust, Our Commitment</h3>
            <p>
              This privacy policy sets out how Investerly collects, uses, and protects your personal information
              when you use our platform. We are committed to ensuring that your privacy is protected and that
              we handle your data responsibly and transparently.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="policy-main" ref={contentRef}>
        <div className="container">
          <div className="policy-grid">
            {sections.map((section, index) => (
              <div key={index} className="policy-card">
                <div className="card-header">
                  <div className="card-icon">{section.icon}</div>
                  <div className="card-title-wrap">
                    <h3>{section.title}</h3>
                    <p>{section.description}</p>
                  </div>
                </div>
                <div className="card-body">
                  <ul className="policy-list">
                    {section.points.map((point, idx) => (
                      <li key={idx}>
                        <span className="list-check">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer Banner */}
          <div className="policy-disclaimer">
            <div className="disclaimer-header">
              <div className="disclaimer-icon">🔐</div>
              <div>
                <h3>Security Certifications & Compliance</h3>
                <p>We maintain industry-leading security standards</p>
              </div>
            </div>
            <div className="disclaimer-grid">
              <div className="disclaimer-item"><span className="item-icon">🔒</span><span>256-bit Encryption</span></div>
              <div className="disclaimer-item"><span className="item-icon">✓</span><span>AMFI Registered</span></div>
              <div className="disclaimer-item"><span className="item-icon">🛡️</span><span>Secure Hosting</span></div>
              <div className="disclaimer-item"><span className="item-icon">📋</span><span>Regular Audits</span></div>
            </div>
            <div className="disclaimer-text">
              <p>
                <strong>Investerly is an AMFI Registered Mutual Fund Distributor.</strong> Mutual fund investments
                are subject to market risks. Please read all scheme related documents carefully before investing.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="policy-contact-card">
            <div className="contact-content">
              <div className="contact-icon">💬</div>
              <h3>Have Questions About Your Privacy?</h3>
              <p>
                If you believe any information we hold is incorrect, or if you have any questions about this
                policy, please don't hesitate to contact us.
              </p>
              <div className="contact-details">
                <a href="mailto:admin@investerly.in" className="contact-link">
                  <span className="link-icon">✉️</span>
                  admin@investerly.in
                </a>
                <a href="tel:+917778882822" className="contact-link">
                  <span className="link-icon">📞</span>
                  +91 7778882822
                </a>
              </div>
              <Link to="/contact" className="contact-btn">
                <span>Contact Us</span>
                <span className="btn-icon">→</span>
              </Link>
            </div>
            <div className="contact-pattern"></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;