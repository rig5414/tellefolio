// app/api/projects/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
    try {
        const projects = await prisma.project.findMany();
        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// You can also define POST, PUT, DELETE functions here later if needed for client-side API calls
// For now, we'll use the admin interface for data manipulation.