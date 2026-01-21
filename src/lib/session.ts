import { SessionOptions } from 'iron-session';

export interface AuthUser {
    userId: string;
    email: string;
    discordId: string | null;
    displayName: string;
    authorityLevel: number;
    roles: string[];
    permissions: string[];
}

export interface SessionData {
    authToken?: string;
    user?: AuthUser;
    isLoggedIn: boolean;
    lastActivity?: number;
}

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET || 'usgrp-status-session-secret-key-32chars!',
    cookieName: 'usgrp-status-session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    },
};

export const defaultSession: SessionData = {
    isLoggedIn: false,
};
