import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoImg from '../assets/investerly_logo3-removebg-preview.svg';
import iconImg from '../assets/logo.svg';

export const generateCorporateReport = async (formData, userName) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // Theme colors from the client's PDF images
  const primaryColor = [37, 67, 89]; // Dark Blue
  const accentGold = [218, 165, 32]; // Yellow/Gold
  const accentGreen = [47, 179, 74]; // Green
  const textColor = [50, 50, 50]; // Dark Grey

  let yPos = 20;
  const margin = 15;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Pre-load images and convert SVGs to Base64 PNGs via Canvas
  let loadedLogo = null;
  let loadedIcon = null;
  
  const svgToBase64Png = (imgElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = imgElement.width || 500;
    canvas.height = imgElement.height || 500;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  };

  try {
    const [logo, icon] = await Promise.all([
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = logoImg;
        img.onload = () => resolve({ img, base64: svgToBase64Png(img) });
        img.onerror = reject;
      }),
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = iconImg;
        img.onload = () => resolve({ img, base64: svgToBase64Png(img) });
        img.onerror = reject;
      })
    ]);
    loadedLogo = logo; // Object containing {img, base64}
    loadedIcon = icon;
  } catch (err) {
    console.error("Failed to load SVG logos", err);
  }

  // Format date like "June 2026"
  const dateObj = new Date(formData.proposalDate);
  const monthYear = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const fullDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Helper: Header
  const addHeader = (name) => {
    if (loadedIcon) {
      doc.addImage(loadedIcon.base64, 'PNG', margin, 9, 6, 5); // small icon
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('INVESTERLY', margin + 8, 13);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textColor);
      doc.text('Financial Services Pvt. Ltd.', margin + 33, 13);
    } else {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('INVESTERLY', margin, 12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textColor);
      doc.text('Financial Services Pvt. Ltd.', margin + 25, 12);
    }

    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text(`Financial Planning Proposal — ${name} | ${monthYear}`, pageWidth - margin, 12, { align: 'right' });

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, 15, pageWidth - margin, 15);
    yPos = 25;
  };

  // Helper: Footer
  const addFooter = (pageNumber, totalPages, name) => {
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text('Investerly Financial Services Pvt. Ltd.', margin, pageHeight - 10);
    doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.setFont('helvetica', 'italic');
    doc.text(`Confidential — Prepared exclusively for ${name}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  };

  // Helper: Section Title Box
  const addSectionTitle = (title) => {
    if (yPos > pageHeight - 30) {
      doc.addPage();
      addHeader(formData.clientName);
    }
    doc.setFillColor(...primaryColor);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 4, yPos + 5.5);
    yPos += 15;
  };

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  
  // Logo
  if (loadedIcon && loadedLogo) {
    // Math to perfectly match Image 1 proportions:
    // iconWidth = 24 (circle). logoWidth = 72 (text).
    // Visual text height becomes ~14.4 (60% of circle height).
    const iconWidth = 24; 
    const iconHeight = (loadedIcon.img.height * iconWidth) / loadedIcon.img.width;
    
    const logoWidth = 72;
    const logoHeight = (loadedLogo.img.height * logoWidth) / loadedLogo.img.width;
    
    const spacing = -6; // Pull the text leftwards to counteract internal SVG padding
    const totalWidth = iconWidth + spacing + logoWidth;
    const startX = pageWidth / 2 - totalWidth / 2;
    
    const baseY = 80;
    doc.addImage(loadedIcon.base64, 'PNG', startX, baseY, iconWidth, iconHeight);
    
    // Perfectly center mathematically
    doc.addImage(loadedLogo.base64, 'PNG', startX + iconWidth + spacing, baseY + (iconHeight - logoHeight) / 2, logoWidth, logoHeight);
  } else if (loadedLogo) {
    const imgWidth = 80;
    const imgHeight = (loadedLogo.img.height * imgWidth) / loadedLogo.img.width;
    doc.addImage(loadedLogo.base64, 'PNG', pageWidth/2 - imgWidth/2, 80, imgWidth, imgHeight);
  } else {
    // Fallback if image fails to load
    doc.setFontSize(40);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('INVESTERLY', pageWidth/2, 95, { align: 'center' });
  }
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...accentGold);
  doc.text('AMFI Registered Investment Advisory | Goal-Based Wealth Management', pageWidth/2, 115, { align: 'center' });

  // Divider Line (spans exactly the width of the blue box)
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin, 135, pageWidth - margin, 135);

  // Main Title
  doc.setTextColor(...primaryColor);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('FINANCIAL PLANNING PROPOSAL', pageWidth/2, 160, { align: 'center' });

  doc.setTextColor(...accentGold);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'italic');
  doc.text('A Comprehensive Investment & Protection Strategy', pageWidth/2, 170, { align: 'center' });

  // Blue Box
  doc.setFillColor(...primaryColor);
  doc.rect(margin, 185, pageWidth - 2 * margin, 42, 'F');

  // Line 1: Prepared for
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Prepared for:', margin + 10, 198);
  doc.setTextColor(...accentGold);
  doc.text(formData.clientName.toUpperCase(), margin + 50, 198);

  // Line 2: Date
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.text('Date:', margin + 10, 208);
  doc.text(fullDate, margin + 50, 208);

  // Line 3: Advisor
  doc.text('Advisor:', margin + 10, 218);
  doc.text(formData.advisorName, margin + 50, 218);

  // Bottom Quote
  doc.setTextColor(...accentGold);
  doc.setFont('helvetica', 'bolditalic');
  doc.setFontSize(12);
  doc.text('"Your Goals. Our Guidance. A Secured Future."', pageWidth/2, pageHeight - 35, { align: 'center' });

  // ==========================================
  // PAGE 2: TABLE OF CONTENTS
  // ==========================================
  doc.addPage();
  addHeader(formData.clientName);
  addSectionTitle('Table of Contents');

  const toc = [
    { title: "1. About Investerly Financial Services", page: 3 },
    { title: "2. Client Profile & Financial Goals", page: 4 },
    { title: "3. Why Financial Planning Matters", page: 5 },
    { title: "4. Insurance Planning — Term Life & Health", page: 6 },
    { title: "5. Mutual Fund — Systematic Investment Plan (SIP)", page: "7-8" },
    { title: "6. Mutual Fund — Lumpsum Investments", page: "9-10" },
    { title: "7. Specialized Investment Fund (SIF)", page: 11 },
    { title: "8. Portfolio Management Services (PMS)", page: 12 },
    { title: "9. Portfolio Summary & Goal-wise Allocation", page: 13 },
    { title: "10. Disclaimer & Next Steps", page: 14 } // Changed to 14 for brevity
  ];

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  
  toc.forEach((item) => {
    doc.text(item.title, margin, yPos);
    const dotsWidth = pageWidth - 2 * margin - doc.getTextWidth(item.title) - 15;
    doc.setTextColor(200, 200, 200);
    doc.text('.'.repeat(Math.floor(dotsWidth / 2)), margin + doc.getTextWidth(item.title) + 2, yPos);
    
    doc.setTextColor(...textColor);
    doc.text(`${item.page}`, pageWidth - margin, yPos, { align: 'right' });
    yPos += 10;
  });

  // ==========================================
  // PAGE 3: ABOUT INVESTERLY
  // ==========================================
  doc.addPage();
  addHeader(formData.clientName);
  addSectionTitle('1. About Investerly Financial Services');

  doc.setFontSize(10);
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  
  const aboutText1 = `Investerly Financial Services Pvt. Ltd. is a AMFI-registered investment distributor committed to helping individuals and families build lasting wealth through disciplined, goal-based financial planning. We combine deep market expertise with a personalized approach to craft strategies tailored to your unique life goals.`;

  const aboutText2 = `Our team of qualified financial advisors brings together decades of experience across equity markets, insurance planning, and tax-efficient wealth creation. Whether you are a working professional, a business owner, or a medical practitioner like ${formData.clientName}, we understand that every financial journey is unique.`;

  const aboutText3 = `At Investerly, we do not believe in one-size-fits-all solutions. We sit with you, understand what truly matters, and then design an investment strategy that grows with you — through market cycles, life changes, and evolving goals.`;

  const maxWidth = pageWidth - 2 * margin;

  const split1 = doc.splitTextToSize(aboutText1, maxWidth);
  doc.text(aboutText1, margin, yPos, { maxWidth: maxWidth, align: 'justify' });
  yPos += split1.length * 5 + 5;

  const split2 = doc.splitTextToSize(aboutText2, maxWidth);
  doc.text(aboutText2, margin, yPos, { maxWidth: maxWidth, align: 'justify' });
  yPos += split2.length * 5 + 5;

  const split3 = doc.splitTextToSize(aboutText3, maxWidth);
  doc.text(aboutText3, margin, yPos, { maxWidth: maxWidth, align: 'justify' });
  yPos += split3.length * 5 + 15;

  // 4 Quadrant Blue Box
  doc.setFillColor(...primaryColor);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 40, 'F');
  
  doc.setDrawColor(100, 130, 160);
  doc.setLineWidth(0.2);
  doc.line(pageWidth/2, yPos, pageWidth/2, yPos + 40); // Vertical
  doc.line(margin, yPos + 20, pageWidth - margin, yPos + 20); // Horizontal

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  
  doc.text('AMFI REGISTERED', margin + (pageWidth/2 - margin)/2, yPos + 10, { align: 'center' });
  doc.text('GOAL-BASED PLANNING', pageWidth/2 + (pageWidth/2 - margin)/2, yPos + 10, { align: 'center' });
  doc.text('HOLISTIC WEALTH MANAGEMENT', margin + (pageWidth/2 - margin)/2, yPos + 30, { align: 'center' });
  doc.text('CLIENT-FIRST APPROACH', pageWidth/2 + (pageWidth/2 - margin)/2, yPos + 30, { align: 'center' });

  doc.setTextColor(...accentGold);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.text('Regulated & Trusted Advisor', margin + (pageWidth/2 - margin)/2, yPos + 15, { align: 'center' });
  doc.text('Investments tied to your life goals', pageWidth/2 + (pageWidth/2 - margin)/2, yPos + 15, { align: 'center' });
  doc.text('Insurance, MF, SIF, PMS — one roof', margin + (pageWidth/2 - margin)/2, yPos + 35, { align: 'center' });
  doc.text('Your success is our only measure', pageWidth/2 + (pageWidth/2 - margin)/2, yPos + 35, { align: 'center' });

  // ==========================================
  // PAGE 4: CLIENT PROFILE & GOALS
  // ==========================================
  doc.addPage();
  addHeader(formData.clientName);
  addSectionTitle('2. Client Profile & Financial Goals');

  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Client Information', margin, yPos);
  yPos += 5;

  autoTable(doc, {
    startY: yPos,
    body: [
      ['Client Name', formData.clientName, 'Occupation', formData.occupation],
      ['Risk Profile', formData.riskProfile, 'Investment Horizon', formData.investmentHorizon],
      ['Proposal Date', fullDate, 'Advisor', formData.advisorName]
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold', cellWidth: 35 },
      1: { fillColor: [245, 248, 250], textColor: textColor, cellWidth: 55 },
      2: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold', cellWidth: 35 },
      3: { fillColor: [245, 248, 250], textColor: textColor, cellWidth: 55 }
    },
    margin: { left: margin, right: margin }
  });

  yPos = doc.lastAutoTable.finalY + 10;

  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Financial Goals', margin, yPos);
  yPos += 5;

  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Goal Name', 'Target Amount', 'Time Horizon', 'Priority', 'Funding Status']],
    body: formData.goals.map((g, i) => [i + 1, g.name, g.targetAmount, g.timeHorizon, g.priority, g.status]),
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
    bodyStyles: { textColor: textColor, fillColor: [245, 248, 250] },
    alternateRowStyles: { fillColor: 255 },
    margin: { left: margin, right: margin }
  });

  yPos = doc.lastAutoTable.finalY + 10;

  // Goal Timeline
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Goal Timeline', margin, yPos);
  yPos += 5;

  doc.setFillColor(245, 248, 250);
  doc.rect(margin, yPos, (pageWidth - 2*margin)/3, 20, 'F');
  doc.setFillColor(200, 220, 240);
  doc.rect(margin + (pageWidth - 2*margin)/3, yPos, (pageWidth - 2*margin)/3, 20, 'F');
  doc.setFillColor(...primaryColor);
  doc.rect(margin + 2*(pageWidth - 2*margin)/3, yPos, (pageWidth - 2*margin)/3, 20, 'F');

  doc.setFontSize(9);
  doc.setTextColor(...accentGold);
  doc.text(`TODAY — ${monthYear}`, margin + (pageWidth - 2*margin)/6, yPos + 8, { align: 'center' });
  doc.setTextColor(...textColor);
  doc.text('SIP + Lumpsum Begins', margin + (pageWidth - 2*margin)/6, yPos + 14, { align: 'center' });

  doc.setTextColor(...primaryColor);
  doc.text(`YEAR 5`, margin + (pageWidth - 2*margin)/2, yPos + 8, { align: 'center' });
  doc.setTextColor(...accentGreen);
  doc.text('Short-term matures', margin + (pageWidth - 2*margin)/2, yPos + 14, { align: 'center' });

  doc.setTextColor(...accentGold);
  doc.text(`YEAR 15`, margin + 5*(pageWidth - 2*margin)/6, yPos + 8, { align: 'center' });
  doc.text('Retirement Goal Achieved', margin + 5*(pageWidth - 2*margin)/6, yPos + 14, { align: 'center' });

  // ==========================================
  // PAGE 3: WHY FINANCIAL PLANNING MATTERS
  // ==========================================
  doc.addPage();
  addHeader(formData.clientName);
  addSectionTitle('3. Why Financial Planning Matters');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  const whyIntro = `Many people work hard their entire lives, yet arrive at retirement without enough savings. The reason is almost always the same — they relied on income alone, without putting their money to work. This section explains, in simple terms, why a structured financial plan is not just useful but necessary.`;
  const whySplit = doc.splitTextToSize(whyIntro, pageWidth - 2 * margin);
  doc.text(whySplit, margin, yPos);
  yPos += whySplit.length * 5 + 8;

  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('The Silent Thief: Inflation', margin, yPos);
  yPos += 5;
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const infText = `Inflation means that the same Rs. 1 Lakh today will feel like just Rs. 50,000 in 10 years. That new car, your child's college fees, your medical bills — all of these will cost roughly double in a decade. If your money is sitting in a savings account earning 3–4%, you are actually losing purchasing power every year. Equity mutual funds, historically, have delivered returns well above inflation over the long term.`;
  const infSplit = doc.splitTextToSize(infText, pageWidth - 2 * margin);
  doc.text(infSplit, margin, yPos);
  yPos += infSplit.length * 5 + 8;

  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('The Power of Starting Early', margin, yPos);
  yPos += 5;
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const timeText = `Time is your most powerful investment tool. If you start a SIP of Rs. 5,000 per month at age 25, you could accumulate over Rs. 3.25 Crores by age 60 at 12% per annum. Wait until age 35, and that number drops to just Rs. 95 Lakhs — a difference of Rs. 2.30 Crores — for the same monthly amount! Every year you delay is expensive.`;
  const timeSplit = doc.splitTextToSize(timeText, pageWidth - 2 * margin);
  doc.text(timeSplit, margin, yPos);
  yPos += timeSplit.length * 5 + 8;

  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Insurance: Your Financial Safety Net', margin, yPos);
  yPos += 5;
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const insText = `Before building wealth, protect it. A term life insurance plan ensures that if something unexpected happens to you, your family does not have to worry about loans, school fees, or household expenses. Think of it as the foundation of your financial house — without it, everything else is at risk.`;
  const insSplit = doc.splitTextToSize(insText, pageWidth - 2 * margin);
  doc.text(insSplit, margin, yPos);
  yPos += insSplit.length * 5 + 8;

  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Diversification: Do Not Put All Eggs in One Basket', margin, yPos);
  yPos += 5;
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const divText = `Spreading your money across different types of investments — large-cap funds for stability, mid/small-cap for growth, and debt funds for safety — means that even if one type goes through a rough patch, your overall portfolio stays on track. This is exactly how ${formData.clientName}'s portfolio has been designed.`;
  const divSplit = doc.splitTextToSize(divText, pageWidth - 2 * margin);
  doc.text(divSplit, margin, yPos);
  yPos += divSplit.length * 5 + 8;

  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Without Planning vs. With Planning', margin, yPos);
  yPos += 5;

  autoTable(doc, {
    startY: yPos,
    head: [['Without Financial Planning', 'With Financial Planning (Your Plan)']],
    body: [
      ['Savings in FD at 6% per year — barely beats inflation', 'SIP in equity mutual funds targeting 14–16% per year'],
      ['No life insurance coverage — family at financial risk', 'Recommended: Term cover of Rs. 2 Crore (Already Taken)'],
      ['No defined goals — money spent without direction', '2 clear goals with mapped investments and timelines'],
      ['Annual bonus/surplus sits idle in bank account', `Annual ${formData.annualInvestment || 'Rs. 6L'} additional investment at 15% CAGR`]
    ],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold', halign: 'center' },
    columnStyles: {
      0: { fillColor: [245, 248, 250], textColor: textColor },
      1: { fillColor: [238, 252, 245], textColor: [47, 143, 90] } // Light green bg, dark green text
    },
    margin: { left: margin, right: margin }
  });
  
  addFooter(5, 14, formData.clientName);

  // ==========================================
  // PAGE 4: INSURANCE PLANNING
  // ==========================================
  doc.addPage();
  addHeader(formData.clientName);
  addSectionTitle('4. Insurance Planning — Term Life & Health');

  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('4A. Term Life Insurance', margin, yPos);
  yPos += 5;
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const termText = `Term insurance is the purest form of life insurance. It pays your family a large lump sum — called the Sum Assured — if something happens to you during the policy period. It has no maturity benefit, meaning if you survive the term, nothing is paid out. But that is exactly the point: for a very small annual premium, you get maximum protection.\n\nAs a high-income, high-responsibility professional, ${formData.clientName}'s family's lifestyle and financial goals depend on earning capacity. A term plan ensures continuity of those goals even in the worst case.`;
  const termSplit = doc.splitTextToSize(termText, pageWidth - 2 * margin);
  doc.text(termSplit, margin, yPos);
  yPos += termSplit.length * 5 + 8;

  // Recommendation Box
  doc.setFillColor(255, 253, 240); // Light yellow
  doc.rect(margin, yPos, pageWidth - 2*margin, 20, 'F');
  doc.setDrawColor(218, 165, 32); // Gold border left
  doc.setLineWidth(1.5);
  doc.line(margin, yPos, margin, yPos + 20);
  doc.setTextColor(218, 165, 32);
  doc.setFont('helvetica', 'bold');
  doc.text('Recommended Term Cover', margin + 5, yPos + 7);
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  doc.text(`Minimum 10–15x of annual income. For ${formData.clientName}, a cover of Rs. 2–5 Crores is advisable given the long investment\nhorizon and family commitments.`, margin + 5, yPos + 13);
  yPos += 28;

  autoTable(doc, {
    startY: yPos,
    head: [['Parameter', `Client (${formData.clientName})`, 'Spouse / Co-applicant', 'Remarks']],
    body: [
      ['Insurance Company', 'NA', 'NA', 'Can Take additional Term insurance'],
      ['Recommended Sum Assured', 'Rs. 2,00,00,000 (2 Crores)', 'NA', 'Review annually'],
      ['Estimated Annual Premium', 'Rs. 60,000-70,000', 'NA', 'Subject to age & health declaration'],
      ['Policy Term (Recommended)', 'Till Age 65–68', 'NA', 'Align with investment horizon'],
      ['Recommended Riders', 'Accidental Death Benefit', 'NA', 'Especially important for medical professionals']
    ],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { textColor: textColor },
    alternateRowStyles: { fillColor: [245, 248, 250] },
    columnStyles: { 0: { fontStyle: 'bold', fillColor: [245, 248, 250] }, 1: { textColor: primaryColor } },
    margin: { left: margin, right: margin }
  });

  yPos = doc.lastAutoTable.finalY + 15;

  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('4B. Health Insurance', margin, yPos);
  yPos += 5;
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const healthText = `Medical costs in India are rising at 12–15% per year. A single hospitalisation — even for a relatively routine procedure — can easily cost Rs. 3–10 Lakhs today. Without a health policy, this can wipe out years of savings in one stroke. A good health plan ensures you get quality treatment at the best hospitals without touching your investments.`;
  const healthSplit = doc.splitTextToSize(healthText, pageWidth - 2 * margin);
  doc.text(healthSplit, margin, yPos);
  yPos += healthSplit.length * 5 + 8;

  // Recommendation Box
  doc.setFillColor(255, 253, 240); // Light yellow
  doc.rect(margin, yPos, pageWidth - 2*margin, 15, 'F');
  doc.setDrawColor(218, 165, 32); // Gold border left
  doc.setLineWidth(1.5);
  doc.line(margin, yPos, margin, yPos + 15);
  doc.setTextColor(218, 165, 32);
  doc.setFont('helvetica', 'bold');
  doc.text('Recommended Health Cover', margin + 5, yPos + 7);
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  doc.text(`Minimum Rs. 10–15 Lakhs per family. Consider a Super Top-up plan for additional Rs. 25–50 Lakhs of coverage.`, margin + 5, yPos + 12);

  addFooter(6, 14, formData.clientName);

  // ==========================================
  // PAGE 5: MUTUAL FUND - SIP
  // ==========================================
  doc.addPage();
  addHeader(formData.clientName);
  addSectionTitle('5. Mutual Fund — Systematic Investment Plan (SIP)');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  const sipText = `A SIP — Systematic Investment Plan — lets you invest a fixed amount every month into a mutual fund. Think of it like a recurring deposit at your bank, except the returns are significantly higher over the long term. Even Rs. 5,000 per month, invested consistently for 20 years at 12% per year, can grow to over Rs. 50 Lakhs. ${formData.clientName} has chosen to invest ${formData.sipTotal || 'Rs. 75,000'} per month across three diversified mutual funds — each chosen for their strong track record and alignment with a high-risk, high-growth profile.`;
  const sipSplit = doc.splitTextToSize(sipText, pageWidth - 2 * margin);
  doc.text(sipSplit, margin, yPos);
  yPos += sipSplit.length * 5 + 10;

  // SIP Calculation logic
  let sipTotalVal = 75000;
  if (formData.sipTotal) {
      sipTotalVal = parseFloat(String(formData.sipTotal).replace(/[^0-9.]/g, '')) || 75000;
  }
  let sip1 = sipTotalVal * 0.40;
  let sip2 = sipTotalVal * 0.30;
  let sip3 = sipTotalVal * 0.30;

  const calcStepUp = (monthly, stepUp, ret, yrs) => {
      const months = yrs * 12;
      const rate = ret / 12 / 100;
      let total = 0;
      let curr = monthly;
      for (let y = 1; y <= yrs; y++) {
          for (let m = 1; m <= 12; m++) {
              total += curr * Math.pow(1 + rate, months - ((y - 1) * 12 + m) + 1);
          }
          curr *= (1 + stepUp / 100);
      }
      return total;
  };
  
  let val1 = calcStepUp(sip1, 10, 16, 15);
  let val2 = calcStepUp(sip2, 10, 14, 15);
  let val3 = calcStepUp(sip3, 10, 15, 15);
  let totalVal = val1 + val2 + val3;

  const fmt = (v) => 'Rs.\n' + Math.round(v).toLocaleString('en-IN');
  const fmtInline = (v) => 'Rs. ' + Math.round(v).toLocaleString('en-IN');

  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Category', 'Risk\nLevel', 'Monthly\nSIP', 'Step-\nUp', 'Step-\nUp %', 'Expected\nReturn', 'Goal\n#', 'Years', 'Projected Value']],
    body: [
      ['1', 'Flexi Cap', 'High', fmt(sip1), 'Yes', '10%\np.a.', '16% p.a.', '1', '15', fmtInline(val1)],
      ['2', 'Large &\nMid Cap', 'Med–\nHigh', fmt(sip2), 'Yes', '10%\np.a.', '14% p.a.', '1', '15', fmtInline(val2)],
      ['3', 'Small\nCap', 'High', fmt(sip3), 'Yes', '10%\np.a.', '15% p.a.', '1', '15', fmtInline(val3)]
    ],
    foot: [['TOTAL MONTHLY SIP OUTFLOW', '', '', fmt(sipTotalVal), 'TOTAL SIP PROJECTED CORPUS', '', '', '', '', fmt(totalVal)]],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold', halign: 'center', valign: 'middle', fontSize: 8 },
    bodyStyles: { textColor: textColor, halign: 'center', valign: 'middle', fontSize: 8 },
    alternateRowStyles: { fillColor: [245, 248, 250] },
    footStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold', halign: 'center', fontSize: 9 },
    columnStyles: { 
      3: { fontStyle: 'bold' },
      9: { textColor: primaryColor, fontStyle: 'bold' }
    },
    didParseCell: function (data) {
      // Handle colspans for the footer
      if (data.section === 'foot') {
        if (data.column.index === 0) {
          data.cell.colSpan = 3;
        } else if (data.column.index === 3) {
          data.cell.styles.fillColor = [226, 163, 34]; // Gold for total SIP
        } else if (data.column.index === 4) {
          data.cell.colSpan = 5;
        } else if (data.column.index === 9) {
          data.cell.styles.fillColor = [226, 163, 34]; // Gold for total value
        }
      }
    },
    margin: { left: margin, right: margin }
  });

  addFooter(7, 14, formData.clientName);

  // ==========================================
  // PAGE 6: MUTUAL FUND - LUMPSUM
  // ==========================================
  doc.addPage();
  addHeader(formData.clientName);
  addSectionTitle('6. Mutual Fund — Lumpsum Investments');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  const lumpText = `A lumpsum investment means putting a larger amount of money into a mutual fund all at once. This works best when you have a bonus, inherited funds, or accumulated savings you want to put to work immediately. The magic of compounding works especially powerfully over longer horizons — Rs. 1 Lakh invested at 16% for 15 years becomes over Rs. 9.27 Lakhs without adding a single rupee more.`;
  const lumpSplit = doc.splitTextToSize(lumpText, pageWidth - 2 * margin);
  doc.text(lumpSplit, margin, yPos);
  yPos += lumpSplit.length * 5 + 8;

  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Fund Name', 'Category', 'Risk\nLevel', 'Lumpsum\nAmount', 'Expected\nReturn', 'Goal\n#', 'Years', 'Projected Value']],
    body: [
      ['1', 'Abakkus Flexi Cap\nFund', 'Flexi Cap', 'High', 'Rs. 3,00,000', '16% p.a.', '1', '15', 'Rs. 27,79,656'],
      ['2', 'Invesco Large & Mid\nCap', 'Large &\nMid Cap', 'Med–\nHigh', 'Rs. 2,00,000', '14% p.a.', '1', '15', 'Rs. 14,27,588'],
      ['3', 'Tata Arbitrage Fund', 'Debt-\nEquity\nHybrid', 'Low', 'Rs. 8,00,000', '7.5% p.a.', '2', '5', 'Rs. 11,48,503'],
      ['4', 'ICICI Pru Equity\nSavings', 'Debt-\nEquity\nHybrid', 'Low', 'Rs. 4,00,000', '8.5% p.a.', '2', '5', 'Rs. 6,01,463']
    ],
    foot: [['TOTAL LUMPSUM INVESTED', '', '', '', formData.lumpsumTotal || 'Rs.\n17,00,000', 'TOTAL LUMPSUM\nPROJECTED CORPUS', '', '', 'Rs. 59,57,210']],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold', halign: 'center', valign: 'middle', fontSize: 8 },
    bodyStyles: { textColor: textColor, halign: 'center', valign: 'middle', fontSize: 8 },
    alternateRowStyles: { fillColor: [245, 248, 250] },
    footStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold', halign: 'center', valign: 'middle', fontSize: 9 },
    columnStyles: { 
      1: { fontStyle: 'bold', halign: 'left' },
      4: { fontStyle: 'bold' },
      8: { textColor: primaryColor, fontStyle: 'bold' }
    },
    didParseCell: function (data) {
      if (data.section === 'foot') {
        if (data.column.index === 0) {
          data.cell.colSpan = 4;
        } else if (data.column.index === 4) {
          data.cell.styles.fillColor = [226, 163, 34];
        } else if (data.column.index === 5) {
          data.cell.colSpan = 3;
        } else if (data.column.index === 8) {
          data.cell.styles.fillColor = [226, 163, 34];
        }
      }
    },
    margin: { left: margin, right: margin }
  });

  yPos = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  const lumpNote = `The equity lumpsum funds (Abakkus and Invesco) are aligned to Goal 1 — Retirement Planning and will compound over 15 years. The debt-hybrid lumpsum funds (Tata Arbitrage and ICICI Equity Savings) are conservative in nature and designed for Goal 2 — to be redeemed in 5 years.`;
  const noteSplit = doc.splitTextToSize(lumpNote, pageWidth - 2 * margin);
  doc.text(noteSplit, margin, yPos);
  yPos += noteSplit.length * 5 + 15;

  // Render Line Chart Graphic
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Lumpsum Investment — Growth Over Time', pageWidth/2, yPos, { align: 'center' });
  yPos += 5;

  const chartX = margin + 10;
  const chartY = yPos;
  const chartW = pageWidth - 2 * margin - 15;
  const chartH = 65;

  // Calculate dynamic values based on input
  let rawLump = String(formData.annualInvestment || formData.lumpsumTotal || '500000').replace(/[^0-9.]/g, '');
  let annualInvested = parseFloat(rawLump) || 500000;
  let annualLakhs = annualInvested / 100000;
  
  let projectedLakhs = 0;
  for(let y=1; y<=15; y++) {
    projectedLakhs += annualLakhs * Math.pow(1.15, 15 - y + 1); // 15 years at 15%
  }

  // Determine dynamic Y-axis maximum
  let maxY = Math.ceil(projectedLakhs / 10) * 10;
  if (maxY - projectedLakhs < (maxY * 0.1)) maxY += Math.ceil(maxY * 0.2); // Add padding
  let yStep = maxY / 4;

  // Chart Background & Grid
  doc.setFillColor(250, 250, 250);
  doc.rect(chartX, chartY, chartW, chartH, 'F');
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  for(let i=1; i<=4; i++) {
    const ly = chartY + chartH - (i * chartH / 4);
    doc.line(chartX, ly, chartX + chartW, ly);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(`${Math.round(i * yStep)}L`, chartX - 5, ly + 2, { align: 'right' }); // Dynamic Y-axis labels
  }
  
  // Axes
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.5);
  doc.line(chartX, chartY, chartX, chartY + chartH); // Y-axis
  doc.line(chartX, chartY + chartH, chartX + chartW, chartY + chartH); // X-axis

  // X-axis labels
  const years = [0, 2, 4, 6, 8, 10, 12, 14];
  years.forEach((yr, idx) => {
    const lx = chartX + (idx * chartW / 7);
    doc.text(`${yr}`, lx, chartY + chartH + 5, { align: 'center' });
  });
  doc.text('Years', chartX + chartW/2, chartY + chartH + 10, { align: 'center' });

  // Draw Lines
  // 1. Invested Line (Linear growth since it's an annual investment)
  doc.setDrawColor(218, 165, 32); // Gold
  doc.setLineWidth(0.8);
  doc.setLineDash([2, 2], 0);
  let prevInvX = chartX;
  let prevInvY = chartY + chartH - (annualLakhs * chartH / maxY);
  prevInvY = Math.min(prevInvY, chartY + chartH); 
  
  for(let i=1; i<=14; i++) {
    const currX = chartX + (i * chartW / 14);
    const currInv = annualLakhs * (i + 1);
    let currInvY = chartY + chartH - (currInv * chartH / maxY);
    currInvY = Math.min(currInvY, chartY + chartH);
    if(currInvY >= chartY) {
      doc.line(prevInvX, prevInvY, currX, currInvY);
    }
    prevInvX = currX;
    prevInvY = currInvY;
  }
  doc.setLineDash([], 0);

  // 2. Projected Line (Curve from initial to projected)
  doc.setDrawColor(...primaryColor); // Dark Blue
  doc.setLineWidth(1.2);
  let prevX = chartX;
  let prevY = chartY + chartH - (annualLakhs * Math.pow(1.15, 1) * chartH / maxY);
  for(let i=1; i<=14; i++) {
    const currX = chartX + (i * chartW / 14);
    // Compound growth simulation for annual investments
    let val = 0;
    for(let y=1; y<=i+1; y++) {
      val += annualLakhs * Math.pow(1.15, (i+1) - y + 1);
    }
    const currY = chartY + chartH - (val * chartH / maxY);
    if(currY >= chartY) { // Keep inside chart bounds
      doc.line(prevX, prevY, currX, currY);
    }
    prevX = currX;
    prevY = currY;
  }
  
  // Value label at end
  doc.setFontSize(8);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  // Format projected value cleanly
  const formattedProjected = projectedLakhs >= 100 ? (projectedLakhs / 100).toFixed(2) + ' Cr' : projectedLakhs.toFixed(2) + ' L';
  doc.text(`Rs. ${formattedProjected}`, prevX - 5, prevY - 3);

  // Legend box inside chart
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.rect(chartX + 5, chartY + 5, 65, 12, 'FD');
  
  doc.setDrawColor(218, 165, 32);
  doc.setLineDash([1, 1], 0);
  doc.line(chartX + 8, chartY + 9, chartX + 15, chartY + 9);
  doc.setLineDash([], 0);
  doc.setFontSize(7);
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  const displayInitial = initialLakhs % 1 === 0 ? initialLakhs.toFixed(0) : initialLakhs.toFixed(1);
  doc.text(`Equity Lumpsum Invested (Rs. ${displayInitial}L)`, chartX + 18, chartY + 10);

  doc.setDrawColor(...primaryColor);
  doc.line(chartX + 8, chartY + 14, chartX + 15, chartY + 14);
  doc.text('Equity Lumpsum Projected (15%)', chartX + 18, chartY + 15);

  addFooter(8, 14, formData.clientName);

  // ==========================================
  // PAGE: CURRENT MARKET CONTEXT
  // ==========================================
  doc.addPage();
  addHeader(formData.clientName);
  
  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Current Market Context (${monthYear})`, margin, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  
  const marketText1 = `As of ${monthYear}, Indian equity markets have demonstrated resilience despite global headwinds. The Nifty 50 and Sensex have maintained their long-term upward trajectory, supported by strong domestic consumption, robust corporate earnings, and continued foreign institutional interest in Indian equities. India's GDP growth continues to outpace most major economies, making it one of the most attractive markets for long-term equity investors globally.`;
  const marketText2 = `The Reserve Bank of India (RBI) has maintained a measured monetary policy stance. Interest rates have been calibrated to balance growth and inflation, creating a favorable environment for equity as an asset class over fixed income. Inflation, while managed, underscores why equity SIPs remain the most effective wealth-creation tool for long-term investors.`;
  const marketText3 = `For long-term SIP investors like ${formData.clientName}, market ups and downs are actually an advantage — a concept called rupee cost averaging. When markets fall, your fixed SIP amount buys more units at lower prices. When markets rise, the value of all those accumulated units goes up. This is why disciplined SIP investors tend to do better than those who try to time the market.`;
  const marketText4 = `Global factors including US Federal Reserve policy, commodity price movements, and geopolitical developments may cause short-term market ups and downs. However, India's domestic growth story and demographic dividend provide strong structural support for equity returns over a 15-year horizon.`;
  
  [marketText1, marketText2, marketText3, marketText4].forEach(text => {
    const splitMarketText = doc.splitTextToSize(text, pageWidth - 2 * margin);
    doc.text(splitMarketText, margin, yPos);
    yPos += splitMarketText.length * 5 + 8;
  });

  // ==========================================
  // PAGE 14: DISCLAIMER & NEXT STEPS
  // ==========================================
  doc.addPage();
  addHeader(formData.clientName);
  addSectionTitle('10. Disclaimer & Next Steps');

  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 35, 'FD');

  doc.setTextColor(...textColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DISCLAIMER', margin + 5, yPos + 8);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const disclaimerText = `This proposal has been prepared by Investerly Financial Services Pvt. Ltd. for informational and planning purposes only. All projected values are indicative and based on assumed rates of return. Actual returns may vary significantly based on market conditions, fund performance, and other factors. Mutual Fund investments are subject to market risk. Past performance is not indicative of future results. Please read all Scheme Information Documents (SID), Key Information Memoranda (KIM), and other offer documents carefully before investing.`;
  
  const splitDisclaimer = doc.splitTextToSize(disclaimerText, pageWidth - 2 * margin - 10);
  doc.text(splitDisclaimer, margin + 5, yPos + 14);

  yPos += 45;

  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Recommended Next Steps', margin, yPos);
  yPos += 10;

  doc.setTextColor(...textColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  const steps = [
    `Step 1 — Review this proposal carefully with your Investerly advisor. Ask as many questions as you need. We are here to explain every number.`,
    `Step 2 — Complete your KYC formalities if not already done. You will need: PAN Card, Aadhaar Card, Bank Account details, and a recent photograph.`,
    `Step 3 — Start Insurance FIRST — this is your financial safety net. Get term life and health insurance in place before your investment journey begins.`,
    `Step 4 — Initiate all SIP mandates (${formData.sipTotal || 'Rs. 0'}) through net banking or UPI auto-debit. Also complete the lumpsum investments (${formData.lumpsumTotal || 'Rs. 0'}).`,
    `Step 5 — Set aside ${formData.annualInvestment || 'Rs. 0'} annually for your high-growth annual lumpsum investment. Timing this at the beginning of each financial year maximizes compounding.`,
    `Step 6 — Schedule a review meeting with Investerly every 6 months to track progress, review fund performance, and make any necessary adjustments.`
  ];

  steps.forEach(step => {
    const splitStep = doc.splitTextToSize(step, pageWidth - 2 * margin);
    doc.text(splitStep, margin, yPos);
    yPos += splitStep.length * 5 + 5;
  });

  yPos += 5;

  // Final Footer Blue Box
  doc.setFillColor(...primaryColor);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('INVESTERLY FINANCIAL SERVICES PVT. LTD.', pageWidth/2, yPos + 8, { align: 'center' });
  
  doc.setTextColor(...accentGold);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('AMFI Registered Investment Distributor', pageWidth/2, yPos + 13, { align: 'center' });
  
  doc.setTextColor(200, 200, 200);
  doc.setFont('helvetica', 'normal');
  doc.text('Phone: +91 777 888 2822   |   Email: advisor@investerly.in   |   www.investerly.in', pageWidth/2, yPos + 18, { align: 'center' });
  
  doc.setTextColor(...accentGold);
  doc.setFont('helvetica', 'italic');
  doc.text('"We are always here to guide you on your financial journey."', pageWidth/2, yPos + 23, { align: 'center' });

  // Add Footers to all pages except Cover
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 2; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(i - 1, pageCount - 1, formData.clientName);
  }

  // Save the PDF
  doc.save(`Proposal_${formData.clientName.replace(/\s+/g, '_')}.pdf`);
  return true;
};