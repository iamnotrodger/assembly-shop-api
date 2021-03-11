import { EntityRepository, Repository } from 'typeorm';
import Project from '../entity/Project';

@EntityRepository(Project)
export default class ProjectRepository extends Repository<Project> {
    findProjectByAdminId(projectID: number, administratorID: number) {
        return this.createQueryBuilder('project')
            .leftJoin('project.team', 'team')
            .where(
                'team.administrator_id = :administratorID AND project_id = :projectID',
                { administratorID, projectID },
            )
            .getOne();
    }
}
