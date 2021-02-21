import { NextFunction, Request, Response } from 'express';
import { getManager } from 'typeorm';
import Project from '../../entities/Project';
import InvalidRequestException from '../../exceptions/InvalidRequestException';

export const getProjects = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const teamID = Number(req.params.teamID);

        const projectRepository = getManager().getRepository(Project);
        const projects = await projectRepository.find({
            where: { team: { teamID } },
        });

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
        const teamID = Number(req.params.teamID);
        const name = req.body.name;

        const project = new Project();
        project.team = { teamID };
        project.name = name;

        const projectRepository = getManager().getRepository(Project);
        await projectRepository.save(project);

        res.status(200).json({
            message: 'Project Created',
            project,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProject = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const projectID = Number(req.params.projectID);

        const projectRepository = getManager().getRepository(Project);
        const { affected } = await projectRepository.delete(projectID);

        if (affected == 0) {
            throw new InvalidRequestException(
                `Invalid Request: Project (${projectID}) does not exist.`,
            );
        }

        res.status(200).json({
            message: 'Project Deleted',
        });
    } catch (error) {
        next(error);
    }
};

export const updateProjectName = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const projectID = Number(req.params.projectID);
        const { name } = req.body;

        const projectRepository = getManager().getRepository(Project);
        const { affected } = await projectRepository.update(projectID, {
            name,
        });

        if (affected == 0) {
            throw new InvalidRequestException(
                `Invalid Request: Project (${projectID}) does not exist.`,
            );
        }

        res.status(200).json({
            message: `Updated Project (${projectID}) name to '${name}'`,
        });
    } catch (error) {
        next(error);
    }
};
