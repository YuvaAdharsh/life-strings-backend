Life Strings Backend API
A Node.js/Express backend API for the Life Strings resilience assessment tool. This API handles feedback collection, analytics tracking, and data management for psychological resilience assessments.
Features

✅ Feedback submission and validation
📊 Real-time analytics tracking
🔒 Basic authentication for admin endpoints
📈 Resilience score averaging
📋 CSV data export functionality
🌐 CORS support for frontend integration
💾 File-based JSON data storage
🔍 Health monitoring endpoint

Tech Stack

Runtime: Node.js (≥14.0.0)
Framework: Express.js
Storage: File-based JSON storage
Dependencies: cors, express
Dev Tools: nodemon

Quick Start
Prerequisites

Node.js (version 14.0.0 or higher)
npm or yarn package manager

Installation

Clone the repository:

bashgit clone https://github.com/yuvaadharsh/life-strings-backend.git
cd life-strings-backend

Install dependencies:

bashnpm install

Configure environment variables:

bashcp .env.example .env
# Edit .env with your settings

Start the development server:

bashnpm run dev
Or start in production mode:
bashnpm start
The server will start on port 3000 (or the port specified in your environment variables).
Environment Configuration
Create a .env file in the root directory:
envPORT=3000
NODE_ENV=production
CORS_ORIGIN=https://yuvaadharsh.github.io
AUTH_TOKEN=your-secure-auth-token-here
API Endpoints
Public Endpoints
Health Check
httpGET /health
Returns server status and timestamp.
Submit Feedback
httpPOST /api/feedback
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "experience": "excellent",
  "feedback": "Great tool for resilience assessment...",
  "improvements": "Could use more detailed explanations",
  "resilienceScore": 75
}
Experience Options: excellent, good, average, poor
Get Analytics
httpGET /api/analytics
Returns aggregated analytics data including total submissions, average scores, and experience ratings.
Protected Endpoints
These endpoints require authentication via the Authorization header:
Get All Feedback
httpGET /api/feedback/all
Authorization: Bearer your-secret-token-here
Export Feedback as CSV
httpGET /api/export/csv
Authorization: Bearer your-secret-token-here
Data Storage
The API uses file-based JSON storage in the data/ directory:

data/feedback.json - Stores all feedback submissions
data/analytics.json - Stores aggregated analytics data

Feedback Data Structure
json{
  "id": "unique-feedback-id",
  "name": "User Name",
  "email": "user@example.com",
  "experience": "excellent",
  "feedback": "User feedback text",
  "improvements": "Suggested improvements",
  "resilienceScore": 75,
  "timestamp": "2025-01-15T10:30:00.000Z",
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0..."
}
Analytics Data Structure
json{
  "totalSubmissions": 150,
  "averageScore": 68,
  "experienceRatings": {
    "excellent": 45,
    "good": 60,
    "average": 35,
    "poor": 10
  },
  "commonImprovements": ["interface", "questions", "results"],
  "lastUpdated": "2025-01-15T10:30:00.000Z"
}
API Response Format
All endpoints return JSON responses in this format:
Success Response
json{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ }
}
Error Response
json{
  "success": false,
  "error": "Error description"
}
Validation Rules
Feedback Validation

experience: Must be one of: excellent, good, average, poor
feedback: Required, 10-2000 characters
name: Optional, defaults to "Anonymous"
email: Optional
resilienceScore: Optional integer
improvements: Optional string

Development
Available Scripts

npm start - Start production server
npm run dev - Start development server with nodemon
npm test - Run tests (not implemented)

Project Structure
life-strings-backend/
├── data/                 # JSON data storage
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
├── .env                # Environment variables
└── README.md           # This file
Deployment
Environment Setup

Set NODE_ENV=production in your environment
Configure CORS_ORIGIN to match your frontend domain
Set a secure AUTH_TOKEN for protected endpoints
Ensure the server has write permissions to the data/ directory

Recommended Hosting Platforms

Heroku: Easy deployment with git integration
Railway: Modern platform with simple setup
DigitalOcean App Platform: Scalable with database options
AWS EC2: Full control and customization
Vercel: Serverless deployment (may require modifications)

Security Considerations
⚠️ Important Security Notes:

Authentication: Currently uses basic token authentication. Consider implementing JWT or OAuth for production.
Rate Limiting: Not implemented. Consider adding rate limiting for production use.
Input Sanitization: Basic validation is in place, but consider additional sanitization.
HTTPS: Ensure HTTPS is enabled in production.
Environment Variables: Keep .env file secure and never commit it to version control.

CORS Configuration
The API is configured to accept requests from:

http://localhost:3000 (development)
Your GitHub Pages URL (as specified in CORS_ORIGIN)

Update the CORS configuration in server.js for additional domains.
Monitoring and Logging

Server logs include feedback submissions with scores
Health check endpoint for uptime monitoring
Error logging for debugging
Analytics tracking for usage insights

Contributing

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

License
This project is licensed under the MIT License - see the LICENSE file for details.
Support
For support and questions:

Create an issue on GitHub
Check the health endpoint for server status
Review server logs for debugging information

Changelog
v1.0.0

Initial release
Feedback collection and storage
Basic analytics tracking
CSV export functionality
Health monitoring
