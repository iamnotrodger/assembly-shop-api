import { Router } from 'express';
import {
    addMember,
    createTeam,
    deleteTeam,
    getTeamMembers,
    getTeams,
    removeMember,
    updateTeamName,
} from '../controllers/TeamController';
import {
    authenticateAdmin,
    authenticateMember,
    authenticateToken,
} from '../middleware/authentication';
import validateRequest, {
    memberSchema,
    teamIDSchema,
    teamSchema,
    userIDSchema,
    validateParams,
} from '../middleware/validateRequest';

const TeamRoutes = Router();

TeamRoutes.get('', authenticateToken, getTeams);

TeamRoutes.post('', authenticateToken, validateRequest(teamSchema), createTeam);

TeamRoutes.delete(
    '/:teamID',
    validateParams(teamIDSchema),
    authenticateToken,
    authenticateAdmin,
    deleteTeam,
);

TeamRoutes.put(
    '/:teamID/name',
    validateParams(teamIDSchema),
    validateRequest(teamSchema),
    authenticateToken,
    authenticateAdmin,
    updateTeamName,
);

TeamRoutes.get(
    '/:teamID/member',
    validateParams(teamIDSchema),
    authenticateToken,
    authenticateMember,
    getTeamMembers,
);

TeamRoutes.post(
    '/:teamID/member',
    validateParams(teamIDSchema),
    validateRequest(userIDSchema),
    authenticateToken,
    authenticateAdmin,
    addMember,
);

TeamRoutes.delete(
    '/:teamID/member/:userID',
    validateParams(memberSchema),
    authenticateToken,
    authenticateAdmin,
    removeMember,
);

export default TeamRoutes;
