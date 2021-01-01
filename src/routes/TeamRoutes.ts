import { Router } from 'express';
import {
    authenticateAdmin,
    authenticateToken,
} from '../controllers/AuthenticationController';
import {
    addMember,
    createTeam,
    getTeamMembers,
    getTeams,
} from '../controllers/TeamMember';
import { removeMember } from '../controllers/TeamMember/TeamController';
import validateRequest, {
    memberSchema,
    teamSchema,
} from '../middleware/validateRequest';

const TeamRoutes = Router();

TeamRoutes.get('', authenticateToken, getTeams);

TeamRoutes.post('', authenticateToken, validateRequest(teamSchema), createTeam);

TeamRoutes.get('/:team_id/members', authenticateToken, getTeamMembers);

TeamRoutes.post(
    '/add-member',
    authenticateToken,
    authenticateAdmin,
    validateRequest(memberSchema),
    addMember,
);

TeamRoutes.post(
    '/remove-member',
    authenticateToken,
    authenticateAdmin,
    validateRequest(memberSchema),
    removeMember,
);

export default TeamRoutes;
