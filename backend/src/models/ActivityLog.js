const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // e.g., 'CREATE', 'UPDATE', 'DELETE', 'EXPORT'
    entity: { type: String, required: true }, // e.g., 'Customer', 'Order', 'Invoice'
    details: { type: String, required: true }, // e.g., 'Created customer XYZ'
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
