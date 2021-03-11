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
    authenticateTeamAdmin,
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
    authenticateTeamAdmin,
    deleteTeam,
);

TeamRoutes.put(
    '/:teamID/name',
    validateParams(teamIDSchema),
    validateRequest(nameSchema),
    authenticateToken,
    authenticateTeamAdmin,
    updateTeamName,
);

export default TeamRoutes;
