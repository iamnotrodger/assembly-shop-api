import { Router } from 'express';
import {
    authenticateAdmin,
    authenticateMember,
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
    authenticateAdmin,
    removeTeam,
);

TeamRoutes.put(
    '/:team_id/name',
    validateParams(teamIDSchema),
    validateRequest(teamSchema),
    authenticateToken,
    authenticateAdmin,
    changeTeamName,
);

TeamRoutes.get(
    '/:team_id/members',
    validateParams(teamIDSchema),
    authenticateToken,
    authenticateMember,
    getTeamMembers,
);

TeamRoutes.post(
    '/:team_id/add-member',
    validateParams(teamIDSchema),
    validateRequest(memberIDSchema),
    authenticateToken,
    authenticateAdmin,
    addMember,
);

TeamRoutes.delete(
    '/:team_id/remove-member/:userID',
    validateParams(memberSchema),
    authenticateToken,
    authenticateAdmin,
    removeMember,
);

export default TeamRoutes;
