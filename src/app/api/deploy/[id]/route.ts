// API Route: Deploy project to Motia
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateId, estimateDeploymentTime, sleep } from '@/lib/utils';

// Ensure we use Node.js runtime for this API route
export const runtime = 'nodejs';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const projectId = params.id;

        console.log('[Deploy API] Received deployment request for project:', projectId);

        // Get project
        const project = db.getProject(projectId);
        if (!project) {
            console.error('[Deploy API] Project not found:', projectId);
            return NextResponse.json(
                { error: 'Project not found', projectId },
                { status: 404 }
            );
        }

        console.log('[Deploy API] Found project:', project.name);

        if (project.status !== 'ready') {
            return NextResponse.json(
                { error: 'Project is not ready for deployment' },
                { status: 400 }
            );
        }

        // Create deployment record
        const deploymentId = generateId('dep');
        const deployment = db.createDeployment({
            id: deploymentId,
            projectId,
            status: 'deploying',
            deployedAt: new Date(),
            config: {
                memory: '512MB',
                timeout: 30,
            },
        });

        // Start deployment in background
        deployToMotiaInBackground(deploymentId, project);

        return NextResponse.json({
            success: true,
            deploymentId,
            status: 'deploying',
            estimatedTime: estimateDeploymentTime(project.files.length),
        });

    } catch (error) {
        console.error('Deploy error:', error);
        return NextResponse.json(
            { error: 'Failed to start deployment' },
            { status: 500 }
        );
    }
}

// Background deployment function
async function deployToMotiaInBackground(
    deploymentId: string,
    project: any
) {
    try {
        // Simulate deployment steps
        await sleep(2000);

        // In production, this would:
        // 1. Create Motia project
        // 2. Upload files
        // 3. Run build
        // 4. Deploy to production
        // 5. Run health checks

        // For now, simulate successful deployment
        const mockUrl = `https://${project.name.toLowerCase().replace(/\s+/g, '-')}-${project.id}.motia.app`;

        db.updateDeployment(deploymentId, {
            status: 'live',
            url: mockUrl,
            metrics: {
                requests: 0,
                avgLatency: '0ms',
                errorRate: '0%',
                uptime: '100%',
            },
        });

    } catch (error) {
        console.error('Background deployment error:', error);
        db.updateDeployment(deploymentId, {
            status: 'failed',
            error: error instanceof Error ? error.message : 'Deployment failed',
        });
    }
}
