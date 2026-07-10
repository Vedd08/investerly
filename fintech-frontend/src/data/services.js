const services = {
  "mutual-funds": {
    title: "Mutual Funds (SIP)",
    intro: "Systematic Investment Plans (SIP) through professionally managed mutual fund portfolios for long-term wealth creation.",
    who: "Ideal for investors seeking market exposure with professional management, diversification, and disciplined long-term wealth creation.",
    approach: [
      "Goal-based fund selection with SIP focus",
      "Risk profiling before allocation",
      "Focus on consistency over speculation",
      "Periodic portfolio review and rebalancing"
    ],
    features: [
      "Start with as low as ₹500 monthly SIP",
      "Professional fund management",
      "Power of rupee cost averaging",
      "Tax efficiency planning through ELSS"
    ],
    benefits: [
      "Disciplined investing through SIPs",
      "Portfolio diversification across sectors",
      "Liquidity and transparency",
      "Compounding benefits over long term"
    ],
    faq: [
      {
        q: "What is the minimum SIP amount?",
        a: "You can start with as low as ₹500 per month for most mutual funds through SIPs."
      },
      {
        q: "How do you select mutual funds for SIP?",
        a: "We analyze fund performance, manager track record, expense ratios, and alignment with your goals. We also consider the fund's consistency in SIP returns."
      },
      {
        q: "Can I start multiple SIPs?",
        a: "Yes, you can start multiple SIPs across different funds based on your financial goals."
      }
    ]
  },

  "sip": {
    title: "Systematic Investment Plan (SIP)",
    intro: "Build wealth systematically through regular investments that harness the power of compounding and rupee cost averaging.",
    who: "Perfect for salaried individuals, young investors, and anyone wanting to cultivate disciplined investing habits.",
    approach: [
      "Goal-aligned SIP planning",
      "Long-term compounding focus",
      "Volatility averaging strategy",
      "Review & step-up planning"
    ],
    features: [
      "Flexible investment amounts (₹500 onwards)",
      "Auto-debit convenience",
      "Rupee cost averaging benefits",
      "Power of compounding"
    ],
    benefits: [
      "Disciplined investing habit",
      "Reduces market timing risk",
      "Affordable wealth building",
      "Flexible investment amounts with step-up options"
    ],
    faq: [
      {
        q: "Can I change my SIP amount?",
        a: "Yes, you can increase, decrease, or pause your SIP anytime based on your financial situation. We recommend step-up SIPs to increase investment with income growth."
      },
      {
        q: "What happens if I miss a SIP payment?",
        a: "Most funds allow a grace period of 3-5 days. We help set up auto-debit to avoid missed payments and maximize your investment journey."
      }
    ]
  },

  "swp": {
    title: "Systematic Withdrawal Plan (SWP)",
    intro: "Generate a regular, tax-efficient income from your mutual fund investments while letting the remaining balance grow.",
    who: "Perfect for retirees, individuals seeking passive income, or anyone needing a regular cash flow from their corpus.",
    approach: [
      "Corpus requirement analysis",
      "Sustainable withdrawal rate calculation",
      "Tax-efficient fund selection",
      "Regular portfolio monitoring"
    ],
    features: [
      "Customizable withdrawal frequency (Monthly/Quarterly)",
      "Fixed or variable withdrawal amounts",
      "Highly tax-efficient compared to FDs",
      "Capital appreciation potential on remaining corpus"
    ],
    benefits: [
      "Regular and predictable income stream",
      "Better tax efficiency than dividend plans",
      "Rupee cost averaging on withdrawals",
      "Flexibility to stop, modify or withdraw lump sum anytime"
    ],
    faq: [
      {
        q: "What is the recommended withdrawal rate for SWP?",
        a: "We generally recommend a withdrawal rate of 6-8% per annum to ensure your corpus lasts long and potentially grows over time."
      },
      {
        q: "How is SWP taxed?",
        a: "Only the capital gains portion of your withdrawal is taxed, making it highly tax-efficient compared to interest income from Fixed Deposits."
      },
      {
        q: "Can I start an SWP from an existing mutual fund?",
        a: "Yes, you can initiate an SWP from any existing open-ended mutual fund investment where you have a sufficient balance."
      }
    ]
  },

  "sif": {
  title: "Systematic Investment Fund (SIF)",
  intro: "A premium investment approach combining the benefits of SIP with the ability to make additional investments and withdrawals, designed for high-net-worth individuals.",
  who: "Ideal for investors with ₹10 lakhs or more who want the discipline of SIP but need flexibility to make additional investments or partial withdrawals.",
  approach: [
    "Flexible investment planning with ₹10 lakhs+ corpus",
    "Goal-based allocation strategy for HNI clients",
    "Liquidity management with partial withdrawal facility",
    "Regular portfolio optimization and rebalancing"
  ],
  features: [
    "Minimum investment: ₹10 lakhs",
    "Base SIP with additional investment options",
    "Partial withdrawal facility",
    "Flexible investment schedule",
    "Combines discipline with flexibility"
  ],
  benefits: [
    "Premium investment solution for HNIs",
    "Discipline of SIP with flexibility of lump sum",
    "Liquidity when needed",
    "Power of compounding with flexibility",
    "Better cash flow management for large portfolios"
  ],
  faq: [
    {
      q: "What is the minimum amount for SIF?",
      a: "SIF requires a minimum investment of ₹10 lakhs, making it ideal for high-net-worth individuals seeking flexible investment options."
    },
    {
      q: "How is SIF different from regular SIP?",
      a: "SIF allows you to make additional investments beyond your regular SIP and also offers partial withdrawal facilities, giving you more flexibility. It's designed for larger investment amounts (₹10 lakhs+)."
    },
    {
      q: "Can I withdraw money from SIF?",
      a: "Yes, SIF offers partial withdrawal facilities, making it ideal for investors who need liquidity while maintaining investment discipline."
    }
  ]
},

  "aif": {
  title: "Alternative Investment Funds (AIF)",
  intro: "Access sophisticated investment opportunities beyond traditional stocks and bonds, including private equity, real estate, and hedge funds. Designed for ultra high-net-worth individuals.",
  who: "Suitable for ultra high-net-worth individuals, family offices, and institutional investors seeking diversification and higher returns with a minimum investment of ₹1 crore.",
  approach: [
    "Category-specific analysis (Category I, II, III)",
    "Due diligence on fund managers",
    "Risk-return assessment for HNI clients",
    "Portfolio integration strategy for large portfolios"
  ],
  features: [
    "Minimum investment: ₹1 crore",
    "Access to exclusive investments",
    "Portfolio diversification",
    "Professional fund management",
    "Regulated structure by SEBI"
  ],
  benefits: [
    "Higher return potential for large investors",
    "Low correlation with traditional markets",
    "Portfolio diversification for HNIs",
    "Access to exclusive investment opportunities",
    "Professional management for complex strategies"
  ],
  faq: [
    {
      q: "What is the minimum investment in AIFs?",
      a: "SEBI regulations require a minimum investment of ₹1 crore for most AIFs, making them suitable for ultra high-net-worth individuals and family offices."
    },
    {
      q: "What are the different categories of AIFs?",
      a: "Category I: Social impact, venture capital, SME funds. Category II: Private equity, debt funds. Category III: Hedge funds that use complex trading strategies."
    },
    {
      q: "What is the lock-in period for AIFs?",
      a: "AIFs typically have a lock-in period of 3-7 years, depending on the fund category and investment strategy."
    }
  ]
},

  "pms": {
  title: "Portfolio Management Services (PMS)",
  intro: "Professional portfolio management for high-net-worth individuals with customized investment strategies and direct equity exposure.",
  who: "Ideal for high-net-worth individuals (HNIs) seeking personalized portfolio management with minimum investment of ₹50 lakhs.",
  approach: [
    "Customized portfolio construction",
    "Direct equity and debt exposure",
    "Active portfolio monitoring",
    "Regular performance reporting"
  ],
  features: [
    "Minimum investment: ₹50K",
    "Direct equity/debt investments",
    "Professional fund management",
    "Customized portfolio as per risk profile",
    "Regular portfolio reviews"
  ],
  benefits: [
    "Personalized investment strategy",
    "Direct ownership of securities",
    "Transparent portfolio holdings",
    "Potential for higher returns",
    "Tax efficiency through long-term holdings"
  ],
  faq: [
    {
      q: "What is the minimum investment for PMS?",
      a: "SEBI guidelines require minimum investment of ₹50 lakhs for Portfolio Management Services."
    },
    {
      q: "How is PMS different from Mutual Funds?",
      a: "PMS offers direct ownership of stocks, customized portfolios, and more flexibility compared to mutual funds. However, it requires higher minimum investment."
    },
    {
      q: "What are the fees in PMS?",
      a: "PMS typically charges management fees (1-2.5% p.a.) and performance fees (profit sharing). The exact structure varies by provider."
    }
  ]
},

  "life-insurance": {
    title: "Life Insurance Solutions",
    intro: "Comprehensive life insurance planning to protect your family's financial future and achieve long-term savings goals.",
    who: "Essential for breadwinners, parents, business owners, and anyone with financial dependents.",
    approach: [
      "Needs-based coverage assessment",
      "Term vs investment-linked analysis",
      "Tax efficiency planning",
      "Regular policy reviews"
    ],
    features: [
      "Family financial protection",
      "Long-term wealth creation",
      "Tax benefits under Section 80C & 10(10D)",
      "Loan against policy options"
    ],
    benefits: [
      "Financial security for dependents",
      "Long-term savings discipline",
      "Tax-efficient investment",
      "Emergency fund availability"
    ],
    faq: [
      {
        q: "How much life insurance do I need?",
        a: "Typically 10-15 times your annual income, but we calculate based on your specific liabilities and goals."
      },
      {
        q: "Term insurance or investment plans?",
        a: "We recommend term insurance for pure protection and separate investments for wealth creation."
      }
    ]
  },

  "health-insurance": {
    title: "Health Insurance",
    intro: "Secure comprehensive health coverage for yourself and your family against rising medical costs and health emergencies.",
    who: "Essential for individuals, families, senior citizens, and anyone wanting financial protection against medical expenses.",
    approach: [
      "Coverage needs assessment",
      "Network hospital evaluation",
      "Pre-existing condition analysis",
      "Claim process guidance"
    ],
    features: [
      "Cashless hospitalization",
      "Pre and post hospitalization cover",
      "Daycare procedures coverage",
      "Annual health check-ups"
    ],
    benefits: [
      "Financial protection against medical bills",
      "Access to quality healthcare",
      "Tax benefits under Section 80D",
      "Peace of mind during emergencies"
    ],
    faq: [
      {
        q: "What is the waiting period for pre-existing diseases?",
        a: "Typically 2-4 years, but varies by insurer. We help find plans with reasonable waiting periods."
      },
      {
        q: "Can I port my existing health policy?",
        a: "Yes, we assist with health insurance portability while preserving continuity benefits."
      }
    ]
  },

  "vehicle-insurance": {
    title: "Vehicle Insurance",
    intro: "Comprehensive protection for your vehicles against accidents, theft, natural calamities, and third-party liabilities.",
    who: "Mandatory for all vehicle owners (cars, bikes, commercial vehicles) as per Indian law and for asset protection.",
    approach: [
      "Comprehensive vs third-party analysis",
      "Add-on cover evaluation",
      "NCB preservation strategy",
      "Claim process assistance"
    ],
    features: [
      "Own damage cover",
      "Third-party liability",
      "Personal accident cover",
      "No claim bonus"
    ],
    benefits: [
      "Legal compliance",
      "Financial protection against damages",
      "Roadside assistance",
      "Depreciation cover options"
    ],
    faq: [
      {
        q: "What is No Claim Bonus (NCB)?",
        a: "Discount on premium for claim-free years, which can go up to 50% over time."
      },
      {
        q: "What add-ons should I consider?",
        a: "Zero depreciation, engine protection, and roadside assistance are popular add-ons we recommend based on usage."
      }
    ]
  },

  "fire-insurance": {
    title: "Fire Insurance",
    intro: "Protect your property, business assets, and inventory against damages caused by fire and other allied perils.",
    who: "Essential for business owners, homeowners, warehouse operators, and manufacturing units.",
    approach: [
      "Property valuation assessment",
      "Risk analysis and peril evaluation",
      "Coverage customization based on asset type",
      "Claim settlement assistance"
    ],
    features: [
      "Coverage for building and contents",
      "Protection against allied perils (lightning, explosion, etc.)",
      "Add-on covers like earthquake and terrorism",
      "Loss of profit coverage options"
    ],
    benefits: [
      "Financial security against catastrophic losses",
      "Business continuity support",
      "Mandatory for securing business loans",
      "Peace of mind for property owners"
    ],
    faq: [
      {
        q: "What does fire insurance cover?",
        a: "It covers damage to the insured property caused by fire, lightning, explosion, riots, strikes, and natural perils like storms or floods (if opted)."
      },
      {
        q: "How is the premium calculated?",
        a: "Premium depends on factors like the value of the property, type of occupancy, location, and the specific add-on covers chosen."
      }
    ]
  },

  "accident-insurance": {
    title: "Personal Accident Insurance",
    intro: "Provide financial stability for yourself and your family in the event of unforeseen accidents leading to injury, disability, or death.",
    who: "Crucial for primary earners, individuals with high-risk occupations, and those who travel frequently.",
    approach: [
      "Income and liability assessment",
      "Occupation risk profiling",
      "Coverage requirement calculation",
      "Policy feature comparison"
    ],
    features: [
      "Accidental death benefit",
      "Permanent total/partial disability cover",
      "Temporary total disability weekly compensation",
      "Educational grant for dependent children"
    ],
    benefits: [
      "Income replacement during recovery",
      "Global coverage, 24x7",
      "No medical tests usually required",
      "Affordable premiums for high coverage"
    ],
    faq: [
      {
        q: "Is personal accident insurance different from life or health insurance?",
        a: "Yes, life insurance covers natural/accidental death, and health insurance covers hospitalization. Accident insurance covers accidental death, disability, and income loss."
      },
      {
        q: "Does this cover accidents outside India?",
        a: "Most personal accident policies offer worldwide coverage, meaning you are protected anywhere in the world, 24/7."
      }
    ]
  }
};

export default services;