// API Route: Get single template and deploy from it
import { NextRequest, NextResponse } from 'next/server';
import { templates } from '@/lib/templates';
import { db } from '@/lib/db';
import { generateId } from '@/lib/utils';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const template = templates.find(t => t.id === params.id);

        if (!template) {
            return NextResponse.json(
                { error: 'Template not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: template,
        });
    } catch (error) {
        console.error('Get template error:', error);
        return NextResponse.json(
            { error: 'Failed to get template' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const template = templates.find(t => t.id === params.id);

        if (!template) {
            return NextResponse.json(
                { error: 'Template not found' },
                { status: 404 }
            );
        }

        // Create project from template
        const projectId = generateId('proj');
        const project = db.createProject({
            id: projectId,
            userId: 'demo-user', // TODO: Get from auth
            name: template.name,
            description: template.description,
            status: 'ready',
            language: 'typescript',
            templateId: template.id,
            files: template.files,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            projectId,
            message: `Project created from ${template.name} template`,
            data: project,
        });

    } catch (error) {
        console.error('Create from template error:', error);
        return NextResponse.json(
            { error: 'Failed to create project from template' },
            { status: 500 }
        );
    }
}
