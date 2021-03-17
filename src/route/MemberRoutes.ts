import { Router } from 'express';
import {
    memberSchema,
    projectIDSchema,
    teamIDSchema,
} from '../config/joiSchemas';
import {
    addMember,
    getProjectMembers,
    getTeamMembers,
    quitTeam,
    removeMember,
} from '../controller/MemberController';
import {
    authenticateProjectMember,
    authenticateTeamAdmin,
    authenticateTeamMember,
    authenticateToken,
} from '../middleware/authentication';
import { validateParams } from '../middleware/validateRequest';

const MemberRoutes = Router();

MemberRoutes.get(
    '/team/:teamID',
    validateParams(teamIDSchema),
    authenticateToken,
    authenticateTeamMember,
    getTeamMembers,
);

MemberRoutes.delete(
    '/team/:teamID',
    validateParams(teamIDSchema),
    authenticateToken,
    quitTeam,
);

MemberRoutes.get(
    '/project/:projectID',
    validateParams(projectIDSchema),
    authenticateToken,
    authenticateProjectMember,
    getProjectMembers,
);

MemberRoutes.post(
    '/:userID/team/:teamID/',
    validateParams(memberSchema),
    authenticateToken,
    authenticateTeamAdmin,
    addMember,
);

MemberRoutes.delete(
    '/:userID/team/:teamID/',
    validateParams(memberSchema),
    authenticateToken,
    authenticateTeamAdmin,
    removeMember,
);

export default MemberRoutes;
