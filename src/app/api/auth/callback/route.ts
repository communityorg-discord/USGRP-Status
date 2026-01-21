import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, SessionData } from '@/lib/session';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const AUTH_URL = 'https://auth.usgrp.xyz';
const APP_URL = 'https://status.usgrp.xyz';

/**
 * Auth callback handler for SSO flow
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
            return NextResponse.redirect(`${APP_URL}/admin?error=${encodeURIComponent(error)}`);
        }

        if (!token) {
            return NextResponse.redirect(`${APP_URL}/admin?error=No token received`);
        }

        // Validate token with Auth service
        let validateRes;
        try {
            validateRes = await fetch(`${AUTH_URL}/api/auth/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, service: 'Status Portal' }),
            });
        } catch (fetchError) {
            console.error('Fetch to Auth failed:', fetchError);
            return NextResponse.redirect(`${APP_URL}/admin?error=Cannot connect to Auth service`);
        }

        const validateData = await validateRes.json();

        if (!validateRes.ok || !validateData.valid) {
            return NextResponse.redirect(`${APP_URL}/admin?error=${encodeURIComponent(validateData.error || 'Invalid token')}`);
        }

        // Check minimum authority level (ADMIN = 3)
        if (validateData.user.authorityLevel < 3) {
            return NextResponse.redirect(`${APP_URL}/admin?error=Insufficient permissions (Admin+ required)`);
        }

        // Create local session
        const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
        session.authToken = token;
        session.user = validateData.user;
        session.isLoggedIn = true;
        session.lastActivity = Date.now();
        await session.save();

        // Also set legacy cookie for existing session API
        const cookieStore = await cookies();
        cookieStore.set('status_session', JSON.stringify({
            email: validateData.user.email,
            discordId: validateData.user.discordId,
            permissionLevel: validateData.user.authorityLevel,
            permissionName: getPermissionName(validateData.user.authorityLevel),
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
        });

        return NextResponse.redirect(`${APP_URL}/admin`);

    } catch (error: unknown) {
        console.error('Auth callback error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.redirect(`${APP_URL}/admin?error=${encodeURIComponent('Callback failed: ' + message)}`);
    }
}

function getPermissionName(level: number): string {
    const names: Record<number, string> = {
        0: 'User',
        1: 'Moderator',
        2: 'Senior Mod',
        3: 'Admin',
        4: 'HR',
        5: 'Superuser',
        6: 'Bot Developer',
    };
    return names[level] || 'User';
}
