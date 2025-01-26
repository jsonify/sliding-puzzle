import { Request, Response } from 'express';
import { GameService } from '../services/gameService';

export class GameController {
  private gameService: GameService;

  constructor(gameService: GameService) {
    this.gameService = gameService;
  }

  async createGame(req: Request, res: Response) {
    // TODO: Implement game creation
  }

  async processMove(req: Request, res: Response) {
    // TODO: Implement move processing
  }
}
