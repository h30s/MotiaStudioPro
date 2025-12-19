// AI Service for code generation using OpenAI

import { ProjectFile } from './types';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

interface AIGenerateOptions {
    description: string;
    language: 'typescript' | 'python' | 'go';
    features?: string[];
}

export class AIService {
    private apiKey: string;

    constructor(apiKey?: string) {
        this.apiKey = apiKey || OPENAI_API_KEY;
    }

    async generateCode(options: AIGenerateOptions): Promise<ProjectFile[]> {
        const { description, language, features = [] } = options;

        // Build the prompt
        const prompt = this.buildPrompt(description, language, features);

        try {
            // Call OpenAI API
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert Motia backend developer. Generate production-ready code that follows best practices.',
                        },
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 4000,
                }),
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            const data = await response.json();
            const generatedText = data.choices[0]?.message?.content || '';

            // Parse the generated code into files
            const files = this.parseGeneratedCode(generatedText, language);

            return files;
        } catch (error) {
            console.error('AI Generation Error:', error);
            // Fallback to template-based generation
            return this.generateFallbackCode(description, language);
        }
    }

    private buildPrompt(description: string, language: string, features: string[]): string {
        const featuresText = features.length > 0 ? `\nRequired features: ${features.join(', ')}` : '';

        return `Generate a complete Motia backend project based on this description:

${description}${featuresText}

Language: ${language}

Generate production-ready code with the following structure:
1. Main workflow file (workflow.ts or workflow.py or workflow.go)
2. Step definitions (steps.ts or steps.py or steps.go)
3. Configuration file (config.ts or config.py or config.go)
4. README.md with usage instructions

Requirements:
- Use Motia Steps and Workflows
- Include error handling
- Add comprehensive comments
- Follow ${language} best practices
- Make it production-ready

Format your response as:
===FILE: path/to/file===
[file content]
===END FILE===

Generate all necessary files now:`;
    }

    private parseGeneratedCode(text: string, language: string): ProjectFile[] {
        const files: ProjectFile[] = [];
        const fileRegex = /===FILE:\s*(.+?)===\n([\s\S]*?)===END FILE===/g;

        let match;
        while ((match = fileRegex.exec(text)) !== null) {
            const path = match[1].trim();
            const content = match[2].trim();

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
        // Simple fallback for when AI fails
        if (language === 'typescript') {
            return [
                {
                    path: 'src/workflow.ts',
                    content: `// Generated Motia Workflow
import { Step, workflow } from 'motia';

// ${description}

export const mainWorkflow = workflow({
  name: 'main-workflow',
  steps: [
    Step({
      name: 'process',
      async handler(context) {
        // TODO: Implement your logic here
        return { success: true };
      }
    })
  ]
});`,
                    language: 'typescript',
                },
                {
                    path: 'README.md',
                    content: `# Generated Motia Project

## Description
${description}

## Usage
\`\`\`bash
motia dev
\`\`\`
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
