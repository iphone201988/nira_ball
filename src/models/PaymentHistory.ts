import mongoose, { Schema } from "mongoose";

const PaymentHistorySchema = new Schema({
    paymentIntentId: {
        type: String,
    },
    transferId: {
        type: String,
    },
    transactionId: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    amount: {
        type: Number,
    },
    currency: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'succeeded','failed', 'refunded', "transfer"],
        default: 'pending'
    },
    type: {
        type: String,
        enum: ['credit', 'debit', 'winner'],
        default: 'debit'
    },
    
},{timestamps:true});
const PaymentHistoryModel = mongoose.model('paymentHistory', PaymentHistorySchema, "paymentHistory");
export default PaymentHistoryModel;