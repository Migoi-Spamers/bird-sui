import colors from "colors";
import fileHelper from "../helpers/file.js";

class AuthService {
  constructor() { }

  async login(user) {
    return {
      code: 200,
      info: { token: user.query_id },
    };
  }

  async getView(user) {
    try {
      const { data } = await user.http.get(0, "player");
      console.log(data);
      if (data) {
        return data;
      } else {
        throw new Error(`Lấy player thất bại: ${data.message}`);
      }
    } catch (error) {
      user.log.logError(
        `Lấy layer thất bại: ${error.response?.data?.message}`
      );
      return 0;
    }
  }

  async getPlayer(user) {
    try {
      const { data } = await user.http.get(1, "player");
      if (data) {
        return data;
      } else {
        throw new Error(`Lấy layer thất bại: ${data.message}`);
      }
    } catch (error) {
      user.log.logError(
        `Lấy layer thất bại: ${error.response?.data?.error}`
      );
      return 0;
    }
  }

  async handleLogin(user) {
    console.log(
      `============== Chạy tài khoản ${user.index} | ${user.info.fullName.green} ==============`
    );

    let token = fileHelper.getTokenById(user.info.id);
    if (false) {
      const info = { token };
      await this.handleAfterLogin(user, info);
      return 1;
    }

    let infoLogin = await this.login(user);

    if (infoLogin?.code === 200) {
      await this.handleAfterLogin(user, infoLogin.info);
      return 1;
    }

    user.log.logError(
      "Quá trình đăng nhập thất bại, vui lòng kiểm tra lại thông tin tài khoản (có thể cần phải lấy mới query_id). Hệ thống sẽ thử đăng nhập lại sau 60s"
    );
    return 0;
  }

  async handleAfterLogin(user, info) {
    const token = info.token || null;
    // user.http.updateToken(token);
    fileHelper.saveToken(user.info.id, token);
    const playerInfo = await this.getPlayer(user);
    user.log.log(
      colors.green("Đăng nhập thành công: ") +
      `${user.info.fullName.green}`
    );
    user.log.log(`Tổng điểm: ${playerInfo.points}`);
  }
}

const authService = new AuthService();
export default authService;
