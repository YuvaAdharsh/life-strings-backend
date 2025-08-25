Life Strings – Resilience Assessment Backend

Life Strings Backend is a Node.js/Express API designed to power the Life Strings resilience assessment tool. It enables feedback collection, real-time analytics, and secure data management to evaluate psychological resilience. The system is lightweight, file-based, and easy to deploy with built-in health monitoring and admin endpoints.

✨ Features
📝 Feedback Management

Submit and validate user feedback

Support for experience ratings: excellent, good, average, poor

Store feedback with resilience score, improvements, and metadata

📊 Analytics & Insights

Aggregated statistics: total submissions, average scores, experience breakdown

Real-time tracking of resilience assessments

Common improvement suggestions extraction

Export analytics as CSV or JSON

🔒 Secure Access

Admin-only endpoints protected with auth token

Role-based feedback access for monitoring & export

CORS support for frontend integration

🔍 System Health

/health endpoint for server uptime and status monitoring

🛠 Tech Stack

Runtime: Node.js (≥14.0.0)
Framework: Express.js
Storage: File-based JSON (no external DB required)
Dependencies: express, cors
Dev Tools: nodemon

🚀 Quick Start
Prerequisites

Node.js v14.0.0 or higher

npm or yarn package manager

Installation
git clone https://github.com/yuvaadharsh/life-strings-backend.git
cd life-strings-backend
npm install

Configuration

Copy environment variables and configure:

cp .env.example .env


Update .env:

PORT=3000  
NODE_ENV=production  
CORS_ORIGIN=https://yuvaadharsh.github.io  
AUTH_TOKEN=your-secure-auth-token  

Run Server

Development:

npm run dev


Production:

npm start


Server runs on http://localhost:3000
 (or configured port).

📂 Project Structure
life-strings-backend/
├── data/                 # JSON data storage
├── server.js             # Main server file
├── package.json          # Dependencies & scripts
├── .env                  # Environment variables
└── README.md             # Documentation

📊 Data Handling
Feedback Data

ID, Name (optional), Email (optional)

Experience rating

Feedback text & suggested improvements

Resilience score (optional)

Metadata: timestamp, IP, user agent

Analytics Data

Total submissions

Average resilience score

Experience distribution

Common improvement keywords

Last updated timestamp

🔗 API Overview

Public Endpoints

GET /health → Server status

POST /api/feedback → Submit feedback

GET /api/analytics → Get aggregated insights

Protected Endpoints (Auth Required)

GET /api/feedback/all → View all feedback

GET /api/export/csv → Export all feedback as CSV

📈 Future Enhancements

Migration from file-based storage to database (MongoDB/Postgres)

Admin dashboard for analytics visualization

Email notifications for new submissions

Extended authentication (JWT, role-based access)

Scalable deployment with Docker/Kubernetes


