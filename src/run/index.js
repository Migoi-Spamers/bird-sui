import colors from "colors";
import delayHelper from "../helpers/delay.js";
import authService from "../services/auth.js";
import gameService from "../services/game.js";
import taskService from "../services/task.js";
import userService from "../services/user.js";

// Điều chỉnh khoảng cách thời gian chạy vòng lặp đầu tiên giữa 2 tài khoản tránh bị spam request (tính bằng giây)
const DELAY_ACC = 3;

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

    await taskService.handleTask(user);
    await gameService.handleGame(user);
    await delayHelper.delay(30);
  }
};

console.log(
  colors.yellow.bold(
    `=============  Tool được fork và phát triển nội bộ bởi JJ  =============`
  )
);
console.log(
  "Mọi hành vi buôn bán tool dưới bất cứ hình thức nào đều phải thông qua JJ!"
);
console.log(
  `🚀 Cập nhật các tool mới nhất tại: 👉 ${colors.gray(
    "https://github.com/thanhdat240220"
  )} 👈 Nhắn tin đăng kí để được join private group`
);
console.log("");
console.log("");
console.log("");
const users = await userService.loadUser();

for (const [index, user] of users.entries()) {
  run(user);
}
