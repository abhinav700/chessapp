import { GameManager } from "./GameManager";
import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_DRAW, GAME_OVER, GAME_STARTED, MAKE_MOVE } from "./messages";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private startTime: number | Date;
  private movesCount:number;
  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = Date.now();
    this.movesCount = 0;
    player1.send(
      JSON.stringify({ type: GAME_STARTED, payload: { color: "white" } })
    );
    player2.send(
      JSON.stringify({ type: GAME_STARTED, payload: { color: "black" } })
    );
  }

  public makeMove(player: WebSocket, move: Move) {
    //checking if correct player is making the move
    console.log("Entered make move function");
    console.log(this.movesCount)
    if (this.movesCount % 2 == 0 && player != this.player1) {
      console.log("Player 1 was supposed to make the move but not player 1");
      console.log(this.board.moves());
      return;
    }
    if (this.movesCount % 2 == 1 && player != this.player2) {
      console.log("Player 2 was supposed to make the move but not player 2");
      return;
    }
    try {
      console.log("Entered try catch");
      this.board.move(move);
    } catch (error) {
      console.log(error);
      return;
    }
    if (this.board.isGameOver()) {
      console.log("Game over");
      const emitMessage = JSON.stringify({
        type: GAME_OVER,
        payload: {
          winner: this.board.turn() === "w" ? "black" : "white",
        },
      });
      this.player1.send(emitMessage);
      this.player2.send(emitMessage);
      return;

    } else {
      const emitMessage = JSON.stringify({
        type: MAKE_MOVE,
        payload: {
          move:{
            from:move.from,
            to:move.to
          }
        },
      });
      if (this.movesCount % 2 === 0) this.player2.send(emitMessage);
      else this.player1.send(emitMessage);
      this.movesCount++;
    }
  }
}
