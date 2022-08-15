import { Socket } from "socket.io-client";
import { IPlayMatrix, IStartGame } from "../../components/game";

class GameService {
  public async joinGameRoom(socket: Socket, roomId: string): Promise<boolean> {
    return new Promise((rs, rj) => {
      socket.emit("join_game", { roomId });
      socket.on("room_joined", () => rs(true));
      socket.on("room_join_error", ({ error }) => rj(error));
    });
  }

  public async updateGame(socket: Socket, gameMatrix: IPlayMatrix, move: any) {
    socket.emit("update_game", { matrix: gameMatrix, move });
  }

  public async onGameUpdate(
    socket: Socket,
    listiner: (matrix: IPlayMatrix, move: any) => void
  ) {
    socket.on("on_game_update", ({ matrix, move }) => listiner(matrix, move));
  }

  public async onStartGame(
    socket: Socket,
    listiner: (options: IStartGame) => void
  ) {
    socket.on("start_game", listiner);
  }

  public async gameWin(socket: Socket, message: string) {
    socket.emit("game_win", { message });
  }

  public async onGameWin(socket: Socket, listiner: (message: string) => void) {
    socket.on("on_game_win", ({ message }) => listiner(message));
  }

  public async leaveRoom(socket: Socket) {
    socket.emit("leave_room");
  }
}

export default new GameService();
