import { Router } from 'express';
import { memberSchema, teamIDSchema, userSchema } from '../config/joiSchemas';
import {
    addMember,
    getTeamMembers,
    removeMember,
} from '../controller/MemberController';
import {
    authenticateTeamAdmin,
    authenticateTeamMember,
    authenticateToken,
} from '../middleware/authentication';
import validateRequest, { validateParams } from '../middleware/validateRequest';

const MemberRoutes = Router();

MemberRoutes.get(
    'team/:teamID/member',
    validateParams(teamIDSchema),
    authenticateToken,
    authenticateTeamMember,
    getTeamMembers,
);

MemberRoutes.post(
    'team/:teamID/member',
    validateParams(teamIDSchema),
    validateRequest(userSchema),
    authenticateToken,
    authenticateTeamAdmin,
    addMember,
);

MemberRoutes.delete(
    'team/:teamID/member/:userID',
    validateParams(memberSchema),
    authenticateToken,
    authenticateTeamAdmin,
    removeMember,
);

export default MemberRoutes;
