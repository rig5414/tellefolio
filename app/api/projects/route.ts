// app/api/projects/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define types for the request body
interface ProjectImage {
    url: string;
    altText?: string;
}

interface ProjectLink {
    url: string;
    text: string;
}

interface CreateProjectPayload {
    title: string;
    tagline?: string;
    problemStatement?: string;
    role?: string;
    processDescription?: string;
    solutionOutcome?: string;
    videoUrl?: string;
    keyLearnings?: string;
    projectStatus?: string;
    dateRange?: string;
    displayOrder?: number;
    isFeatured?: boolean;
    githubRepoUrl?: string;
    githubRepoId?: string;
    productionUrl?: string;
    autoAnalyzed?: boolean;
    images?: ProjectImage[];
    links?: ProjectLink[];
    technologies?: string[];
    mainImageIndex?: number;
}

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
        const body = await request.json() as CreateProjectPayload;
        
        // Basic validation
        if (!body.title) {
            return NextResponse.json({ message: 'Title is required' }, { status: 400 });
        }

        // Create project with all relations in a single transaction
        const newProject = await prisma.project.create({
            data: {
                // Basic fields
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
                displayOrder: body.displayOrder ?? 0,
                isFeatured: body.isFeatured ?? false,

                // Create related records
                images: body.images ? {
                    create: body.images.map((img: ProjectImage) => ({
                        url: img.url,
                        altText: img.altText
                    }))
                } : undefined,

                links: body.links ? {
                    create: body.links.map((link: ProjectLink) => ({
                        url: link.url,
                        text: link.text
                    }))
                } : undefined,

                technologies: body.technologies ? {
                    connectOrCreate: body.technologies.map((tech: string) => ({
                        where: { name: tech },
                        create: { name: tech }
                    }))
                } : undefined
            },
            // Include relations in response
            include: {
                images: true,
                links: true,
                technologies: true
            }
        });

        // If mainImageIndex is provided and valid, update the project with mainImageId
        let updatedProject = newProject;
        if (
          typeof body.mainImageIndex === 'number' &&
          newProject.images &&
          newProject.images[body.mainImageIndex]
        ) {
          updatedProject = await prisma.project.update({
            where: { id: newProject.id },
            data: { mainImageId: newProject.images[body.mainImageIndex].id },
            include: {
              images: true,
              links: true,
              technologies: true
              // mainImage: true, // Remove this line, not supported by Prisma types yet
            },
          }) as typeof newProject;
        }

        return NextResponse.json(updatedProject, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ 
            message: 'Something went wrong creating the project.',
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

// Remember to close the Prisma client when the application exits (optional in Next.js serverless)
// process.on('beforeExit', () => {
//   prisma.$disconnect();
// });

// You can also define PUT, DELETE functions here later if needed for client-side API calls
// For now, we'll use the admin interface for data manipulation.