import { Router } from 'express';
import { nameSchema, projectSchema, teamIDSchema } from '../config/joiSchemas';
import {
    createProject,
    deleteProject,
    getProjects,
    updateProjectName,
} from '../controller/ProjectController';
import {
    authenticateAdmin,
    authenticateMember,
    authenticateToken,
} from '../middleware/authentication';
import validateRequest, { validateParams } from '../middleware/validateRequest';

const ProjectRoutes = Router();
const baseURI = '/team/:teamID/project';

//Get Team Projects
ProjectRoutes.get(
    baseURI,
    validateParams(teamIDSchema),
    authenticateToken,
    authenticateMember,
    getProjects,
);

// Create Project
ProjectRoutes.post(
    baseURI,
    validateRequest(nameSchema),
    authenticateToken,
    authenticateAdmin,
    createProject,
);

//Delete Project
ProjectRoutes.delete(
    baseURI + '/:projectID',
    validateParams(projectSchema),
    authenticateToken,
    authenticateAdmin,
    deleteProject,
);

//Update Project's Name
ProjectRoutes.put(
    baseURI + '/:projectID/name',
    validateParams(projectSchema),
    validateRequest(nameSchema),
    authenticateToken,
    authenticateAdmin,
    updateProjectName,
);

// //Create Assignment
// ProjectRoutes.post(
//     '/:project_id/task/:task_id/assignment',
//     validateParams(taskIDSchema),
//     validateRequest(postAssignmentSchema),
//     authenticateToken,
//     authenticateProjectAdmin,
//     authenticateMemberByRequest,
//     createAssignment,
// );

// //Delete Assignment
// ProjectRoutes.delete(
//     '/:project_id/task/:task_id/assignment',
//     validateParams(taskIDSchema),
//     authenticateToken,
//     authenticateProjectAdmin,
//     removeAssignment,
// );

// //Start Assignment
// ProjectRoutes.put(
//     '/:project_id/task/:task_id/assignment/start',
//     validateParams(taskIDSchema),
//     authenticateToken,
//     authenticateProjectMember,
//     updateAssignmentStatus('ONGOING'),
// );

// //Complete Assignment
// ProjectRoutes.put(
//     '/:project_id/task/:task_id/assignment/complete',
//     validateParams(taskIDSchema),
//     authenticateToken,
//     authenticateProjectMember,
//     updateAssignmentStatus('COMPLETED'),
// );

export default ProjectRoutes;
