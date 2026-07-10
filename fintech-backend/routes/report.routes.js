const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const { protect } = require('../middleware/auth');

// @desc    Get user's generated reports history
// @route   GET /api/reports
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Save a new report
// @route   POST /api/reports
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { personName, reportData } = req.body;

    const report = await Report.create({
      user: req.user.id,
      personName,
      reportData,
    });

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Research a person (Mock Generator)
// @route   POST /api/reports/research
// @access  Private
router.post('/research', protect, async (req, res) => {
  try {
    const { personName } = req.body;
    
    if (!personName) {
      return res.status(400).json({ success: false, message: 'Please provide a person name' });
    }

    // Simulate API delay for realism
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Dynamic Mock Data Generator based on the name provided
    const nameParts = personName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

    const mockProfile = {
      basicInfo: {
        fullName: personName,
        profession: 'Technology Executive & Investor',
        birthYear: 1970 + Math.floor(Math.random() * 20),
        nationality: 'Global Citizen',
        netWorth: `$${(Math.random() * 100 + 1).toFixed(1)} Billion (Estimated)`,
      },
      biography: `${personName} is a highly influential figure in the global technology and investment landscape. Known for visionary leadership and strategic foresight, they have successfully navigated complex market dynamics to build sustainable, high-growth enterprises. Their journey reflects a deep commitment to innovation and long-term value creation.`,
      education: [
        {
          degree: 'Master of Business Administration (MBA)',
          institution: 'Stanford Graduate School of Business',
          year: '1995',
        },
        {
          degree: 'Bachelor of Science in Engineering',
          institution: 'Massachusetts Institute of Technology',
          year: '1992',
        }
      ],
      careerTimeline: [
        {
          role: 'Founder & CEO',
          company: `${lastName || 'Global'} Innovations Corp`,
          period: '2010 - Present',
          description: 'Spearheaded global expansion and product diversification resulting in a 400% increase in market capitalization.',
        },
        {
          role: 'Chief Operating Officer',
          company: 'Nexus Ventures',
          period: '2004 - 2010',
          description: 'Managed a $5B portfolio focusing on emerging technologies and sustainable energy.',
        },
        {
          role: 'Senior Analyst',
          company: 'Alpha Capital Partners',
          period: '1996 - 2004',
          description: 'Led quantitative analysis for high-frequency trading algorithms.',
        }
      ],
      businessInterests: [
        { sector: 'Artificial Intelligence', stake: 'Major Shareholder', value: 'High' },
        { sector: 'Renewable Energy', stake: 'Board Member', value: 'Strategic' },
        { sector: 'Fintech', stake: 'Angel Investor', value: 'High Growth' }
      ],
      achievements: [
        'Named in Time 100 Most Influential People',
        'Recipient of the Global Innovator Award',
        'Featured on Forbes Billionaires List'
      ],
      recentNews: [
        {
          headline: `${lastName || personName} Announces New $1B Philanthropic Fund`,
          date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
          summary: 'The new fund will focus on global education and climate change initiatives.'
        },
        {
          headline: `Market Rallies as ${firstName} Unveils Strategic Merger`,
          date: new Date(Date.now() - 86400000 * 15).toISOString().split('T')[0],
          summary: 'Shares surged 12% following the unexpected announcement of the acquisition.'
        }
      ]
    };

    res.json({ success: true, data: mockProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
