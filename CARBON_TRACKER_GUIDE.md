# Carbon Emission Tracker - User Guide

## Overview

The Carbon Emission Tracker is an AI-powered feature that helps users:
- Calculate their carbon footprint based on daily activities
- Receive personalized feedback and recommendations
- Get predictions about future environmental impact using machine learning
- Track their progress over time

## Features

### 1. Carbon Footprint Calculator
Users can input data about their:
- **Transportation**: Car miles, public transport miles, flights
- **Energy**: Electricity usage (kWh), gas usage (therms)
- **Food**: Meat meals and vegetarian meals per week
- **Waste**: Plastic items used and recycling rate

### 2. AI-Powered Feedback
The system provides:
- **Sustainability Score** (0-100): Higher is better
- **Personalized Feedback**: Based on your carbon footprint
- **Actionable Recommendations**: Specific steps to reduce emissions

### 3. ML Predictions
Using linear regression and trend analysis, the system predicts:
- **Future Emissions**: Projected yearly carbon footprint
- **Environmental Impact**: Trees needed to offset, equivalent cars
- **Trend Analysis**: Whether your emissions are increasing, decreasing, or stable

### 4. Statistics Dashboard
Track your progress with:
- Total entries recorded
- Average monthly emissions
- Latest sustainability score
- Trend indicators

## How to Use

### Step 1: Login/Register
1. Navigate to the login page
2. Create an account or log in with existing credentials
3. You must be logged in to save and track your emissions

### Step 2: Access Carbon Tracker
1. Click on "Carbon Tracker" in the navigation menu
2. You'll see the carbon emission calculator page

### Step 3: Enter Your Data
Fill in the form with your monthly/weekly data:

**Transportation:**
- Car miles: How many miles you drive per month
- Public transport miles: Miles traveled on buses, trains, etc.
- Flights: Number of flights taken per month

**Energy:**
- Electricity (kWh): Your monthly electricity consumption
- Gas usage (therms): Your monthly gas consumption

**Food:**
- Meat meals: Number of meat-based meals per week
- Vegetarian meals: Number of vegetarian/vegan meals per week

**Waste:**
- Plastic items: Number of single-use plastic items per week
- Recycling rate: Percentage of waste you recycle (0-100%)

### Step 4: Calculate Your Footprint
1. Click "Calculate Carbon Footprint"
2. The system will:
   - Calculate your total emissions (kg CO₂ equivalent)
   - Break down emissions by category
   - Generate a sustainability score
   - Provide personalized feedback
   - Show recommendations

### Step 5: View Predictions
After calculating, you'll automatically see:
- **Future Impact Prediction**: Based on your current usage patterns
- **Projected yearly emissions**: How much CO₂ you'll emit in a year
- **Offset metrics**: Trees needed and equivalent cars
- **Trend**: Whether your emissions are trending up, down, or stable

### Step 6: Track Over Time
- Each calculation is saved to your account
- View your statistics and trends
- Compare your progress over time
- The more data you enter, the more accurate predictions become

## Understanding Your Results

### Sustainability Score
- **80-100**: Excellent! You're well below average emissions
- **60-79**: Good! You're doing better than average
- **40-59**: Average. Room for improvement
- **0-39**: High emissions. Significant changes needed

### Emission Categories
- **Transportation**: Usually the largest contributor (cars, flights)
- **Energy**: Home electricity and heating
- **Food**: Meat production has high carbon footprint
- **Waste**: Plastic production and decomposition

### Predictions
- **Confidence Levels**:
  - High: 6+ data points
  - Medium: 3-5 data points
  - Low: 1-2 data points
- **Trends**:
  - Increasing: Your emissions are going up
  - Decreasing: Your emissions are going down
  - Stable: Your emissions remain consistent

## Tips for Reducing Your Carbon Footprint

1. **Transportation**
   - Use public transport or carpool
   - Walk or bike for short distances
   - Reduce air travel when possible

2. **Energy**
   - Switch to LED bulbs
   - Unplug devices when not in use
   - Consider renewable energy sources
   - Improve home insulation

3. **Food**
   - Reduce meat consumption
   - Eat more plant-based meals
   - Buy local and seasonal produce
   - Reduce food waste

4. **Waste**
   - Reduce single-use plastics
   - Recycle more
   - Compost organic waste
   - Buy products with less packaging

## Technical Details

### How It Works

**Emission Calculation:**
- Uses industry-standard emission factors
- Calculates CO₂ equivalent for each activity
- Aggregates by category (transportation, energy, food, waste)

**ML Predictions:**
- Uses linear regression on historical data
- Analyzes trends to predict future emissions
- Provides confidence levels based on data points

**Feedback Generation:**
- Compares your emissions to average benchmarks
- Identifies high-impact categories
- Provides category-specific recommendations

### API Endpoints

**Backend Routes:**
- `POST /api/carbon/calculate` - Calculate and save emissions
- `GET /api/carbon/my-emissions` - Get all your emission records
- `GET /api/carbon/predictions` - Get future impact predictions
- `GET /api/carbon/latest` - Get your latest emission data
- `GET /api/carbon/stats` - Get statistics and trends

## Troubleshooting

**"Please log in" message:**
- Make sure you're logged in before calculating
- Your data is saved to your account

**No predictions showing:**
- You need at least one emission calculation
- More data points = more accurate predictions

**Can't see my previous data:**
- Make sure you're logged in with the same account
- Check that your backend is running and connected to MongoDB

## Future Enhancements

Potential improvements:
- Integration with smart home devices
- Mobile app for easier tracking
- Social features (compare with friends)
- Carbon offset purchase options
- More detailed category breakdowns
- Historical charts and graphs

## Support

If you encounter any issues:
1. Check that both backend and frontend are running
2. Verify MongoDB connection
3. Check browser console for errors
4. Ensure you're logged in with a valid account

---
