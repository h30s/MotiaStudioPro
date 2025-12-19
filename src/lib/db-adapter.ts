// Database adapter that works both locally and on Vercel
import { Project, Deployment, Template } from './types';
import fs from 'fs';
import path from 'path';

// Detect if we're running on Vercel
const IS_VERCEL = process.env.VERCEL === '1';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

interface DatabaseAdapter {
    getProjects(): Record<string, Project>;
    setProjects(data: Record<string, Project>): void;
    getDeployments(): Record<string, Deployment>;
    setDeployments(data: Record<string, Deployment>): void;
    getTemplates(): Record<string, Template>;
    setTemplates(data: Record<string, Template>): void;
}

// Filesystem adapter for local development
class FilesystemAdapter implements DatabaseAdapter {
    private DB_DIR = path.join(process.cwd(), '.data');
    private PROJECTS_FILE = path.join(this.DB_DIR, 'projects.json');
    private DEPLOYMENTS_FILE = path.join(this.DB_DIR, 'deployments.json');
    private TEMPLATES_FILE = path.join(this.DB_DIR, 'templates.json');

    constructor() {
        // Ensure data directory and files exist
        if (!fs.existsSync(this.DB_DIR)) {
            fs.mkdirSync(this.DB_DIR, { recursive: true });
        }

        [this.PROJECTS_FILE, this.DEPLOYMENTS_FILE, this.TEMPLATES_FILE].forEach(file => {
            if (!fs.existsSync(file)) {
                fs.writeFileSync(file, '{}', 'utf-8');
            }
        });
    }

    private readJsonFile<T>(filePath: string): T {
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            if (!data || data.trim() === '') return {} as T;

            return JSON.parse(data, (key, value) => {
                if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
                    return new Date(value);
                }
                return value;
            });
        } catch (error) {
            console.error(`Error reading ${filePath}:`, error);
            return {} as T;
        }
    }

    private writeJsonFile<T>(filePath: string, data: T): void {
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        } catch (error) {
            console.error(`Error writing ${filePath}:`, error);
        }
    }

    getProjects(): Record<string, Project> {
        return this.readJsonFile<Record<string, Project>>(this.PROJECTS_FILE);
    }

    setProjects(data: Record<string, Project>): void {
        this.writeJsonFile(this.PROJECTS_FILE, data);
    }

    getDeployments(): Record<string, Deployment> {
        return this.readJsonFile<Record<string, Deployment>>(this.DEPLOYMENTS_FILE);
    }

    setDeployments(data: Record<string, Deployment>): void {
        this.writeJsonFile(this.DEPLOYMENTS_FILE, data);
    }

    getTemplates(): Record<string, Template> {
        return this.readJsonFile<Record<string, Template>>(this.TEMPLATES_FILE);
    }

    setTemplates(data: Record<string, Template>): void {
        this.writeJsonFile(this.TEMPLATES_FILE, data);
    }
}

// In-memory adapter for Vercel (ephemeral, resets on each cold start)
class InMemoryAdapter implements DatabaseAdapter {
    private projects: Record<string, Project> = {};
    private deployments: Record<string, Deployment> = {};
    private templates: Record<string, Template> = {};

    getProjects(): Record<string, Project> {
        return this.projects;
    }

    setProjects(data: Record<string, Project>): void {
        this.projects = data;
    }

    getDeployments(): Record<string, Deployment> {
        return this.deployments;
    }

    setDeployments(data: Record<string, Deployment>): void {
        this.deployments = data;
    }

    getTemplates(): Record<string, Template> {
        return this.templates;
    }

    setTemplates(data: Record<string, Template>): void {
        this.templates = data;
    }
}

// Export the appropriate adapter
export function createAdapter(): DatabaseAdapter {
    if (IS_VERCEL || IS_PRODUCTION) {
        console.log('🧠 Using In-Memory database (Vercel/Production mode)');
        console.log('⚠️  Warning: Data will reset on serverless function cold starts');
        return new InMemoryAdapter();
    } else {
        console.log('💾 Using Filesystem database (Development mode)');
        return new FilesystemAdapter();
    }
}
