import { Router } from 'express';
import {
    memberSchema,
    projectIDSchema,
    teamIDSchema,
    userSchema,
} from '../config/joiSchemas';
import {
    addMember,
    getProjectMembers,
    getTeamMembers,
    removeMember,
} from '../controller/MemberController';
import {
    authenticateProjectMember,
    authenticateTeamAdmin,
    authenticateTeamMember,
    authenticateToken,
} from '../middleware/authentication';
import validateRequest, { validateParams } from '../middleware/validateRequest';

const MemberRoutes = Router();

MemberRoutes.get(
    '/team/:teamID',
    validateParams(teamIDSchema),
    authenticateToken,
    authenticateTeamMember,
    getTeamMembers,
);

MemberRoutes.get(
    '/project/:projectID',
    validateParams(projectIDSchema),
    authenticateToken,
    authenticateProjectMember,
    getProjectMembers,
);

MemberRoutes.post(
    '/team/:teamID',
    validateParams(teamIDSchema),
    validateRequest(userSchema),
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
