// API Route: Get all templates
import { NextResponse } from 'next/server';
import { templates } from '@/lib/templates';

export async function GET() {
    try {
        // Return all templates with summary info
        const templateSummaries = templates.map(t => ({
            id: t.id,
            name: t.name,
            description: t.description,
            category: t.category,
            difficulty: t.difficulty,
            deployTime: t.deployTime,
            features: t.features,
        }));

        return NextResponse.json({
            success: true,
            data: templateSummaries,
            total: templateSummaries.length,
        });
    } catch (error) {
        console.error('Get templates error:', error);
        return NextResponse.json(
            { error: 'Failed to get templates' },
            { status: 500 }
        );
    }
}
