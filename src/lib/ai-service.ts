// AI Service for code generation using Groq API (FREE!)

import { ProjectFile } from './types';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';

interface AIGenerateOptions {
    description: string;
    language: 'typescript' | 'python' | 'go';
    features?: string[];
}

export class AIService {
    private apiKey: string;

    constructor(apiKey?: string) {
        this.apiKey = apiKey || GROQ_API_KEY;
    }

    async generateCode(options: AIGenerateOptions): Promise<ProjectFile[]> {
        const { description, language, features = [] } = options;

        // Use template-based generation for reliable output
        console.log(`🤖 Generating ${language} project: "${description}"`);

        // Generate using templates (no AI parsing issues!)
        const files = await this.generateFromTemplates(description, language, features);

        console.log(`✅ Generated ${files.length} files successfully`);
        return files;
    }

    private async generateFromTemplates(
        description: string,
        language: string,
        features: string[]
    ): Promise<ProjectFile[]> {
        // Template-based generation ensures valid code structure
        if (language === 'typescript') {
            return this.generateTypeScriptProject(description, features);
        } else if (language === 'python') {
            return this.generatePythonProject(description, features);
        } else if (language === 'go') {
            return this.generateGoProject(description, features);
        }

        return this.generateFallbackCode(description, language);
    }

    private generateTypeScriptProject(description: string, features: string[]): ProjectFile[] {
        const projectName = this.extractProjectName(description);
        const hasDB = description.toLowerCase().includes('database') ||
            description.toLowerCase().includes('crud') ||
            features.some(f => f.toLowerCase().includes('database'));

        const files: ProjectFile[] = [];

        // 1. Package.json
        files.push({
            path: 'package.json',
            content: `{
  "name": "${projectName.toLowerCase().replace(/\s+/g, '-')}",
  "version": "1.0.0",
  "description": "${description}",
  "scripts": {
    "start": "ts-node src/index.ts",
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc"
  },
  "dependencies": {
    "motia": "^1.0.0"${hasDB ? ',\n    "@types/node": "^20.0.0"' : ''}
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0",
    "nodemon": "^3.0.0"
  }
}`,
            language: 'json'
        });

        // 2. TypeScript Config
        files.push({
            path: 'tsconfig.json',
            content: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}`,
            language: 'json'
        });

        // 3. Config file
        files.push({
            path: 'src/config.ts',
            content: `import { WorkflowConfig } from 'motia';

export const config: WorkflowConfig = {
  name: '${projectName}',
  description: '${description}',
  retryPolicy: {
    maxRetries: 3,
    backoffStrategy: {
      initialDelay: 1000,
      multiplier: 2,
    },
  },
};

export default config;`,
            language: 'typescript'
        });

        // 4. Database utilities (if needed)
        if (hasDB) {
            files.push({
                path: 'src/db.ts',
                content: `// Simple in-memory database for demo
const db: Map<string, any> = new Map();

export const database = {
  async create(id: string, data: any) {
    db.set(id, { id, ...data, createdAt: new Date().toISOString() });
    return db.get(id);
  },
  
  async read(id: string) {
    return db.get(id) || null;
  },
  
  async update(id: string, data: any) {
    const existing = db.get(id);
    if (!existing) throw new Error('Not found');
    const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
    db.set(id, updated);
    return updated;
  },
  
  async delete(id: string) {
    const existed = db.has(id);
    db.delete(id);
    return existed;
  },
  
  async list() {
    return Array.from(db.values());
  }
};`,
                language: 'typescript'
            });
        }

        // 5. Steps file
        files.push({
            path: 'src/steps.ts',
            content: `import { Step } from 'motia';${hasDB ? "\nimport { database } from './db';" : ''}

export const validateInput: Step = {
  name: 'validate-input',
  description: 'Validate incoming request data',
  async handler(context) {
    if (!context.input) {
      throw new Error('Input is required');
    }
    console.log('✅ Input validated');
    return context.input;
  }
};

export const processRequest: Step = {
  name: 'process-request',
  description: 'Process the validated request',
  async handler(context) {
    const { action, data } = context.input;
    
    ${hasDB ? `// CRUD operations
    switch (action) {
      case 'create':
        const created = await database.create(data.id || Date.now().toString(), data);
        return { success: true, data: created };
      
      case 'read':
        const item = await database.read(data.id);
        return { success: true, data: item };
      
      case 'update':
        const updated = await database.update(data.id, data);
        return { success: true, data: updated };
      
      case 'delete':
        await database.delete(data.id);
        return { success: true, message: 'Deleted successfully' };
      
      case 'list':
        const items = await database.list();
        return { success: true, data: items };
      
      default:
        throw new Error(\`Unknown action: \${action}\`);
    }` : `// Process the data
    const result = {
      success: true,
      data,
      processedAt: new Date().toISOString()
    };
    console.log('✅ Request processed');
    return result;`}
  }
};

export const steps = [validateInput, processRequest];`,
            language: 'typescript'
        });

        // 6. Workflow file
        files.push({
            path: 'src/workflow.ts',
            content: `import { workflow } from 'motia';
import { config } from './config';
import { steps } from './steps';

export const mainWorkflow = workflow({
  name: '${projectName.toLowerCase().replace(/\s+/g, '-')}',
  description: '${description}',
  retryPolicy: config.retryPolicy,
  steps
});

export default mainWorkflow;`,
            language: 'typescript'
        });

        // 7. Main entry point
        files.push({
            path: 'src/index.ts',
            content: `import { mainWorkflow } from './workflow';

// Example usage
async function main() {
  try {
    console.log('🚀 Starting workflow...');
    
    ${hasDB ? `// Example: Create an item
    const createResult = await mainWorkflow.run({
      action: 'create',
      data: { id: '1', name: 'Example Item' }
    });
    console.log('Created:', createResult);
    
    // Example: List all items
    const listResult = await mainWorkflow.run({
      action: 'list',
      data: {}
    });
    console.log('List:', listResult);` : `const result = await mainWorkflow.run({
      message: 'Hello from Motia!',
      timestamp: new Date().toISOString()
    });
    console.log('Result:', result);`}
    
    console.log('✅ Workflow completed successfully');
  } catch (error) {
    console.error('❌ Workflow failed:', error);
    process.exit(1);
  }
}

main();`,
            language: 'typescript'
        });

        // 8. README
        files.push({
            path: 'README.md',
            content: `# ${projectName}

${description}

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`bash
npm run dev
\`\`\`
${hasDB ? `
## API Operations

The workflow supports CRUD operations:
- **Create**: \`{ action: 'create', data: { id, ...fields } }\`
- **Read**: \`{ action: 'read', data: { id } }\`
- **Update**: \`{ action: 'update', data: { id, ...fields } }\`
- **Delete**: \`{ action: 'delete', data: { id } }\`
- **List**: \`{ action: 'list', data: {} }\`
` : ''}
## Project Structure

- \`src/workflow.ts\` - Main workflow definition
- \`src/steps.ts\` - Step implementations
- \`src/config.ts\` - Configuration${hasDB ? '\n- `src/db.ts` - Database utilities' : ''}
- \`src/index.ts\` - Entry point

## Next Steps

1. Customize the step logic in \`src/steps.ts\`
2. Add your business requirements
3. Test thoroughly
4. Deploy to production
`,
            language: 'markdown'
        });

        return files;
    }

    private generatePythonProject(description: string, features: string[]): ProjectFile[] {
        // Add Python templates here
        return this.generateFallbackCode(description, 'python');
    }

    private generateGoProject(description: string, features: string[]): ProjectFile[] {
        // Add Go templates here
        return this.generateFallbackCode(description, 'go');
    }

    private extractProjectName(description: string): string {
        const lowerDesc = description.toLowerCase();

        if (lowerDesc.includes("payment") || lowerDesc.includes("stripe")) {
            return "Payment API";
        } else if (lowerDesc.includes("todo") || lowerDesc.includes("task")) {
            return "Todo API";
        } else if (lowerDesc.includes("crud") || lowerDesc.includes("rest")) {
            return "REST API";
        } else if (lowerDesc.includes("webhook")) {
            return "Webhook Handler";
        } else if (lowerDesc.includes("ai") || lowerDesc.includes("agent")) {
            return "AI Agent";
        } else if (lowerDesc.includes("ecommerce") || lowerDesc.includes("shop")) {
            return "E-commerce API";
        } else if (lowerDesc.includes("auth") || lowerDesc.includes("login")) {
            return "Auth Service";
        } else if (lowerDesc.includes("notification") || lowerDesc.includes("email")) {
            return "Notification Service";
        } else {
            return "Custom API";
        }
    }

    private buildPrompt(description: string, language: string, features: string[]): string {
        const featuresText = features.length > 0 ? `\nRequired features: ${features.join(', ')}` : '';
        const ext = language === 'typescript' ? 'ts' : language === 'python' ? 'py' : 'go';

        return `Generate ONLY raw executable code. NO markdown, NO explanations, NO tutorials.

Task: ${description}${featuresText}

RULES (FOLLOW EXACTLY):
- Output ONLY the ===FILE:=== markers with code inside
- NO triple backticks (\`\`\`) anywhere
- NO bullet points or "Method:", "Request:", etc.
- NO step-by-step instructions
- Just pure executable ${language} code

Required structure:
===FILE: src/workflow.${ext}===
import { workflow } from 'motia';
import { steps } from './steps';
export const mainWorkflow = workflow({ name: 'api', steps });
===END FILE===

===FILE: src/steps.${ext}===
import { Step } from 'motia';
export const steps: Step[] = [/* your steps */];
===END FILE===

===FILE: src/config.${ext}===
export const config = { retryPolicy: { maxRetries: 3 } };
===END FILE===

===FILE: README.md===
# API Documentation
## Endpoints
- POST /api/endpoint
===END FILE===

NOW generate the complete ${language} project for: ${description}
Use ONLY ===FILE:=== markers. Start NOW:`;
    }

    private parseGeneratedCode(text: string, language: string): ProjectFile[] {
        const files: ProjectFile[] = [];

        // Clean up the text first - remove any markdown artifacts
        let cleaned = text
            .replace(/```[\w]*\n/g, '') // Remove opening code blocks
            .replace(/```/g, '')         // Remove closing code blocks
            .replace(/^\*\*[^*]+\*\*:?\s*/gm, '') // Remove bold markdown headers
            .replace(/^[-*]\s+/gm, '');  // Remove bullet points

        const fileRegex = /===FILE:\s*(.+?)===\s*\n([\s\S]*?)===END FILE===/g;

        let match;
        while ((match = fileRegex.exec(cleaned)) !== null) {
            const path = match[1].trim();
            let content = match[2].trim();

            // Additional cleaning for code content
            content = content
                .replace(/^```[\w]*\n/gm, '')
                .replace(/^```$/gm, '')
                .trim();

            files.push({
                path,
                content,
                language,
            });
        }

        // If no files were parsed, create a basic structure
        if (files.length === 0) {
            return this.generateFallbackCode(text, language);
        }

        return files;
    }

    private generateFallbackCode(description: string, language: string): ProjectFile[] {
        // Enhanced fallback for when AI fails to parse
        if (language === 'typescript') {
            return [
                {
                    path: 'src/workflow.ts',
                    content: `import { Step, workflow } from 'motia';
import { config } from './config';
import { processStep, validateStep } from './steps';

// ${description}

export const mainWorkflow = workflow({
  name: 'main-workflow',
  description: '${description}',
  retryPolicy: config.retryPolicy,
  steps: [validateStep, processStep]
});

export default mainWorkflow;`,
                    language: 'typescript',
                },
                {
                    path: 'src/steps.ts',
                    content: `import { Step } from 'motia';

export const validateStep: Step = {
  name: 'validate-input',
  description: 'Validate incoming data',
  async handler(context) {
    if (!context.input) {
      throw new Error('Input is required');
    }
    console.log('✅ Input validated:', context.input);
    return context.input;
  }
};

export const processStep: Step = {
  name: 'process-data',
  description: 'Process the validated data',
  async handler(context) {
    const result = {
      success: true,
      data: context.input,
      processedAt: new Date().toISOString()
    };
    console.log('✅ Data processed:', result);
    return result;
  }
};`,
                    language: 'typescript',
                },
                {
                    path: 'src/config.ts',
                    content: `import { WorkflowConfig } from 'motia';

export const config: WorkflowConfig = {
  name: 'Generated Workflow',
  description: '${description}',
  retryPolicy: {
    maxRetries: 3,
    backoffStrategy: {
      initialDelay: 1000,
      multiplier: 2,
    },
  },
};

export default config;`,
                    language: 'typescript',
                },
                {
                    path: 'README.md',
                    content: `# Generated Motia Project

## Description
${description}

## Structure
- \`src/workflow.ts\` - Main workflow definition
- \`src/steps.ts\` - Step implementations
- \`src/config.ts\` - Configuration

## Usage
\`\`\`bash
npm install motia
motia dev
\`\`\`

## API Endpoints
The workflow exposes the following endpoints:
- POST /workflow - Execute the main workflow

## Next Steps
1. Review and customize the step logic
2. Add your business requirements
3. Test thoroughly
4. Deploy to production
`,
                    language: 'markdown',
                },
            ];
        }

        // Add fallbacks for Python and Go if needed
        return [];
    }

    async validateCode(files: ProjectFile[]): Promise<{ valid: boolean; errors: string[] }> {
        const errors: string[] = [];

        // Basic validation
        if (files.length === 0) {
            errors.push('No files generated');
            return { valid: false, errors };
        }

        // Check for required files
        const hasWorkflow = files.some(f =>
            f.path.includes('workflow') || f.path.includes('main')
        );

        if (!hasWorkflow) {
            errors.push('Missing main workflow file');
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    }
}

// Singleton instance
export const aiService = new AIService();
