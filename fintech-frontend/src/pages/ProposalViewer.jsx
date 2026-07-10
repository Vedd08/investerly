import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  User, 
  Target, 
  ShieldAlert, 
  TrendingUp, 
  PieChart, 
  ArrowLeft, 
  Download,
  CheckCircle,
  FileText
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { generateCorporateReport } from '../utils/generateCorporateReport';
import '../styles/dashboard.css'; // Reusing SaaS dashboard styles

const ProposalViewer = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (location.state && location.state.reportData) {
      setReportData(location.state.reportData);
    } else {
      navigate('/dashboard');
    }
  }, [location, navigate]);

  const handleDownload = () => {
    if (reportData) {
      generateCorporateReport(reportData, user?.name);
    }
  };

  if (!reportData) return <div className="loading-screen text-center mt-5">Loading Proposal Data...</div>;

  const generateChartData = () => {
    const data = [];
    const sipInvested = parseInt(reportData.sipTotal?.replace(/\D/g, '') || '0') * 12;
    let rawLump = parseInt(reportData.lumpsumTotal?.replace(/\D/g, '') || '0');
    const lumpsumInvested = rawLump > 0 ? rawLump : 500000;
    
    let currentSipValue = 0;
    let currentLumpsumValue = lumpsumInvested;
    
    for (let i = 0; i <= 15; i++) {
      if (i > 0) {
        currentSipValue = (currentSipValue + sipInvested) * 1.15;
        currentLumpsumValue = currentLumpsumValue * 1.15;
      }
      data.push({
        year: i,
        sipInvested: sipInvested * i,
        sipValue: Math.round(currentSipValue),
        lumpsumInvested: lumpsumInvested,
        lumpsumValue: Math.round(currentLumpsumValue)
      });
    }
    return data;
  };

  const formatCurrency = (val) => `Rs. ${(val / 100000).toFixed(2)} L`;

  const tabs = [
    { id: 'profile', label: 'Profile & Goals', icon: <User size={18} /> },
    { id: 'why', label: 'Why Planning Matters', icon: <Target size={18} /> },
    { id: 'insurance', label: 'Insurance Planning', icon: <ShieldAlert size={18} /> },
    { id: 'sip', label: 'SIP Portfolio', icon: <TrendingUp size={18} /> },
    { id: 'lumpsum', label: 'Lumpsum Portfolio', icon: <PieChart size={18} /> }
  ];

  return (
    <div className="proposal-viewer-container" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingTop: '80px', paddingBottom: '5rem', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Clean SaaS Header */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '2rem 0', marginBottom: '2rem' }}>
        <div className="container d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <Link to="/dashboard" className="text-decoration-none d-inline-flex align-items-center mb-3" style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>
              <ArrowLeft size={16} className="me-2" /> Back to Dashboard
            </Link>
            <h2 className="mb-1 fw-bold" style={{ color: '#0f172a', letterSpacing: '-0.5px', marginTop: '0.5rem' }}>Financial Proposal</h2>
            <p className="mb-0" style={{ color: '#64748b', fontSize: '1.05rem' }}>Prepared exclusively for <strong style={{ color: '#0f172a' }}>{reportData.clientName}</strong></p>
          </div>
          <button onClick={handleDownload} className="btn-saas-primary">
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }} className="proposal-layout">
          
          {/* Sidebar Navigation */}
          <div className="proposal-sidebar" style={{ gridColumn: '1 / 2' }}>
            <div className="bg-white rounded p-4" style={{ position: 'sticky', top: '100px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h6 className="mb-4 text-uppercase" style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>Document Index</h6>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {tabs.map(tab => (
                  <button 
                    key={tab.id}
                    className="text-start d-flex align-items-center gap-3"
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      backgroundColor: activeTab === tab.id ? '#f1f5f9' : 'transparent',
                      color: activeTab === tab.id ? '#0f172a' : '#64748b',
                      fontWeight: activeTab === tab.id ? '600' : '500',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      transition: 'all 0.2s',
                      border: 'none',
                      width: '100%',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ color: activeTab === tab.id ? '#2FB34A' : '#94a3b8' }}>
                      {tab.icon}
                    </span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="proposal-content" style={{ gridColumn: '2 / -1' }}>
            <div className="bg-white rounded p-5" style={{ minHeight: '600px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              
              {/* TAB 1: Profile & Goals */}
              {activeTab === 'profile' && (
                <div className="animate-fade-in">
                  <h3 className="mb-5 fw-bold" style={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                    Client Profile & Financial Goals
                  </h3>
                  
                  <h5 className="fw-bold mb-4 mt-5" style={{ color: '#334155' }}>Client Information</h5>
                  <div className="reports-container mb-5" style={{ padding: '0', overflow: 'hidden' }}>
                    <table className="premium-table">
                      <thead>
                        <tr>
                          <th>Parameter</th>
                          <th>Details</th>
                          <th>Parameter</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Client Name</td>
                          <td>{reportData.clientName}</td>
                          <td>Occupation</td>
                          <td>{reportData.occupation || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td>Risk Profile</td>
                          <td style={{ color: '#16a34a', fontWeight: '700' }}>{reportData.riskProfile}</td>
                          <td>Investment Horizon</td>
                          <td>{reportData.investmentHorizon || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td>Proposal Date</td>
                          <td>{reportData.proposalDate}</td>
                          <td>Advisor</td>
                          <td>{reportData.advisorName}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h5 className="fw-bold mb-4" style={{ color: '#334155' }}>Financial Goals</h5>
                  <div className="reports-container" style={{ padding: '0', overflow: 'hidden' }}>
                    <table className="premium-table">
                      <thead>
                        <tr>
                          <th>Goal Name</th>
                          <th>Target Amount</th>
                          <th>Time Horizon</th>
                          <th>Priority</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.goals && reportData.goals.map((goal, idx) => (
                          <tr key={idx}>
                            <td style={{ color: '#0f172a' }}>{goal.name}</td>
                            <td style={{ color: '#3b82f6', fontWeight: '700' }}>{goal.targetAmount}</td>
                            <td>{goal.timeHorizon}</td>
                            <td>
                              <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', backgroundColor: '#f1f5f9', color: '#475569' }}>
                                {goal.priority}
                              </span>
                            </td>
                            <td>{goal.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: Why Planning Matters */}
              {activeTab === 'why' && (
                <div className="animate-fade-in">
                  <h3 className="mb-5 fw-bold" style={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                    Why Financial Planning Matters
                  </h3>
                  
                  <p className="mb-5" style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#475569' }}>
                    Many people work hard their entire lives, yet arrive at retirement without enough savings. 
                    The reason is almost always the same — they relied on income alone, without putting their money to work.
                  </p>

                  <div className="row g-4 mb-5">
                    <div className="col-md-6">
                      <div className="p-4 h-100 rounded" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <h5 className="fw-bold mb-3" style={{ color: '#0f172a' }}>The Silent Thief: Inflation</h5>
                        <p className="mb-0" style={{ color: '#64748b', lineHeight: '1.7' }}>That new car, child's college fees, or medical bills will cost roughly double in a decade. If your money sits in a 3% savings account, you lose purchasing power every year.</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-4 h-100 rounded" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                        <h5 className="fw-bold mb-3" style={{ color: '#166534' }}>The Power of Starting Early</h5>
                        <p className="mb-0" style={{ color: '#15803d', lineHeight: '1.7' }}>Time is your most powerful tool. Waiting just 10 years to start investing can cost you crores in compounded returns for the exact same monthly contribution.</p>
                      </div>
                    </div>
                  </div>

                  <h5 className="fw-bold mb-4 mt-5" style={{ color: '#334155' }}>Without Planning vs. With Planning</h5>
                  <div className="reports-container" style={{ padding: '0', overflow: 'hidden' }}>
                    <table className="premium-table">
                      <thead>
                        <tr>
                          <th>Without Financial Planning</th>
                          <th>With Financial Planning (Your Plan)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Savings in FD at 6% per year — barely beats inflation</td>
                          <td style={{ color: '#16a34a', backgroundColor: '#f0fdf4', fontWeight: '600' }}><CheckCircle size={18} className="me-2"/> SIP in equity mutual funds targeting 14-16% per year</td>
                        </tr>
                        <tr>
                          <td>No life insurance coverage — family at financial risk</td>
                          <td style={{ color: '#16a34a', backgroundColor: '#f0fdf4', fontWeight: '600' }}><CheckCircle size={18} className="me-2"/> Recommended: Term cover of Rs. 2 Crore (Already Taken)</td>
                        </tr>
                        <tr>
                          <td>No defined goals — money spent without direction</td>
                          <td style={{ color: '#16a34a', backgroundColor: '#f0fdf4', fontWeight: '600' }}><CheckCircle size={18} className="me-2"/> Clear goals with mapped investments and timelines</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: Insurance Planning */}
              {activeTab === 'insurance' && (
                <div className="animate-fade-in">
                  <h3 className="mb-5 fw-bold" style={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                    Insurance Planning
                  </h3>
                  
                  <h5 className="fw-bold mb-3" style={{ color: '#0f172a' }}>Term Life Insurance</h5>
                  <p className="mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#475569' }}>
                    Term insurance is the purest form of life insurance. It pays your family a large lump sum if something happens to you. 
                    As a high-income professional, {reportData.clientName}'s family lifestyle depends on earning capacity.
                  </p>

                  <div className="p-4 rounded mb-5" style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <ShieldAlert size={24} style={{ color: '#3b82f6' }} />
                      <h5 className="fw-bold mb-0" style={{ color: '#1e3a8a' }}>Recommended Term Cover</h5>
                    </div>
                    <p className="mb-0 mt-2 ms-5" style={{ color: '#1e40af', fontSize: '1.05rem' }}>
                      Minimum 10–15x of annual income. For {reportData.clientName}, a cover of <strong>Rs. 2–5 Crores</strong> is advisable.
                    </p>
                  </div>

                  <div className="reports-container mb-5" style={{ padding: '0', overflow: 'hidden' }}>
                    <table className="premium-table">
                      <thead>
                        <tr>
                          <th>Parameter</th>
                          <th>Client ({reportData.clientName})</th>
                          <th>Spouse</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Recommended Sum Assured</td>
                          <td style={{ color: '#0f172a', fontSize: '1.1rem', fontWeight: '700' }}>Rs. 2,00,00,000 (2 Crores)</td>
                          <td>NA</td>
                          <td>Review annually</td>
                        </tr>
                        <tr>
                          <td>Estimated Annual Premium</td>
                          <td style={{ fontWeight: '600' }}>Rs. 60,000-70,000</td>
                          <td>NA</td>
                          <td>Subject to age & health</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: SIP Portfolio */}
              {activeTab === 'sip' && (
                <div className="animate-fade-in">
                  <h3 className="mb-5 fw-bold" style={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                    Systematic Investment Plan (SIP)
                  </h3>
                  
                  <p className="mb-5" style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#475569' }}>
                    A SIP lets you invest a fixed amount every month into a mutual fund. {reportData.clientName} has chosen to invest <strong style={{ color: '#2FB34A' }}>{reportData.sipTotal || 'Rs. 75,000'}</strong> per month across diversified mutual funds aligned with a high-growth profile.
                  </p>

                  <div className="reports-container" style={{ padding: '0', overflow: 'hidden' }}>
                    <table className="premium-table">
                      <thead>
                        <tr>
                          <th className="text-start">Category</th>
                          <th>Risk</th>
                          <th>Monthly SIP</th>
                          <th>Expected Return</th>
                          <th>Years</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-start">Flexi Cap</td>
                          <td>High</td>
                          <td style={{ color: '#3b82f6', fontWeight: '700' }}>Rs. 30,000</td>
                          <td>16% p.a.</td>
                          <td>15</td>
                        </tr>
                        <tr>
                          <td className="text-start">Large/Mid Cap</td>
                          <td>Med-High</td>
                          <td style={{ color: '#3b82f6', fontWeight: '700' }}>Rs. 22,500</td>
                          <td>14% p.a.</td>
                          <td>15</td>
                        </tr>
                        <tr>
                          <td className="text-start">Small Cap</td>
                          <td>High</td>
                          <td style={{ color: '#3b82f6', fontWeight: '700' }}>Rs. 22,500</td>
                          <td>15% p.a.</td>
                          <td>15</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr style={{ backgroundColor: '#f8fafc' }}>
                          <td colSpan="2" className="text-end fw-bold" style={{ color: '#475569', textTransform: 'uppercase', fontSize: '0.85rem' }}>Total Monthly Outflow</td>
                          <td className="fw-bold" style={{ color: '#16a34a', fontSize: '1.1rem' }}>{reportData.sipTotal}</td>
                          <td colSpan="2"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: Lumpsum & Chart */}
              {activeTab === 'lumpsum' && (
                <div className="animate-fade-in">
                  <h3 className="mb-5 fw-bold" style={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                    Lumpsum Investments & Projections
                  </h3>
                  
                  <p className="mb-5" style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#475569' }}>
                    A lumpsum investment means putting a larger amount of money into a mutual fund all at once. The magic of compounding works powerfully here over long periods.
                  </p>

                  <div className="reports-container mb-5" style={{ padding: '0', overflow: 'hidden' }}>
                    <table className="premium-table">
                      <thead>
                        <tr>
                          <th className="text-start">Fund Name</th>
                          <th>Category</th>
                          <th>Lumpsum Amount</th>
                          <th>Expected Return</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-start">Tata Arbitrage Fund</td>
                          <td>Debt-Hybrid</td>
                          <td style={{ color: '#3b82f6', fontWeight: '700' }}>Rs. 8,00,000</td>
                          <td>7.5% p.a.</td>
                        </tr>
                        <tr>
                          <td className="text-start">ICICI Pru Equity Savings</td>
                          <td>Debt-Equity</td>
                          <td style={{ color: '#3b82f6', fontWeight: '700' }}>Rs. 4,00,000</td>
                          <td>8.5% p.a.</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr style={{ backgroundColor: '#f8fafc' }}>
                          <td colSpan="2" className="text-end fw-bold" style={{ color: '#475569', textTransform: 'uppercase', fontSize: '0.85rem' }}>Total Lumpsum Invested</td>
                          <td className="fw-bold" style={{ color: '#16a34a', fontSize: '1.1rem' }}>{reportData.lumpsumTotal}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Interactive Chart */}
                  <div className="p-4 rounded" style={{ border: '1px solid #e2e8f0', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h5 className="fw-bold text-center mb-4" style={{ color: '#0f172a' }}>Lumpsum Growth Projection</h5>
                    <div style={{ width: '100%', height: 400 }}>
                      <ResponsiveContainer>
                        <LineChart data={generateChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                          <YAxis tickFormatter={formatCurrency} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                          <Tooltip 
                            formatter={(value) => `Rs. ${value.toLocaleString('en-IN')}`} 
                            labelFormatter={(label) => `Year ${label}`}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} 
                          />
                          <Legend wrapperStyle={{ paddingTop: '20px' }} />
                          <Line type="monotone" dataKey="lumpsumValue" name="Projected Value (15%)" stroke="#2FB34A" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="lumpsumInvested" name="Principal Invested" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalViewer;
