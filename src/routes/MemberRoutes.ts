import { Router } from 'express';
import {
    getTeamMembers,
    addMember,
    removeMember,
} from '../controllers/MemberController';
import {
    authenticateToken,
    authenticateMember,
    authenticateAdmin,
} from '../middleware/authentication';
import validateRequest, {
    validateParams,
    teamIDSchema,
    userIDSchema,
    memberSchema,
} from '../middleware/validateRequest';

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
    validateRequest(userIDSchema),
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
