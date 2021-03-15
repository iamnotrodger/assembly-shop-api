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

            let log;

            if (task) {
                const { activeLog } = task;
                if (activeLog) {
                    activeLog.endTime = new Date();

                    const { endTime, startTime } = activeLog;
                    const total = endTime.getTime() - startTime!.getTime();

                    task.totalTime! += total;
                    task.activeLog = null;

                    await transactionManager.save(activeLog);

                    log = { log: activeLog };
                }

                task.completed = true;
                await transactionManager.save(task);
                log = { ...log, totalTime: task.totalTime! };
            }

            return log;
        });
    }

    //* finds the task if the user is a member of the project */
    findTaskByMember(taskID: number, userID: number) {
        return this.createQueryBuilder('task')
            .innerJoin('task.project', 'project')
            .innerJoin('project.team', 'team')
            .innerJoin('team.members', 'member')
            .where('task.task_id = :taskID AND member.user_id = :userID', {
                taskID,
                userID,
            })
            .getOne();
    }
}
