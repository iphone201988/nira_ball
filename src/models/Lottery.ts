import { Schema, Document, model } from "mongoose";


const LotterySchema = new Schema(
    {
        gameType: {
            type: String,
            default: 'Powerball',
        },
        jackpotAmount: {
            type: Number,
            required: true,
        },
        drawDate: {
            type: Date,
            required: true,
        },
        mainNumbers: {
            type: [Number],
            required: true,
        },
        powerball: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['upcoming', 'completed'],
            default: 'upcoming',
        },
    }, { timestamps: true }

);

const LotteryModel = model("Lottery", LotterySchema, "Lottery");

export default LotteryModel;