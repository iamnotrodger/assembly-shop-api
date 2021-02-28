import { Router } from 'express';
import { nameSchema, teamIDSchema, teamSchema } from '../config/joiSchemas';
import {
    createTeam,
    deleteTeam,
    getTeams,
    getTeamsByAdmin,
    updateTeamName,
} from '../controller/TeamController';
import {
    authenticateAdmin,
    authenticateToken,
} from '../middleware/authentication';
import validateRequest, { validateParams } from '../middleware/validateRequest';

const TeamRoutes = Router();

TeamRoutes.get('', authenticateToken, getTeams);

TeamRoutes.post('', authenticateToken, validateRequest(teamSchema), createTeam);

TeamRoutes.get('/admin', authenticateToken, getTeamsByAdmin);

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
