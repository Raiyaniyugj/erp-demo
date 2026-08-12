export const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString('en-IN')}`;
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const getStatusColor = (status) => {
    const colors = {
        Active: 'bg-green-500/20 text-green-300',
        Inactive: 'bg-red-500/20 text-red-300',
        Draft: 'bg-gray-500/20 text-gray-300',
        Sent: 'bg-blue-500/20 text-blue-300',
        Approved: 'bg-green-500/20 text-green-300',
        Rejected: 'bg-red-500/20 text-red-300',
        Expired: 'bg-yellow-500/20 text-yellow-300',
        Pending: 'bg-yellow-500/20 text-yellow-300',
        Processing: 'bg-blue-500/20 text-blue-300',
        Packed: 'bg-indigo-500/20 text-indigo-300',
        Dispatched: 'bg-purple-500/20 text-purple-300',
        Delivered: 'bg-green-500/20 text-green-300',
        Cancelled: 'bg-red-500/20 text-red-300',
        Paid: 'bg-green-500/20 text-green-300',
        Partial: 'bg-amber-500/20 text-amber-300',
    };
    return colors[status] || 'bg-slate-500/20 text-slate-300';
};
