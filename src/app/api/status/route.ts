import { NextResponse } from 'next/server';

const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3003';
const API_KEY = process.env.BOT_API_KEY || 'usgrp-admin-2026-secure-key-x7k9m2p4';

export async function GET() {
    try {
        const res = await fetch(`${BOT_API_URL}/api/status`, {
            headers: { 'x-admin-key': API_KEY },
            cache: 'no-store',
        });

        if (res.ok) {
            const data = await res.json();
            // Transform service data to match frontend interface
            const services = (data.services || []).map((s: Record<string, unknown>) => ({
                id: s.service_id || s.id,
                name: s.name,
                description: s.description,
                icon: s.icon || '🖥️',
                status: s.status || 'operational',
                uptime: s.uptime_30d || 100,
            }));

            // Transform incident data
            const incidents = (data.incidents || []).map((inc: Record<string, unknown>) => ({
                id: inc.incident_id || inc.id,
                title: inc.title,
                status: inc.status,
                severity: inc.severity,
                affectedServices: inc.affectedServices || [],
                createdAt: inc.created_at,
                updates: (inc.updates as Array<Record<string, unknown>> || []).map((u) => ({
                    time: new Date(u.created_at as string).toLocaleString(),
                    status: u.status,
                    message: u.message,
                })),
            }));

            return NextResponse.json({ services, incidents });
        }

        // Return empty defaults if API unavailable
        return NextResponse.json({
            services: [],
            incidents: [],
        });
    } catch (error) {
        console.error('Status API error:', error);
        return NextResponse.json({
            services: [],
            incidents: [],
            error: 'Failed to fetch status',
        });
    }
}
