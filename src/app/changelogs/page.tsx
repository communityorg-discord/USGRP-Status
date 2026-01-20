'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Changelog {
    id: string;
    system: string;
    version: string;
    title: string;
    date: string;
    changes: {
        added?: string[];
        changed?: string[];
        fixed?: string[];
        removed?: string[];
        security?: string[];
    };
}

export default function ChangelogsPage() {
    const [changelogs, setChangelogs] = useState<Changelog[]>([
        {
            id: '1',
            system: 'Gov Utils Bot',
            version: 'v2.5.0',
            title: 'Permission System Overhaul',
            date: '2026-01-20',
            changes: {
                added: [
                    'Advanced permission grants system',
                    'Command request/approval workflow',
                    'Staff dashboard API integration',
                ],
                changed: [
                    'Improved case management commands',
                    'Updated moderation action logging',
                ],
                fixed: [
                    'Fixed DM delivery for grant notifications',
                    'Resolved role hierarchy checks',
                ],
            },
        },
        {
            id: '2',
            system: 'Economy Bot',
            version: 'v3.2.0',
            title: 'Crime & Police Update',
            date: '2026-01-18',
            changes: {
                added: [
                    'Secret Service protection system',
                    'Gun license management',
                    'Federal Reserve daily stats',
                ],
                fixed: [
                    'Fixed food consumption stat updates',
                    'Corrected payday loan APR calculations',
                ],
            },
        },
    ]);

    const [filter, setFilter] = useState<string>('all');
    const [loading, setLoading] = useState(false);

    const systems = ['all', 'Gov Utils Bot', 'Economy Bot', 'Admin Dashboard', 'Webmail'];

    const filteredChangelogs = filter === 'all'
        ? changelogs
        : changelogs.filter(c => c.system === filter);

    return (
        <div className="page-container">
            <Header />

            <main className="main-content">
                <div className="section-header">
                    <h1 className="section-title">Changelogs</h1>
                </div>

                {/* Filter */}
                <div className="card" style={{ marginBottom: '24px', padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {systems.map((sys) => (
                            <button
                                key={sys}
                                className={`btn ${filter === sys ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setFilter(sys)}
                            >
                                {sys === 'all' ? 'All Systems' : sys}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Changelog List */}
                <div className="changelog-list">
                    {filteredChangelogs.map((log) => (
                        <div key={log.id} className="changelog-entry">
                            <div className="changelog-header">
                                <div className="changelog-version">
                                    <span className="version-badge">{log.version}</span>
                                    <span className="changelog-title">{log.title}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{log.system}</div>
                                    <div className="changelog-date">{new Date(log.date).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div className="changelog-content">
                                {log.changes.added && log.changes.added.length > 0 && (
                                    <div className="change-category">
                                        <div className="category-label added">✓ Added</div>
                                        <ul className="change-list">
                                            {log.changes.added.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {log.changes.changed && log.changes.changed.length > 0 && (
                                    <div className="change-category">
                                        <div className="category-label changed">◐ Changed</div>
                                        <ul className="change-list">
                                            {log.changes.changed.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {log.changes.fixed && log.changes.fixed.length > 0 && (
                                    <div className="change-category">
                                        <div className="category-label fixed">🔧 Fixed</div>
                                        <ul className="change-list">
                                            {log.changes.fixed.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {log.changes.removed && log.changes.removed.length > 0 && (
                                    <div className="change-category">
                                        <div className="category-label removed">✕ Removed</div>
                                        <ul className="change-list">
                                            {log.changes.removed.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {log.changes.security && log.changes.security.length > 0 && (
                                    <div className="change-category">
                                        <div className="category-label security">🔒 Security</div>
                                        <ul className="change-list">
                                            {log.changes.security.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredChangelogs.length === 0 && (
                    <div className="card">
                        <div className="empty-state">
                            <div className="empty-state-icon">📋</div>
                            <p>No changelogs found for this system</p>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
