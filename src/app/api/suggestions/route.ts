import { NextResponse } from 'next/server';

const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3003';
const API_KEY = process.env.BOT_API_KEY || 'usgrp-admin-2026-secure-key-x7k9m2p4';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || '';
        const status = searchParams.get('status') || '';

        let url = `${BOT_API_URL}/api/suggestions?`;
        if (type) url += `type=${encodeURIComponent(type)}&`;
        if (status) url += `status=${encodeURIComponent(status)}`;

        const res = await fetch(url, {
            headers: { 'x-admin-key': API_KEY },
            cache: 'no-store',
        });

        if (res.ok) {
            const data = await res.json();
            return NextResponse.json(data);
        }

        return NextResponse.json({ suggestions: [] });
    } catch (error) {
        console.error('Suggestions API error:', error);
        return NextResponse.json({ suggestions: [], error: 'Failed to fetch suggestions' });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const res = await fetch(`${BOT_API_URL}/api/suggestions`, {
            method: 'POST',
            headers: {
                'x-admin-key': API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            const data = await res.json();
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'Failed to create suggestion' }, { status: 500 });
    } catch (error) {
        console.error('Create suggestion error:', error);
        return NextResponse.json({ error: 'Failed to create suggestion' }, { status: 500 });
    }
}
