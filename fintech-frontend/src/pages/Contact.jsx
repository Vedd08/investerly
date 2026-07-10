import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from "../utils/api";
import "../styles/contact.css";
import Footer from "../components/Footer";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
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
      await api.post("/contact", form);

      setStatus({ loading: false, success: "Message sent successfully!", error: null });
      setForm({ name: "", email: "", message: "" });

      // Success animation
      gsap.fromTo(".contact-success",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      );

    } catch (err) {
      setStatus({
        loading: false,
        success: null,
        error: "Something went wrong. Please try again."
      });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section entrance animation
      gsap.from(".contact-grid > *", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse"
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });


      // Background pattern animation
      gsap.from(".contact-pattern", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out"
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Input focus animation
  const handleInputFocus = (index) => {
    gsap.to(inputRefs.current[index], {
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleInputBlur = (index) => {
    gsap.to(inputRefs.current[index], {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <section className="contact section" ref={sectionRef}>
      {/* Animated Background Pattern */}
      <div className="contact-pattern" aria-hidden="true">
        <div className="pattern-dot pattern-1"></div>
        <div className="pattern-dot pattern-2"></div>
        <div className="pattern-line"></div>
      </div>

      <div className="container contact-grid">

        {/* LEFT CONTENT - Animated */}
        <div className="contact-info">
          <span className="eyebrow contact-eyebrow">Get in Touch</span>

          <h1 className="contact-title">
            Let's build your<br />
            <span className="text-accent">financial future</span> together
          </h1>

          <p className="contact-desc">
            Whether you're planning investments, insurance coverage,
            or exploring a partnership — our team will guide you with
            clarity and transparency.
          </p>

          {/* Contact Details with Animation */}
          <div className="contact-details">
            <div className="detail-item">
              <div className="detail-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 6L12 13L2 6" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="detail-content">
                <span className="detail-label">Email</span>
                <a href="mailto:sonawanevedant42@gmail.com" className="detail-value">
                  admin@investerly.in
                </a>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92V19.92C22 20.47 21.55 20.92 21 20.92H19C18.45 20.92 18 20.47 18 19.92V16.92C18 16.37 18.45 15.92 19 15.92H21C21.55 15.92 22 16.37 22 16.92Z" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 12.92H21C21.55 12.92 22 13.37 22 13.92V16.92C22 17.47 21.55 17.92 21 17.92H19C18.45 17.92 18 17.47 18 16.92V13.92C18 13.37 18.45 12.92 19 12.92Z" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 8.92C2 5.92 4 3.92 7 3.92H17C20 3.92 22 5.92 22 8.92V13.92C22 14.47 21.55 14.92 21 14.92H19C18.45 14.92 18 14.47 18 13.92V8.92C18 7.82 17.1 6.92 16 6.92H8C6.9 6.92 6 7.82 6 8.92V19.92C6 21.02 6.9 21.92 8 21.92H13" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="detail-content">
                <span className="detail-label">Phone</span>
                <a href="tel:+91XXXXXXXXXX" className="detail-value">

                  +91 7778882822
                </a>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="detail-content">
                <span className="detail-label">Response Time</span>
                <span className="detail-value">Within 24 hours</span>
              </div>
            </div>
          </div>

          {/* Trust Indicator */}
          <div className="contact-trust">
            <div className="trust-icon">✓</div>
            <p className="trust-text">Your information is secure and confidential</p>
          </div>
        </div>

        {/* FORM - Animated */}
        <form
          className="contact-form"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div className="form-header">
            <h3 className="form-title">Send us a message</h3>
            <p className="form-subtitle">We'll get back to you promptly</p>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-text">Your Name</span>
              <span className="label-required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              onFocus={() => handleInputFocus(0)}
              onBlur={() => handleInputBlur(0)}
              ref={el => inputRefs.current[0] = el}
              required
              className="form-input"
            // placeholder="John Doe"
            />
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
              onFocus={() => handleInputFocus(1)}
              onBlur={() => handleInputBlur(1)}
              ref={el => inputRefs.current[1] = el}
              required
              className="form-input"
            // placeholder="john@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-text">Your Message</span>
              <span className="label-required">*</span>
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              onFocus={() => handleInputFocus(2)}
              onBlur={() => handleInputBlur(2)}
              ref={el => inputRefs.current[2] = el}
              required
              className="form-textarea"
              rows="5"
              placeholder="Tell us about your financial goals..."
            />
          </div>

          <button
            type="submit"
            className={`contact-submit ${status.loading ? 'loading' : ''}`}
            disabled={status.loading}
          >
            {status.loading ? (
              <>
                <span className="submit-loader"></span>
                Sending...
              </>
            ) : (
              <>
                Send Message
                <span className="submit-arrow">→</span>
              </>
            )}
          </button>

          {/* Status Messages with Animation */}
          {status.success && (
            <div className="contact-feedback success">
              <div className="feedback-icon">✓</div>
              <p className="feedback-text">{status.success}</p>
            </div>
          )}

          {status.error && (
            <div className="contact-feedback error">
              <div className="feedback-icon">!</div>
              <p className="feedback-text">{status.error}</p>
            </div>
          )}

          <p className="form-disclaimer">
            By submitting, you agree to our <a href="/privacy">Privacy Policy</a>
          </p>
        </form>

      </div>
      <Footer />

    </section>
  );
};

export default Contact;