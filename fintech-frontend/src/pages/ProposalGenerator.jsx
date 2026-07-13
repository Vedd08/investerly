import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader2, Plus, Trash2, Download, AlertCircle, CheckCircle, User, Briefcase, Calendar, Target, Clock, ShieldAlert, IndianRupee, ArrowRight, ArrowLeft, TrendingUp, Shield, Activity, GraduationCap, Home } from 'lucide-react';
import gsap from 'gsap';
import { generateCorporateReport } from '../utils/generateCorporateReport';
import api from '../utils/api';
import '../styles/profile-research.css';

const ProposalGenerator = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    clientName: '',
    occupation: '',
    riskProfile: '',
    investmentHorizon: '',
    proposalDate: new Date().toISOString().split('T')[0],
    advisorName: 'Investerly Financial Services Pvt. Ltd.',
    
    // Goals
    goals: [
      { id: 1, name: 'Retirement Planning', targetAmount: '', timeHorizon: '', priority: 'HIGH', status: 'Active' }
    ],

    // Next Steps Amounts
    sipTotal: '',
    lumpsumTotal: '',
    annualInvestment: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Animate on step change
  useEffect(() => {
    if (formRef.current) {
      const elements = formRef.current.querySelectorAll('.step-animate');
      gsap.fromTo(elements, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [currentStep]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionSelect = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGoalChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.map(goal => goal.id === id ? { ...goal, [field]: value } : goal)
    }));
  };

  const addGoal = () => {
    setFormData(prev => ({
      ...prev,
      goals: [...prev.goals, { id: Date.now(), name: '', targetAmount: '', timeHorizon: '', priority: 'MEDIUM', status: 'Active' }]
    }));
  };

  const addPresetGoal = (presetName) => {
    setFormData(prev => ({
      ...prev,
      goals: [...prev.goals, { id: Date.now(), name: presetName, targetAmount: '', timeHorizon: '', priority: 'HIGH', status: 'Active' }]
    }));
  };

  const removeGoal = (id) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== id)
    }));
  };

  const nextStep = () => {
    // Basic validation
    if (currentStep === 1 && (!formData.clientName || !formData.occupation)) {
      setError('Please fill in your Name and Occupation to continue.');
      return;
    }
    if (currentStep === 2 && !formData.riskProfile) {
      setError('Please select a Risk Profile.');
      return;
    }
    if (currentStep === 3 && !formData.investmentHorizon) {
      setError('Please select your Investment Horizon.');
      return;
    }
    
    setError('');
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsGenerating(true);
    setError('');
    setSuccessMsg('');

    try {
      // 1. Generate PDF
      await generateCorporateReport(formData, user?.name);

      // 2. Save History
      const res = await api.post('/reports', {
        personName: formData.clientName,
        reportData: formData
      });

      const data = res.data;
      if (data.success) {
        setSuccessMsg('Your Personalized Financial Proposal is ready!');
      } else {
        setError('Downloaded PDF, but failed to save history to dashboard.');
      }
    } catch (err) {
      setError('Failed to generate PDF proposal.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (authLoading) return <div className="loading-screen text-center mt-5"><Loader2 className="spinner" size={32} /></div>;

  return (
    <div className="profile-research-container pb-5">
      <div className="research-header text-center" style={{ padding: '3rem 0', background: 'linear-gradient(135deg, #1A2A3A 0%, #121E2A 100%)' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem' }}>Create Your Financial Plan</h1>
          <p className="mb-0">Answer a few simple questions to generate your personalized investment strategy.</p>
        </div>
      </div>

      <div className="container mt-5 position-relative z-index-10" ref={formRef}>
        <div className="proposal-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          {/* Progress Bar */}
          <div className="wizard-progress-bar">
            <div className="wizard-progress-fill" style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}></div>
            {[1, 2, 3, 4, 5].map(step => (
              <div key={step} className={`wizard-step-indicator ${step === currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}>
                {step < currentStep ? <CheckCircle size={20} /> : step}
              </div>
            ))}
          </div>

          {error && <div className="alert alert-danger step-animate"><AlertCircle size={18} className="me-2" />{error}</div>}
          {successMsg && <div className="alert alert-success step-animate"><CheckCircle size={18} className="me-2" />{successMsg}</div>}

          {/* STEP 1: Basic Info */}
          {currentStep === 1 && (
            <div className="step-animate text-center">
              <h2 className="mb-2" style={{ fontWeight: 800, color: '#1A2A3A' }}>Let's get to know you</h2>
              <p className="text-muted mb-5">To personalize your plan, we need a few basic details.</p>
              
              <div className="row justify-content-center">
                <div className="col-md-8 text-start">
                  <div className="mb-4">
                    <label className="fw-bold mb-2">What is your full name?</label>
                    <div className="input-icon-wrapper">
                      <User className="input-icon" size={20} />
                      <input type="text" className="proposal-input" style={{ fontSize: '1.1rem', padding: '1rem 1.2rem 1rem 3rem' }} name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Enter your full name" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="fw-bold mb-2">What is your current occupation?</label>
                    <div className="input-icon-wrapper">
                      <Briefcase className="input-icon" size={20} />
                      <input type="text" className="proposal-input" style={{ fontSize: '1.1rem', padding: '1rem 1.2rem 1rem 3rem' }} name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Enter your occupation" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Risk Profile */}
          {currentStep === 2 && (
            <div className="step-animate text-center">
              <h2 className="mb-2" style={{ fontWeight: 800, color: '#1A2A3A' }}>What is your Risk Appetite?</h2>
              <p className="text-muted mb-5">This helps us recommend the right mix of equity and debt funds for you.</p>
              
              <div className="row g-4">
                <div className="col-md-4">
                  <div className={`wizard-option-card ${formData.riskProfile === 'LOW' ? 'active' : ''}`} onClick={() => handleOptionSelect('riskProfile', 'LOW')}>
                    <div className="wizard-option-icon"><Shield size={30} /></div>
                    <div className="wizard-option-title">Conservative</div>
                    <div className="wizard-option-desc">I prefer capital protection over high returns. Minimal market risk.</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className={`wizard-option-card ${formData.riskProfile === 'MODERATE' ? 'active' : ''}`} onClick={() => handleOptionSelect('riskProfile', 'MODERATE')}>
                    <div className="wizard-option-icon"><Activity size={30} /></div>
                    <div className="wizard-option-title">Moderate</div>
                    <div className="wizard-option-desc">I can accept some short-term volatility for steady long-term growth.</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className={`wizard-option-card ${formData.riskProfile === 'HIGH' ? 'active' : ''}`} onClick={() => handleOptionSelect('riskProfile', 'HIGH')}>
                    <div className="wizard-option-icon"><TrendingUp size={30} /></div>
                    <div className="wizard-option-title">Aggressive</div>
                    <div className="wizard-option-desc">I want to maximize returns and am comfortable with high market volatility.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Investment Horizon */}
          {currentStep === 3 && (
            <div className="step-animate text-center">
              <h2 className="mb-2" style={{ fontWeight: 800, color: '#1A2A3A' }}>What is your Investment Horizon?</h2>
              <p className="text-muted mb-5">How long do you plan to stay invested before needing the majority of your funds?</p>
              
              <div className="row g-4 justify-content-center">
                {['< 5 Years (Short Term)', '5-10 Years (Medium Term)', '10-15 Years (Long Term)', '15+ Years (Retirement)'].map((horizon) => (
                  <div key={horizon} className="col-md-5">
                    <div className={`wizard-option-card ${formData.investmentHorizon === horizon ? 'active' : ''}`} style={{ padding: '1.5rem' }} onClick={() => handleOptionSelect('investmentHorizon', horizon)}>
                      <div className="wizard-option-title m-0" style={{ fontSize: '1.1rem' }}>{horizon}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Financial Goals */}
          {currentStep === 4 && (
            <div className="step-animate">
              <div className="text-center mb-5">
                <h2 className="mb-2" style={{ fontWeight: 800, color: '#1A2A3A' }}>What are you saving for?</h2>
                <p className="text-muted">Define your financial goals. You can add as many as you like.</p>
                
                <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
                  <span className="preset-chip" onClick={() => addPresetGoal('Retirement Corpus')}><Target size={16} /> Retirement</span>
                  <span className="preset-chip" onClick={() => addPresetGoal('Child\'s Education')}><GraduationCap size={16} /> Education</span>
                  <span className="preset-chip" onClick={() => addPresetGoal('Buying a Home')}><Home size={16} /> Buying a Home</span>
                  <span className="preset-chip" onClick={() => addPresetGoal('Wealth Creation')}><TrendingUp size={16} /> Wealth Creation</span>
                </div>
              </div>
              
              <div className="goals-container">
                {formData.goals.map((goal, index) => (
                  <div key={goal.id} className="goal-row" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="m-0 fw-bold" style={{ color: '#1A2A3A' }}>Goal {index + 1}</h5>
                      {formData.goals.length > 1 && (
                        <button type="button" onClick={() => removeGoal(goal.id)} className="btn btn-sm btn-outline-danger border-0"><Trash2 size={18} /></button>
                      )}
                    </div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label>Goal Name</label>
                        <input type="text" className="proposal-input" value={goal.name} onChange={(e) => handleGoalChange(goal.id, 'name', e.target.value)} placeholder="e.g. Retirement Planning" />
                      </div>
                      <div className="col-md-6">
                        <label>Target Amount</label>
                        <input type="text" className="proposal-input" value={goal.targetAmount} onChange={(e) => handleGoalChange(goal.id, 'targetAmount', e.target.value)} placeholder="e.g. Rs. 5 Crores" />
                      </div>
                      <div className="col-md-6">
                        <label>Years to Goal</label>
                        <input type="text" className="proposal-input" value={goal.timeHorizon} onChange={(e) => handleGoalChange(goal.id, 'timeHorizon', e.target.value)} placeholder="e.g. 15 Years" />
                      </div>
                      <div className="col-md-6">
                        <label>Priority</label>
                        <select className="proposal-input" value={goal.priority} onChange={(e) => handleGoalChange(goal.id, 'priority', e.target.value)}>
                          <option value="HIGH">High Priority</option>
                          <option value="MEDIUM">Medium Priority</option>
                          <option value="LOW">Low Priority</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <button type="button" onClick={addGoal} className="btn btn-link text-decoration-none fw-bold" style={{ color: '#2FB34A' }}><Plus size={20} className="me-1" /> Add Another Goal</button>
              </div>
            </div>
          )}

          {/* STEP 5: Final Details */}
          {currentStep === 5 && (
            <div className="step-animate text-center">
              <h2 className="mb-2" style={{ fontWeight: 800, color: '#1A2A3A' }}>Investment Capability</h2>
              <p className="text-muted mb-5">To achieve these goals, tell us what you can comfortably invest.</p>
              
              <div className="row justify-content-center">
                <div className="col-md-8 text-start">
                  <div className="mb-4">
                    <label className="fw-bold mb-2">Monthly SIP Capacity</label>
                    <div className="input-icon-wrapper">
                      <IndianRupee className="input-icon" size={20} />
                      <input type="text" className="proposal-input" style={{ fontSize: '1.1rem', padding: '1rem 1.2rem 1rem 3rem' }} name="sipTotal" value={formData.sipTotal} onChange={handleChange} placeholder="e.g. Rs. 50,000" />
                    </div>
                    <small className="text-muted mt-2 d-block">How much can you invest every month?</small>
                  </div>
                  
                  <div className="mb-4">
                    <label className="fw-bold mb-2">Initial Lumpsum (Optional)</label>
                    <div className="input-icon-wrapper">
                      <IndianRupee className="input-icon" size={20} />
                      <input type="text" className="proposal-input" style={{ fontSize: '1.1rem', padding: '1rem 1.2rem 1rem 3rem' }} name="lumpsumTotal" value={formData.lumpsumTotal} onChange={handleChange} placeholder="e.g. Rs. 10,00,000" />
                    </div>
                    <small className="text-muted mt-2 d-block">Do you have existing funds to invest upfront?</small>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="d-flex justify-content-between mt-5 pt-4 border-top">
            {currentStep > 1 ? (
              <button type="button" onClick={prevStep} className="wizard-btn-outline d-flex align-items-center gap-2">
                <ArrowLeft size={18} /> Back
              </button>
            ) : (
              <div></div> // Empty div for flex spacing
            )}
            
            {currentStep < totalSteps ? (
              <button type="button" onClick={nextStep} className="wizard-btn-primary d-flex align-items-center gap-2">
                Continue <ArrowRight size={18} />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={isGenerating || successMsg} className="wizard-btn-primary d-flex align-items-center gap-2" style={{ background: 'linear-gradient(135deg, #1A2A3A 0%, #121E2A 100%)' }}>
                {isGenerating ? <Loader2 className="spinner" size={20} /> : <CheckCircle size={20} />}
                {isGenerating ? 'Generating...' : successMsg ? 'Proposal Ready!' : 'Generate My Proposal'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProposalGenerator;
