/**
 * ML Prediction Service for Carbon Emission Forecasting
 * Uses linear regression and trend analysis to predict future environmental impact
 */

/**
 * Simple linear regression to predict future emissions
 * @param {Array} historicalData - Array of {date, totalEmissions} objects
 * @param {number} monthsAhead - Number of months to predict
 * @returns {Object} Prediction results
 */
export function predictFutureEmissions(historicalData, monthsAhead = 12) {
  if (!historicalData || historicalData.length < 2) {
    // Not enough data, use current emission rate
    const current = historicalData[0]?.totalEmissions || 0;
    return {
      predictedMonthly: current,
      predictedYearly: current * 12,
      trend: 'stable',
      confidence: 'low',
    };
  }

  // Sort by date
  const sorted = [...historicalData].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Calculate linear regression
  const n = sorted.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  
  sorted.forEach((point, index) => {
    const x = index;
    const y = point.totalEmissions;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  });
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Predict future values
  const lastIndex = n - 1;
  const predictedMonthly = slope * (lastIndex + monthsAhead) + intercept;
  const predictedYearly = predictedMonthly * 12;
  
  // Determine trend
  let trend = 'stable';
  if (slope > 0.1) trend = 'increasing';
  else if (slope < -0.1) trend = 'decreasing';
  
  // Calculate confidence based on data points
  const confidence = n >= 6 ? 'high' : n >= 3 ? 'medium' : 'low';
  
  // Calculate environmental impact metrics
  const treesNeeded = Math.ceil(predictedYearly / 21.77); // 1 tree absorbs ~21.77 kg CO2/year
  const equivalentCars = (predictedYearly / 4600).toFixed(1); // Average car emits ~4600 kg CO2/year
  
  return {
    predictedMonthly: Math.max(0, predictedMonthly),
    predictedYearly: Math.max(0, predictedYearly),
    trend,
    confidence,
    treesNeeded,
    equivalentCars,
    slope,
  };
}

/**
 * Generate personalized feedback and recommendations
 * @param {Object} emissionData - Current emission data
 * @param {Object} averageEmissions - Average emissions for comparison
 * @returns {Object} Feedback object
 */
export function generateFeedback(emissionData, averageEmissions = { total: 167 }) {
  const total = emissionData.totalEmissions || 0;
  // Indian average: ~2,000 kg CO2/year per person = ~167 kg CO2/month
  // Since we calculate monthly emissions, compare against monthly average
  const avgMonthly = averageEmissions.total || 167; // Average Indian person emits ~167 kg CO2/month
  
  // Calculate score (0-100, higher is better)
  let score = 100;
  if (total > avgMonthly * 1.5) score = 20;
  else if (total > avgMonthly * 1.2) score = 40;
  else if (total > avgMonthly) score = 60;
  else if (total > avgMonthly * 0.8) score = 80;
  else if (total > avgMonthly * 0.5) score = 90;
  
  const recommendations = [];
  const feedback = [];
  
  // Transportation feedback (typically 30-40% of total)
  if (emissionData.categoryBreakdown?.transportation > avgMonthly * 0.4) {
    feedback.push('Your transportation emissions are above average.');
    recommendations.push('Consider using public transport or carpooling more often.');
    recommendations.push('Try walking or cycling for short distances.');
    recommendations.push('Use metro or local trains instead of private vehicles when possible.');
  }
  
  // Energy feedback (typically 25-35% of total)
  if (emissionData.categoryBreakdown?.energy > avgMonthly * 0.3) {
    feedback.push('Your energy consumption is high.');
    recommendations.push('Switch to LED bulbs and unplug devices when not in use.');
    recommendations.push('Use energy-efficient appliances (BEE 5-star rated).');
    recommendations.push('Consider solar panels if feasible.');
  }
  
  // Food feedback (typically 15-25% of total)
  if (emissionData.categoryBreakdown?.food > avgMonthly * 0.2) {
    feedback.push('Your food choices have a significant carbon footprint.');
    recommendations.push('Try reducing meat consumption and eating more plant-based meals.');
    recommendations.push('Buy local and seasonal produce when possible.');
    recommendations.push('Reduce food waste by planning meals better.');
  }
  
  // Waste feedback (typically 5-10% of total)
  if (emissionData.categoryBreakdown?.waste > avgMonthly * 0.1) {
    feedback.push('Your waste production is contributing to emissions.');
    recommendations.push('Reduce single-use plastics and recycle more.');
    recommendations.push('Compost organic waste when possible.');
    recommendations.push('Use reusable bags and containers.');
  }
  
  // Positive feedback
  if (total < avgMonthly * 0.8) {
    feedback.push('Great job! Your carbon footprint is below the Indian average.');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Keep up the excellent work! Continue your sustainable practices.');
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    feedback: feedback.length > 0 ? feedback.join(' ') : 'Your carbon footprint is within average range.',
    recommendations,
  };
}

/**
 * Calculate carbon emissions from user input
 * @param {Object} input - User input data
 * @returns {Object} Calculated emissions
 */
export function calculateEmissions(input) {
  // Emission factors for Indian context (kg CO2 equivalent per unit)
  // Indian electricity grid emission factor is higher (coal-heavy grid)
  const factors = {
    carKm: 0.255, // kg CO2 per km (average Indian car: ~0.255 kg/km)
    publicTransportKm: 0.031, // kg CO2 per km (buses, trains in India)
    flight: 200, // kg CO2 per flight (short haul average, domestic Indian flights)
    electricityKwh: 0.82, // kg CO2 per kWh (Indian grid average - higher due to coal)
    lpgCylinder: 19.5, // kg CO2 per LPG cylinder (14.2 kg cylinder = ~19.5 kg CO2)
    meatMeal: 3.5, // kg CO2 per meal (global average)
    vegetarianMeal: 0.8, // kg CO2 per meal (global average)
    plasticItem: 0.05, // kg CO2 per item
  };
  
  // Handle backward compatibility: convert miles to km if old field names are used
  const carKm = input.carKm || (input.carMiles ? input.carMiles * 1.60934 : 0);
  const publicTransportKm = input.publicTransportKm || (input.publicTransportMiles ? input.publicTransportMiles * 1.60934 : 0);
  const lpgCylinders = input.lpgCylinders || 0;
  
  // Calculate by category
  const transportation = 
    carKm * factors.carKm +
    publicTransportKm * factors.publicTransportKm +
    (input.flights || 0) * factors.flight;
  
  const energy = 
    (input.electricityKwh || 0) * factors.electricityKwh +
    lpgCylinders * factors.lpgCylinder;
  
  const food = 
    (input.meatMeals || 0) * factors.meatMeal +
    (input.vegetarianMeals || 0) * factors.vegetarianMeal;
  
  const waste = 
    (input.plasticItems || 0) * factors.plasticItem * 
    (1 - (input.recyclingRate || 0) / 100); // Less impact if recycled
  
  const totalEmissions = transportation + energy + food + waste;
  
  return {
    totalEmissions: Math.round(totalEmissions * 100) / 100,
    categoryBreakdown: {
      transportation: Math.round(transportation * 100) / 100,
      energy: Math.round(energy * 100) / 100,
      food: Math.round(food * 100) / 100,
      waste: Math.round(waste * 100) / 100,
    },
  };
}

