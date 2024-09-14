import colors from "colors";
import delayHelper from "../helpers/delay.js";
import generatorHelper from "../helpers/generator.js";

class GameService {
  constructor() { }

  async spin(user) {
    try {
      const { data } = await user.http.post(0, "wheel/spin", {});
      if (data) {
        user.log.log(
          `Bắt đầu spin wheel, kết thúc và nhận thưởng: ${data.result.reward}`
        );
        user.log.log(`Chờ 10 giây spin lần tiếp theo`);
        await delayHelper.delay(10);
        return 1;
      } else {
        throw new Error(`Chơi game thất bại: ${data.message}`);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.message === "not enough play passes") {
        return 2;
      } else {
        user.log.logError(
          `Chơi game thất bại: ${error.response?.data?.message}`
        );
      }
      return 0;
    }
  }

  async handleGame(user, playPasses) {
    user.log.log(`Còn ${colors.blue(playPasses + " lượt")} chơi game`);
    let gameCount = playPasses || 0;
    let errorCount = 0;
    while (gameCount > 0) {
      if (errorCount > 20) {
        gameCount = 0;
        continue;
      }
      await delayHelper.delay(2);
      const status = await this.spin(user);

      if (status == 2) {
        gameCount = 0;
        continue
      }
      if (status == 1) {
        gameCount--;
        continue;
      }
      if (status == 0) {
        errorCount++;
      }
    }
    if (playPasses > 0)
      user.log.log(colors.magenta("Đã dùng hết lượt chơi game"));
  }
}

const gameService = new GameService();
export default gameService;
