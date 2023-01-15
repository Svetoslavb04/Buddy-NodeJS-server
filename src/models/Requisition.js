const mongoose = require('mongoose');

const requisitionSchema = new mongoose.Schema({
    requisition: {
        type: String,
        required: [true, 'Requisition is required']
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: [true, 'User id is required']
    }
});

const Requisition = mongoose.model('requisition', requisitionSchema);

module.exports = Requisition;