import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3003';
const API_KEY = process.env.BOT_API_KEY || 'usgrp-admin-2026-secure-key-x7k9m2p4';

async function isAuthenticated() {
    const cookieStore = await cookies();
    const session = cookieStore.get('status_session');
    if (!session) return false;
    try {
        const data = JSON.parse(session.value);
        return data.permissionLevel >= 3;
    } catch {
        return false;
    }
}

export async function POST(request: Request) {
    if (!await isAuthenticated()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        const res = await fetch(`${BOT_API_URL}/api/roadmap`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-key': API_KEY
            },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            const data = await res.json();
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'Failed to create roadmap item' }, { status: 500 });
    } catch (error) {
        console.error('Create roadmap error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
