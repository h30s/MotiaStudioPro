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

// Ensure data directory and files exist
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize empty files if they don't exist
[PROJECTS_FILE, DEPLOYMENTS_FILE, TEMPLATES_FILE].forEach(file => {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, '{}', 'utf-8');
    }
});

// Helper to safely read JSON file with better error handling
function readJsonFile<T>(filePath: string, defaultValue: T): T {
    try {
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  File not found: ${filePath}, using default`);
            return defaultValue;
        }

        const data = fs.readFileSync(filePath, 'utf-8');
        if (!data || data.trim() === '') {
            console.log(`⚠️  Empty file: ${filePath}, using default`);
            return defaultValue;
        }

        // Convert date strings back to Date objects
        const parsed = JSON.parse(data, (key, value) => {
            if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
                return new Date(value);
            }
            return value;
        });

        return parsed;
    } catch (error) {
        console.error(`❌ Error reading ${filePath}:`, error);
        return defaultValue;
    }
}

// Helper to safely write JSON file with atomic write
function writeJsonFile<T>(filePath: string, data: T): void {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        const tempFile = `${filePath}.tmp`;

        // Write to temp file first
        fs.writeFileSync(tempFile, jsonString, 'utf-8');

        // Atomic rename
        fs.renameSync(tempFile, filePath);
    } catch (error) {
        console.error(`❌ Error writing ${filePath}:`, error);
    }
}

class Database {
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

    // Reload data from disk
    private reload(): void {
        const now = Date.now();
        if (now - this.lastLoadTime < this.RELOAD_INTERVAL) {
            return; // Don't reload too frequently
        }

        const projectsData = readJsonFile<Record<string, Project>>(PROJECTS_FILE, {});
        const deploymentsData = readJsonFile<Record<string, Deployment>>(DEPLOYMENTS_FILE, {});
        const templatesData = readJsonFile<Record<string, Template>>(TEMPLATES_FILE, {});

        this.projects = new Map(Object.entries(projectsData));
        this.deployments = new Map(Object.entries(deploymentsData));
        this.templates = new Map(Object.entries(templatesData));
        this.lastLoadTime = now;

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
