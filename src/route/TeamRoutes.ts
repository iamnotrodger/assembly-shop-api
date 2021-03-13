import { Router } from 'express';
import { nameSchema, teamIDSchema, teamSchema } from '../config/joiSchemas';
import { getTeamProjects } from '../controller/ProjectController';
import {
    createTeam,
    deleteTeam,
    getTeam,
    getTeams,
    getTeamsByAdmin,
    updateTeamName,
} from '../controller/TeamController';
import {
    authenticateTeamAdmin,
    authenticateTeamMember,
    authenticateToken,
} from '../middleware/authentication';
import validateRequest, { validateParams } from '../middleware/validateRequest';

const TeamRoutes = Router();

TeamRoutes.get('', authenticateToken, getTeams);

TeamRoutes.post('', authenticateToken, validateRequest(teamSchema), createTeam);

TeamRoutes.get('/admin', authenticateToken, getTeamsByAdmin);

TeamRoutes.get(
    '/:teamID',
    validateParams(teamIDSchema),
    authenticateToken,
    authenticateTeamMember,
    getTeam,
);

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

//Get Team Projects
TeamRoutes.get(
    '/:teamID/project',
    validateParams(teamIDSchema),
    authenticateToken,
    authenticateTeamMember,
    getTeamProjects,
);

export default TeamRoutes;
