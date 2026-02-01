import express from 'express';
import CarbonEmission from '../models/CarbonEmission.js';
import { calculateEmissions, generateFeedback, predictFutureEmissions } from '../services/mlPredictionService.js';
import { protect as authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all emissions for a user
router.get('/my-emissions', authenticate, async (req, res) => {
  try {
    const emissions = await CarbonEmission.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(12); // Last 12 entries
    
    res.json(emissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to get week identifier (YYYY-MM-DD format for Monday of the week)
function getWeekIdentifier(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  // Get Monday of the current week
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(d.setDate(diff));
  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(monday.getDate()).padStart(2, '0');
  return `${year}-${month}-${dayOfMonth}`;
}

// Calculate and save new emission entry
router.post('/calculate', authenticate, async (req, res) => {
  try {
    const input = req.body;
    
    // Check if user has already calculated this week
    const now = new Date();
    const currentWeek = getWeekIdentifier(now);
    const existingThisWeek = await CarbonEmission.findOne({
      userId: req.user._id,
      weekIdentifier: currentWeek,
    });
    
    if (existingThisWeek) {
      const nextWeekDate = new Date(now);
      nextWeekDate.setDate(nextWeekDate.getDate() + (7 - nextWeekDate.getDay()));
      return res.status(429).json({
        message: 'You can only calculate your carbon footprint once per week. Please try again next week.',
        nextAvailableDate: nextWeekDate.toISOString().split('T')[0],
        existingEntry: {
          date: existingThisWeek.date,
          score: existingThisWeek.score,
          totalEmissions: existingThisWeek.totalEmissions,
        },
      });
    }
    
    // Normalize input: convert old field names to new ones if needed
    const normalizedInput = {
      carKm: input.carKm || (input.carMiles ? input.carMiles * 1.60934 : 0),
      publicTransportKm: input.publicTransportKm || (input.publicTransportMiles ? input.publicTransportMiles * 1.60934 : 0),
      flights: input.flights || 0,
      electricityKwh: input.electricityKwh || 0,
      lpgCylinders: input.lpgCylinders || 0,
      meatMeals: input.meatMeals || 0,
      vegetarianMeals: input.vegetarianMeals || 0,
      plasticItems: input.plasticItems || 0,
      recyclingRate: input.recyclingRate || 0,
    };
    
    // Validation: Check for negative values
    const validationErrors = [];
    if (normalizedInput.carKm < 0) validationErrors.push('Car distance cannot be negative');
    if (normalizedInput.publicTransportKm < 0) validationErrors.push('Public transport distance cannot be negative');
    if (normalizedInput.flights < 0) validationErrors.push('Number of flights cannot be negative');
    if (normalizedInput.electricityKwh < 0) validationErrors.push('Electricity consumption cannot be negative');
    if (normalizedInput.lpgCylinders < 0) validationErrors.push('LPG cylinders cannot be negative');
    if (normalizedInput.meatMeals < 0) validationErrors.push('Meat meals cannot be negative');
    if (normalizedInput.vegetarianMeals < 0) validationErrors.push('Vegetarian meals cannot be negative');
    if (normalizedInput.plasticItems < 0) validationErrors.push('Plastic items cannot be negative');
    if (normalizedInput.recyclingRate < 0 || normalizedInput.recyclingRate > 100) {
      validationErrors.push('Recycling rate must be between 0 and 100');
    }
    
    // Validation: Check for unrealistic maximum values (to prevent data manipulation)
    const maxLimits = {
      carKm: 10000, // 10,000 km/month is very high but possible
      publicTransportKm: 5000, // 5,000 km/month
      flights: 20, // 20 flights/month is extremely high
      electricityKwh: 2000, // 2,000 kWh/month is very high
      lpgCylinders: 10, // 10 cylinders/month is very high
      meatMeals: 90, // 90 meals/month (3 per day)
      vegetarianMeals: 90, // 90 meals/month
      plasticItems: 500, // 500 items/month
    };
    
    if (normalizedInput.carKm > maxLimits.carKm) {
      validationErrors.push(`Car distance (${normalizedInput.carKm} km) seems unrealistic. Maximum allowed: ${maxLimits.carKm} km/month`);
    }
    if (normalizedInput.publicTransportKm > maxLimits.publicTransportKm) {
      validationErrors.push(`Public transport distance (${normalizedInput.publicTransportKm} km) seems unrealistic. Maximum allowed: ${maxLimits.publicTransportKm} km/month`);
    }
    if (normalizedInput.flights > maxLimits.flights) {
      validationErrors.push(`Number of flights (${normalizedInput.flights}) seems unrealistic. Maximum allowed: ${maxLimits.flights} flights/month`);
    }
    if (normalizedInput.electricityKwh > maxLimits.electricityKwh) {
      validationErrors.push(`Electricity consumption (${normalizedInput.electricityKwh} kWh) seems unrealistic. Maximum allowed: ${maxLimits.electricityKwh} kWh/month`);
    }
    if (normalizedInput.lpgCylinders > maxLimits.lpgCylinders) {
      validationErrors.push(`LPG cylinders (${normalizedInput.lpgCylinders}) seems unrealistic. Maximum allowed: ${maxLimits.lpgCylinders} cylinders/month`);
    }
    if (normalizedInput.meatMeals > maxLimits.meatMeals) {
      validationErrors.push(`Meat meals (${normalizedInput.meatMeals}) seems unrealistic. Maximum allowed: ${maxLimits.meatMeals} meals/month`);
    }
    if (normalizedInput.vegetarianMeals > maxLimits.vegetarianMeals) {
      validationErrors.push(`Vegetarian meals (${normalizedInput.vegetarianMeals}) seems unrealistic. Maximum allowed: ${maxLimits.vegetarianMeals} meals/month`);
    }
    if (normalizedInput.plasticItems > maxLimits.plasticItems) {
      validationErrors.push(`Plastic items (${normalizedInput.plasticItems}) seems unrealistic. Maximum allowed: ${maxLimits.plasticItems} items/month`);
    }
    
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors,
      });
    }
    
    // Calculate emissions
    const calculated = calculateEmissions(normalizedInput);
    
    // Generate feedback
    const feedback = generateFeedback(calculated);
    
    // Validation: Check for unrealistic scores
    // A score of 100 means emissions are less than 50% of average (i.e., < 83.5 kg)
    // If score is 100 but emissions are too high, this is suspicious
    const avgMonthly = 167; // Average Indian monthly emissions
    if (feedback.score >= 100) {
      // Score of 100 should only occur when totalEmissions < avgMonthly * 0.5 (i.e., < 83.5 kg)
      // If emissions are higher than 80 kg but score is 100, something is wrong
      if (calculated.totalEmissions > 80) {
        return res.status(400).json({
          message: 'Data validation failed',
          errors: ['The calculated score seems unrealistic based on your emissions. Please verify your input data.'],
          calculatedEmissions: calculated.totalEmissions,
          calculatedScore: feedback.score,
        });
      }
    }
    
    // Additional check: If score is 90+ but emissions are above average, flag it
    if (feedback.score >= 90 && calculated.totalEmissions > avgMonthly) {
      return res.status(400).json({
        message: 'Data validation failed',
        errors: ['The calculated score seems inconsistent with your emissions data. Please verify your input.'],
        calculatedEmissions: calculated.totalEmissions,
        calculatedScore: feedback.score,
      });
    }
    
    // Additional validation: If all inputs are zero or extremely low, warn user
    const totalInput = normalizedInput.carKm + normalizedInput.publicTransportKm + 
                      normalizedInput.flights + normalizedInput.electricityKwh + 
                      normalizedInput.lpgCylinders + normalizedInput.meatMeals + 
                      normalizedInput.vegetarianMeals + normalizedInput.plasticItems;
    
    if (totalInput === 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: ['Please enter at least some data. All fields cannot be zero.'],
      });
    }
    
    // Get week and month identifiers
    const emissionDate = new Date();
    const weekId = getWeekIdentifier(emissionDate);
    const monthId = getMonthIdentifier(emissionDate);
    
    // Create emission record
    const emission = new CarbonEmission({
      userId: req.user._id,
      date: emissionDate,
      weekIdentifier: weekId,
      monthIdentifier: monthId,
      ...normalizedInput,
      ...calculated,
      ...feedback,
    });
    
    await emission.save();
    
    res.json({
      ...emission.toObject(),
      message: 'Carbon emission calculated and saved successfully',
    });
  } catch (error) {
    console.error('Error calculating emissions:', error);
    res.status(500).json({ message: error.message || 'Failed to calculate emissions' });
  }
});

// Get predictions for future environmental impact
router.get('/predictions', authenticate, async (req, res) => {
  try {
    const emissions = await CarbonEmission.find({ userId: req.user._id })
      .sort({ date: 1 })
      .select('date totalEmissions');
    
    if (emissions.length === 0) {
      return res.json({
        message: 'Not enough data for predictions. Please add some emission data first.',
        predictedYearly: 0,
        trend: 'stable',
        confidence: 'low',
      });
    }
    
    const monthsAhead = parseInt(req.query.months) || 12;
    const predictions = predictFutureEmissions(emissions, monthsAhead);
    
    res.json({
      ...predictions,
      dataPoints: emissions.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get latest emission with feedback
router.get('/latest', authenticate, async (req, res) => {
  try {
    const latest = await CarbonEmission.findOne({ userId: req.user.id })
      .sort({ date: -1 });
    
    if (!latest) {
      return res.json({ message: 'No emission data found. Please calculate your emissions first.' });
    }
    
    res.json(latest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get statistics and trends
router.get('/stats', authenticate, async (req, res) => {
  try {
    const emissions = await CarbonEmission.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(12);
    
    if (emissions.length === 0) {
      return res.json({ message: 'No data available' });
    }
    
    const total = emissions.reduce((sum, e) => sum + e.totalEmissions, 0);
    const average = total / emissions.length;
    const latest = emissions[0];
    
    // Calculate trend
    let trend = 'stable';
    if (emissions.length >= 2) {
      const recent = emissions.slice(0, 3).reduce((sum, e) => sum + e.totalEmissions, 0) / Math.min(3, emissions.length);
      const older = emissions.slice(3, 6).reduce((sum, e) => sum + e.totalEmissions, 0) / Math.min(3, emissions.length - 3);
      if (recent > older * 1.1) trend = 'increasing';
      else if (recent < older * 0.9) trend = 'decreasing';
    }
    
    res.json({
      totalEntries: emissions.length,
      averageMonthly: Math.round(average * 100) / 100,
      latestScore: latest.score,
      trend,
      latestDate: latest.date,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get weekly rankings (leaderboard)
router.get('/rankings', authenticate, async (req, res) => {
  try {
    const weekParam = req.query.week; // Optional: YYYY-WW format
    const now = new Date();
    const currentWeek = weekParam || getWeekIdentifier(now);
    
    // Get all emissions for this week, sorted by score (descending)
    const weeklyEmissions = await CarbonEmission.find({ weekIdentifier: currentWeek })
      .populate('userId', 'name email')
      .sort({ score: -1, date: -1 })
      .limit(100); // Top 100
    
    // Format rankings
    const rankings = weeklyEmissions.map((emission, index) => ({
      rank: index + 1,
      userId: emission.userId._id,
      userName: emission.userId.name,
      userEmail: emission.userId.email,
      score: emission.score,
      totalEmissions: emission.totalEmissions,
      date: emission.date,
    }));
    
    // Find current user's rank
    const userRankIndex = rankings.findIndex(r => r.userId.toString() === req.user._id.toString());
    const userRank = userRankIndex >= 0 ? userRankIndex + 1 : null;
    
    res.json({
      week: currentWeek,
      rankings,
      userRank,
      totalParticipants: rankings.length,
    });
  } catch (error) {
    console.error('Error fetching rankings:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get monthly rewards based on aggregated scores
router.get('/monthly-rewards', authenticate, async (req, res) => {
  try {
    const monthParam = req.query.month; // Optional: YYYY-MM format
    const now = new Date();
    const currentMonth = monthParam || getMonthIdentifier(now);
    
    // Get all users' emissions for this month
    const monthlyEmissions = await CarbonEmission.find({ monthIdentifier: currentMonth })
      .populate('userId', 'name email');
    
    // Aggregate scores by user
    const userScores = {};
    monthlyEmissions.forEach(emission => {
      const userId = emission.userId._id.toString();
      if (!userScores[userId]) {
        userScores[userId] = {
          userId: emission.userId._id,
          userName: emission.userId.name,
          userEmail: emission.userId.email,
          totalScore: 0,
          entryCount: 0,
          averageScore: 0,
          totalEmissions: 0,
        };
      }
      userScores[userId].totalScore += emission.score;
      userScores[userId].entryCount += 1;
      userScores[userId].totalEmissions += emission.totalEmissions;
    });
    
    // Calculate average scores
    Object.values(userScores).forEach(user => {
      user.averageScore = Math.round((user.totalScore / user.entryCount) * 100) / 100;
    });
    
    // Sort by average score (descending)
    const sortedUsers = Object.values(userScores)
      .sort((a, b) => b.averageScore - a.averageScore)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
      }));
    
    // Find current user's reward info
    const userReward = sortedUsers.find(u => u.userId.toString() === req.user._id.toString());
    
    // Calculate reward tiers
    const rewardTiers = {
      gold: sortedUsers.slice(0, Math.ceil(sortedUsers.length * 0.1)), // Top 10%
      silver: sortedUsers.slice(
        Math.ceil(sortedUsers.length * 0.1),
        Math.ceil(sortedUsers.length * 0.3)
      ), // Next 20%
      bronze: sortedUsers.slice(
        Math.ceil(sortedUsers.length * 0.3),
        Math.ceil(sortedUsers.length * 0.5)
      ), // Next 20%
    };
    
    // Determine user's tier
    let userTier = null;
    if (userReward) {
      if (rewardTiers.gold.some(u => u.userId.toString() === req.user._id.toString())) {
        userTier = 'gold';
      } else if (rewardTiers.silver.some(u => u.userId.toString() === req.user._id.toString())) {
        userTier = 'silver';
      } else if (rewardTiers.bronze.some(u => u.userId.toString() === req.user._id.toString())) {
        userTier = 'bronze';
      }
    }
    
    res.json({
      month: currentMonth,
      userReward: userReward ? {
        rank: userReward.rank,
        tier: userTier,
        averageScore: userReward.averageScore,
        totalScore: userReward.totalScore,
        entryCount: userReward.entryCount,
        totalEmissions: userReward.totalEmissions,
      } : null,
      topUsers: sortedUsers.slice(0, 10), // Top 10 for display
      totalParticipants: sortedUsers.length,
      rewardTiers: {
        gold: rewardTiers.gold.length,
        silver: rewardTiers.silver.length,
        bronze: rewardTiers.bronze.length,
      },
    });
  } catch (error) {
    console.error('Error calculating monthly rewards:', error);
    res.status(500).json({ message: error.message });
  }
});

// Helper function to get month identifier
function getMonthIdentifier(date) {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${d.getFullYear()}-${month}`;
}

export default router;

