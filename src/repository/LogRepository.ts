import { EntityRepository, Repository } from 'typeorm';
import Log from '../entity/Log';
import Task from '../entity/Task';

@EntityRepository(Log)
export default class LogRepository extends Repository<Log> {
    start(taskID: number) {
        return this.manager.transaction(async (transactionManager) => {
            const log = new Log();
            log.task = { taskID };
            log.startTime = new Date();

            await transactionManager.save(log);
            await transactionManager.update(Task, taskID, { activeLog: log });

            return log;
        });
    }

    stop(logID: number) {
        return this.manager.transaction(async (transactionManager) => {
            const result = await transactionManager
                .createQueryBuilder()
                .update(Log)
                .set({ endTime: new Date() })
                .where('log_id = :logID', { logID })
                .returning('*')
                .execute();

            let log;

            if (result.affected! > 0) {
                const { log_id, task_id, start_time, end_time } = result.raw[0];

                log = new Log();
                log.logID = log_id;
                log.taskID = task_id;
                log.startTime = start_time;
                log.endTime = end_time;

                const total = log.endTime!.getTime() - log.startTime!.getTime();

                await transactionManager.update(Task, log.taskID, {
                    totalTime: () => `total_time + ${total}`,
                    activeLog: null,
                });
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

            if (result.affected! > 0 && result.raw[0].end_time) {
                const { task_id, start_time, end_time } = result.raw[0];
                const total = end_time.getTime() - start_time.getTime();

                await transactionManager.update(Task, task_id, {
                    totalTime: () => `total_time - ${total}`,
                });
            }

            return result;
        });
    }
}
