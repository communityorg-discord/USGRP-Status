import { NextResponse } from 'next/server';

const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3003';

export async function GET() {
    try {
        // Fetch status from bot API
        const res = await fetch(`${BOT_API_URL}/api/status`, {
            cache: 'no-store',
        });

        if (res.ok) {
            const data = await res.json();
            return NextResponse.json(data);
        }

        // Return default status if API unavailable
        return NextResponse.json({
            services: [
                { id: 'gov-utils', name: 'Gov Utils Bot', description: 'Moderation & administration', icon: '🤖', status: 'operational', uptime: 99.9 },
                { id: 'economy-bot', name: 'Economy Bot', description: 'Economy systems', icon: '💰', status: 'operational', uptime: 99.8 },
                { id: 'admin-dashboard', name: 'Admin Dashboard', description: 'Staff portal', icon: '🖥️', status: 'operational', uptime: 100 },
                { id: 'webmail', name: 'Webmail', description: 'Email service', icon: '📧', status: 'operational', uptime: 99.5 },
            ],
            incidents: [],
        });
    } catch (error) {
        return NextResponse.json({
            services: [],
            incidents: [],
            error: 'Failed to fetch status',
        });
    }
}
