import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { TrendingUp, Landmark, Shield, Target, BarChart3 } from "lucide-react";
import "../styles/tools.css";
import Footer from "../components/Footer";

const Tools = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    // Set initial visibility
    gsap.set(".tools-header, .tools-category", {
      opacity: 1,
      y: 0
    });

    const ctx = gsap.context(() => {
      gsap.from(".tools-header", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        clearProps: "all"
      });

      gsap.from(".tools-category", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.3,
        clearProps: "all"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toolCategories = [
    {
      title: "Investment Calculators",
      icon: <TrendingUp size={28} />,
      color: "#2FB34A",
      tools: [
        { name: "SIP Calculator", path: "/tools/sip-calculator", desc: "Calculate monthly SIP returns with power of compounding" },
        { name: "Lumpsum Calculator", path: "/tools/lumpsum-calculator", desc: "Calculate future value of one-time investment" },
        { name: "Retirement Calculator", path: "/tools/retirement-calculator", desc: "Plan your retirement corpus and monthly savings" }
      ]
    },
    {
      title: "Loan Calculators",
      icon: <Landmark size={28} />,
      color: "#2E3F56",
      tools: [
        { name: "EMI Calculator", path: "/tools/emi-calculator", desc: "Calculate loan EMI, total interest and payment" },
        { name: "Home Loan Calculator", path: "/tools/home-loan-calculator", desc: "Plan your home loan with affordability check" },
        { name: "Car Loan Calculator", path: "/tools/car-loan-calculator", desc: "Calculate vehicle loan EMI with on-road price" }
      ]
    },
    {
      title: "Insurance & Protection",
      icon: <Shield size={28} />,
      color: "#63C97A",
      tools: [
        { name: "Life Insurance Calculator", path: "/tools/life-insurance-calculator", desc: "Calculate optimal life insurance coverage" }
      ]
    },
    {
      title: "Goal Planning",
      icon: <Target size={28} />,
      color: "#FFA726",
      tools: [
        { name: "Marriage Calculator", path: "/tools/marriage-calculator", desc: "Plan and save for your dream wedding" },
        { name: "Education Calculator", path: "/tools/education-calculator", desc: "Save for your children's higher education" }
      ]
    },
    {
      title: "Tax & Performance",
      icon: <BarChart3 size={28} />,
      color: "#9C27B0",
      tools: [
        { name: "Tax Calculator", path: "/tools/tax-calculator", desc: "Calculate income tax under old and new regime" },
        { name: "SIP Performance", path: "/tools/sip-performance", desc: "Analyze historical and projected SIP returns" },
        { name: "Fund Performance", path: "/tools/fund-performance", desc: "Compare mutual fund performance metrics" }
      ]
    }
  ];

  return (
    <div className="tools-page-wrapper">
      <div className="tools-page" ref={sectionRef}>
        <div className="tools-container">
          
          {/* Header */}
          <div className="tools-header">
            <span className="tools-badge">Financial Toolkit</span>
            <h1 className="tools-heading">
              Plan Your <span className="heading-highlight">Financial Future</span>
            </h1>
            <p className="tools-subheading">
              Use our comprehensive suite of financial calculators to make informed decisions with confidence.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="tools-grid">
            {toolCategories.map((category, idx) => (
              <div key={idx} className="tools-category">
                <div className="category-title">
                  <span className="category-icon" style={{ background: `linear-gradient(135deg, ${category.color}20, ${category.color}40)` }}>
                    {category.icon}
                  </span>
                  <h2>{category.title}</h2>
                </div>
                <div className="category-cards">
                  {category.tools.map((tool, index) => (
                    <Link to={tool.path} key={index} className="tool-card" style={{"--card-accent": category.color}}>
                      <div className="tool-card-inner">
                        <div className="tool-header">
                          <h3 className="tool-name">{tool.name}</h3>
                          <span className="tool-badge">New</span>
                        </div>
                        <p className="tool-desc">{tool.desc}</p>
                        
                        <div className="tool-footer">
                          <span className="tool-link-text">Calculate Now</span>
                          <span className="tool-arrow">→</span>
                        </div>
                      </div>
                      <div className="tool-card-glow" style={{background: `radial-gradient(circle at right bottom, ${category.color}40, transparent 60%)`}}></div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Tools;