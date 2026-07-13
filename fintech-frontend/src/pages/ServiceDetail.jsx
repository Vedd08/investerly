import { useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lottie from "lottie-react";
import { TrendingUp, Shield, Target, Zap, Gem } from "lucide-react";
import services from "../data/services";
import "../styles/service-detail.css";

// Import Lottie animation
import contactAnim from "../assets/lotties/contact-click.json"; // You'll need to add this

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = services[slug];
  const sectionRef = useRef(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const contactLottieRef = useRef(null);

  useEffect(() => {
    // FIRST: Ensure all elements are fully visible by default
    gsap.set(".service-hero-content, .feature-card, .benefit-item, .faq-item, .cta-card, .overview-grid, .visual-card", {
      opacity: 1,
      y: 0,
      scale: 1,
      visibility: "visible"
    });

    const ctx = gsap.context(() => {

      // Hero animation
      gsap.from(".service-hero-content", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
          once: true
        },
        y: 50,
        opacity: 0.01,
        duration: 1,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(".service-hero-content", { opacity: 1, clearProps: "opacity,y" });
        }
      });

      // Overview section
      gsap.from(".overview-grid", {
        scrollTrigger: {
          trigger: ".overview-section",
          start: "top 75%",
          toggleActions: "play none none none",
          once: true
        },
        y: 40,
        opacity: 0.01,
        duration: 0.8,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(".overview-grid", { opacity: 1, clearProps: "opacity,y" });
        }
      });

      // Features animation
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: ".features-grid",
          start: "top 75%",
          toggleActions: "play none none none",
          once: true
        },
        y: 40,
        opacity: 0.01,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(".feature-card", { opacity: 1, clearProps: "opacity,y" });
        }
      });

      // Benefits animation
      gsap.from(".benefit-item", {
        scrollTrigger: {
          trigger: ".benefits-section",
          start: "top 75%",
          toggleActions: "play none none none",
          once: true
        },
        x: -30,
        opacity: 0.01,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(".benefit-item", { opacity: 1, clearProps: "opacity,x" });
        }
      });

      // FAQ animation
      gsap.from(".faq-item", {
        scrollTrigger: {
          trigger: ".faq-section",
          start: "top 75%",
          toggleActions: "play none none none",
          once: true
        },
        y: 30,
        opacity: 0.01,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(".faq-item", { opacity: 1, clearProps: "opacity,y" });
        }
      });

      // CTA animation
      gsap.from(".cta-card", {
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 80%",
          toggleActions: "play none none none",
          once: true
        },
        scale: 0.95,
        opacity: 0.01,
        duration: 1,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(".cta-card", { opacity: 1, scale: 1, clearProps: "opacity,scale" });
        }
      });

    }, sectionRef);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ctx.revert();
    };
  }, [slug]);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleContactHover = () => {
    if (contactLottieRef.current) {
      contactLottieRef.current.play();
    }
  };

  const handleContactLeave = () => {
    if (contactLottieRef.current) {
      contactLottieRef.current.goToAndStop(0);
    }
  };

  if (!service) {
    return (
      <section className="service-detail" ref={sectionRef}>
        <div className="container">
          <div className="not-found">
            <h2>Service Not Found</h2>
            <p>The service you're looking for doesn't exist.</p>
            <Link to="/" className="btn-primary">Return Home</Link>
          </div>
        </div>
      </section>
    );
  }

  const isInvestment = slug === "mutual-funds" || slug === "sip" || slug === "aif";
  const isInsurance = slug.includes("insurance");

  return (
    <main className="service-detail" ref={sectionRef}>

      {/* Hero Section - Without Stats */}
      <section className="service-hero">
        <div className="container">
          <div className="service-hero-content">
            <div className="hero-badge">
              <span className="badge-icon">✦</span>
              <span>Premium Service</span>
            </div>
            <h1 className="hero-title">
              {service.title}
              <span className="title-accent">.</span>
            </h1>
            <p className="hero-description">{service.intro}</p>

            {/* Simple Contact Button with Lottie */}
            <div className="service-contact-wrapper">
              <Link
                to="/contact"
                className="service-contact-btn"
                onMouseEnter={handleContactHover}
                onMouseLeave={handleContactLeave}
              >
                <div className="contact-btn-lottie">
                  <Lottie
                    lottieRef={contactLottieRef}
                    animationData={contactAnim}
                    loop={false}
                    autoplay={false}
                    className="contact-lottie-small"
                  />
                </div>
                <span>Contact Our Experts</span>
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-pattern"></div>
      </section>

      {/* Overview Section */}
      <section className="overview-section">
        <div className="container">
          <div className="overview-grid">
            <div className="overview-content">
              <h2 className="section-title">
                <span className="title-number">01</span>
                Who is this for?
              </h2>
              <p className="overview-text">{service.who}</p>

              <div className="ideal-for">
                <h3>Perfect for:</h3>
                <div className="ideal-tags">
                  {(() => {
                    const tags = {
                      "mutual-funds": ["Long-term Investors", "Retirement Planners", "Wealth Builders", "Tax Savers"],
                      "sip": ["Salaried Professionals", "Young Investors", "Goal Planners", "Disciplined Savers"],
                      "aif": ["HNIs", "Family Offices", "Institutional Investors", "Sophisticated Investors"],
                      "life-insurance": ["Breadwinners", "Parents", "Business Owners", "Loan Holders"],
                      "health-insurance": ["Families", "Senior Citizens", "Self-Employed", "Corporate"],
                      "vehicle-insurance": ["Car Owners", "Two-wheeler Owners", "Fleet Owners", "Commercial Vehicles"],
                      "fire-insurance": ["Property Owners", "Business Owners", "Warehouses", "Factories"],
                      "accident-insurance": ["Primary Earners", "High-Risk Jobs", "Frequent Travelers", "Self-Employed"]
                    };
                    return (tags[slug] || ["Individual Investors", "Business Owners"]).map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ));
                  })()}
                </div>
              </div>
            </div>

            <div className="overview-visual">
              <div className="visual-card">
                <div className="visual-icon">
                  {isInvestment ? <TrendingUp size={32} /> : <Shield size={32} />}
                </div>
                <h4>{isInvestment ? "Investment Approach" : "Protection Strategy"}</h4>
                <ul className="approach-list">
                  {service.approach.map((item, index) => (
                    <li key={index}>
                      <span className="list-check">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {service.features && (
        <section className="features-section">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Key Features</span>
              <h2 className="section-title">
                <span className="title-number">02</span>
                What you get
              </h2>
            </div>

            <div className="features-grid">
              {service.features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">
                      {index === 0 ? <Target size={28} /> : index === 1 ? <Zap size={28} /> : index === 2 ? <Shield size={28} /> : <Gem size={28} />}
                    </div>
                  </div>
                  <h3 className="feature-title">{feature}</h3>
                  <p className="feature-description">
                    {(() => {
                      const descriptions = {
                        "mutual-funds": [
                          "Access to top-performing funds managed by experts",
                          "Spread risk across multiple securities and sectors",
                          "Easy entry and exit with high liquidity",
                          "Save taxes while building long-term wealth"
                        ],
                        "sip": [
                          "Invest fixed amounts at regular intervals",
                          "Buy more units when prices are low",
                          "Long-term wealth creation through compounding",
                          "Increase SIP amount as your income grows"
                        ]
                      };
                      return (descriptions[slug]?.[index] || "Premium feature with expert guidance") + " →";
                    })()}
                  </p>
                  <div className="feature-shine"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {service.benefits && (
        <section className="benefits-section">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Advantages</span>
              <h2 className="section-title">
                <span className="title-number">03</span>
                Why choose this
              </h2>
            </div>

            <div className="benefits-grid">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <div className="benefit-number">{String(index + 1).padStart(2, '0')}</div>
                  <div className="benefit-content">
                    <p>{benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {service.faq && (
        <section className="faq-section">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Common Questions</span>
              <h2 className="section-title">
                <span className="title-number">04</span>
                Frequently Asked
              </h2>
            </div>

            <div className="faq-grid">
              {service.faq.map((item, index) => (
                <div
                  key={index}
                  className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                  onClick={() => toggleFaq(index)}
                >
                  <div className="faq-question">
                    <span className="faq-q">Q{index + 1}</span>
                    <h3>{item.q}</h3>
                    <span className="faq-toggle">{activeFaq === index ? '−' : '+'}</span>
                  </div>
                  <div className="faq-answer">
                    <p>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Comparison Table for Investment Products */}
      {isInvestment && (
        <section className="comparison-section">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Compare</span>
              <h2 className="section-title">
                <span className="title-number">05</span>
                Investment Options
              </h2>
            </div>

            <div className="comparison-table">
              <div className="table-header">
                <div className="header-cell">Features</div>
                <div className="header-cell">Mutual Funds</div>
                <div className="header-cell">SIF</div>
                <div className="header-cell">PMS</div>
              </div>
              <div className="table-row">
                <div className="row-label">Minimum Amount</div>
                <div className="row-value">₹500+</div>
                <div className="row-value">₹10 Lakh</div>
                <div className="row-value highlight">₹50 Lakh</div>
              </div>
              <div className="table-row">
                <div className="row-label">Risk Level</div>
                <div className="row-value">Moderate</div>
                <div className="row-value">Moderate to High</div>
                <div className="row-value highlight">High</div>
              </div>
              <div className="table-row">
                <div className="row-label">Lock-in Period</div>
                <div className="row-value">None*</div>
                <div className="row-value">3-7 Years</div>
                <div className="row-value highlight">3-7 Years</div>
              </div>
              <div className="table-row">
                <div className="row-label">Ideal For</div>
                <div className="row-value">All Investors</div>
                <div className="row-value">HNIs</div>
                <div className="row-value highlight">HNIs</div>
              </div>
            </div>
            <p className="table-note">*ELSS funds have 3-year lock-in</p>
          </div>
        </section>
      )}

      {/* Insurance Coverage for Insurance Products */}
      {isInsurance && (
        <section className="coverage-section">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Coverage</span>
              <h2 className="section-title">
                <span className="title-number">05</span>
                What's Included
              </h2>
            </div>

            <div className="coverage-grid">
              {(() => {
                const coverages = {
                  "life-insurance": [
                    { name: "Death Benefit", desc: "Guaranteed payout to nominee" },
                    { name: "Maturity Benefit", desc: "Amount paid on policy maturity" },
                    { name: "Critical illness", desc: "Coverage for major illnesses" },
                    { name: "Accidental Death", desc: "Additional cover for accidents" },
                    { name: "Term Rider", desc: "Optional add-on coverage" },
                    { name: "Tax Benefits", desc: "Under Section 80C & 10(10D)" }
                  ],
                  "health-insurance": [
                    { name: "Hospitalization", desc: "In-patient treatment coverage" },
                    { name: "Daycare Procedures", desc: "No 24-hour hospitalization required" },
                    { name: "Pre & Post Care", desc: "Coverage before and after" },
                    { name: "Ambulance Cover", desc: "Emergency transport" },
                    { name: "No Claim Bonus", desc: "Increase cover yearly" },
                    { name: "Tax Benefits", desc: "Under Section 80D" }
                  ],
                  "vehicle-insurance": [
                    { name: "Own Damage", desc: "Damage to your vehicle" },
                    { name: "Third Party", desc: "Damage to others" },
                    { name: "Personal Accident", desc: "Coverage for injuries" },
                    { name: "Zero Depreciation", desc: "Full claim without depreciation" },
                    { name: "Roadside Assistance", desc: "24/7 emergency support" },
                    { name: "NCB Protection", desc: "Preserve no claim bonus" }
                  ],
                  "fire-insurance": [
                    { name: "Building Cover", desc: "Protection for physical structure" },
                    { name: "Content Cover", desc: "Protection for assets inside" },
                    { name: "Allied Perils", desc: "Storms, floods, riots cover" },
                    { name: "Loss of Profit", desc: "Compensation for business interruption" },
                    { name: "Stock Insurance", desc: "Coverage for raw materials and inventory" },
                    { name: "Earthquake Add-on", desc: "Optional cover against seismic activity" }
                  ],
                  "accident-insurance": [
                    { name: "Accidental Death", desc: "100% sum insured paid to nominee" },
                    { name: "Permanent Total Disability", desc: "Payout for life-altering injuries" },
                    { name: "Permanent Partial Disability", desc: "Percentage payout based on severity" },
                    { name: "Temporary Total Disability", desc: "Weekly income replacement" },
                    { name: "Education Grant", desc: "Financial support for dependent children" },
                    { name: "Medical Expenses", desc: "Reimbursement for accident treatments" }
                  ]
                };
                return (coverages[slug] || []).map((item, index) => (
                  <div key={index} className="coverage-card">
                    <div className="coverage-header">
                      <span className="coverage-check">✓</span>
                      <h4>{item.name}</h4>
                    </div>
                    <p>{item.desc}</p>
                  </div>
                ));
              })()}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-pattern"></div>
            <div className="cta-content">
              <h2>Ready to get started?</h2>
              <p>Explore our tools or partner with us to begin your journey.</p>
              <div className="cta-actions">
                <Link to="/tools" className="btn-primary">
                  <span>Explore Tools</span>
                  <span className="btn-icon">→</span>
                </Link>
                <Link to="/contact" className="btn btn-outline-light">
                  <span>Contact Us</span>
                  <span className="btn-icon">↗</span>
                </Link>
              </div>
              <div className="premium-cta-features">
                <div className="premium-feature-item">
                  <span className="premium-cta-icon">✦</span>
                  <span className="feature-text">Expert Guidance</span>
                </div>
                <div className="premium-feature-item">
                  <span className="premium-cta-icon">✦</span>
                  <span className="feature-text">Transparent Process</span>
                </div>
                <div className="premium-feature-item">
                  <span className="premium-cta-icon">✦</span>
                  <span className="feature-text">Client First Approach</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default ServiceDetail;