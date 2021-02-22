import { EntityRepository, Repository } from 'typeorm';
import Task from '../entity/Task';

@EntityRepository(Task)
export default class TaskRepository extends Repository<Task> {
    completed(taskID: number) {
        return this.manager.transaction(async (transactionManager) => {
            const task = await transactionManager.findOne(Task, {
                relations: ['activeLog'],
                where: { taskID },
            });

            if (task) {
                const { activeLog } = task;
                if (activeLog) {
                    activeLog.endTime = new Date();

                    const { endTime, startTime } = activeLog;
                    const total = endTime.getTime() - startTime!.getTime();

                    task.totalTime! += total;
                    task.activeLog = null;

                    await transactionManager.save(activeLog);
                }

                task.completed = true;
                await transactionManager.save(task);
            }

            return task;
        });
    }
}
