import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/config';
import { NextResponse } from 'next/server';
import type { Session } from 'next-auth';

interface SessionWithGitHubToken extends Session {
  githubAccessToken?: string;
}

export async function GET() {
  const session = (await getServerSession(authOptions)) as SessionWithGitHubToken;
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accessToken = session.githubAccessToken;
  if (!accessToken) {
    return NextResponse.json({ error: 'No GitHub access token found' }, { status: 401 });
  }

  // Fetch repos from GitHub API
  const res = await fetch('https://api.github.com/user/repos?per_page=100', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
    },
  });
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch repos from GitHub' }, { status: 500 });
  }
  const repos = await res.json();
  return NextResponse.json(repos);
}
