import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('status_session');

        if (!sessionCookie) {
            return NextResponse.json({ authenticated: false });
        }

        const session = JSON.parse(sessionCookie.value);
        return NextResponse.json({
            authenticated: true,
            email: session.email,
            discordId: session.discordId,
            permissionLevel: session.permissionLevel,
            permissionName: session.permissionName,
        });
    } catch {
        return NextResponse.json({ authenticated: false });
    }
}
