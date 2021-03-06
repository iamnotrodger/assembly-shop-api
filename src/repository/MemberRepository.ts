import { EntityRepository, Repository } from 'typeorm';
import Member from '../entity/Member';
import Team from '../entity/Team';

@EntityRepository(Member)
export default class MemberRepository extends Repository<Member> {
    findByTeamId(teamID: number) {
        return this.find({
            relations: ['user'],
            where: { teamID },
        });
    }

    findByProjectId(projectID: number) {
        return this.createQueryBuilder('member')
            .innerJoinAndSelect('member.user', 'user')
            .innerJoin('member.team', 'team')
            .innerJoin('team.projects', 'project')
            .where('project.project_id = :projectID', { projectID })
            .getMany();
    }

    findOneProjectMember(projectID: number, userID: number) {
        return this.createQueryBuilder('member')
            .innerJoin('member.team', 'team')
            .innerJoin('team.projects', 'project')
            .where(
                'project.project_id = :projectID AND member.user_id = :userID',
                { projectID, userID },
            )
            .getOne();
    }

    /** Add team member and add the number of members of the team */
    add(teamID: number, userID: number) {
        return this.manager.transaction(async (transactionManager) => {
            await transactionManager.save(Member, { teamID, userID });
            await transactionManager.update(Team, teamID, {
                numMembers: () => `num_members + 1`,
            });
        });
    }

    /** Remove team member and subtracts the number of members of the team */
    subtract(teamID: number, userID: number) {
        return this.manager.transaction(async (transactionManager) => {
            const result = await transactionManager.delete(Member, {
                teamID,
                userID,
            });

            if (result.affected! > 0) {
                await transactionManager.update(Team, teamID, {
                    numMembers: () => `num_members - 1`,
                });
            }

            return result;
        });
    }
}
