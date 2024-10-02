import colors from "colors";

class TaskService {
  constructor() { }

  async getTaskList(user) {
    const skipTasks = [1, 5, 17, 25, 28, 109, 110];
    try {
      const { data } = await user.http.get(1, 'tasks');
      if (data?.tasks) {
        return data.tasks.filter(
          (task) =>
            !skipTasks.includes(task.id) &&
            task.claimType === 'immediate' &&
            task.completed.length === 0 &&
            (new Date(task.expiresAt).getTime() > Date.now())
        );
      } else {
        throw new Error(`Lấy danh sách nhiệm vụ thất bại`);
      }
    } catch (error) {
      user.log.logError(
        `Lấy danh sách nhiệm vụ thất bại: ${error.response?.data?.message}`
      );
      return [];
    }
  }

  async claimTask(user, task) {
    let taskName = task.name;
    try {
      const data = await user.http.post(1, `tasks/${task.id}`, {
        points: task.points,
        status: "completed"
      });
      if (data && data.status === 200) {
        user.log.log(
          `Làm nhiệm vụ ${colors.blue(
            taskName
          )} thành công, phần thưởng: ${colors.green(
            task.points
          )} points`
        );
        return true;
      } else {
        throw new Error(
          `Claim phần thưởng nhiệm vụ ${colors.blue(taskName)} thất bại: ${data?.message}`
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
      let complete = await this.claimTask(user, task);
      if (complete) {
        tasksErrorStart.push(task);
      }
    }
  }
}

const taskService = new TaskService();
export default taskService;
