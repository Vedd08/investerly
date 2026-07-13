import logoIcon from "../assets/investerly_logo1-removebg-preview (1).svg";
import logoText from "../assets/investerly_logo3-removebg-preview.svg"; // Using the exact SVG requested!

const getBase64ImageFromUrl = (imageUrl, crop = null) => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      
      if (crop) {
        // Crop the SVG to remove transparent padding
        canvas.width = crop.width;
        canvas.height = crop.height;
        // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      }
      
      let dataURL = canvas.toDataURL('image/png');
      resolve({ dataUrl: dataURL, ratio: canvas.width / canvas.height });
    };
    img.onerror = error => reject(error);
    img.src = imageUrl;
  });
};

export const addReportHeader = async (doc, title) => {
  // Add premium white background for header
  doc.setFillColor(255, 255, 255); 
  doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');

  // Load and add logos
  try {
    const iconObj = await getBase64ImageFromUrl(logoIcon);
    // Crop the text logo SVG vertically and horizontally to perfectly bound the text
    // y: 180 and height: 120 perfectly captures Y=199 to Y=285 without clipping the bottom bars
    const textObj = await getBase64ImageFromUrl(logoText, { x: 20, y: 180, width: 475, height: 120 });
    
    // Calculate dimensions to maintain aspect ratio
    const iconH = 22;
    const iconW = iconH * iconObj.ratio;
    
    const textH = 14;
    const textW = textH * textObj.ratio;
    
    // Add icon on the left
    doc.addImage(iconObj.dataUrl, 'PNG', 15, 9, iconW, iconH); 
    
    // Add text logo right next to it (with a tight 2px gap to remove huge spacing)
    doc.addImage(textObj.dataUrl, 'PNG', 15 + iconW + 2, 13.5, textW, textH);
  } catch (error) {
    console.error("Error loading logos for PDF", error);
  }

  // Add Title aligned to the right
  doc.setTextColor(46, 63, 86); // Dark primary color for title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(title, doc.internal.pageSize.width - 15, 25, { align: 'right' });

  // Add a subtle border line at the bottom of the header area
  doc.setDrawColor(225, 230, 239);
  doc.setLineWidth(0.5);
  doc.line(15, 36, doc.internal.pageSize.width - 15, 36);

  // Date
  doc.setFontSize(10);
  doc.setTextColor(107, 124, 143);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 20, 50);
  
  // Set default text color for body
  doc.setTextColor(46, 63, 86);
};

export const addReportFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text("investerly.in", 20, pageHeight - 15);
    
    // Contact details
    doc.text("Contact: +91 98765 43210 | support@investerly.in", pageWidth / 2, pageHeight - 15, { align: 'center' });

    doc.setFontSize(8);
    doc.text("Confidential & Proprietary", pageWidth - 55, pageHeight - 15);
  }
};

export const addBarChart = (doc, data, startY) => {
  if (!data || data.length === 0) return;
  
  // Parse data
  const parseValue = (valStr) => {
    if (typeof valStr !== 'string') return Number(valStr) || 0;
    let str = valStr.replace(/,/g, '');
    let multiplier = 1;
    if (str.includes('Cr')) multiplier = 10000000;
    else if (str.includes('Lac')) multiplier = 100000;
    else if (str.includes('K')) multiplier = 1000;
    const num = parseFloat(str.replace(/[^0-9.-]+/g, ''));
    return isNaN(num) ? 0 : Math.abs(num * multiplier);
  };
  
  const parsedData = data.map(item => ({
    label: item[0] ? item[0].replace(':', '') : 'Metric',
    value: parseValue(item[1]),
    displayValue: item[1] || '0'
  })).filter(item => item.value > 0);
  
  if (parsedData.length === 0) return;
  
  const maxVal = Math.max(...parsedData.map(d => d.value));
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(46, 63, 86);
  doc.text("Visual Summary", 20, startY);
  
  const chartY = startY + 10;
  const chartHeight = 50;
  const chartWidth = 160;
  const startX = 20;
  const numBars = parsedData.length;
  const barWidth = Math.min(20, (chartWidth / numBars) - 5);
  
  // Draw axes
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(startX, chartY + chartHeight, startX + chartWidth, chartY + chartHeight); // X axis
  
  // Draw bars
  parsedData.forEach((d, i) => {
    const barHeight = maxVal > 0 ? (d.value / maxVal) * chartHeight : 0;
    const x = startX + (i * (chartWidth / numBars)) + 5;
    const y = chartY + chartHeight - barHeight;
    
    // Bar
    doc.setFillColor(34, 197, 94); // Primary green
    doc.rect(x, y, barWidth, barHeight, 'F');
    
    // Label (truncated)
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const shortLabel = d.label.length > 15 ? d.label.substring(0, 12) + '...' : d.label;
    doc.text(shortLabel, x, chartY + chartHeight + 6);
    
    // Value on top
    doc.setFontSize(7);
    doc.setTextColor(46, 63, 86);
    doc.text(d.displayValue, x, y - 2);
  });
};

export const addGrowthChart = (doc, data, startY) => {
  if (!data || data.length === 0) return;
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(46, 63, 86);
  doc.text("Year-by-Year Growth Chart", 20, startY);
  
  const chartY = startY + 10;
  const chartHeight = 50;
  const chartWidth = 160;
  const startX = 20;
  
  const maxVal = Math.max(...data.map(d => d.futureValue || d.balance || 0));
  if (maxVal <= 0) return;

  const numBars = data.length;
  const barWidth = Math.min(10, (chartWidth / numBars) - 1);
  
  // Draw axes
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(startX, chartY + chartHeight, startX + chartWidth, chartY + chartHeight);
  
  data.forEach((d, i) => {
    const invested = d.invested || 0;
    const futureValue = d.futureValue || d.balance || 0;
    const returns = Math.max(0, futureValue - invested);
    
    const hInvested = (invested / maxVal) * chartHeight;
    const hReturns = (returns / maxVal) * chartHeight;
    
    const x = startX + (i * (chartWidth / numBars));
    
    // Invested Bar (bottom)
    const yInvested = chartY + chartHeight - hInvested;
    doc.setFillColor(100, 116, 139); // Slate-500
    doc.rect(x, yInvested, barWidth, hInvested, 'F');
    
    // Returns Bar (top)
    const yReturns = yInvested - hReturns;
    if (hReturns > 0) {
      doc.setFillColor(34, 197, 94); // Green-500
      doc.rect(x, yReturns, barWidth, hReturns, 'F');
    }
    
    // Year label
    if (numBars <= 15 || d.year % 5 === 0 || i === 0 || i === numBars - 1) {
      doc.setFontSize(6);
      doc.setTextColor(100, 100, 100);
      doc.text(`Y${d.year}`, x + (barWidth/2), chartY + chartHeight + 4, { align: 'center' });
    }
  });

  // Legend
  doc.setFillColor(100, 116, 139);
  doc.rect(startX, chartY + chartHeight + 10, 4, 4, 'F');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Invested Amount", startX + 6, chartY + chartHeight + 13.5);
  
  doc.setFillColor(34, 197, 94);
  doc.rect(startX + 40, chartY + chartHeight + 10, 4, 4, 'F');
  doc.text("Returns", startX + 46, chartY + chartHeight + 13.5);
};

export const addAmortizationChart = (doc, data, startY) => {
  if (!data || data.length === 0) return;
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(46, 63, 86);
  doc.text("Year-by-Year Amortization", 20, startY);
  
  const chartY = startY + 10;
  const chartHeight = 50;
  const chartWidth = 160;
  const startX = 20;
  
  const maxVal = Math.max(...data.map(d => (d.principalPaid || 0) + (d.interestPaid || 0)));
  if (maxVal <= 0) return;

  const numBars = data.length;
  const barWidth = Math.min(10, (chartWidth / numBars) - 1);
  
  // Draw axes
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(startX, chartY + chartHeight, startX + chartWidth, chartY + chartHeight);
  
  data.forEach((d, i) => {
    const principal = d.principalPaid || 0;
    const interest = d.interestPaid || 0;
    
    const hPrincipal = (principal / maxVal) * chartHeight;
    const hInterest = (interest / maxVal) * chartHeight;
    
    const x = startX + (i * (chartWidth / numBars));
    
    // Principal Bar (bottom)
    const yPrincipal = chartY + chartHeight - hPrincipal;
    doc.setFillColor(37, 99, 235); // Blue-600
    doc.rect(x, yPrincipal, barWidth, hPrincipal, 'F');
    
    // Interest Bar (top)
    const yInterest = yPrincipal - hInterest;
    if (hInterest > 0) {
      doc.setFillColor(249, 115, 22); // Orange-500
      doc.rect(x, yInterest, barWidth, hInterest, 'F');
    }
    
    // Year label
    if (numBars <= 15 || d.year % 5 === 0 || i === 0 || i === numBars - 1) {
      doc.setFontSize(6);
      doc.setTextColor(100, 100, 100);
      doc.text(`Y${d.year}`, x + (barWidth/2), chartY + chartHeight + 4, { align: 'center' });
    }
  });

  // Legend
  doc.setFillColor(37, 99, 235);
  doc.rect(startX, chartY + chartHeight + 10, 4, 4, 'F');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Principal Paid", startX + 6, chartY + chartHeight + 13.5);
  
  doc.setFillColor(249, 115, 22);
  doc.rect(startX + 35, chartY + chartHeight + 10, 4, 4, 'F');
  doc.text("Interest Paid", startX + 41, chartY + chartHeight + 13.5);
};