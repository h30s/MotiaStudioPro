// Persistent filesystem-based database for MVP
// Data survives server restarts and hot-reloads
// For production, replace with PostgreSQL/Prisma

import { Project, Deployment, Template } from './types';
import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), '.data');
const PROJECTS_FILE = path.join(DB_DIR, 'projects.json');
const DEPLOYMENTS_FILE = path.join(DB_DIR, 'deployments.json');
const TEMPLATES_FILE = path.join(DB_DIR, 'templates.json');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}

// Helper to safely read JSON file
function readJsonFile<T>(filePath: string, defaultValue: T): T {
    try {
        if (!fs.existsSync(filePath)) {
            return defaultValue;
        }
        const data = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(data);

        // Convert date strings back to Date objects
        return JSON.parse(data, (key, value) => {
            if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
                return new Date(value);
            }
            return value;
        });
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return defaultValue;
    }
}

// Helper to safely write JSON file
function writeJsonFile<T>(filePath: string, data: T): void {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
    }
}

class Database {
    private projects: Map<string, Project>;
    private deployments: Map<string, Deployment>;
    private templates: Map<string, Template>;

    constructor() {
        // Load existing data from files
        const projectsData = readJsonFile<Record<string, Project>>(PROJECTS_FILE, {});
        const deploymentsData = readJsonFile<Record<string, Deployment>>(DEPLOYMENTS_FILE, {});
        const templatesData = readJsonFile<Record<string, Template>>(TEMPLATES_FILE, {});

        this.projects = new Map(Object.entries(projectsData));
        this.deployments = new Map(Object.entries(deploymentsData));
        this.templates = new Map(Object.entries(templatesData));

        console.log(`📦 Database loaded: ${this.projects.size} projects, ${this.deployments.size} deployments, ${this.templates.size} templates`);
    }

    private saveProjects(): void {
        const data = Object.fromEntries(this.projects.entries());
        writeJsonFile(PROJECTS_FILE, data);
    }

    private saveDeployments(): void {
        const data = Object.fromEntries(this.deployments.entries());
        writeJsonFile(DEPLOYMENTS_FILE, data);
    }

    private saveTemplates(): void {
        const data = Object.fromEntries(this.templates.entries());
        writeJsonFile(TEMPLATES_FILE, data);
    }

    // Projects
    createProject(project: Project): Project {
        this.projects.set(project.id, project);
        this.saveProjects();
        console.log(`✅ Project saved: ${project.id}`);
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
        this.saveProjects();
        return updated;
    }

    listProjects(userId: string): Project[] {
        return Array.from(this.projects.values())
            .filter(p => p.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    deleteProject(id: string): boolean {
        const result = this.projects.delete(id);
        if (result) {
            this.saveProjects();
        }
        return result;
    }

    // Deployments
    createDeployment(deployment: Deployment): Deployment {
        this.deployments.set(deployment.id, deployment);
        this.saveDeployments();
        console.log(`✅ Deployment saved: ${deployment.id}`);
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
        this.saveDeployments();
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
        this.saveTemplates();
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
