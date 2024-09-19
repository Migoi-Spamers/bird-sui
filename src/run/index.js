import colors from "colors";
import delayHelper from "../helpers/delay.js";
import authService from "../services/auth.js";
import dailyService from "../services/view.js";
import farmingClass from "../services/farming.js";
import gameService from "../services/game.js";
import inviteClass from "../services/invite.js";
import taskService from "../services/task.js";
import tribeService from "../services/tribe.js";
import userService from "../services/user.js";

// Điều chỉnh khoảng cách thời gian chạy vòng lặp đầu tiên giữa 2 tài khoản tránh bị spam request (tính bằng giây)
const DELAY_ACC = 30;

const run = async (user) => {
  await delayHelper.delay((user.index - 1) * DELAY_ACC);
  let isDoneAccount = false;
  while (!isDoneAccount) {
    // Kiểm tra kết nối proxy
    let isProxyConnected = false;
    while (!isProxyConnected) {
      const ip = await user.http.checkProxyIP();
      if (ip === -1) {
        user.log.logError(
          "Proxy lỗi, kiểm tra lại kết nối proxy, sẽ thử kết nối lại sau 30s"
        );
        await delayHelper.delay(30);
      } else {
        isProxyConnected = true;
      }
    }

    // Đăng nhập tài khoản
    const login = await authService.handleLogin(user);

    if (!login) {
      await delayHelper.delay(60);
      continue;
    }

    // await taskService.handleTask(user);
    await gameService.handleGame(user);
    await delayHelper.delay(30);
  }
};

console.log(
  colors.yellow.bold(
    `=============  Tool phát triển và chia sẻ miễn phí bởi ZuyDD  =============`
  )
);
console.log(
  "Mọi hành vi buôn bán tool dưới bất cứ hình thức nào đều không được cho phép!"
);
console.log(
  `Telegram: ${colors.green(
    "https://t.me/zuydd"
  )}  ___  Facebook: ${colors.blue("https://www.facebook.com/zuy.dd")}`
);
console.log(
  `🚀 Cập nhật các tool mới nhất tại: 👉 ${colors.gray(
    "https://github.com/zuydd"
  )} 👈`
);
console.log("");
console.log("");
console.log("");
const users = await userService.loadUser();

for (const [index, user] of users.entries()) {
  run(user);
}
