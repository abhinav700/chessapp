import { Game } from "./Game";
import { WebSocket } from "ws";
import { INIT_GAME, MAKE_MOVE } from "./messages";
export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  users: WebSocket[];
  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
  }

  public addUser(player: WebSocket): void {
    this.users.push(player);
    this.handleMessage(player);
  }
  public removeUser(player: WebSocket): void {
    this.users = this.users.filter((item) => item != player);
  }

  private handleMessage(socket: WebSocket): void {
    socket.on("message", (data) => {
      const message: Message = JSON.parse(data.toString()); 
      
      switch (message.type) {
        case INIT_GAME:
          try {
            if (this.pendingUser) {
              const game = new Game(this.pendingUser, socket);
              this.games.push(game);
              
              this.pendingUser = null;
              console.log("second player entered");
            } 
            else {console.log("first player entered"), this.pendingUser = socket;}
          } catch (error) {
            // console.log(error);
          }
          break;

        case MAKE_MOVE:
          try {
            // console.log("Make move event was emitted")
            const game = this.games.find(
              (game) => game.player1 == socket || game.player2 == socket
            );
            // console.log("found the game")
            game?.makeMove(socket, message.payload?.move as Move);
          } catch (error) {}
          break;
        default:
          return "Invalid message type";
      }
    });
  }
}
