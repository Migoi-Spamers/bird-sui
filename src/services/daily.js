import colors from "colors";

class DailyService {
  constructor() { }

  async taskWheel(user, type) {
    try {
      const body = {
        type: type
      };
      const { data } = await user.http.post(0, "wheel/task", body);

      if (data) {
        return data.ok;
      } else {
        throw new Error(`Thực hiện ${type} wheel task thất bại: ${data?.message}`);
      }
    } catch (error) {
      user.log.logError(
        `Thực hiện ${type} wheel task thất bại: ${error.response?.data?.message}`
      );
      return [];
    }
  }

  async loadWheel(user) {
    try {
      const { data } = await user.http.post(0, "wheel/load", {});

      if (data?.result) {
        return {
          isBird: data.result.tasks.bird,
          isCheckinDaily: data.result.tasks.daily < Date.now() - 24 * 60 * 60 * 1000
        };
      } else {
        throw new Error(`load wheel task thất bại: ${data?.message}`);
      }
    } catch (error) {
      console.log(error);
      user.log.logError(
        `load wheel task thất bại: ${error.response?.data?.message}`
      );
      return [];
    }
  }

  async wheelCheckin(user) {
    const { isBird, isCheckinDaily } = await this.loadWheel(user);

    if (!isBird) {
      await this.taskWheel(user, 'bird');
    }
    if (!isCheckinDaily) {
      await this.taskWheel(user, 'daily');
    }
  }

  async checkin(user) {
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
      console.log(error);
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

const dailyService = new DailyService();
export default dailyService;
