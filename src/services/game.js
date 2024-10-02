import delayHelper from "../helpers/delay.js";
import generatorHelper from "../helpers/generator.js";

class GameService {
  constructor() { }

  async mint(user) {
    try {
      const points = generatorHelper.randomInt(70,90);
      await delayHelper.delay(21);
      await user.http.post(1, "tasks/1", {
        points: points,
        status: "completed"
      });
      user.log.log(
        `Kết thúc mint và nhận thưởng: ${points} points`
      );
      return 1;
    } catch (error) {
      user.log.logError(
        `Mint thất bại: ${error.response?.data?.error}`
      );
      return 0;
    }
  }

  async handleGame(user) {
    user.log.log(`---- Bắt đầu mint ---`);
    while (true) {
      const skipOrNot = generatorHelper.randomInt(0, 10);
      await this.mint(user);
      // if (skipOrNot > 0 && skipOrNot < 10) {
      // } else {
      //   await delayHelper.delay(21);
      //   user.log.log(
      //     `Bỏ qua một lượt mint`
      //   );
      // }
    }
  }
}

const gameService = new GameService();
export default gameService;
