import { EntityRepository, Repository } from 'typeorm';
import Member from '../entity/Member';
import Team from '../entity/Team';

@EntityRepository(Team)
export default class TeamRepository extends Repository<Team> {
    createAndJoin(team: Team) {
        return this.manager.transaction(async (transactionManager) => {
            const member = new Member();
            member.team = team;
            member.userID = team.administratorID;

            await transactionManager.save(team);
            await transactionManager.save(member);
        });
    }

    findTeams(userID: number) {
        return this.createQueryBuilder('team')
            .innerJoin('team.members', 'member')
            .where('member.user_id = :userID', { userID })
            .getMany();
    }

    findProjects(userID: number) {
        return this.createQueryBuilder('team')
            .innerJoin('team.members', 'member')
            .where('member.user_id = :userID', { userID })
            .leftJoinAndSelect('team.projects', 'project')
            .orderBy('project.projectID', 'ASC')
            .getMany();
    }
}
