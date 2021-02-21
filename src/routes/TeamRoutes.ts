import { Router } from 'express';
import {
    createTeam,
    deleteTeam,
    getTeams,
    updateTeamName,
} from '../controllers/TeamController';
import {
    authenticateAdmin,
    authenticateToken,
} from '../middleware/authentication';
import validateRequest, {
    nameSchema,
    teamIDSchema,
    validateParams,
} from '../middleware/validateRequest';

const TeamRoutes = Router();

TeamRoutes.get('', authenticateToken, getTeams);

TeamRoutes.post('', authenticateToken, validateRequest(nameSchema), createTeam);

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
    validateRequest(nameSchema),
    authenticateToken,
    authenticateAdmin,
    updateTeamName,
);

export default TeamRoutes;
