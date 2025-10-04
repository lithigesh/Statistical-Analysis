# Statistical Analysis and Probability Tools - Lab 2

## Lab -2				
**Note:**
1. Lab2 should use responsive HTML, ReactJS, JSON, NodeJS
2. The topic should be related to mathematics 
   - It should not be just addition, subtraction
   - The application chosen should be from Set-1/Set-2 attached
3. It should have more than one web page. The output should come on the webpage
4. It should have visualisation part.
5. Make sure you are not repeating the other student work in the class.

**Total Mark: 25 Mark**

---

## About the use case: --3 Mark

This Statistical Analysis and Probability Tools application is a comprehensive web-based platform designed for performing advanced mathematical computations in statistics and probability theory. The application provides interactive tools for data analysis, statistical hypothesis testing, and regression modeling.

**Key Features:**
- **Interactive Dashboard:** Real-time analytics showing usage statistics and saved analyses
- **Distribution Plotting:** Visualizes probability distributions (Normal, Binomial, Poisson, Exponential) with customizable parameters
- **Hypothesis Testing:** Performs statistical significance tests (t-tests, z-tests) with detailed result interpretation
- **Regression Analysis:** Linear regression modeling with correlation analysis and predictive capabilities
- **Database Integration:** MongoDB persistence for saving and retrieving analysis results
- **Responsive Design:** Black and white professional theme optimized for all devices

The application addresses real-world statistical analysis needs commonly found in research, quality control, financial modeling, and data science applications.

---

## Technology used: --2 Mark

**Frontend Technologies:**
- **ReactJS 18.3.1:** Component-based UI framework for interactive user interfaces
- **Vite 7.1.9:** Modern build tool for fast development and optimized production builds
- **Chart.js 4.5.0:** Powerful charting library for statistical visualizations
- **Tailwind CSS 4.1.14:** Utility-first CSS framework for responsive design
- **React Router DOM:** Client-side routing for multiple pages

**Backend Technologies:**
- **Node.js:** JavaScript runtime for server-side development
- **Express.js 4.19.2:** Web application framework for RESTful APIs
- **MongoDB 6.20.0:** NoSQL database for data persistence
- **Mongoose 8.19.0:** Object Document Mapper (ODM) for MongoDB

**Development Tools:**
- **Nodemon:** Auto-restart server during development
- **CORS:** Cross-Origin Resource Sharing middleware
- **dotenv:** Environment variable management

---

## How it is different from existing works from internet: --3 Mark

| Reference URL/Product | How it is different |
|----------------------|-------------------|
| **R Studio / SPSS Online** | Our application provides a lightweight, web-based alternative that doesn't require software installation. It features a clean black-and-white UI design and real-time visualization updates, unlike traditional statistical software with complex interfaces. |
| **GraphPad Prism / Minitab** | Unlike expensive commercial statistical software, our tool is completely free and open-source. It integrates multiple statistical functions (distributions, hypothesis testing, regression) in a single platform with MongoDB persistence, whereas most tools focus on specific statistical areas. |
| **Python Matplotlib/Scipy Online Tools** | Our application provides a user-friendly GUI interface that doesn't require programming knowledge. It offers instant visual feedback and automatic result interpretation, making statistical analysis accessible to non-programmers compared to code-based solutions. |
| **Excel Statistical Functions** | Our tool provides more advanced statistical computations with proper mathematical foundations. It offers interactive parameter adjustment with real-time chart updates and comprehensive hypothesis test interpretations that Excel's basic functions lack. |
| **Online Calculators (Calculator.net, etc.)** | Our application combines multiple statistical tools in one integrated platform with data persistence capabilities. It provides detailed result explanations, professional visualizations, and the ability to save/retrieve previous analyses, unlike simple online calculators. |

---

## Functionalities implemented: ---17 Mark

### 1. **Dashboard Analytics (3 marks)**
**Description:** Interactive dashboard displaying comprehensive statistics about user activities and database analytics.

**Features:**
- Real-time statistics cards showing total analyses, distribution plots, hypothesis tests, and regression analyses
- Recent activity tracking (last 7 days)
- Database information display
- Quick action buttons for navigation
- Alternating black and white card design for visual appeal

**Technical Implementation:**
- React hooks for state management
- RESTful API endpoint `/api/dashboard/stats`
- MongoDB aggregation queries for statistics calculation
- Responsive grid layout

**Output:** Dashboard displays statistical summaries with professional black and white themed cards showing analysis counts and recent activity metrics.

---

### 2. **Probability Distribution Plotter (4 marks)**
**Description:** Interactive tool for visualizing various probability distributions with customizable parameters.

**Supported Distributions:**
- **Normal Distribution:** Mean and standard deviation parameters
- **Binomial Distribution:** Number of trials (n) and probability of success (p)
- **Poisson Distribution:** Lambda (rate) parameter
- **Exponential Distribution:** Lambda (rate) parameter

**Features:**
- Real-time parameter adjustment with instant chart updates
- Professional Chart.js visualizations
- Save analysis to database with success notifications
- View previously saved distribution analyses
- Responsive design with black and white theme

**Technical Implementation:**
- Mathematical probability density/mass function calculations
- Chart.js integration for smooth visualizations
- MongoDB schema for analysis persistence
- React state management for real-time updates

**Output:** Interactive charts displaying probability distribution curves with customizable parameters. Users can generate distributions and save them to database with visual confirmation.

---

### 3. **Statistical Hypothesis Testing (4 marks)**
**Description:** Comprehensive hypothesis testing tool supporting various statistical tests with detailed result interpretation.

**Supported Tests:**
- **One-sample t-test:** Testing sample mean against population mean
- **One-sample z-test:** Testing with known population variance
- **Two-tailed and one-tailed tests:** Comprehensive significance testing

**Features:**
- Input validation for sample data and parameters
- Automatic test statistic calculation
- P-value computation and interpretation
- Critical value determination
- Confidence interval estimation
- Decision making (Reject/Fail to reject null hypothesis)
- Save test results with detailed metadata

**Statistical Calculations:**
- Sample mean and standard deviation
- Standard error computation
- T-statistic and Z-statistic calculation
- Degrees of freedom determination
- Two-tailed and one-tailed p-value calculation

**Output:** Detailed statistical test results including test statistics, p-values, confidence intervals, and clear interpretation of whether to reject or fail to reject the null hypothesis.

---

### 4. **Linear Regression Analysis (3 marks)**
**Description:** Complete linear regression modeling tool with correlation analysis and predictive capabilities.

**Features:**
- Scatter plot visualization with regression line
- Regression coefficient calculation (slope and intercept)
- R-squared (coefficient of determination) computation
- Correlation coefficient analysis
- Residual analysis capabilities
- Save regression models to database
- Interactive data input with validation

**Statistical Computations:**
- Least squares regression line fitting
- Pearson correlation coefficient
- Coefficient of determination (R²)
- Standard error of regression
- Regression equation generation

**Visualization:**
- Interactive scatter plots with Chart.js
- Regression line overlay
- Professional black and white styling
- Responsive chart design

**Output:** Scatter plot with fitted regression line, statistical coefficients (slope, intercept, R²), correlation analysis, and regression equation for predictive modeling.

---

### 5. **Database Integration & Persistence (2 marks)**
**Description:** Complete MongoDB integration for saving and retrieving statistical analyses.

**Database Features:**
- **Analysis Storage:** Save distribution analyses, hypothesis tests, and regression models
- **Metadata Tracking:** Timestamps, analysis types, and parameter storage
- **User Session Management:** Track user activities and analysis history
- **Data Retrieval:** View previously saved analyses with detailed information
- **Statistics Aggregation:** Dashboard analytics from stored data

**Database Schema:**
- DistributionAnalysis collection with parameters and results
- HypothesisTest collection with test details and outcomes
- RegressionAnalysis collection with model coefficients and statistics
- Dataset collection for data management
- UserSession collection for activity tracking

**Output:** Persistent storage of all analyses with ability to retrieve and view historical data. Success notifications confirm database operations.

---

### 6. **Responsive UI/UX Design (1 mark)**
**Description:** Professional black and white theme with responsive design principles.

**Design Features:**
- **Black & White Theme:** Professional monochrome design
- **Success Notifications:** Visual feedback for database operations
- **Loading States:** Professional loading indicators
- **Mobile Responsive:** Optimized for all device sizes
- **Navigation System:** Multi-page application with React Router
- **Form Validation:** Input validation with error handling
- **Accessibility:** High contrast design for better readability

**Technical Implementation:**
- Tailwind CSS for responsive design
- React Router for navigation
- State management for UI interactions
- Component-based architecture
- Professional typography and spacing

**Output:** Clean, professional interface that works seamlessly across desktop, tablet, and mobile devices with intuitive navigation and clear visual feedback.

---

## Technical Architecture

**Frontend Structure:**
```
client/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── DistributionPlotter.jsx
│   │   ├── HypothesisTest.jsx
│   │   ├── RegressionAnalysis.jsx
│   │   └── Navigation.jsx
│   ├── App.jsx
│   └── main.jsx
└── public/
```

**Backend Structure:**
```
server/
├── src/
│   ├── models/
│   │   └── Analysis.js
│   ├── config/
│   │   └── database.js
│   └── index.js
└── package.json
```

**API Endpoints:**
- `GET /api/normal-distribution` - Normal distribution data
- `GET /api/binomial-distribution` - Binomial distribution data
- `GET /api/poisson-distribution` - Poisson distribution data
- `GET /api/exponential-distribution` - Exponential distribution data
- `POST /api/hypothesis-test` - Hypothesis testing
- `POST /api/regression` - Regression analysis
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/analyses/*` - Retrieve saved analyses

---

## Key Mathematical Implementations

**1. Statistical Functions:**
- Normal PDF: `f(x) = (1/σ√(2π)) * e^(-½((x-μ)/σ)²)`
- Binomial PMF: `P(X=k) = C(n,k) * p^k * (1-p)^(n-k)`
- Poisson PMF: `P(X=k) = (λ^k * e^(-λ)) / k!`
- Exponential PDF: `f(x) = λ * e^(-λx)`

**2. Hypothesis Testing:**
- T-statistic: `t = (x̄ - μ) / (s/√n)`
- Z-statistic: `z = (x̄ - μ) / (σ/√n)`
- P-value calculation using statistical distributions

**3. Regression Analysis:**
- Slope: `β₁ = Σ[(xi - x̄)(yi - ȳ)] / Σ[(xi - x̄)²]`
- Intercept: `β₀ = ȳ - β₁x̄`
- R-squared: `R² = 1 - (SSres/SStot)`

---

## Installation and Setup

**Prerequisites:**
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Git

**Installation Steps:**
1. Clone the repository
2. Install backend dependencies: `cd server && npm install`
3. Install frontend dependencies: `cd client && npm install`
4. Set up MongoDB connection in `.env` file
5. Start backend server: `npm run dev` (port 3001)
6. Start frontend server: `npm run dev` (port 5173)

**Access URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Dashboard: http://localhost:5173/ (default route)
- Distribution Plotter: http://localhost:5173/distributions
- Hypothesis Testing: http://localhost:5173/hypothesis-testing
- Regression Analysis: http://localhost:5173/regression

---

**Code Files:** Will be collected in person
