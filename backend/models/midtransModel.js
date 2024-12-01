const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const midtransSchema = new Schema({
    sellerId: {
        type: Schema.ObjectId,
        required: true
    },
    merchantId: {
        type: String,
        required: true
    },
    serverKey: {
        type: String,
        required: true
    },
    clientKey: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('midtrans', midtransSchema);