import { EntityRepository, Repository } from 'typeorm';
import Team from '../entity/Team';

@EntityRepository(Team)
export default class TeamRepository extends Repository<Team> {
    findTeams(userID: number) {
        return this.createQueryBuilder('team')
            .innerJoin('team.members', 'member')
            .where('member.user_id = :userID', { userID })
            .getMany();
    }

    findTeamsByAdmin(administratorID: number) {
        return this.find({ administratorID });
    }

    findProjects(userID: number) {
        return this.createQueryBuilder('team')
            .innerJoin('team.members', 'member')
            .where('member.user_id = :userID', { userID })
            .leftJoinAndSelect('team.projects', 'project')
            .orderBy('team.teamID', 'ASC')
            .addOrderBy('project.projectID', 'ASC')
            .getMany();
    }
}
