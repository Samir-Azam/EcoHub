# EcoHub - Sustainability Marketplace

EcoHub is a curated marketplace and community platform dedicated to eco-friendly living. It connects conscious consumers with sustainable brands that prioritize ethical production, mineral packaging (cans, paper), and environmental responsibility.

## 🌿 Overview

Traditional shopping makes it difficult to verify a brand's actual sustainability impact. EcoHub simplifies this by vetting brands and products, providing a transparent marketplace where every choice is a step towards a greener planet.

## 🚀 Core Features

### 🛍️ Sustainable Marketplace
- **Product Discovery**: Browse a wide range of vetted eco-friendly products.
- **Brand Profiles**: Learn about the sustainability practices of various brands.
- **Categorization**: Find products by categories like Household, Personal Care, and more.

### 📉 Carbon Emission Calculator
- **Track Your Impact**: Input your daily activities (transportation, energy, food, waste) to calculate your monthly carbon footprint.
- **Sustainability Score**: Receive a score based on your data to understand how you compare to environmental benchmarks.
- **ML Predictions**: Get projected yearly emissions and trend analysis based on your historical data.
- **Actionable Insights**: Receive personalized feedback and recommendations to reduce your environmental impact.

### 🔐 User Management
- **Secure Authentication**: Register and log in to save your carbon footprint data and track your journey over time.
- **Track Progress**: View your statistics and trends via a personalized dashboard.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Vanilla CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Deployment & Architecture**: MERN Stack

## 📁 Project Structure

```text
ai-web-platform/
├── backend/            # Express.js server and API
│   ├── data/           # Seed data for brands and products
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints (Auth, Products, Brands, Carbon)
│   ├── scripts/        # Seeding and verification scripts
│   └── server.js       # Entry point
├── frontend/           # React.js client
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Main view pages
│   │   └── api.js      # Backend API integration
│   └── vite.config.js  # Vite configuration
└── README.md           # Project documentation
```

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ai-web-platform
   ```

2. **Install dependencies for all components:**
   ```bash
   npm run install:all
   ```

### Environment Setup

#### Backend (`/backend/.env`)
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

#### Frontend (`/frontend/.env`)
Vite proxies `/api` to the backend during development. No specific env vars are required for local dev unless changing the proxy.

### Running the Application

1. **Seed the database (Optional):**
   ```bash
   npm run seed
   ```

2. **Start the Development Servers (Frontend & Backend):**
   ```bash
   npm run dev
   ```
   - Frontend will be available at: `http://localhost:3000`
   - Backend API will be available at: `http://localhost:5000`

## 📊 Available Scripts

- `npm run install:all`: Installs dependencies for root, backend, and frontend.
- `npm run seed`: Populates the database with initial brand and product data.
- `npm run backend`: Runs the backend server in dev mode.
- `npm run frontend`: Runs the frontend application in dev mode.
- `npm run dev`: Runs both frontend and backend concurrently.

---
*Built with ❤️ for a sustainable future.*
