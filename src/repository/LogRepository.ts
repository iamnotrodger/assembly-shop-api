import { EntityRepository, Repository } from 'typeorm';
import Log from '../entity/Log';
import Task from '../entity/Task';

@EntityRepository(Log)
export default class LogRepository extends Repository<Log> {
    start(taskID: number, time: Date) {
        return this.manager.transaction(async (transactionManager) => {
            const log = new Log();
            log.task = { taskID };
            log.startTime = time;

            await transactionManager.save(log);
            await transactionManager.update(Task, taskID, { activeLog: log });

            return log;
        });
    }

    stop(taskID: number, time: Date) {
        return this.manager.transaction(async (transactionManager) => {
            const task = await transactionManager.findOne(Task, {
                relations: ['activeLog'],
                where: { taskID },
            });

            let log;

            if (task && task.activeLog) {
                const { activeLog } = task;
                activeLog.endTime = time;

                const { logID, endTime, startTime } = activeLog;
                const total = endTime.getTime() - startTime!.getTime();

                task.totalTime! += total;
                task.activeLog = null;

                await transactionManager.update(Log, logID, activeLog);
                await transactionManager.update(Task, taskID, task);

                log = { totalTime: task.totalTime!, log: activeLog };
            }

            return log;
        });
    }

    deleteAndDecrementTaskTime(logID: number) {
        return this.manager.transaction(async (transactionManager) => {
            const result = await transactionManager
                .createQueryBuilder()
                .delete()
                .from(Log)
                .where('log_id = :logID', { logID })
                .returning('*')
                .execute();

            const successful = result.affected! > 0;
            let success: { successful: boolean; totalTime?: number } = {
                successful,
            };

            if (successful && result.raw[0].end_time) {
                const { task_id, start_time, end_time } = result.raw[0];
                const total = end_time.getTime() - start_time.getTime();

                const updateResult = await transactionManager
                    .createQueryBuilder()
                    .update(Task)
                    .where('task_id = :task_id', {
                        task_id,
                    })
                    .set({ totalTime: () => `total_time - ${total}` })
                    .returning('total_time')
                    .execute();

                success.totalTime = updateResult.raw[0].total_time;
            }

            return success;
        });
    }

    findTask(logID: number) {
        return this.findOne(logID, { relations: ['task', 'task.assignee'] });
    }
}
