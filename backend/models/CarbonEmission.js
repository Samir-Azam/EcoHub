import mongoose from 'mongoose';

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

// Helper function to get month identifier (YYYY-MM format)
function getMonthIdentifier(date) {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${d.getFullYear()}-${month}`;
}

const carbonEmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  
  // Week and month tracking for rankings and rewards
  weekIdentifier: { type: String, required: true }, // Format: YYYY-WW
  monthIdentifier: { type: String, required: true }, // Format: YYYY-MM
  
  // Transportation
  carKm: { type: Number, default: 0 }, // kilometers driven
  publicTransportKm: { type: Number, default: 0 }, // kilometers
  flights: { type: Number, default: 0 }, // number of flights
  
  // Energy
  electricityKwh: { type: Number, default: 0 }, // kWh per month
  lpgCylinders: { type: Number, default: 0 }, // LPG cylinders per month
  
  // Food
  meatMeals: { type: Number, default: 0 }, // meals per week
  vegetarianMeals: { type: Number, default: 0 }, // meals per week
  
  // Waste
  plasticItems: { type: Number, default: 0 }, // items per week
  recyclingRate: { type: Number, default: 0 }, // percentage (0-100)
  
  // Calculated totals
  totalEmissions: { type: Number, default: 0 }, // kg CO2 equivalent
  categoryBreakdown: {
    transportation: { type: Number, default: 0 },
    energy: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    waste: { type: Number, default: 0 },
  },
  
  // Feedback and recommendations
  score: { type: Number, default: 0 }, // 0-100 (higher is better)
  feedback: { type: String, default: '' },
  recommendations: [{ type: String }],
}, { timestamps: true });

// Pre-save hook to set week and month identifiers
carbonEmissionSchema.pre('save', function(next) {
  if (!this.weekIdentifier) {
    this.weekIdentifier = getWeekIdentifier(this.date);
  }
  if (!this.monthIdentifier) {
    this.monthIdentifier = getMonthIdentifier(this.date);
  }
  next();
});

// Indexes for efficient queries
carbonEmissionSchema.index({ userId: 1, date: -1 });
carbonEmissionSchema.index({ userId: 1, weekIdentifier: 1 }); // For weekly restriction check
carbonEmissionSchema.index({ weekIdentifier: 1, score: -1 }); // For weekly rankings
carbonEmissionSchema.index({ monthIdentifier: 1, userId: 1 }); // For monthly rewards

export default mongoose.model('CarbonEmission', carbonEmissionSchema);

