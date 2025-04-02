import { Schema, Document, model } from "mongoose";


const LotteryPrizesSchema = new Schema(
    {
        lotteryId: { type: Schema.Types.ObjectId, ref: "Lottery", required: true },
        postion: {
            type: Number,
            required: true,
        },
        prizeAmount: {
            type: Number,
            required: true,
        },
        matchCombination: {
            type: [Number],
            required: true,
        },
    }

);

const LotteryPrizesModel = model("LotteryPrizes", LotteryPrizesSchema, "LotteryPrizes");

export default LotteryPrizesModel;