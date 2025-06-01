// app/api/projects/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/projects
export async function GET() {
    try {
        const projects = await prisma.project.findMany();
        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ message: 'Something went wrong fetching projects.' }, { status: 500 });
    }
}

// POST /api/projects
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        // Basic validation - expand this as needed
        if (!body.title) {
            return NextResponse.json({ message: 'Title is required' }, { status: 400 });
        }

        const newProject = await prisma.project.create({
            data: {
                title: body.title,
                tagline: body.tagline,
                problemStatement: body.problemStatement,
                role: body.role,
                processDescription: body.processDescription,
                solutionOutcome: body.solutionOutcome,
                videoUrl: body.videoUrl,
                keyLearnings: body.keyLearnings,
                projectStatus: body.projectStatus,
                dateRange: body.dateRange,
                displayOrder: body.displayOrder,
                isFeatured: body.isFeatured,
                // Note: Images, links, and technologies will need separate endpoints or a more complex POST body
            },
        });

        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ message: 'Something went wrong creating the project.' }, { status: 500 });
    }
}

// Remember to close the Prisma client when the application exits (optional in Next.js serverless)
// process.on('beforeExit', () => {
//   prisma.$disconnect();
// });

// You can also define PUT, DELETE functions here later if needed for client-side API calls
// For now, we'll use the admin interface for data manipulation.