import { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';

export default function CarbonEmission() {
  const { isAuthenticated, logout } = useAuth();
  const [formData, setFormData] = useState({
    carKm: '',
    publicTransportKm: '',
    flights: '',
    electricityKwh: '',
    lpgCylinders: '',
    meatMeals: '',
    vegetarianMeals: '',
    plasticItems: '',
    recyclingRate: '50',
  });

  const [result, setResult] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [stats, setStats] = useState(null);
  const [rankings, setRankings] = useState(null);
  const [monthlyRewards, setMonthlyRewards] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weeklyRestriction, setWeeklyRestriction] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadPredictions();
      loadRankings();
      loadMonthlyRewards();
    }
  }, [isAuthenticated]);

  const loadStats = async () => {
    try {
      const data = await api.carbon.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
      // Don't logout here - user stays on page; they'll get auth error when they calculate
    }
  };

  const loadPredictions = async () => {
    try {
      const data = await api.carbon.getPredictions();
      setPredictions(data);
    } catch (err) {
      console.error('Failed to load predictions:', err);
      // Don't logout here - user stays on page; they'll get auth error when they calculate
    }
  };

  const loadRankings = async () => {
    try {
      const data = await api.carbon.getRankings();
      setRankings(data);
    } catch (err) {
      console.error('Failed to load rankings:', err);
    }
  };

  const loadMonthlyRewards = async () => {
    try {
      const data = await api.carbon.getMonthlyRewards();
      setMonthlyRewards(data);
    } catch (err) {
      console.error('Failed to load monthly rewards:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please log in to calculate your carbon emissions');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const numericData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, parseFloat(value) || 0])
      );

      const data = await api.carbon.calculate(numericData);

      setResult(data);
      setWeeklyRestriction(null);
      loadStats();
      loadPredictions();
      loadRankings();
      loadMonthlyRewards();
    } catch (err) {
      console.error('Carbon calculation error:', err);
      const errorMessage = err.message || 'Failed to calculate emissions';
      
      // Handle weekly restriction error (429 status)
      if (err.status === 429 && err.data) {
        setWeeklyRestriction({
          message: err.data.message || errorMessage,
          nextAvailableDate: err.data.nextAvailableDate,
          existingEntry: err.data.existingEntry,
        });
        setError(null);
      } else if (err.status === 400 && err.data && err.data.errors) {
        // Handle validation errors
        const errorList = Array.isArray(err.data.errors) ? err.data.errors : [err.data.message || errorMessage];
        setError(errorList.join('. '));
      } else if (errorMessage.includes('Invalid token') || errorMessage.includes('Token expired')) {
        setError('Session expired. Please log out and log in again to continue.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Prevent negative values
    if (value !== '' && parseFloat(value) < 0) {
      return; // Don't update if negative
    }
    // For recycling rate, ensure it's between 0 and 100
    if (name === 'recyclingRate' && value !== '' && (parseFloat(value) < 0 || parseFloat(value) > 100)) {
      return; // Don't update if out of range
    }
    setFormData({ ...formData, [name]: value });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="page carbon-emission">
      <div className="container">
        <h1>Carbon Emission Calculator</h1>
        <p className="page-subtitle">
          Track your carbon footprint and get AI-powered insights on your environmental impact.
        </p>

        {!isAuthenticated && (
          <div className="alert alert-info">
            <strong>Login Required:</strong> Please log in to save and track your carbon emissions over time.
          </div>
        )}

        {weeklyRestriction && (
          <div className="alert alert-warning">
            <strong>Weekly Limit Reached:</strong> {weeklyRestriction.message}
            {weeklyRestriction.nextAvailableDate && (
              <div style={{ marginTop: '8px', fontSize: '0.9rem' }}>
                Next calculation available: <strong>{new Date(weeklyRestriction.nextAvailableDate).toLocaleDateString()}</strong>
              </div>
            )}
            {weeklyRestriction.existingEntry && (
              <div style={{ marginTop: '8px', fontSize: '0.9rem' }}>
                Your current week's entry: Score {weeklyRestriction.existingEntry.score}/100 
                ({weeklyRestriction.existingEntry.totalEmissions.toFixed(2)} kg CO₂)
              </div>
            )}
          </div>
        )}

        <div className="carbon-layout">
          <div className="carbon-form-section">
            <h2>Enter Your Data</h2>
            <form onSubmit={handleSubmit} className="carbon-form">
              <div className="form-group">
                <label>Transportation</label>
                <div className="form-row">
                  <div className="form-field">
                    <input
                      type="number"
                      name="carKm"
                      placeholder="0"
                      value={formData.carKm}
                      onChange={handleChange}
                      min="0"
                      max="10000"
                      step="1"
                    />
                    <span className="field-label">Car distance (km per month)</span>
                  </div>
                  <div className="form-field">
                    <input
                      type="number"
                      name="publicTransportKm"
                      placeholder="0"
                      value={formData.publicTransportKm}
                      onChange={handleChange}
                      min="0"
                      max="5000"
                      step="1"
                    />
                    <span className="field-label">Public transport (km per month)</span>
                  </div>
                  <div className="form-field">
                    <input
                      type="number"
                      name="flights"
                      placeholder="0"
                      value={formData.flights}
                      onChange={handleChange}
                      min="0"
                      max="20"
                      step="1"
                    />
                    <span className="field-label">Flights (per month)</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Energy</label>
                <div className="form-row">
                  <div className="form-field">
                    <input
                      type="number"
                      name="electricityKwh"
                      placeholder="0"
                      value={formData.electricityKwh}
                      onChange={handleChange}
                      min="0"
                      max="2000"
                      step="1"
                    />
                    <span className="field-label">Electricity (kWh per month)</span>
                  </div>
                  <div className="form-field">
                    <input
                      type="number"
                      name="lpgCylinders"
                      placeholder="0"
                      value={formData.lpgCylinders}
                      onChange={handleChange}
                      min="0"
                      max="10"
                      step="0.1"
                    />
                    <span className="field-label">LPG cylinders (per month)</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Food</label>
                <div className="form-row">
                  <div className="form-field">
                    <input
                      type="number"
                      name="meatMeals"
                      placeholder="0"
                      value={formData.meatMeals}
                      onChange={handleChange}
                      min="0"
                      max="90"
                      step="1"
                    />
                    <span className="field-label">Meat meals (per week)</span>
                  </div>
                  <div className="form-field">
                    <input
                      type="number"
                      name="vegetarianMeals"
                      placeholder="0"
                      value={formData.vegetarianMeals}
                      onChange={handleChange}
                      min="0"
                      max="90"
                      step="1"
                    />
                    <span className="field-label">Vegetarian meals (per week)</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Waste</label>
                <div className="form-row">
                  <div className="form-field">
                    <input
                      type="number"
                      name="plasticItems"
                      placeholder="0"
                      value={formData.plasticItems}
                      onChange={handleChange}
                      min="0"
                      max="500"
                      step="1"
                    />
                    <span className="field-label">Plastic items (per week)</span>
                  </div>
                  <div className="form-field">
                    <input
                      type="number"
                      name="recyclingRate"
                      placeholder="50"
                      value={formData.recyclingRate}
                      onChange={handleChange}
                      min="0"
                      max="100"
                    />
                    <span className="field-label">Recycling rate (%)</span>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Calculating...' : 'Calculate Carbon Footprint'}
              </button>
            </form>

            {error && <div className="alert alert-error">{error}</div>}
          </div>

          <div className="carbon-results-section">
            {result && (
              <div className="result-card">
                <h2>Your Carbon Footprint</h2>
                <div className="score-display" style={{ borderColor: getScoreColor(result.score) }}>
                  <div className="score-value" style={{ color: getScoreColor(result.score) }}>
                    {result.score}/100
                  </div>
                  <div className="score-label">Sustainability Score</div>
                </div>

                <div className="emission-total">
                  <div className="emission-value">{result.totalEmissions.toFixed(2)}</div>
                  <div className="emission-unit">kg CO₂ equivalent (per month)</div>
                </div>

                <div className="category-breakdown">
                  <h3>Breakdown by Category</h3>
                  <div className="breakdown-item">
                    <span>Transportation</span>
                    <span>{result.categoryBreakdown.transportation.toFixed(2)} kg</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Energy</span>
                    <span>{result.categoryBreakdown.energy.toFixed(2)} kg</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Food</span>
                    <span>{result.categoryBreakdown.food.toFixed(2)} kg</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Waste</span>
                    <span>{result.categoryBreakdown.waste.toFixed(2)} kg</span>
                  </div>
                </div>

                <div className="feedback-section">
                  <h3>Feedback</h3>
                  <p className="feedback-text">{result.feedback}</p>
                </div>

                {result.recommendations && result.recommendations.length > 0 && (
                  <div className="recommendations-section">
                    <h3>Recommendations</h3>
                    <ul className="recommendations-list">
                      {result.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {predictions && predictions.predictedYearly > 0 && (
              <div className="prediction-card">
                <h2>Future Impact Prediction</h2>
                <p className="prediction-subtitle">
                  Based on your current usage patterns, here's your projected impact:
                </p>

                <div className="prediction-metrics">
                  <div className="metric">
                    <div className="metric-value">{predictions.predictedYearly.toFixed(0)}</div>
                    <div className="metric-label">kg CO₂ per year</div>
                  </div>
                  <div className="metric">
                    <div className="metric-value">{predictions.treesNeeded}</div>
                    <div className="metric-label">trees needed to offset</div>
                  </div>
                  <div className="metric">
                    <div className="metric-value">{predictions.equivalentCars}</div>
                    <div className="metric-label">equivalent cars</div>
                  </div>
                </div>

                <div className="trend-indicator">
                  <span className={`trend-badge trend-${predictions.trend}`}>
                    {predictions.trend === 'increasing' ? '📈 Increasing' : 
                     predictions.trend === 'decreasing' ? '📉 Decreasing' : '➡️ Stable'}
                  </span>
                  <span className="confidence">Confidence: {predictions.confidence}</span>
                </div>
              </div>
            )}

            {stats && (
              <div className="stats-card">
                <h2>Your Statistics</h2>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-value">{stats.totalEntries}</div>
                    <div className="stat-label">Total Entries</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{stats.averageMonthly?.toFixed(1)}</div>
                    <div className="stat-label">Avg Monthly (kg)</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{stats.latestScore}</div>
                    <div className="stat-label">Latest Score</div>
                  </div>
                </div>
              </div>
            )}

            {rankings && rankings.rankings && rankings.rankings.length > 0 && (
              <div className="rankings-card">
                <h2>Weekly Leaderboard</h2>
                <p className="rankings-subtitle">
                  Week of {rankings.week ? new Date(rankings.week).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Current Week'}
                </p>
                {rankings.userRank && (
                  <div className="user-rank-badge">
                    Your Rank: <strong>#{rankings.userRank}</strong> out of {rankings.totalParticipants}
                  </div>
                )}
                <div className="rankings-list">
                  {rankings.rankings.slice(0, 10).map((entry) => (
                    <div key={entry.userId} className={`ranking-item ${entry.userId === rankings.userRank ? 'user-rank' : ''}`}>
                      <div className="rank-number">#{entry.rank}</div>
                      <div className="rank-info">
                        <div className="rank-name">{entry.userName}</div>
                        <div className="rank-score">Score: {entry.score}/100</div>
                      </div>
                      <div className="rank-emissions">{entry.totalEmissions.toFixed(1)} kg</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {monthlyRewards && monthlyRewards.userReward && (
              <div className="rewards-card">
                <h2>Monthly Rewards</h2>
                <p className="rewards-subtitle">Month: {monthlyRewards.month}</p>
                <div className={`reward-tier tier-${monthlyRewards.userReward.tier || 'none'}`}>
                  {monthlyRewards.userReward.tier ? (
                    <>
                      <div className="tier-icon">
                        {monthlyRewards.userReward.tier === 'gold' && '🥇'}
                        {monthlyRewards.userReward.tier === 'silver' && '🥈'}
                        {monthlyRewards.userReward.tier === 'bronze' && '🥉'}
                      </div>
                      <div className="tier-info">
                        <div className="tier-name">{monthlyRewards.userReward.tier.toUpperCase()} Tier</div>
                        <div className="tier-rank">Rank: #{monthlyRewards.userReward.rank}</div>
                        <div className="tier-score">Avg Score: {monthlyRewards.userReward.averageScore}/100</div>
                        <div className="tier-entries">{monthlyRewards.userReward.entryCount} weekly entries</div>
                      </div>
                    </>
                  ) : (
                    <div className="tier-info">
                      <div className="tier-name">Keep Going!</div>
                      <div className="tier-rank">Rank: #{monthlyRewards.userReward.rank}</div>
                      <div className="tier-score">Avg Score: {monthlyRewards.userReward.averageScore}/100</div>
                      <div className="tier-entries">{monthlyRewards.userReward.entryCount} weekly entries</div>
                    </div>
                  )}
                </div>
                {monthlyRewards.topUsers && monthlyRewards.topUsers.length > 0 && (
                  <div className="top-users">
                    <h3>Top Performers This Month</h3>
                    <div className="top-users-list">
                      {monthlyRewards.topUsers.slice(0, 5).map((user) => (
                        <div key={user.userId} className="top-user-item">
                          <span className="top-user-rank">#{user.rank}</span>
                          <span className="top-user-name">{user.userName}</span>
                          <span className="top-user-score">{user.averageScore}/100</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .carbon-emission {
          padding: 40px 0;
          min-height: 80vh;
        }
        .page-subtitle {
          color: var(--color-ink-muted);
          margin-bottom: 32px;
          font-size: 1.1rem;
        }
        .alert {
          padding: 16px;
          border-radius: var(--radius);
          margin-bottom: 24px;
        }
        .alert-info {
          background: #dbeafe;
          color: #1e40af;
          border: 1px solid #93c5fd;
        }
        .alert-error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
          margin-top: 16px;
        }
        .alert-warning {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fcd34d;
          margin-bottom: 24px;
        }
        .carbon-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-top: 32px;
        }
        @media (max-width: 968px) {
          .carbon-layout {
            grid-template-columns: 1fr;
          }
        }
        .carbon-form-section {
          background: white;
          padding: 32px;
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
        }
        .carbon-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .form-group label {
          font-weight: 600;
          color: var(--color-earth-800);
          font-size: 1.1rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .form-field input {
          padding: 10px 12px;
          border: 1px solid var(--color-earth-300);
          border-radius: var(--radius);
          font-size: 1rem;
        }
        .form-field input:focus {
          outline: none;
          border-color: var(--color-earth-600);
        }
        .field-label {
          font-size: 0.85rem;
          color: var(--color-ink-muted);
        }
        .btn-primary {
          background: var(--color-earth-600);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: var(--radius);
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-primary:hover {
          background: var(--color-earth-700);
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .carbon-results-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .result-card, .prediction-card, .stats-card, .rankings-card, .rewards-card {
          background: white;
          padding: 32px;
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
        }
        .result-card h2, .prediction-card h2, .stats-card h2, .rankings-card h2, .rewards-card h2 {
          margin-bottom: 24px;
          color: var(--color-earth-800);
        }
        .score-display {
          text-align: center;
          padding: 24px;
          border: 3px solid;
          border-radius: var(--radius);
          margin-bottom: 24px;
        }
        .score-value {
          font-size: 3rem;
          font-weight: 700;
        }
        .score-label {
          color: var(--color-ink-muted);
          margin-top: 8px;
        }
        .emission-total {
          text-align: center;
          padding: 20px;
          background: var(--color-earth-100);
          border-radius: var(--radius);
          margin-bottom: 24px;
        }
        .emission-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--color-earth-800);
        }
        .emission-unit {
          color: var(--color-ink-muted);
          margin-top: 4px;
        }
        .category-breakdown {
          margin-bottom: 24px;
        }
        .category-breakdown h3 {
          font-size: 1.1rem;
          margin-bottom: 12px;
          color: var(--color-earth-700);
        }
        .breakdown-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid var(--color-earth-200);
        }
        .breakdown-item:last-child {
          border-bottom: none;
        }
        .feedback-section, .recommendations-section {
          margin-top: 24px;
        }
        .feedback-section h3, .recommendations-section h3 {
          font-size: 1.1rem;
          margin-bottom: 12px;
          color: var(--color-earth-700);
        }
        .feedback-text {
          color: var(--color-ink-muted);
          line-height: 1.6;
        }
        .recommendations-list {
          list-style: none;
          padding: 0;
        }
        .recommendations-list li {
          padding: 8px 0;
          padding-left: 24px;
          position: relative;
          color: var(--color-ink-muted);
        }
        .recommendations-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: var(--color-earth-600);
          font-weight: bold;
        }
        .prediction-subtitle {
          color: var(--color-ink-muted);
          margin-bottom: 20px;
        }
        .prediction-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }
        @media (max-width: 640px) {
          .prediction-metrics {
            grid-template-columns: 1fr;
          }
        }
        .metric {
          text-align: center;
          padding: 16px;
          background: var(--color-earth-50);
          border-radius: var(--radius);
        }
        .metric-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--color-earth-800);
        }
        .metric-label {
          font-size: 0.85rem;
          color: var(--color-ink-muted);
          margin-top: 4px;
        }
        .trend-indicator {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid var(--color-earth-200);
        }
        .trend-badge {
          padding: 6px 12px;
          border-radius: var(--radius);
          font-weight: 600;
        }
        .trend-increasing {
          background: #fee2e2;
          color: #991b1b;
        }
        .trend-decreasing {
          background: #d1fae5;
          color: #065f46;
        }
        .trend-stable {
          background: #e0e7ff;
          color: #3730a3;
        }
        .confidence {
          font-size: 0.9rem;
          color: var(--color-ink-muted);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .stat-item {
          text-align: center;
          padding: 16px;
          background: var(--color-earth-50);
          border-radius: var(--radius);
        }
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-earth-800);
        }
        .stat-label {
          font-size: 0.85rem;
          color: var(--color-ink-muted);
          margin-top: 4px;
        }
        .rankings-subtitle, .rewards-subtitle {
          color: var(--color-ink-muted);
          font-size: 0.9rem;
          margin-bottom: 16px;
        }
        .user-rank-badge {
          background: var(--color-earth-100);
          padding: 12px 16px;
          border-radius: var(--radius);
          margin-bottom: 20px;
          text-align: center;
          font-weight: 600;
          color: var(--color-earth-800);
        }
        .rankings-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .ranking-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px;
          background: var(--color-earth-50);
          border-radius: var(--radius);
          border: 2px solid transparent;
        }
        .ranking-item.user-rank {
          border-color: var(--color-earth-600);
          background: var(--color-earth-100);
        }
        .rank-number {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--color-earth-700);
          min-width: 40px;
        }
        .rank-info {
          flex: 1;
        }
        .rank-name {
          font-weight: 600;
          color: var(--color-earth-800);
        }
        .rank-score {
          font-size: 0.85rem;
          color: var(--color-ink-muted);
        }
        .rank-emissions {
          font-weight: 600;
          color: var(--color-earth-700);
        }
        .reward-tier {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
          border-radius: var(--radius);
          margin-bottom: 24px;
        }
        .tier-gold {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 2px solid #f59e0b;
        }
        .tier-silver {
          background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
          border: 2px solid #6b7280;
        }
        .tier-bronze {
          background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
          border: 2px solid #d97706;
        }
        .tier-none {
          background: var(--color-earth-50);
          border: 2px solid var(--color-earth-300);
        }
        .tier-icon {
          font-size: 3rem;
        }
        .tier-info {
          flex: 1;
        }
        .tier-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-earth-800);
          margin-bottom: 8px;
        }
        .tier-rank, .tier-score, .tier-entries {
          font-size: 0.95rem;
          color: var(--color-ink-muted);
          margin-top: 4px;
        }
        .top-users {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid var(--color-earth-200);
        }
        .top-users h3 {
          font-size: 1.1rem;
          margin-bottom: 16px;
          color: var(--color-earth-700);
        }
        .top-users-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .top-user-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          background: var(--color-earth-50);
          border-radius: var(--radius);
        }
        .top-user-rank {
          font-weight: 700;
          color: var(--color-earth-700);
          min-width: 30px;
        }
        .top-user-name {
          flex: 1;
          font-weight: 500;
        }
        .top-user-score {
          font-weight: 600;
          color: var(--color-earth-700);
        }
      `}</style>
    </div>
  );
}

