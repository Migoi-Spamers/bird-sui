import colors from "colors";
import fileHelper from "../helpers/file.js";
import tokenHelper from "../helpers/token.js";

class AuthService {
  constructor() { }

  async login(user) {
    return {
      code: 200,
      info: { token: user.query_id },
    };
  }

  async handleLogin(user) {
    console.log(
      `============== Chạy tài khoản ${user.index} | ${user.info.fullName.green} ==============`
    );

    let token = fileHelper.getTokenById(user.info.id);
    if (token) {
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
    user.http.updateToken(token);
    fileHelper.saveToken(user.info.id, token);
    user.log.log(
      colors.green("Đăng nhập thành công: ") +
      `${user.info.fullName.green}`
    );
  }
}

const authService = new AuthService();
export default authService;
