import { NextFunction, Request, Response } from "express";
import LotteryModel from "../models/Lottery";
import { generateRandomNumbers } from "../utils/utils";
import LotteryPrizesModel from "../models/LotteryPrizes";
import { SUCCESS } from "../utils/response";
import TicketModel from "../models/Ticket";
import { BadRequestError } from "../utils/errors";

export const createLottery = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { drawDate, prizes, gameType } = req.body;

    const mainNumbers = generateRandomNumbers(5, 69);
    const powerball = generateRandomNumbers(1, 29)[0];
    const lottery = new LotteryModel({
      mainNumbers,
      drawDate,
      powerball,
      jackpotAmount: prizes[0],
      gameType
    });
    await lottery.save();
    const matchCombinations = [
      [...mainNumbers, powerball], // Position 1: 5 main numbers + Powerball
      [...mainNumbers],            // Position 2: 5 main numbers
      [mainNumbers[0], mainNumbers[1], mainNumbers[2], mainNumbers[3], powerball], // Position 3: 4 main numbers + Powerball
      [mainNumbers[0], mainNumbers[1], mainNumbers[2], mainNumbers[3]],             // Position 4: 4 main numbers
      [mainNumbers[0], mainNumbers[1], mainNumbers[2], powerball],                  // Position 5: 3 main numbers + Powerball
      [mainNumbers[0], mainNumbers[1], mainNumbers[2]],                             // Position 6: 3 main numbers
      [mainNumbers[0], mainNumbers[1], powerball],                                  // Position 7: 2 main numbers + Powerball
      [mainNumbers[0], powerball],                                                  // Position 8: 1 main number + Powerball
      [powerball],                                                                  // Position 9: Powerball only
    ];
    for (let i = 0; i < 9; i++) {
      await LotteryPrizesModel.create({
        lotteryId: lottery._id,
        postion: i + 1,
        prizeAmount: prizes[i + 1],
        matchCombination: matchCombinations[i],
      });

    }
    return SUCCESS(res, 200, "Lottery created", {});
  } catch (err) {
    next(err);
  }
};
//get all lotteries status
export const getLotteryStatus = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { status="upcoming" } = req.query;
    const lotteries = await LotteryModel.find({ status }).sort({ drawDate: -1 });
    return SUCCESS(res, 200, "Lottery status", { data: lotteries });
  } catch (err) {
    next(err);
  }
}


// buy ticket
export const buyLotteryTickets = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { lotteryId, drawDate, balldata } = req.body;
    const lottery = await LotteryModel.findById(lotteryId);
    if (!lottery) {
      throw new BadRequestError("Lottery not found");
    }

    const userId = req.userId;
    const tickets = await TicketModel.insertMany(
      balldata.map((ball: { numbers: number[]; powerball: number }) => ({
        userId,
        lotteryId,
        drawDate,
        numbers: ball.numbers,
        powerball: ball.powerball,
      }))
    );
    return SUCCESS(res, 200, "Tickets purchased successfully", { tickets });
  } catch (error) {
    next(error);
  }
};
