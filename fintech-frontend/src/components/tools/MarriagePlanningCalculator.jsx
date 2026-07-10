import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Target, Clock, Wallet, TrendingUp, Zap, BarChart3, Calendar, Download } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../styles/calculator.css";
import { MapPin, Utensils, Sparkles, Gem } from "lucide-react";
import { addReportHeader, addReportFooter } from "../../utils/pdfHelper";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const MarriagePlanningCalculator = () => {
  const [currentAge, setCurrentAge] = useState(25);
  const [marriageAge, setMarriageAge] = useState(28);
  const [currentSavings, setCurrentSavings] = useState(100000);
  const [monthlySIP, setMonthlySIP] = useState(5000);
  const [returnRate, setReturnRate] = useState(12);
  const [inflationRate, setInflationRate] = useState(6);
  
  // Marriage expenses
  const [venueCost, setVenueCost] = useState(1500000);
  const [cateringCost, setCateringCost] = useState(1000000);
  const [decorationCost, setDecorationCost] = useState(500000);
  const [jewelryCost, setJewelryCost] = useState(2000000);
  const [clothingCost, setClothingCost] = useState(500000);
  const [photographyCost, setPhotographyCost] = useState(300000);
  const [otherCosts, setOtherCosts] = useState(1000000);

  const sectionRef = useRef(null);
  const resultRef = useRef(null);

  const totalCurrentCost = useMemo(() => {
    return venueCost + cateringCost + decorationCost + jewelryCost + 
           clothingCost + photographyCost + otherCosts;
  }, [venueCost, cateringCost, decorationCost, jewelryCost, 
      clothingCost, photographyCost, otherCosts]);

  const result = useMemo(() => {
    const yearsToMarriage = marriageAge - currentAge;
    const monthsToMarriage = yearsToMarriage * 12;
    
    // Future cost considering inflation
    const futureCost = totalCurrentCost * Math.pow(1 + inflationRate / 100, yearsToMarriage);
    
    // Future value of current savings
    const futureSavings = currentSavings * Math.pow(1 + returnRate / 100, yearsToMarriage);
    
    // Future value of monthly SIPs
    const monthlyRate = returnRate / 12 / 100;
    const sipFutureValue = monthlySIP * ((Math.pow(1 + monthlyRate, monthsToMarriage) - 1) / monthlyRate) * (1 + monthlyRate);
    
    const totalAvailable = futureSavings + sipFutureValue;
    const gap = Math.max(0, futureCost - totalAvailable);
    
    // Additional monthly investment needed
    const additionalMonthly = gap * monthlyRate / ((Math.pow(1 + monthlyRate, monthsToMarriage) - 1) * (1 + monthlyRate));
    
    // Monthly investment needed if starting from zero
    const requiredMonthly = futureCost * monthlyRate / ((Math.pow(1 + monthlyRate, monthsToMarriage) - 1) * (1 + monthlyRate));
    
    return {
      currentCost: totalCurrentCost,
      futureCost,
      futureSavings,
      sipFutureValue,
      totalAvailable,
      gap,
      additionalMonthly,
      requiredMonthly,
      yearsToMarriage,
      onTrack: totalAvailable >= futureCost,
      progress: (totalAvailable / futureCost) * 100
    };
  }, [currentAge, marriageAge, currentSavings, monthlySIP, returnRate, 
      inflationRate, totalCurrentCost]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".calculator-header, .calc-inputs, .calc-results", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const formatCurrency = (num, forPDF = false) => {
    if (!num || isNaN(num)) return forPDF ? 'Rs. 0' : '₹0';
    const formatted = num.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
    return forPDF ? formatted.replace(/₹/g, 'Rs. ') : formatted;
  };

  const formatLargeNumber = (num, forPDF = false) => {
    if (!num || isNaN(num)) return forPDF ? 'Rs. 0' : '₹0';
    const symbol = forPDF ? 'Rs. ' : '₹';
    if (num >= 10000000) return `${symbol}${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${symbol}${(num / 100000).toFixed(2)} Lac`;
    if (num >= 1000) return `${symbol}${(num / 1000).toFixed(2)} K`;
    return formatCurrency(num, forPDF);
  };

  const downloadReport = async () => {
    try {
      const doc = new jsPDF();

      await addReportHeader(doc, "Marriage Calculator Report");
      
      // Timeline
      doc.setTextColor(46, 63, 86);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Wedding Timeline", 20, 70);
      
      const timelineData = [
        ["Current Age:", `${currentAge} years`],
        ["Planned Marriage Age:", `${marriageAge} years`],
        ["Years to Plan:", `${result.yearsToMarriage} years`],
        ["Months to Plan:", `${result.yearsToMarriage * 12} months`]
      ];
      
      let yPos = 80;
      timelineData.forEach(([label, value]) => {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(label, 25, yPos);
        doc.text(value, 100, yPos);
        yPos += 8;
      });
      
      // Cost Breakdown
      yPos += 10;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Wedding Cost Breakdown", 20, yPos);
      
      const costData = [
        ["Venue", formatCurrency(venueCost, true)],
        ["Catering", formatCurrency(cateringCost, true)],
        ["Decoration", formatCurrency(decorationCost, true)],
        ["Jewellery", formatCurrency(jewelryCost, true)],
        ["Clothing", formatCurrency(clothingCost, true)],
        ["Photography", formatCurrency(photographyCost, true)],
        ["Other Expenses", formatCurrency(otherCosts, true)],
        ["Total Current Cost", formatLargeNumber(totalCurrentCost, true)]
      ];
      
      autoTable(doc, {
        startY: yPos + 5,
        body: costData,
        theme: 'striped',
        columnStyles: {
          0: { fontStyle: 'bold' },
          1: { halign: 'right' }
        }
      });
      
      // Future Cost
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Future Wedding Cost (with Inflation)", 20, finalY);
      
      doc.setFontSize(14);
      doc.setTextColor(47, 179, 74);
      doc.text(formatLargeNumber(result.futureCost, true), 20, finalY + 10);
      
      // Investment Required
      doc.setTextColor(46, 63, 86);
      doc.setFontSize(12);
      doc.text("Monthly Investment Required", 20, finalY + 25);
      
      doc.setFontSize(14);
      doc.setTextColor(result.onTrack ? 47 : 220, result.onTrack ? 179 : 53, result.onTrack ? 74 : 69);
      doc.text(formatCurrency(result.requiredMonthly, true), 20, finalY + 35);
      
      // Disclaimer
      doc.setFontSize(8);
      doc.setTextColor(107, 124, 143);
      doc.text("*This is an estimate. Actual costs may vary based on location and preferences.", 20, doc.internal.pageSize.height - 20);
      
      addReportFooter(doc);
      doc.save(`Marriage_Calculator_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <section className="calculator-section marriage-calculator" ref={sectionRef}>
      <div className="container">
        <div className="calculator-header">
          <span className="calculator-eyebrow">
            <span className="eyebrow-icon"><Heart size={16} /></span>
            Marriage Calculator
          </span>
          <h1 className="calculator-title">
            Plan Your <span className="text-gradient">Dream Wedding</span>
          </h1>
          <p className="calculator-description">
            Calculate how much you need to save for your perfect wedding day.
          </p>
        </div>

        <div className="calculator-grid">
          {/* INPUT PANEL */}
          <div className="calc-inputs glass-effect">
            <div className="input-header">
              <div className="input-icon pulse-animation"><Heart size={24} /></div>
              <h3>Wedding Details</h3>
            </div>

            <div className="input-row">
              <div className="input-group half">
                <label className="input-label">
                  <span>Current Age</span>
                  <div className="input-value-wrapper highlight">
                  
                  <input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  <span> Years</span>
                </div>
                </label>
                <input
                  type="range"
                  min="18"
                  max="40"
                  step="1"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
              <div className="slider-range">
                <span>18y</span>
                <span>29y</span>
                <span>40y</span>
              </div>
              </div>

              <div className="input-group half">
                <label className="input-label">
                  <span>Planned Marriage Age</span>
                  <div className="input-value-wrapper highlight">
                  
                  <input
                    type="number"
                    value={marriageAge}
                    onChange={(e) => setMarriageAge(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  <span> Years</span>
                </div>
                </label>
                <input
                  type="range"
                  min="21"
                  max="50"
                  step="1"
                  value={marriageAge}
                  onChange={(e) => setMarriageAge(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
              <div className="slider-range">
                <span>21y</span>
                <span>35y</span>
                <span>50y</span>
              </div>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Current Savings</span>
                <div className="input-value-wrapper highlight">
                  <span>₹</span>
                  <input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  
                </div>
              </label>
              <input
                type="range"
                min="0"
                max="1000000"
                step="50000"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>₹0</span>
                <span>₹5L</span>
                <span>₹10L</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Monthly SIP</span>
                <div className="input-value-wrapper highlight">
                  <span>₹</span>
                  <input
                    type="number"
                    value={monthlySIP}
                    onChange={(e) => setMonthlySIP(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  
                </div>
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={monthlySIP}
                onChange={(e) => setMonthlySIP(Number(e.target.value))}
                className="slider-input styled-slider"
              />
              <div className="slider-range">
                <span>₹0</span>
                <span>₹50K</span>
                <span>₹1L</span>
              </div>
            </div>

            <div className="input-row">
              <div className="input-group half">
                <label className="input-label">
                  <span>Return Rate (%)</span>
                  <div className="input-value-wrapper highlight">
                  
                  <input
                    type="number"
                    value={returnRate}
                    onChange={(e) => setReturnRate(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  <span>%</span>
                </div>
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.5"
                  value={returnRate}
                  onChange={(e) => setReturnRate(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
              <div className="slider-range">
                <span>1%</span>
                <span>8%</span>
                <span>15%</span>
              </div>
              </div>

              <div className="input-group half">
                <label className="input-label">
                  <span>Inflation (%)</span>
                  <div className="input-value-wrapper highlight">
                  
                  <input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(e.target.value === '' ? '' : Number(e.target.value))}
                    className="number-input"
                  />
                  <span>%</span>
                </div>
                </label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="0.5"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
              <div className="slider-range">
                <span>2%</span>
                <span>6%</span>
                <span>10%</span>
              </div>
              </div>
            </div>

            <div className="expenses-section">
              <h4>Wedding Expenses</h4>
              
              <div className="expense-item" style={{ marginBottom: '1rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label style={{ fontWeight: '600', color: 'var(--color-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={20} color="var(--color-accent)" /> Venue
                  </label>
                  <span className="expense-value" style={{ fontWeight: '700', color: 'var(--color-accent)', fontSize: '1.1rem' }}>{formatCurrency(venueCost)}</span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="5000000"
                  step="100000"
                  value={venueCost}
                  onChange={(e) => setVenueCost(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
              </div>

              <div className="expense-item" style={{ marginBottom: '1rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label style={{ fontWeight: '600', color: 'var(--color-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Utensils size={20} color="var(--color-accent)" /> Catering
                  </label>
                  <span className="expense-value" style={{ fontWeight: '700', color: 'var(--color-accent)', fontSize: '1.1rem' }}>{formatCurrency(cateringCost)}</span>
                </div>
                <input
                  type="range"
                  min="200000"
                  max="3000000"
                  step="100000"
                  value={cateringCost}
                  onChange={(e) => setCateringCost(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
              </div>

              <div className="expense-item" style={{ marginBottom: '1rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label style={{ fontWeight: '600', color: 'var(--color-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={20} color="var(--color-accent)" /> Decoration
                  </label>
                  <span className="expense-value" style={{ fontWeight: '700', color: 'var(--color-accent)', fontSize: '1.1rem' }}>{formatCurrency(decorationCost)}</span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="2000000"
                  step="50000"
                  value={decorationCost}
                  onChange={(e) => setDecorationCost(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
              </div>

              <div className="expense-item" style={{ marginBottom: '1rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label style={{ fontWeight: '600', color: 'var(--color-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Gem size={20} color="var(--color-accent)" /> Jewellery
                  </label>
                  <span className="expense-value" style={{ fontWeight: '700', color: 'var(--color-accent)', fontSize: '1.1rem' }}>{formatCurrency(jewelryCost)}</span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="5000000"
                  step="100000"
                  value={jewelryCost}
                  onChange={(e) => setJewelryCost(Number(e.target.value))}
                  className="slider-input styled-slider"
                />
              </div>
            </div>
          </div>

          {/* RESULTS PANEL */}
          <div className="calc-results glass-effect" ref={resultRef}>
            <div className="results-header">
              <div className="results-icon float-animation"><Target size={24} /></div>
              <h3>Wedding Plan</h3>
            </div>

            {/* Main Result */}
            <div className="main-result-card premium-card">
              <div className="card-glow"></div>
              <div className="result-label">Estimated Wedding Cost</div>
              <div className="result-number count-animation">
                {formatLargeNumber(result.futureCost)}
              </div>
              <div className="result-badge">
                <span className="badge-icon"><Clock size={16} /></span>
                <span>in {result.yearsToMarriage} years</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-section">
              <h4>Savings Progress</h4>
              <div className="progress-container">
                <div className="progress-labels">
                  <span>Current: {formatLargeNumber(result.totalAvailable)}</span>
                  <span>Target: {formatLargeNumber(result.futureCost)}</span>
                </div>
                <div className="progress-bar-large">
                  <div 
                    className={`progress-fill ${result.onTrack ? 'on-track' : 'off-track'}`}
                    style={{ width: `${Math.min(100, result.progress)}%` }}
                  >
                    {result.progress > 15 && `${result.progress.toFixed(1)}%`}
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon"><Wallet size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Current Cost</div>
                  <div className="metric-value">{formatLargeNumber(result.currentCost)}</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon"><TrendingUp size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Future Value</div>
                  <div className="metric-value">{formatLargeNumber(result.futureCost)}</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon"><Gem size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">SIP Future Value</div>
                  <div className="metric-value">{formatLargeNumber(result.sipFutureValue)}</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon"><Zap size={24} /></div>
                <div className="metric-content">
                  <div className="metric-label">Gap to Fill</div>
                  <div className={`metric-value ${result.gap > 0 ? 'warning' : 'positive'}`}>
                    {formatLargeNumber(result.gap)}
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Required */}
            <div className="investment-card">
              <div className="investment-header">
                <span className="investment-icon"><BarChart3 size={16} /></span>
                <span className="investment-label">Monthly Investment Required</span>
              </div>
              <div className="investment-amount">{formatCurrency(result.requiredMonthly)}</div>
              {!result.onTrack && (
                <div className="investment-note">
                  Additional monthly SIP needed: {formatCurrency(result.additionalMonthly)}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <Link to="/contact" className="action-btn primary">
                <span className="btn-icon"><Calendar size={20} /></span>
                <span className="btn-text">Get Wedding Planning Advice</span>
                <span className="btn-arrow">→</span>
              </Link>
              <button onClick={downloadReport} className="action-btn secondary">
                <span className="btn-icon"><Download size={20} /></span>
                <span className="btn-text">Download Report</span>
              </button>
            </div>

            <p className="calc-disclaimer">
              *Wedding costs are estimates. Actual expenses may vary based on location and preferences.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarriagePlanningCalculator;