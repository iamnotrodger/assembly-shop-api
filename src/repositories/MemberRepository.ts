import { EntityRepository, Repository } from 'typeorm';
import Member from '../entities/Member';
import InvalidRequestException from '../exceptions/InvalidRequestException';

@EntityRepository(Member)
export default class MemberRepository extends Repository<Member> {
    findTeams(userID: number) {
        return this.find({
            relations: ['team'],
            where: { user: { userID } },
        });
    }

    findByTeamId(teamID: number) {
        return this.find({
            relations: ['user'],
            where: { team: teamID },
        });
    }

    createAndSave(teamID: number, userID: number) {
        const member = this.create({ team: { teamID }, user: { userID } });
        return this.save(member);
    }
}
