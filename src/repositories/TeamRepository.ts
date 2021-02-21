import { EntityRepository, Repository } from 'typeorm';
import Member from '../entities/Member';
import Team from '../entities/Team';

@EntityRepository(Team)
export default class TeamRepository extends Repository<Team> {
    async createAndJoin(team: Team) {
        return this.manager.transaction(async (transactionManager) => {
            const member = new Member();
            member.team = team;
            member.user = team.administrator!;

            await transactionManager.save(team);
            await transactionManager.save(member);
        });
    }
}
