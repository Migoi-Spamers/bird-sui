import delayHelper from "../helpers/delay.js";
import generatorHelper from "../helpers/generator.js";
import colors from "colors";

class GameService {
  constructor() { }

  async getJoin(user) {
    try {
      const response = await user.http.get(1, "minigame/egg/join"); // Gọi API join
      const data = response.data;
      if (data && data.turn) {
        user.log.log(`Số lượt chơi hiện tại: ${data.turn}`);
        return data.turn; // Trả về số lượt chơi
      } else {
        user.log.log(`Không tìm thấy lượt chơi!`);
        return 0;
      }
    } catch (error) {
      user.log.logError(`Lỗi khi thực hiện getJoin: ${error.message}`);
      return 0;
    }
  }

  async getPlay(user, i) {
    try {
      const response = await user.http.get(1, "minigame/egg/play"); // Gọi API play
      const data = response.data;
      if (data && data.result !== undefined) {
        user.log.log(`Lượt chơi ${i + 1}: Nhận được ${data.result} điểm`);
      } else {
        user.log.log(`Lượt chơi ${i + 1}: Không nhận được điểm`);
      }
    } catch (error) {
      user.log.logError(`Lỗi khi thực hiện getPlay: ${error.message}`);
    }
  }

  async getClaim(user) {
    try {
      const response = await user.http.get(1, "minigame/egg/claim"); // Gọi API claim
      const data = response.data;
      if (data === true) {
        user.log.log(colors.green(`Claim thành công!`));
      } else {
        user.log.log(`Claim thất bại!`);
      }
    } catch (error) {
      user.log.logError(`Lỗi khi thực hiện getClaim: ${error.message}`);
    }
  }

  async handleGame(user) {
    user.log.log(`---- Bắt đầu đập trứng ---`);

    // Bước 1: Thực hiện join để lấy số lượt chơi
    const turn = await this.getJoin(user);

    // Bước 2: Thực hiện vòng lặp chơi theo số lượt
    for (let i = 0; i < turn; i++) {
      await this.getPlay(user, i);
      await delayHelper.delay(3);
    }

    if (turn > 0) {
      await this.getClaim(user);
    }

    user.log.log(`---- Kết thúc đập trứng ---`);
    // Bước 3: Thực hiện claim sau khi hoàn thành các lượt chơi
  }
}

const gameService = new GameService();
export default gameService;
