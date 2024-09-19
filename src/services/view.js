import colors from "colors";

class ViewService {
  constructor() { }

  async view(user) {
    try {
      const body = {
        referrer_id: 0,
      };
      const { data } = await user.http.post(0, "getMe", body);
      if (data) {
        user.update('tasks', data.result.tasks);
        user.update('tickets', data.result.tickets);

        user.log.log(`Balance: ${data.result.balance}`);
        user.log.log(`Daily streak: ${data.result.daily_streak.day}`);
        return data;
      } else {
        throw new Error(`Checkin thất bại: ${data.message}`);
      }
    } catch (error) {
      if (
        error.status === 400 &&
        error.response?.data?.message === "same day"
      ) {
        user.log.log(colors.magenta("Đã checkin hôm nay"));
      } else if (error.status === 403) {
        user.log.log(colors.magenta("Timeout"));
      } else {
        user.log.logError(`Checkin thất bại: ${error.response?.data?.message}`);
      }
      return null;
    }
  }
}

const dailyService = new ViewService();
export default dailyService;
