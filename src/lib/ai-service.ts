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

        return `You are an expert Motia backend code generator. Generate ONLY executable code files - NO tutorials, NO step-by-step instructions, NO markdown formatting.

Project Description: ${description}${featuresText}
Language: ${language}

CRITICAL INSTRUCTIONS:
1. Generate ONLY executable code files
2. NO "Step 1", "Step 2" or tutorial text
3. NO markdown code blocks or explanations OUTSIDE the file markers
4. Use ONLY the ===FILE:=== marker format shown below
5. Include minimal inline comments within the code only

Required Files:
- Main workflow file (src/workflow.${language === 'typescript' ? 'ts' : language === 'python' ? 'py' : 'go'})
- Step definitions (src/steps.${language === 'typescript' ? 'ts' : language === 'python' ? 'py' : 'go'})
- Configuration (src/config.${language === 'typescript' ? 'ts' : language === 'python' ? 'py' : 'go'})
- README.md with API documentation

Code Requirements:
- Use Motia Steps and Workflows properly
- Include comprehensive error handling
- Production-ready with validation
- Follow ${language} best practices
- Add retry logic for critical operations

OUTPUT FORMAT - Use EXACTLY this structure (NO other text allowed):
===FILE: path/to/file===
[actual executable code here]
===END FILE===

===FILE: another/file===
[actual executable code here]
===END FILE===

Generate the complete project now using ONLY the ===FILE:=== markers:`;
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
