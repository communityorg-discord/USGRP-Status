import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3003';
const API_KEY = process.env.BOT_API_KEY || 'usgrp-admin-2026-secure-key-x7k9m2p4';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        // Authenticate via bot API
        const authRes = await fetch(`${BOT_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-key': API_KEY
            },
            body: JSON.stringify({ email, password }),
        });

        if (!authRes.ok) {
            const error = await authRes.json().catch(() => ({ error: 'Authentication failed' }));
            return NextResponse.json({ error: error.error || 'Invalid credentials' }, { status: 401 });
        }

        const data = await authRes.json();

        // Check permission level (must be ADMIN or higher - level 3+)
        if (data.permissionLevel < 3) {
            return NextResponse.json({ error: 'Insufficient permissions. Admin access required.' }, { status: 403 });
        }

        // Set session cookie
        const cookieStore = await cookies();
        cookieStore.set('status_session', JSON.stringify({
            email: data.email,
            discordId: data.discordId,
            permissionLevel: data.permissionLevel,
            permissionName: data.permissionName,
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
