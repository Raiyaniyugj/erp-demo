const ActivityLog = require('../models/ActivityLog');

exports.logActivity = async (userId, action, entity, details) => {
    try {
        await ActivityLog.create({ user: userId, action, entity, details });
    } catch (err) {
        console.error('Error logging activity:', err);
    }
};

exports.getActivities = async (req, res) => {
    try {
        const activities = await ActivityLog.find().populate('user', 'name email role').sort({ createdAt: -1 }).limit(100);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
