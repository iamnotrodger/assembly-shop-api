import { Router } from 'express';
import { memberSchema, teamIDSchema, userSchema } from '../config/joiSchemas';
import {
    addMember,
    getTeamMembers,
    removeMember,
} from '../controller/MemberController';
import {
    authenticateAdmin,
    authenticateMember,
    authenticateToken,
} from '../middleware/authentication';
import validateRequest, { validateParams } from '../middleware/validateRequest';

const MemberRoutes = Router();

MemberRoutes.get(
    '/:teamID/member',
    validateParams(teamIDSchema),
    authenticateToken,
    authenticateMember,
    getTeamMembers,
);

MemberRoutes.post(
    '/:teamID/member',
    validateParams(teamIDSchema),
    validateRequest(userSchema),
    authenticateToken,
    authenticateAdmin,
    addMember,
);

MemberRoutes.delete(
    '/:teamID/member/:userID',
    validateParams(memberSchema),
    authenticateToken,
    authenticateAdmin,
    removeMember,
);

export default MemberRoutes;
