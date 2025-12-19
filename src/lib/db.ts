// Adaptive database that works both locally and on Vercel
// Local: Uses filesystem for persistence
// Vercel: Uses in-memory storage (ephemeral)
// For production scale, replace with PostgreSQL/Prisma or Vercel KV

import { Project, Deployment, Template } from './types';
import { createAdapter } from './db-adapter';

class Database {
    private adapter = createAdapter();
    private projects: Map<string, Project>;
    private deployments: Map<string, Deployment>;
    private templates: Map<string, Template>;
    private lastLoadTime: number = 0;
    private readonly RELOAD_INTERVAL = 1000; // Reload if data is older than 1 second

    constructor() {
        this.projects = new Map();
        this.deployments = new Map();
        this.templates = new Map();
        this.reload();
    }

    // Reload data from storage
    private reload(): void {
        const now = Date.now();
        if (now - this.lastLoadTime < this.RELOAD_INTERVAL) {
            return; // Don't reload too frequently
        }

        const projectsData = this.adapter.getProjects();
        const deploymentsData = this.adapter.getDeployments();
        const templatesData = this.adapter.getTemplates();

        this.projects = new Map(Object.entries(projectsData));
        this.deployments = new Map(Object.entries(deploymentsData));
        this.templates = new Map(Object.entries(templatesData));
        this.lastLoadTime = now;

        console.log(`📦 Database loaded: ${this.projects.size} projects, ${this.deployments.size} deployments, ${this.templates.size} templates`);
    }

    private saveProjects(): void {
        const data = Object.fromEntries(this.projects.entries());
        this.adapter.setProjects(data);
    }

    private saveDeployments(): void {
        const data = Object.fromEntries(this.deployments.entries());
        this.adapter.setDeployments(data);
    }

    private saveTemplates(): void {
        const data = Object.fromEntries(this.templates.entries());
        this.adapter.setTemplates(data);
    }

    // Projects
    createProject(project: Project): Project {
        this.reload(); // Ensure we have latest data
        this.projects.set(project.id, project);
        this.saveProjects();
        console.log(`✅ Project saved: ${project.id} (Total: ${this.projects.size})`);
        return project;
    }

    getProject(id: string): Project | undefined {
        this.reload(); // Ensure we have latest data
        const project = this.projects.get(id);
        if (!project) {
            console.log(`⚠️  Project not found: ${id} (Available: ${Array.from(this.projects.keys()).join(', ')})`);
        }
        return project;
    }

    updateProject(id: string, updates: Partial<Project>): Project | undefined {
        this.reload();
        const project = this.projects.get(id);
        if (!project) return undefined;

        const updated = { ...project, ...updates, updatedAt: new Date() };
        this.projects.set(id, updated);
        this.saveProjects();
        return updated;
    }

    listProjects(userId: string): Project[] {
        this.reload();
        return Array.from(this.projects.values())
            .filter(p => p.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    deleteProject(id: string): boolean {
        this.reload();
        const result = this.projects.delete(id);
        if (result) {
            this.saveProjects();
        }
        return result;
    }

    // Deployments
    createDeployment(deployment: Deployment): Deployment {
        this.reload();
        this.deployments.set(deployment.id, deployment);
        this.saveDeployments();
        console.log(`✅ Deployment saved: ${deployment.id}`);
        return deployment;
    }

    getDeployment(id: string): Deployment | undefined {
        this.reload();
        return this.deployments.get(id);
    }

    updateDeployment(id: string, updates: Partial<Deployment>): Deployment | undefined {
        this.reload();
        const deployment = this.deployments.get(id);
        if (!deployment) return undefined;

        const updated = { ...deployment, ...updates };
        this.deployments.set(id, updated);
        this.saveDeployments();
        return updated;
    }

    getDeploymentsByProject(projectId: string): Deployment[] {
        this.reload();
        return Array.from(this.deployments.values())
            .filter(d => d.projectId === projectId)
            .sort((a, b) => b.deployedAt.getTime() - a.deployedAt.getTime());
    }

    // Templates
    createTemplate(template: Template): Template {
        this.reload();
        this.templates.set(template.id, template);
        this.saveTemplates();
        return template;
    }

    getTemplate(id: string): Template | undefined {
        this.reload();
        return this.templates.get(id);
    }

    listTemplates(): Template[] {
        this.reload();
        return Array.from(this.templates.values());
    }
}

// Singleton instance
export const db = new Database();
