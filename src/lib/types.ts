// Database types and models for Motia Studio Pro

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: 'generating' | 'ready' | 'error';
  language: 'typescript' | 'python' | 'go';
  templateId?: string;
  files: ProjectFile[];
  createdAt: Date;
  updatedAt: Date;
  error?: string;
}

export interface ProjectFile {
  path: string;
  content: string;
  language: string;
}

export interface Deployment {
  id: string;
  projectId: string;
  status: 'deploying' | 'live' | 'failed';
  url?: string;
  error?: string;
  deployedAt: Date;
  config: {
    memory: string;
    timeout: number;
  };
  metrics?: DeploymentMetrics;
}

export interface DeploymentMetrics {
  requests: number;
  avgLatency: string;
  errorRate: string;
  uptime: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDeployTime: number;
  features: string[];
  preview: {
    image: string;
    code: string;
  };
  useCases: string[];
  files: ProjectFile[];
}

export interface GenerateRequest {
  description: string;
  language: 'typescript' | 'python' | 'go';
  features?: string[];
}

export interface GenerateResponse {
  projectId: string;
  status: 'generating' | 'ready' | 'error';
  estimatedTime: number;
}

export interface DeployRequest {
  projectId: string;
}

export interface DeployResponse {
  deploymentId: string;
  status: 'deploying' | 'live' | 'failed';
  estimatedTime: number;
}
