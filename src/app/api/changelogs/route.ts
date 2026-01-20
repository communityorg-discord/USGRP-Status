import { NextResponse } from 'next/server';

const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3003';
const API_KEY = process.env.BOT_API_KEY || 'usgrp-admin-2026-secure-key-x7k9m2p4';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const system = searchParams.get('system') || '';

        const url = system
            ? `${BOT_API_URL}/api/changelogs?system=${encodeURIComponent(system)}`
            : `${BOT_API_URL}/api/changelogs`;

        const res = await fetch(url, {
            headers: { 'x-admin-key': API_KEY },
            cache: 'no-store',
        });

        if (res.ok) {
            const data = await res.json();
            return NextResponse.json(data);
        }

        return NextResponse.json({ changelogs: [] });
    } catch (error) {
        console.error('Changelogs API error:', error);
        return NextResponse.json({ changelogs: [], error: 'Failed to fetch changelogs' });
    }
}
