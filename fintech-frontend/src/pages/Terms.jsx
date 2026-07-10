import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/privacy-policy.css";
import Footer from "../components/Footer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Terms = () => {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    gsap.set(".policy-hero-content, .policy-card, .policy-disclaimer, .policy-contact-card", {
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
      icon: "📋",
      title: "Acceptance of Terms",
      description: "By using Investerly you agree to be bound by these terms and conditions.",
      points: [
        "These terms apply to all visitors, users, and clients of Investerly.",
        "Continued use of the platform after any updates constitutes acceptance of revised terms.",
        "If you disagree with any part of these terms, please discontinue use of the platform.",
        "We reserve the right to update these terms at any time with reasonable notice.",
      ],
    },
    {
      icon: "🏦",
      title: "Services Provided",
      description: "Investerly offers investment and insurance advisory services.",
      points: [
        "Mutual fund distribution as an AMFI Registered Mutual Fund Distributor.",
        "Insurance advisory for life, health, and vehicle insurance products.",
        "Financial planning tools — SIP, lumpsum, retirement, and EMI calculators.",
        "Educational content and resources on investments and personal finance.",
        "All services are subject to applicable regulatory guidelines of SEBI and AMFI.",
      ],
    },
    {
      icon: "⚖️",
      title: "User Obligations",
      description: "Your responsibilities while using our platform.",
      points: [
        "Provide accurate, current, and complete information during registration.",
        "Maintain the confidentiality of your account credentials at all times.",
        "Do not engage in any fraudulent, misleading, or unlawful activity on the platform.",
        "Comply with all applicable laws, rules, and financial regulations of India.",
        "Notify us immediately of any unauthorised access to your account.",
      ],
    },
    {
      icon: "💡",
      title: "Intellectual Property",
      description: "All content on this platform is owned by or licensed to Investerly.",
      points: [
        "All trademarks, logos, and content are the property of Investerly.",
        "You may not reproduce, distribute, or modify our content without written permission.",
        "Our tools, calculators, software, and underlying code are proprietary.",
        "User-generated content remains the property of the user but grants us a licence to use it.",
        "Unauthorised use of our intellectual property may result in legal action.",
      ],
    },
    {
      icon: "📊",
      title: "Investment Risk Disclaimer",
      description: "Important disclosures relating to investment products.",
      points: [
        "Mutual fund investments are subject to market risks.",
        "Past performance is not indicative of future returns.",
        "Please read all scheme-related documents carefully before investing.",
        "Our calculators are for illustrative and planning purposes only — not guaranteed outcomes.",
        "Please consider your specific investment requirements before choosing a fund.",
      ],
    },
    {
      icon: "🛡️",
      title: "Limitation of Liability",
      description: "Investerly's liability is limited as described below.",
      points: [
        "Investerly is not liable for investment losses arising from market volatility.",
        "We are not responsible for the content or practices of any third-party website.",
        "Investerly makes no warranties, express or implied, on products offered through the platform.",
        "We accept no liability for any damages or losses caused by reliance on our content.",
        "Our liability is limited to the maximum extent permitted by applicable law.",
      ],
    },
    {
      icon: "🔗",
      title: "Governing Law",
      description: "These terms are governed by the laws of India.",
      points: [
        "These terms shall be governed by and construed under the laws of India.",
        "Any disputes shall be subject to the exclusive jurisdiction of courts in Surat, Gujarat.",
        "Investerly operates in accordance with SEBI, AMFI, and IRDA regulations.",
        "Any waiver of rights under these terms must be in writing to be effective.",
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
              <span className="badge-icon">⚖️</span>
              <span>Legal Framework</span>
            </div>
            <h1 className="hero-title">
              Terms &amp; <span className="text-gradient">Conditions</span>
            </h1>
            <p className="hero-description">
              Please read these terms carefully before using Investerly's platform and services.
            </p>
            <div className="hero-meta">
              <span className="meta-item">
                <span className="meta-icon">📅</span>
                Last Updated: March 2025
              </span>
              <span className="meta-item">
                <span className="meta-icon">📄</span>
                Version 1.0
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
            <div className="intro-icon">⚖️</div>
            <h3>Fair &amp; Transparent Terms</h3>
            <p>
              These Terms &amp; Conditions govern your use of the Investerly platform and all associated services.
              By accessing our platform, you acknowledge that you have read, understood, and agree to be bound by
              these terms. Investerly is an AMFI Registered Mutual Fund Distributor operating in accordance with
              SEBI, AMFI, and IRDA guidelines.
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
              <div className="disclaimer-icon">📋</div>
              <div>
                <h3>Regulatory Compliance</h3>
                <p>Investerly is regulated in accordance with Indian financial laws</p>
              </div>
            </div>
            <div className="disclaimer-grid">
              <div className="disclaimer-item"><span className="item-icon">✓</span><span>AMFI Registered</span></div>
              <div className="disclaimer-item"><span className="item-icon">🛡️</span><span>SEBI Compliant</span></div>
              <div className="disclaimer-item"><span className="item-icon">⚖️</span><span>IRDA Guidelines</span></div>
              <div className="disclaimer-item"><span className="item-icon">📋</span><span>Regular Audits</span></div>
            </div>
            <div className="disclaimer-text">
              <p>
                <strong>Investerly is an AMFI Registered Mutual Fund Distributor.</strong> Mutual fund investments
                are subject to market risks. Please read all scheme related documents carefully before investing.
                Past performance is not indicative of future returns. Terms and conditions of the website are applicable.
                Investments in securities markets are subject to market risks; read all related documents carefully
                before investing.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="policy-contact-card">
            <div className="contact-content">
              <div className="contact-icon">💬</div>
              <h3>Questions About Our Terms?</h3>
              <p>
                If you have any questions about these Terms &amp; Conditions or need clarification on any provision,
                please reach out to us directly.
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

export default Terms;
