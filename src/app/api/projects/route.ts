// API Route: Get all projects for user
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        // TODO: Get userId from auth session
        const userId = 'demo-user';

        const projects = db.listProjects(userId);

        return NextResponse.json({
            success: true,
            data: projects,
            total: projects.length,
        });
    } catch (error) {
        console.error('List projects error:', error);
        return NextResponse.json(
            { error: 'Failed to list projects' },
            { status: 500 }
        );
    }
}
