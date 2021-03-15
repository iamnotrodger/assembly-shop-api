import { EntityRepository, Repository } from 'typeorm';
import { getAutomaticTypeDirectiveNames } from 'typescript';
import Team from '../entity/Team';

@EntityRepository(Team)
export default class TeamRepository extends Repository<Team> {
    findTeams(userID: number) {
        return this.createQueryBuilder('team')
            .innerJoin('team.members', 'member')
            .where('member.user_id = :userID', { userID })
            .getMany();
    }

    findTeamsByAdmin(userID: number) {
        return this.createQueryBuilder('team')
            .innerJoin('team.members', 'member')
            .where('member.user_id = :userID AND member.admin = TRUE', {
                userID,
            })
            .getMany();
    }

    findProjects(userID: number) {
        return this.createQueryBuilder('team')
            .innerJoin('team.members', 'member')
            .where('member.user_id = :userID', { userID })
            .leftJoinAndSelect('team.projects', 'project')
            .orderBy('team.teamID', 'DESC')
            .addOrderBy('project.projectID', 'DESC')
            .getMany();
    }
}
