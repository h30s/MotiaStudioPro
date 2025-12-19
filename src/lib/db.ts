// Simple in-memory database for MVP
// For production, replace with PostgreSQL/Prisma

import { Project, Deployment, Template } from './types';

class Database {
    private projects: Map<string, Project> = new Map();
    private deployments: Map<string, Deployment> = new Map();
    private templates: Map<string, Template> = new Map();

    // Projects
    createProject(project: Project): Project {
        this.projects.set(project.id, project);
        return project;
    }

    getProject(id: string): Project | undefined {
        return this.projects.get(id);
    }

    updateProject(id: string, updates: Partial<Project>): Project | undefined {
        const project = this.projects.get(id);
        if (!project) return undefined;

        const updated = { ...project, ...updates, updatedAt: new Date() };
        this.projects.set(id, updated);
        return updated;
    }

    listProjects(userId: string): Project[] {
        return Array.from(this.projects.values())
            .filter(p => p.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    deleteProject(id: string): boolean {
        return this.projects.delete(id);
    }

    // Deployments
    createDeployment(deployment: Deployment): Deployment {
        this.deployments.set(deployment.id, deployment);
        return deployment;
    }

    getDeployment(id: string): Deployment | undefined {
        return this.deployments.get(id);
    }

    updateDeployment(id: string, updates: Partial<Deployment>): Deployment | undefined {
        const deployment = this.deployments.get(id);
        if (!deployment) return undefined;

        const updated = { ...deployment, ...updates };
        this.deployments.set(id, updated);
        return updated;
    }

    getDeploymentsByProject(projectId: string): Deployment[] {
        return Array.from(this.deployments.values())
            .filter(d => d.projectId === projectId)
            .sort((a, b) => b.deployedAt.getTime() - a.deployedAt.getTime());
    }

    // Templates
    createTemplate(template: Template): Template {
        this.templates.set(template.id, template);
        return template;
    }

    getTemplate(id: string): Template | undefined {
        return this.templates.get(id);
    }

    listTemplates(): Template[] {
        return Array.from(this.templates.values());
    }
}

// Singleton instance
export const db = new Database();
