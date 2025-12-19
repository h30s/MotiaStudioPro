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

        // Check if API key is configured
        if (!this.apiKey || this.apiKey.trim() === '') {
            throw new Error(
                'GROQ_API_KEY is not configured. Please add it to your .env file. ' +
                'Get your free API key from https://console.groq.com'
            );
        }

        // Build the prompt
        const prompt = this.buildPrompt(description, language, features);

        try {
            // Call Groq API using OpenAI-compatible chat completions
            const response = await fetch(GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: GROQ_MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert Motia backend developer who generates production-ready code.',
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
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    `Groq API error (${response.status}): ${errorData.error?.message || response.statusText}`
                );
            }

            const data = await response.json();
            const generatedText = data.choices?.[0]?.message?.content || '';

            if (!generatedText) {
                throw new Error('No content generated from Groq API');
            }

            // Parse the generated code into files
            const files = this.parseGeneratedCode(generatedText, language);

            // If parsing failed, log the raw response for debugging
            if (files.length === 0) {
                console.warn('⚠️ Groq API returned content but parsing failed. Raw response:', generatedText.substring(0, 500));
                console.warn('Using fallback code generation...');
                return this.generateFallbackCode(description, language);
            }

            return files;
        } catch (error: any) {
            console.error('❌ AI Generation Error:', error);

            // Provide helpful error messages
            if (error.message?.includes('401') || error.message?.includes('API key')) {
                throw new Error(
                    'Invalid Groq API key. Please check your .env file and get a valid key from ' +
                    'https://console.groq.com'
                );
            }

            if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('rate limit')) {
                throw new Error('Groq API rate limit exceeded. Please try again later.');
            }

            // Re-throw other errors instead of silently failing
            throw new Error(
                `Failed to generate code: ${error.message || 'Unknown error'}. ` +
                'Check your GROQ_API_KEY and internet connection.'
            );
        }
    }

    private buildPrompt(description: string, language: string, features: string[]): string {
        const featuresText = features.length > 0 ? `\nRequired features: ${features.join(', ')}` : '';

        return `You are an expert Motia backend developer. Generate production-ready code based on this description:

${description}${featuresText}

Language: ${language}

Generate a complete Motia backend project with the following structure:
1. Main workflow file (workflow.ts or workflow.py or workflow.go)
2. Step definitions (steps.ts or steps.py or steps.go)
3. Configuration file (config.ts or config.py or config.go)
4. README.md with usage instructions

Requirements:
- Use Motia Steps and Workflows
- Include comprehensive error handling
- Add detailed comments explaining the code
- Follow ${language} best practices
- Make it production-ready with proper validation
- Include retry logic where appropriate

IMPORTANT: Format your response EXACTLY like this (including the markers):
===FILE: path/to/file===
[file content here]
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
        console.log('Processing request:', context);
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

## Next Steps
1. Review the generated code
2. Customize the workflow logic
3. Add your business logic
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
