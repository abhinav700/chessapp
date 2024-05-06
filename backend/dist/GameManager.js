"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
const messages_1 = require("./messages");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(player) {
        this.users.push(player);
        this.handleMessage(player);
    }
    removeUser(player) {
        this.users = this.users.filter((item) => item != player);
    }
    handleMessage(socket) {
        socket.on("message", (data) => {
            var _a;
            const message = JSON.parse(data.toString());
            switch (message.type) {
                case messages_1.INIT_GAME:
                    try {
                        if (this.pendingUser) {
                            const game = new Game_1.Game(this.pendingUser, socket);
                            this.games.push(game);
                            this.pendingUser = null;
                            console.log("second player entered");
                        }
                        else {
                            console.log("first player entered"), this.pendingUser = socket;
                        }
                    }
                    catch (error) {
                        // console.log(error);
                    }
                    break;
                case messages_1.MAKE_MOVE:
                    try {
                        // console.log("Make move event was emitted")
                        const game = this.games.find((game) => game.player1 == socket || game.player2 == socket);
                        // console.log("found the game")
                        game === null || game === void 0 ? void 0 : game.makeMove(socket, (_a = message.payload) === null || _a === void 0 ? void 0 : _a.move);
                    }
                    catch (error) { }
                    break;
                default:
                    return "Invalid message type";
            }
        });
    }
}
exports.GameManager = GameManager;
