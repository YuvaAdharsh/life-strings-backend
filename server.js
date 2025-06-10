// server.js - Life Strings Backend API
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://yourusername.github.io'], // Add your GitHub Pages URL
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Data storage paths
const DATA_DIR = path.join(__dirname, 'data');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

// Ensure data directory and files exist
async function initializeStorage() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        
        // Initialize feedback file if it doesn't exist
        try {
            await fs.access(FEEDBACK_FILE);
        } catch {
            await fs.writeFile(FEEDBACK_FILE, JSON.stringify({ feedback: [] }, null, 2));
        }
        
        // Initialize analytics file if it doesn't exist
        try {
            await fs.access(ANALYTICS_FILE);
        } catch {
            await fs.writeFile(ANALYTICS_FILE, JSON.stringify({ 
                totalSubmissions: 0,
                averageScore: 0,
                experienceRatings: {},
                commonImprovements: [],
                lastUpdated: new Date().toISOString()
            }, null, 2));
        }
        
        console.log('✅ Storage initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize storage:', error);
    }
}

// Helper functions
async function readJsonFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return null;
    }
}

async function writeJsonFile(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        return false;
    }
}

// Validation middleware
function validateFeedback(req, res, next) {
    const { experience, feedback } = req.body;
    
    if (!experience || !feedback) {
        return res.status(400).json({
            success: false,
            error: 'Experience rating and feedback are required'
        });
    }
    
    const validExperiences = ['excellent', 'good', 'average', 'poor'];
    if (!validExperiences.includes(experience)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid experience rating'
        });
    }
    
    if (feedback.length < 10 || feedback.length > 2000) {
        return res.status(400).json({
            success: false,
            error: 'Feedback must be between 10 and 2000 characters'
        });
    }
    
    next();
}

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'Life Strings API'
    });
});

// Submit feedback endpoint
app.post('/api/feedback', validateFeedback, async (req, res) => {
    try {
        const feedbackData = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: req.body.name || 'Anonymous',
            email: req.body.email || null,
            experience: req.body.experience,
            feedback: req.body.feedback,
            improvements: req.body.improvements || '',
            resilienceScore: parseInt(req.body.resilienceScore) || null,
            timestamp: new Date().toISOString(),
            ipAddress: req.ip || 'unknown',
            userAgent: req.headers['user-agent'] || 'unknown'
        };
        
        // Read existing feedback
        const feedbackFile = await readJsonFile(FEEDBACK_FILE);
        if (!feedbackFile) {
            return res.status(500).json({
                success: false,
                error: 'Failed to read feedback data'
            });
        }
        
        // Add new feedback
        feedbackFile.feedback.push(feedbackData);
        
        // Save updated feedback
        const saved = await writeJsonFile(FEEDBACK_FILE, feedbackFile);
        if (!saved) {
            return res.status(500).json({
                success: false,
                error: 'Failed to save feedback'
            });
        }
        
        // Update analytics
        await updateAnalytics(feedbackData);
        
        console.log(`📝 New feedback received from ${feedbackData.name} (Score: ${feedbackData.resilienceScore})`);
        
        res.json({
            success: true,
            message: 'Feedback submitted successfully',
            feedbackId: feedbackData.id
        });
        
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Get analytics endpoint (for your dashboard)
app.get('/api/analytics', async (req, res) => {
    try {
        const analytics = await readJsonFile(ANALYTICS_FILE);
        if (!analytics) {
            return res.status(500).json({
                success: false,
                error: 'Failed to read analytics data'
            });
        }
        
        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Get all feedback endpoint (protected - you might want to add authentication)
app.get('/api/feedback/all', async (req, res) => {
    try {
        // Simple authentication check (replace with proper auth)
        const authToken = req.headers.authorization;
        if (authToken !== 'Bearer your-secret-token-here') {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }
        
        const feedbackFile = await readJsonFile(FEEDBACK_FILE);
        if (!feedbackFile) {
            return res.status(500).json({
                success: false,
                error: 'Failed to read feedback data'
            });
        }
        
        // Sort by timestamp (newest first)
        const sortedFeedback = feedbackFile.feedback.sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        res.json({
            success: true,
            data: {
                total: sortedFeedback.length,
                feedback: sortedFeedback
            }
        });
    } catch (error) {
        console.error('Error fetching all feedback:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Update analytics helper function
async function updateAnalytics(newFeedback) {
    try {
        const analytics = await readJsonFile(ANALYTICS_FILE);
        if (!analytics) return;
        
        // Update total submissions
        analytics.totalSubmissions += 1;
        
        // Update experience ratings
        if (!analytics.experienceRatings[newFeedback.experience]) {
            analytics.experienceRatings[newFeedback.experience] = 0;
        }
        analytics.experienceRatings[newFeedback.experience] += 1;
        
        // Update average resilience score
        if (newFeedback.resilienceScore) {
            const feedbackFile = await readJsonFile(FEEDBACK_FILE);
            if (feedbackFile) {
                const scoresWithData = feedbackFile.feedback
                    .filter(f => f.resilienceScore)
                    .map(f => f.resilienceScore);
                
                if (scoresWithData.length > 0) {
                    analytics.averageScore = Math.round(
                        scoresWithData.reduce((a, b) => a + b, 0) / scoresWithData.length
                    );
                }
            }
        }
        
        // Extract common improvement suggestions
        if (newFeedback.improvements) {
            const words = newFeedback.improvements.toLowerCase().split(/\s+/)
                .filter(word => word.length > 3)
                .filter(word => !['the', 'and', 'but', 'for', 'are', 'this', 'that', 'with', 'have', 'will', 'been', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were'].includes(word));
                
            analytics.commonImprovements = [...new Set([...analytics.commonImprovements, ...words])];
            
            // Keep only top 50 most mentioned words
            if (analytics.commonImprovements.length > 50) {
                analytics.commonImprovements = analytics.commonImprovements.slice(0, 50);
            }
        }
        
        analytics.lastUpdated = new Date().toISOString();
        
        await writeJsonFile(ANALYTICS_FILE, analytics);
    } catch (error) {
        console.error('Error updating analytics:', error);
    }
}

// Export feedback as CSV endpoint
app.get('/api/export/csv', async (req, res) => {
    try {
        const authToken = req.headers.authorization;
        if (authToken !== 'Bearer your-secret-token-here') {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }
        
        const feedbackFile = await readJsonFile(FEEDBACK_FILE);
        if (!feedbackFile) {
            return res.status(500).json({
                success: false,
                error: 'Failed to read feedback data'
            });
        }
        
        // Convert to CSV
        const csvHeader = 'ID,Name,Email,Experience,ResilienceScore,Feedback,Improvements,Timestamp\n';
        const csvRows = feedbackFile.feedback.map(item => {
            return [
                item.id,
                `"${item.name || ''}"`,
                `"${item.email || ''}"`,
                item.experience,
                item.resilienceScore || '',
                `"${item.feedback.replace(/"/g, '""')}"`,
                `"${(item.improvements || '').replace(/"/g, '""')}"`,
                item.timestamp
            ].join(',');
        }).join('\n');
        
        const csv = csvHeader + csvRows;
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=life-strings-feedback.csv');
        res.send(csv);
        
    } catch (error) {
        console.error('Error exporting CSV:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Start server
async function startServer() {
    await initializeStorage();
    
    app.listen(PORT, () => {
        console.log(`🚀 Life Strings API server running on port ${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
        console.log(`💬 Feedback endpoint: http://localhost:${PORT}/api/feedback`);
        console.log(`📈 Analytics endpoint: http://localhost:${PORT}/api/analytics`);
    });
}

startServer().catch(console.error);

module.exports = app;
