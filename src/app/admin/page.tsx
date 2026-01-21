'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_URL = 'https://auth.usgrp.xyz';

export default function AdminPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [session, setSession] = useState<{ email: string; discordId: string; permissionLevel: number } | null>(null);

    useEffect(() => {
        checkSession();

        // Check URL for error params
        const params = new URLSearchParams(window.location.search);
        const errorParam = params.get('error');
        if (errorParam) {
            setError(errorParam);
        }
    }, []);

    const checkSession = async () => {
        try {
            const res = await fetch('/api/auth/session');
            if (res.ok) {
                const data = await res.json();
                if (data.authenticated && data.permissionLevel >= 3) {
                    setIsAuthenticated(true);
                    setSession(data);
                }
            }
        } catch {
            // Not authenticated
        }
    };

    const handleSSOLogin = () => {
        const returnUrl = 'https://status.usgrp.xyz';
        window.location.href = `${AUTH_URL}/login?return=${encodeURIComponent(returnUrl)}`;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                checkSession();
            } else {
                const data = await res.json();
                setError(data.error || 'Login failed');
            }
        } catch {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setIsAuthenticated(false);
        setSession(null);
    };

    if (!isAuthenticated) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'var(--bg-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '12px',
                    padding: '32px'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
                        <h1 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Admin Access</h1>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                            Login with your USGRP staff credentials
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            padding: '12px',
                            background: 'rgba(248, 81, 73, 0.1)',
                            border: '1px solid rgba(248, 81, 73, 0.3)',
                            borderRadius: '6px',
                            color: 'var(--status-major)',
                            fontSize: '13px',
                            marginBottom: '16px'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* SSO Login Button */}
                    <button
                        onClick={handleSSOLogin}
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <span>🔑</span> Sign in with USGRP Auth
                    </button>

                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '24px' }}>
                        Only Bot Developers and Admins have access to this portal
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Admin Header */}
            <header style={{
                background: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border-default)',
                padding: '16px 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '24px' }}>⚙️</span>
                    <div>
                        <h1 style={{ fontSize: '18px', fontWeight: 600 }}>Status Portal Admin</h1>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted) ' }}>Manage content and incidents</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{session?.email}</span>
                    <button onClick={handleLogout} className="btn btn-secondary">Sign Out</button>
                </div>
            </header>

            {/* Admin Content */}
            <main style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {/* Incidents Card */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">🔴 Manage Incidents</h3>
                        </div>
                        <div className="card-content">
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                Create and update service incidents and scheduled maintenance.
                            </p>
                            <button className="btn btn-primary" onClick={() => router.push('/admin/incidents')}>
                                Manage Incidents
                            </button>
                        </div>
                    </div>

                    {/* Changelogs Card */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">📋 Manage Changelogs</h3>
                        </div>
                        <div className="card-content">
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                Post new changelog entries for system updates.
                            </p>
                            <button className="btn btn-primary" onClick={() => router.push('/admin/changelogs')}>
                                Manage Changelogs
                            </button>
                        </div>
                    </div>

                    {/* Suggestions Card */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">💡 Manage Suggestions</h3>
                        </div>
                        <div className="card-content">
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                Review and respond to community suggestions and bug reports.
                            </p>
                            <button className="btn btn-primary" onClick={() => router.push('/admin/suggestions')}>
                                Manage Suggestions
                            </button>
                        </div>
                    </div>

                    {/* Roadmap Card */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">🗺️ Manage Roadmap</h3>
                        </div>
                        <div className="card-content">
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                Update roadmap items and progress.
                            </p>
                            <button className="btn btn-primary" onClick={() => router.push('/admin/roadmap')}>
                                Manage Roadmap
                            </button>
                        </div>
                    </div>

                    {/* Services Card */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">🖥️ Manage Services</h3>
                        </div>
                        <div className="card-content">
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                Configure monitored services and status.
                            </p>
                            <button className="btn btn-primary" onClick={() => router.push('/admin/services')}>
                                Manage Services
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
