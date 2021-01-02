import { Router } from 'express';
import {
    authenticateAdminByParams,
    authenticateMemberByParams,
    authenticateToken,
} from '../controllers/AuthenticationController';
import {
    addMember,
    changeTeamName,
    createTeam,
    getTeamMembers,
    getTeams,
    removeMember,
    removeTeam,
} from '../controllers/TeamController';
import validateRequest, {
    memberIDSchema,
    memberSchema,
    teamIDSchema,
    teamSchema,
    validateParams,
} from '../middleware/validateRequest';

const TeamRoutes = Router();

TeamRoutes.get('', authenticateToken, getTeams);

TeamRoutes.post('', authenticateToken, validateRequest(teamSchema), createTeam);

TeamRoutes.delete(
    '/:team_id',
    validateParams(teamIDSchema),
    authenticateToken,
    authenticateAdminByParams,
    removeTeam,
);

TeamRoutes.put(
    '/:team_id/name',
    validateParams(teamIDSchema),
    validateRequest(teamSchema),
    authenticateToken,
    authenticateAdminByParams,
    changeTeamName,
);

TeamRoutes.get(
    '/:team_id/members',
    validateParams(teamIDSchema),
    authenticateToken,
    authenticateMemberByParams,
    getTeamMembers,
);

TeamRoutes.post(
    '/:team_id/add-member',
    validateParams(teamIDSchema),
    validateRequest(memberIDSchema),
    authenticateToken,
    authenticateAdminByParams,
    addMember,
);

TeamRoutes.delete(
    '/:team_id/remove-member/:user_id',
    validateParams(memberSchema),
    authenticateToken,
    authenticateAdminByParams,
    removeMember,
);

export default TeamRoutes;
