import { Request, Response, NextFunction } from 'express';
import Project from '../../interface/Project';
import {
    deleteProject,
    insertProject,
    selectProjects,
    updateProjectName,
} from '../../models/ProjectModel';

export const getProjects = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { team_id } = req.body;
        const projects = await selectProjects(team_id);
        res.status(200).json({
            projects,
        });
    } catch (error) {
        next(error);
    }
};

export const createProject = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { team_id, name } = req.body;
        const project: Project = { team_id, name };

        await insertProject(project);

        res.status(200).json({
            message: 'Project Created',
            project,
        });
    } catch (error) {
        next(error);
    }
};

export const removeProject = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { project_id } = req.body;

        await deleteProject(project_id);

        res.status(200).json({
            message: 'Project Deleted',
        });
    } catch (error) {
        next(error);
    }
};

export const changeProjectName = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { project_id, name } = req.body;

        await updateProjectName(project_id, name);

        res.status(200).json({
            message: `Updated Project name to ${name}`,
        });
    } catch (error) {
        next(error);
    }
};
