const calculateStepUpSIP = (monthlyInvestment, stepUpPercent, expectedReturn, years) => {
  const months = years * 12;
  const monthlyRate = expectedReturn / 12 / 100;
  
  let totalValue = 0;
  let currentSip = monthlyInvestment;
  
  for (let year = 1; year <= years; year++) {
    for (let month = 1; month <= 12; month++) {
      // Future value of this particular SIP installment at the end of the term
      const monthsRemaining = months - ((year - 1) * 12 + month) + 1; // +1 if invested at beginning of month
      totalValue += currentSip * Math.pow(1 + monthlyRate, monthsRemaining);
    }
    // Step up at the end of the year
    currentSip = currentSip * (1 + stepUpPercent / 100);
  }
  
  return totalValue;
};

const formatCurrency = (val) => {
  return "Rs. " + Math.round(val).toLocaleString('en-IN');
};

console.log("Flexi Cap:", formatCurrency(calculateStepUpSIP(30000, 10, 16, 15)));
console.log("Large & Mid Cap:", formatCurrency(calculateStepUpSIP(22500, 10, 14, 15)));
console.log("Small Cap:", formatCurrency(calculateStepUpSIP(22500, 10, 15, 15)));

// Annual lumpsum calculation
const calculateAnnualLumpsum = (annualAmount, expectedReturn, years) => {
  let totalValue = 0;
  for(let year = 1; year <= years; year++) {
      const yearsRemaining = years - year + 1; // +1 because invested at beginning of year
      totalValue += annualAmount * Math.pow(1 + expectedReturn/100, yearsRemaining);
  }
  return totalValue;
}
console.log("Annual Lumpsum (6L, 15%, 15yr):", formatCurrency(calculateAnnualLumpsum(600000, 15, 15)));
