import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lottie from "lottie-react";
import axios from "axios";
import { 
  TrendingUp, Wallet, Gem, Shield, HeartPulse, Car, 
  Target, BarChart3, Lock, Handshake, Award, Star, ArrowRight, ExternalLink
} from "lucide-react";

const InstagramIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

import heroAnim from "../assets/lotties/hero.json";
import "../styles/home.css";

// Import bank logos
import iciciLogo from "../assets/partners/icici.png";
import hdfcLogo from "../assets/partners/hdfc.png";
import motilalLogo from "../assets/partners/motilal.png";
import sbiLogo from "../assets/partners/sbi.png";
import nipponLogo from "../assets/partners/nippon.png";
import kotakLogo from "../assets/partners/kotak.png";
import paragLogo from "../assets/partners/parag.png";
import bandhanLogo from "../assets/partners/bandhan.png";
import abakkusLogo from "../assets/partners/abakkus.png";
import buoyantLogo from "../assets/partners/buoyant.png";
import Footer from "../components/Footer";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Home = () => {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const whyRef = useRef(null);
  const partnersTrackRef = useRef(null);
  const testimonialsRef = useRef(null);
  const testimonialsTrackRef = useRef(null);
  
  // State for active dot
  const [activeDot, setActiveDot] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const dotCount = 5; // Number of dots

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/testimonials`);
        if (response.data.success) {
          const activeTestimonials = response.data.data.filter(t => t.status === 'active');
          setTestimonials(activeTestimonials);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoadingTestimonials(false);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    // Set initial states to prevent fading
    gsap.set(".hero-badge, .hero-title, .hero-desc, .hero-actions, .hero-visual", {
      opacity: 1,
      y: 0,
      scale: 1
    });

    gsap.set(".service-card, .why-card, .partners-title, .testimonial-card", {
      opacity: 1,
      y: 0,
      scale: 1
    });

    const ctx = gsap.context(() => {
      
      // Hero animations - from 0.01 to avoid complete fade
      gsap.from(".hero-badge", {
        y: 30,
        opacity: 0.01,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "all"
      });
      
      gsap.from(".hero-title", {
        y: 50,
        opacity: 0.01,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
        clearProps: "all"
      });
      
      gsap.from(".hero-desc", {
        y: 30,
        opacity: 0.01,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.4,
        clearProps: "all"
      });
      
      gsap.from(".hero-actions", {
        y: 30,
        opacity: 0.01,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.6,
        clearProps: "all"
      });
      
      gsap.from(".hero-visual", {
        scale: 0.8,
        opacity: 0.01,
        duration: 1.2,
        ease: "back.out(1.7)",
        delay: 0.3,
        clearProps: "all"
      });

      // Services section animations
      gsap.from(".services-header", {
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true
        },
        y: 40,
        opacity: 0.01,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "all"
      });

      gsap.from(".service-card", {
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
          once: true
        },
        y: 50,
        opacity: 0.01,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "all"
      });

      // Why choose us animations
      gsap.from(".why-header", {
        scrollTrigger: {
          trigger: whyRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true
        },
        y: 40,
        opacity: 0.01,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "all"
      });

      gsap.from(".why-card", {
        scrollTrigger: {
          trigger: whyRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
          once: true
        },
        y: 50,
        opacity: 0.01,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "all"
      });

      // Partners marquee animation
      if (partnersTrackRef.current) {
        gsap.to(partnersTrackRef.current, {
          xPercent: -50,
          duration: 40,
          ease: "linear",
          repeat: -1,
          modifiers: {
            xPercent: gsap.utils.unitize(x => parseFloat(x) % -50)
          }
        });
      }

      // Partners title animation
      gsap.from(".partners-title", {
        scrollTrigger: {
          trigger: ".partners-section",
          start: "top 90%",
          toggleActions: "play none none none",
          once: true
        },
        y: 30,
        opacity: 0.01,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "all"
      });

      // Testimonials marquee animation (only if not paused)
      if (testimonialsTrackRef.current && !isPaused) {
        gsap.to(testimonialsTrackRef.current, {
          xPercent: -50,
          duration: 60,
          ease: "linear",
          repeat: -1,
          modifiers: {
            xPercent: gsap.utils.unitize(x => parseFloat(x) % -50)
          }
        });
      }

      // Testimonials header animation
      gsap.from(".testimonials-header", {
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true
        },
        y: 40,
        opacity: 0.01,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "all"
      });

    }, pageRef);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ctx.revert();
    };
  }, [isPaused]);

  // Function to handle dot click
  const handleDotClick = (index) => {
    setActiveDot(index);
    setIsPaused(true);
    
    // Calculate scroll position (each card width + gap = approx 380px)
    const scrollAmount = index * 380;
    
    // Animate to the position
    if (testimonialsTrackRef.current) {
      gsap.to(testimonialsTrackRef.current, {
        x: -scrollAmount,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          // Resume auto-scroll after 3 seconds
          setTimeout(() => {
            setIsPaused(false);
          }, 3000);
        }
      });
    }
  };

  const services = [
    {
      icon: <TrendingUp size={32} strokeWidth={1.5} />,
      title: "Mutual Funds",
      description: "Professionally managed portfolios for long-term wealth creation",
      link: "/services/mutual-funds"
    },
    {
      icon: <Wallet size={32} strokeWidth={1.5} />,
      title: "SWP",
      description: "Systematic withdrawal plans for regular income during retirement",
      link: "/services/swp"
    },
    {
      icon: <Gem size={32} strokeWidth={1.5} />,
      title: "AIF",
      description: "Alternative investment funds for sophisticated investors",
      link: "/services/aif"
    },
    {
      icon: <Shield size={32} strokeWidth={1.5} />,
      title: "Life Insurance",
      description: "Comprehensive protection for your family's future",
      link: "/services/life-insurance"
    },
    {
      icon: <HeartPulse size={32} strokeWidth={1.5} />,
      title: "Health Insurance",
      description: "Medical coverage for you and your family",
      link: "/services/health-insurance"
    },
    {
      icon: <Car size={32} strokeWidth={1.5} />,
      title: "Vehicle Insurance",
      description: "Protection for your cars and two-wheelers",
      link: "/services/vehicle-insurance"
    }
  ];

  const whyItems = [
    {
      icon: <Target size={32} strokeWidth={1.5} />,
      title: "Goal-Based Planning",
      description: "Every recommendation starts with your unique financial goals."
    },
    {
      icon: <BarChart3 size={32} strokeWidth={1.5} />,
      title: "Research-Driven",
      description: "Strategies backed by rigorous market research and data analysis."
    },
    {
      icon: <Lock size={32} strokeWidth={1.5} />,
      title: "Complete Transparency",
      description: "No hidden charges, clear communication always."
    },
    {
      icon: <Handshake size={32} strokeWidth={1.5} />,
      title: "Lifelong Partnership",
      description: "We stay with you through every financial milestone."
    }
  ];

  // Testimonials data is now fetched from API

  // Partner logos array
  const partnerLogos = [
    { name: "ICICI Prudential MF", logo: iciciLogo },
    { name: "HDFC Mutual Fund", logo: hdfcLogo },
    { name: "Motilal Oswal AMC", logo: motilalLogo },
    { name: "SBI Mutual Fund", logo: sbiLogo },
    { name: "Nippon India MF", logo: nipponLogo },
    { name: "Kotak Mutual Fund", logo: kotakLogo },
    { name: "Parag Parikh MF", logo: paragLogo },
    { name: "Bandhan Mutual Fund", logo: bandhanLogo },
    { name: "Abakkus", logo: abakkusLogo },
    { name: "Buoyant", logo: buoyantLogo }
  ];

  // Double the array for seamless marquee
  const marqueeLogos = [...partnerLogos, ...partnerLogos];

  const scrollToServices = (e) => {
    e.preventDefault();
    if (servicesRef.current) {
      const yOffset = -80; // offset for fixed header if needed
      const element = servicesRef.current;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <main className="home-page" ref={pageRef}>
      
      {/* ========== HERO SECTION ========== */}
      <section className="hero-section" ref={heroRef}>
        <div className="container">
          <div className="hero-grid">
            
            {/* Left Content */}
            <div className="hero-content">
              <div className="hero-badge">
                <span className="badge-pulse"></span>
                <span>Trusted by 1,000+ Investors</span>
              </div>
              
              <h1 className="hero-title">
                Build wealth with <span className="text-gradient">clarity</span><br />
                and <span className="text-gradient">discipline</span>
              </h1>
              
              <p className="hero-desc">
                Expert investment and insurance helping individuals and 
                businesses achieve financial freedom through structured planning.
              </p>
              
              <div className="hero-actions">
                <Link to="/tools" className="btn btn-primary">
                  <span>Explore Tools</span>
                  <span className="btn-icon"><BarChart3 size={18} /></span>
                </Link>
                
                <a href="#services" onClick={scrollToServices} className="btn btn-outline">
                  <span>Our Services</span>
                  <span className="btn-icon">→</span>
                </a>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hero-visual">
              <div className="visual-wrapper">
                <Lottie 
                  animationData={heroAnim} 
                  loop={true}
                  className="hero-lottie"
                />
                <div className="visual-glow"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== VALUE STRIP ========== */}
      <section className="value-strip">
        <div className="container">
          <div className="value-grid">
            <div className="value-card">
              <div className="value-icon"><Award size={24} /></div>
              <div className="value-content">
                <h3>AMFI Registered</h3>
                <p>Mutual Fund Distributor</p>
              </div>
            </div>
            
            <div className="value-card">
              <div className="value-icon"><Lock size={24} /></div>
              <div className="value-content">
                <h3>100% Secure</h3>
                <p>Your data is protected</p>
              </div>
            </div>
            
            <div className="value-card">
              <div className="value-icon"><Star size={24} /></div>
              <div className="value-content">
                <h3>4.8 Rating</h3>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SERVICES SECTION ========== */}
      <section className="services-section" ref={servicesRef}>
        <div className="container">
          <div className="services-header">
            <span className="eyebrow">Our Services</span>
            <h2>Comprehensive <span className="text-gradient">financial solutions</span></h2>
            <p>Tailored investment and insurance products for every need</p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <Link to={service.link} key={index} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span className="service-link">
                  Learn more <span className="link-arrow">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHY CHOOSE US ========== */}
      <section className="why-section" ref={whyRef}>
        <div className="container">
          <div className="why-header">
            <span className="eyebrow">Why Choose Us</span>
            <h2>The <span className="text-gradient">Investerly</span> difference</h2>
            <p>What sets us apart in the financial advisory landscape</p>
          </div>

          <div className="why-grid">
            {whyItems.map((item, index) => (
              <div className="why-card" key={index}>
                <div className="why-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PARTNERS SECTION ========== */}
      <section className="partners-section">
        <div className="container">
          <h3 className="partners-title">Trusted by leading partners</h3>
        </div>

        <div className="partners-wrapper">
          <div className="partners-track" ref={partnersTrackRef}>
            {marqueeLogos.map((partner, index) => (
              <div className="partner-logo" key={index}>
                <img src={partner.logo} alt={partner.name} />
                <span className="partner-name">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS SECTION ========== */}
      <section className="testimonials-section" ref={testimonialsRef}>
        <div className="container">
          <div className="testimonials-header">
            <span className="eyebrow">Client Stories</span>
            <h2>What our <span className="text-gradient">clients say</span></h2>
            <p>Real experiences from people who trusted us with their financial journey</p>
          </div>

          <div className="testimonials-wrapper">
            {loadingTestimonials ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
                Loading testimonials...
              </div>
            ) : testimonials.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
                No testimonials available at the moment.
              </div>
            ) : (
              <div className="testimonials-track" ref={testimonialsTrackRef}>
                {/* Map through testimonials twice for seamless infinite scroll */}
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <div className="testimonial-card" key={index}>
                    {testimonial.type === 'video' && (
                      <div className="testimonial-media" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
                        {testimonial.content.includes('instagram.com') ? (
                          <a href={testimonial.content} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#E1306C', textDecoration: 'none' }}>
                            <InstagramIcon size={48} />
                            <span style={{ fontWeight: 500 }}>View on Instagram</span>
                          </a>
                        ) : testimonial.content.includes('youtube.com') || testimonial.content.includes('youtu.be') ? (
                          <iframe 
                            src={testimonial.content.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} 
                            title="Testimonial Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <a href={testimonial.content} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                            <ExternalLink size={48} />
                            <span style={{ fontWeight: 500 }}>View Video</span>
                          </a>
                        )}
                      </div>
                    )}
                    {testimonial.type === 'photo' && (
                      <div className="testimonial-media">
                        <img src={testimonial.content} alt={`Testimonial from ${testimonial.name}`} />
                      </div>
                    )}
                    
                    <div className="testimonial-quote">"</div>
                    {testimonial.type === 'text' && (
                      <p className="testimonial-content">{testimonial.content}</p>
                    )}
                    <div className="testimonial-rating">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="star">★</span>
                      ))}
                    </div>
                    <div className="testimonial-author">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.role}</p>
                    </div>
                    <div className="testimonial-shine"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Navigation dots with functionality */}
          <div className="testimonials-dots">
            {[...Array(dotCount)].map((_, index) => (
              <span 
                key={index} 
                className={`dot ${activeDot === index ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Home;