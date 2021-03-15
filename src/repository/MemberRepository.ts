import { EntityRepository, Repository } from 'typeorm';
import Member from '../entity/Member';
import Team from '../entity/Team';

@EntityRepository(Member)
export default class MemberRepository extends Repository<Member> {
    /** Add team member and add the number of members of the team */
    add(teamID: number, userID: number, admin: boolean = false) {
        return this.manager.transaction(async (transactionManager) => {
            await transactionManager.save(Member, { teamID, userID, admin });
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

    findTeamAdmin(teamID: number, userID: number) {
        const admin = true;
        return this.findOne({ teamID, userID, admin });
    }

    findProjectAdmin(projectID: number, userID: number) {
        return this.createQueryBuilder('member')
            .innerJoin('member.team', 'team')
            .innerJoin('team.projects', 'project')
            .where(
                'project.project_id = :projectID AND member.user_id = :userID AND member.admin = TRUE',
                { projectID, userID },
            )
            .getOne();
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
}
