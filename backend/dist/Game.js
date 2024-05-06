"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = Date.now();
        this.movesCount = 0;
        player1.send(JSON.stringify({ type: messages_1.GAME_STARTED, payload: { color: "white" } }));
        player2.send(JSON.stringify({ type: messages_1.GAME_STARTED, payload: { color: "black" } }));
    }
    makeMove(player, move) {
        //checking if correct player is making the move
        console.log("Entered make move function");
        console.log(this.movesCount);
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
        }
        catch (error) {
            console.log(error);
            return;
        }
        if (this.board.isGameOver()) {
            console.log("Game over");
            const emitMessage = JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            });
            this.player1.send(emitMessage);
            this.player2.send(emitMessage);
            return;
        }
        else {
            const emitMessage = JSON.stringify({
                type: messages_1.MAKE_MOVE,
                payload: move,
            });
            if (this.movesCount % 2 === 0)
                this.player2.send(emitMessage);
            else
                this.player1.send(emitMessage);
            this.movesCount++;
        }
    }
}
exports.Game = Game;
