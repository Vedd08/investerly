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
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "normal");
  doc.text("investerly.in", 20, pageHeight - 15);
  
  doc.setFontSize(8);
  doc.text("Confidential & Proprietary", pageWidth - 55, pageHeight - 15);
};