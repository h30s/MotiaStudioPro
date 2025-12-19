// API Route: Get deployment status
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const deployment = db.getDeployment(params.id);

        if (!deployment) {
            return NextResponse.json(
                { error: 'Deployment not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: deployment,
        });
    } catch (error) {
        console.error('Get deployment error:', error);
        return NextResponse.json(
            { error: 'Failed to get deployment status' },
            { status: 500 }
        );
    }
}
