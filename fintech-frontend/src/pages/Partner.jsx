import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lottie from "lottie-react";
import api from "../utils/api";
import partnerAnim from "../assets/lotties/partner.json";
import "../styles/partner.css";
import Footer from "../components/Footer";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Partner = () => {
  const [form, setForm] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    interestedService: "",
    message: ""
  });

  const [status, setStatus] = useState({
    loading: false,
    success: null,
    error: null
  });

  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const inputRefs = useRef([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    try {
      await api.post("/partner", form);

      setStatus({
        loading: false,
        success: "Thank you for your interest. We'll get back to you shortly.",
        error: null
      });

      setForm({
        companyName: "",
        contactPerson: "",
        email: "",
        interestedService: "",
        message: ""
      });

    } catch (err) {
      setStatus({
        loading: false,
        success: null,
        error: "Unable to submit right now. Please try again later."
      });
    }
  };

  useEffect(() => {
    // First, ensure all elements are visible by default
    gsap.set(".benefit-item, .partner-grid > *, .partner-shape", {
      opacity: 1,
      y: 0,
      scale: 1,
      visibility: "visible"
    });

    const ctx = gsap.context(() => {
      
      // Grid items animation
      gsap.from(".partner-grid > *", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
          once: true
        },
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(".partner-grid > *", { clearProps: "opacity,y" });
        }
      });



      // Background shapes animation
      gsap.from(".partner-shape", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
          once: true
        },
        scale: 0,
        rotation: 360,
        duration: 1.5,
        stagger: 0.3,
        ease: "back.out(1.7)",
        onComplete: () => {
          gsap.set(".partner-shape", { clearProps: "scale,rotation,opacity" });
        }
      });

      // Benefit items animation - FIXED
      gsap.from(".benefit-item", {
        scrollTrigger: {
          trigger: ".partner-benefits",
          start: "top 85%",
          toggleActions: "play none none none",
          once: true
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(".benefit-item", { clearProps: "opacity,y" });
        }
      });

    }, sectionRef);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ctx.revert();
    };
  }, []);

  const handleInputFocus = (index) => {
    gsap.to(inputRefs.current[index], {
      scale: 1.02,
      boxShadow: "0 8px 32px rgba(46, 63, 86, 0.15)",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleInputBlur = (index) => {
    gsap.to(inputRefs.current[index], {
      scale: 1,
      boxShadow: "0 4px 16px rgba(46, 63, 86, 0.08)",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const serviceOptions = [
    { value: "", label: "Select a service" },
    { value: "Mutual Funds", label: "Mutual Funds (SIP)" },
    { value: "SIF", label: "SIF (Systematic Investment Fund)" },
    { value: "AIF", label: "AIF (Alternative Investment Funds)" },
    { value: "PMS", label: "PMS (Portfolio Management Services)" },
    { value: "Life Insurance", label: "Life Insurance" },
    { value: "Health Insurance", label: "Health Insurance" },
    { value: "Vehicle Insurance", label: "Vehicle Insurance" },
    { value: "Corporate Solutions", label: "Corporate Solutions" }
  ];

  // Partnership benefits data - Clean and minimal
  const partnershipBenefits = [
    {
      icon: "✓",
      title: "Transparent Framework",
      description: "Clear advisory processes"
    },
    {
      icon: "📊",
      title: "Structured Access",
      description: "Products across asset classes"
    },
    {
      icon: "⚖️",
      title: "Compliance-First",
      description: "Robust compliance processes"
    },
    {
      icon: "🤝",
      title: "Long-term Partnership",
      description: "Enduring relationships"
    },
    {
      icon: "📚",
      title: "Regular Training",
      description: "Ongoing education & support"
    },
    {
      icon: "📈",
      title: "Marketing Support",
      description: "Branding & lead generation"
    }
  ];

  return (
    <section className="partner section" ref={sectionRef}>
      {/* Animated Background Shapes */}
      <div className="partner-shapes" aria-hidden="true">
        <div className="partner-shape shape-1"></div>
        <div className="partner-shape shape-2"></div>
        <div className="partner-shape shape-3"></div>
        <div className="partner-shape shape-4"></div>
      </div>

      <div className="container partner-grid">
        
        {/* LEFT CONTENT - Enhanced */}
        <div className="partner-info">
          <span className="eyebrow partner-eyebrow">
            Strategic Partnership
          </span>
          
          <h1 className="partner-title">
            Build <span className="text-accent">long-term value</span><br />
            through strategic collaboration
          </h1>
          
          <p className="partner-desc">
            We collaborate with advisors, distributors, and institutions who
            share a long-term, client-first approach towards investments and insurance.
          </p>

          {/* Partner Benefits - Clean card design */}
          <div className="partner-benefits">
            {partnershipBenefits.map((benefit, index) => (
              <div className="benefit-item" key={index}>
                <div className="benefit-icon">
                  <span>{benefit.icon}</span>
                </div>
                <div className="benefit-content">
                  <h4>{benefit.title}</h4>
                  <p>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Lottie Animation */}
          <div className="partner-animation">
            <Lottie
              animationData={partnerAnim}
              loop={true}
              autoplay={true}
              rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
              aria-label="Partnership growth animation"
            />
          </div>
        </div>

        {/* FORM - Enhanced */}
        <form 
          className="partner-form" 
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div className="form-header">
            <h3 className="form-title">
              <span className="title-text">Partner Inquiry</span>
              <span className="title-badge">Premium</span>
            </h3>
            <p className="form-subtitle">Fill the form below to begin our partnership journey</p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="label-text">Company Name</span>
                <span className="label-required">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                onFocus={() => handleInputFocus(0)}
                onBlur={() => handleInputBlur(0)}
                ref={el => inputRefs.current[0] = el}
                required
                className="form-input"
                placeholder="Enter company name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-text">Contact Person</span>
                <span className="label-required">*</span>
              </label>
              <input
                type="text"
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleChange}
                onFocus={() => handleInputFocus(1)}
                onBlur={() => handleInputBlur(1)}
                ref={el => inputRefs.current[1] = el}
                required
                className="form-input"
                placeholder="Full name"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-text">Email Address</span>
              <span className="label-required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onFocus={() => handleInputFocus(2)}
              onBlur={() => handleInputBlur(2)}
              ref={el => inputRefs.current[2] = el}
              required
              className="form-input"
              placeholder="company@email.com"
            />
          </div>

          {/* FIXED SELECT FIELD */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-text">Interested Service</span>
              <span className="label-required">*</span>
            </label>
            <div className="select-wrapper">
              <select
                name="interestedService"
                value={form.interestedService}
                onChange={handleChange}
                onFocus={() => handleInputFocus(3)}
                onBlur={() => handleInputBlur(3)}
                ref={el => inputRefs.current[3] = el}
                required
                className="form-select"
              >
                {serviceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="select-arrow">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-text">Additional Details</span>
              <span className="label-optional">(Optional)</span>
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              onFocus={() => handleInputFocus(4)}
              onBlur={() => handleInputBlur(4)}
              ref={el => inputRefs.current[4] = el}
              className="form-textarea"
              rows="4"
              placeholder="Tell us about your business, current partnerships, or specific requirements..."
            />
            <div className="textarea-counter">
              <span className="counter-text">{form.message.length}/500</span>
            </div>
          </div>

          <button
            type="submit"
            className={`partner-submit ${status.loading ? 'loading' : ''}`}
            disabled={status.loading}
          >
            {status.loading ? (
              <>
                <span className="submit-loader"></span>
                Processing Request...
              </>
            ) : (
              <>
                <span className="submit-text">Submit Partnership Request</span>
                <span className="submit-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 4L16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </>
            )}
          </button>

          {/* Status Messages */}
          {status.success && (
            <div className="partner-feedback success">
              <div className="feedback-icon">✓</div>
              <div className="feedback-content">
                <h4 className="feedback-title">Request Submitted!</h4>
                <p className="feedback-text">{status.success}</p>
              </div>
            </div>
          )}

          {status.error && (
            <div className="partner-feedback error">
              <div className="feedback-icon">!</div>
              <div className="feedback-content">
                <h4 className="feedback-title">Submission Failed</h4>
                <p className="feedback-text">{status.error}</p>
              </div>
            </div>
          )}

          <div className="form-footer">
            <p className="form-note">
              <span className="note-icon">⏱️</span>
              We typically respond within 24-48 hours
            </p>
            <p className="form-disclaimer">
              By submitting, you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>
            </p>
          </div>
        </form>

      </div>
      <Footer />
    </section>
  );
};

export default Partner;