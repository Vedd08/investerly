import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/privacy-policy.css";
import Footer from "../components/Footer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Disclaimer = () => {
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
      icon: "📊",
      title: "Mutual Fund Investments",
      description: "Important risks associated with mutual fund products.",
      points: [
        "Mutual fund investments are subject to market risks.",
        "Please read the scheme information and all related documents carefully before investing.",
        "Past performance is not indicative of future returns.",
        "Please consider your specific investment requirements before choosing a fund or designing a portfolio.",
        "The NAV of schemes may go up or down based on prevailing market conditions.",
      ],
    },
    {
      icon: "🏦",
      title: "AMFI Registration & Scope",
      description: "Our regulatory standing and the scope of services provided.",
      points: [
        "Investerly is an AMFI Registered Mutual Fund Distributor.",
        "We act as a distributor, not as a SEBI Registered Investment Adviser.",
        "All mutual fund products are offered through AMC platforms in accordance with AMFI guidelines.",
        "Our AMFI Registration Number (ARN) is available on request.",
        "We are not authorised to provide personalised portfolio management services.",
      ],
    },
    {
      icon: "⚠️",
      title: "No Warranties",
      description: "Limitations on the accuracy and reliability of information.",
      points: [
        "Investerly makes no warranties or representations, express or implied, on products offered through the platform.",
        "It accepts no liability for any damages or losses, however caused, in connection with the use of or reliance on its products or related services.",
        "Information on this platform is for general informational and educational purposes only.",
        "Market data and fund information may be delayed or approximate — verify from official sources.",
        "Calculator results are illustrative and are not guaranteed investment outcomes.",
      ],
    },
    {
      icon: "🛡️",
      title: "Insurance Products",
      description: "Important disclosures relating to insurance products.",
      points: [
        "Insurance products are subject to the specific policy terms and conditions of the insurer.",
        "Coverage and benefits depend on the policy selected and are subject to underwriting.",
        "Premium calculations shown are indicative and subject to final underwriting approval.",
        "Claims are subject to the terms and conditions of the respective insurance company.",
        "Please read the policy document carefully before making a purchase decision.",
      ],
    },
    {
      icon: "📈",
      title: "Securities Market Risk",
      description: "Additional disclosures for securities market investments.",
      points: [
        "Investments in securities markets are subject to market risks.",
        "Read all related documents carefully before investing in any securities market instrument.",
        "Terms and conditions of the website are applicable to all transactions.",
        "Equity investments are subject to volatility and may result in loss of principal.",
        "Debt fund investments are subject to interest rate and credit risk.",
      ],
    },
    {
      icon: "🔗",
      title: "Third-Party Services",
      description: "Our responsibilities in relation to third-party services.",
      points: [
        "Our platform may contain links to third-party websites and services.",
        "We are not responsible for the content or practices of any third-party site.",
        "Linking does not imply endorsement of any external product or service.",
        "Users access third-party services at their own risk.",
        "We recommend reviewing the privacy and risk policies of any external service.",
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
              <span className="badge-icon">⚠️</span>
              <span>Important Notice</span>
            </div>
            <h1 className="hero-title">
              <span className="text-gradient">Disclaimer</span>
            </h1>
            <p className="hero-description">
              Important disclosures regarding our services, mutual fund investments, insurance products,
              and the scope of information provided on this platform.
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
            <div className="intro-icon">⚠️</div>
            <h3>Please Read Carefully</h3>
            <p>
              Mutual fund investments are subject to market risks. Please read the scheme information
              and other related documents carefully before investing. Past performance is not indicative
              of future returns. Investerly makes no warranties or representations, express or implied,
              on products offered through the platform. It accepts no liability for any damages or losses,
              however caused, in connection with the use of, or on the reliance of, its products or
              related services.
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

          {/* Regulatory Banner */}
          <div className="policy-disclaimer">
            <div className="disclaimer-header">
              <div className="disclaimer-icon">🔐</div>
              <div>
                <h3>AMFI Registered Distributor</h3>
                <p>Mutual fund investments are subject to market risks</p>
              </div>
            </div>
            <div className="disclaimer-grid">
              <div className="disclaimer-item"><span className="item-icon">📊</span><span>Market Risk</span></div>
              <div className="disclaimer-item"><span className="item-icon">✓</span><span>AMFI Registered</span></div>
              <div className="disclaimer-item"><span className="item-icon">🛡️</span><span>SEBI Compliant</span></div>
              <div className="disclaimer-item"><span className="item-icon">📋</span><span>IRDA Regulated</span></div>
            </div>
            <div className="disclaimer-text">
              <p>
                <strong>Investerly is an AMFI Registered Mutual Fund Distributor.</strong> Mutual fund
                investments are subject to market risks. Please read all scheme related documents carefully
                before investing. Insurance is subject to policy terms and conditions. Investments in
                securities markets are subject to market risks — read all related documents carefully
                before investing.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="policy-contact-card">
            <div className="contact-content">
              <div className="contact-icon">💬</div>
              <h3>Need Clarification?</h3>
              <p>
                If you have any questions about these disclosures or need further clarification
                regarding our services, please contact us.
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

export default Disclaimer;
