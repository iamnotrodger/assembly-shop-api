import { EntityRepository, Repository } from 'typeorm';
import Member from '../entity/Member';

@EntityRepository(Member)
export default class MemberRepository extends Repository<Member> {
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
