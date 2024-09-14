import colors from "colors";

class TaskService {
  constructor() { }

  async getTaskList(user) {
    const skipTasks = [""];
    try {
      const tasks = user.tasks;

      if (tasks) {
        let tasks_ = [];
        for (const item of tasks) {
          tasks_ = tasks_.concat(item.tasks);
        }
        return tasks_.filter(
          (task) =>
            !skipTasks.includes(task.type) &&
            !task.is_claimed
        );
      } else {
        throw new Error(`Lấy danh sách nhiệm vụ thất bại: ${data?.message}`);
      }
    } catch (error) {
      user.log.logError(
        `Lấy danh sách nhiệm vụ thất bại: ${error.response?.data?.message}`
      );
      return [];
    }
  }

  async startTask(user, task) {
    const param = `completeTask`;
    const body = {
      type: task.type
    };
    try {
      const { data } = await user.http.post(0, param, body);
      if (data && data.result.is_completed) {
        return true;
      } else {
        throw new Error(
          `Làm nhiệm vụ ${colors.blue(taskName)} thất bại: ${data?.message}`
        );
      }
    } catch (error) {
      user.log.logError(
        `Làm nhiệm vụ ${colors.blue(taskName)} - ${colors.gray(
          `[${task.id}]`
        )} thất bại: ${error.response?.data?.message}`
      );
      return false;
    }
  }

  async claimTask(user, task) {
    const param = `tasks/${task.id}/claim`;
    let taskName = task.title;
    if (task.progressTarget) {
      taskName = `${task.title} ${task.target} ${task.postfix}`;
    }
    try {
      const { data } = await user.http.post(0, param, {});
      if (data && data.status === "FINISHED") {
        user.log.log(
          `Làm nhiệm vụ ${colors.blue(
            taskName
          )} thành công, phần thưởng: ${colors.green(
            task.reward + user.currency
          )}`
        );
        return true;
      } else {
        throw new Error(
          `Claim phần thưởng nhiệm vụ ${colors.blue(taskName)} thất bại: ${data?.message
          }`
        );
      }
    } catch (error) {
      user.log.logError(
        `Claim phần thưởng nhiệm vụ ${colors.blue(taskName)} - ${colors.gray(
          `[${task.id}]`
        )} thất bại: ${error.response?.data?.message}`
      );
      return false;
    }
  }

  async handleTask(user) {
    const tasks = await this.getTaskList(user);

    if (!tasks.length) {
      user.log.log(colors.magenta("Đã làm hết nhiệm vụ"));
      return;
    }

    const tasksErrorStart = [];
    for (const task of tasks) {
      let complete = task.is_claimed;
      if (complete) {
        complete = await this.startTask(user, task);
        if (complete) {
          tasksErrorStart.push(task);
        }
      }
    }

    if (tasksErrorStart.length) {
      user.log.log(colors.magenta("Chạy lại các nhiệm vụ bị lỗi..."));
      for (const task of tasksErrorStart) {
        complete = await this.startTask(user, task);
      }
    }
  }
}

const taskService = new TaskService();
export default taskService;
