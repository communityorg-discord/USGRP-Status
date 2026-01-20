import { NextResponse } from 'next/server';

const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3003';
const API_KEY = process.env.BOT_API_KEY || 'usgrp-admin-2026-secure-key-x7k9m2p4';

export async function GET() {
    try {
        const res = await fetch(`${BOT_API_URL}/api/roadmap`, {
            headers: { 'x-admin-key': API_KEY },
            cache: 'no-store',
        });

        if (res.ok) {
            const data = await res.json();
            return NextResponse.json(data);
        }

        return NextResponse.json({ items: [] });
    } catch (error) {
        console.error('Roadmap API error:', error);
        return NextResponse.json({ items: [], error: 'Failed to fetch roadmap' });
    }
}
