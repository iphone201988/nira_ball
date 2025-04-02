
import { Schema, Document, model } from "mongoose";


const TicketSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  lotteryId: { type: Schema.Types.ObjectId, ref: "Lottery", required: true },
  numbers: { type: [Number], required: true },
  powerball: { type: Number, required: true },
  status: { type: String, enum: ["pending", "won", "lost"], default: "pending" }
}, { timestamps: true });

const TicketModel = model("Ticket", TicketSchema, "Ticket");

export default TicketModel;

