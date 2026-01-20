'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Suggestion {
    id: string;
    title: string;
    description: string;
    type: 'feature' | 'bug';
    severity?: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'rejected';
    upvotes: number;
    downvotes: number;
    author: string;
    createdAt: string;
    adminResponse?: string;
}

export default function SuggestionsPage() {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([
        {
            id: '1',
            title: 'Add bulk case management',
            description: 'Ability to void/restore multiple cases at once would save time for admins.',
            type: 'feature',
            status: 'approved',
            upvotes: 12,
            downvotes: 1,
            author: 'User#1234',
            createdAt: '2026-01-18',
        },
        {
            id: '2',
            title: 'Mobile-friendly dashboard',
            description: 'The admin dashboard is hard to use on mobile devices. Would be great to have responsive design.',
            type: 'feature',
            status: 'in-progress',
            upvotes: 25,
            downvotes: 0,
            author: 'User#5678',
            createdAt: '2026-01-15',
            adminResponse: 'We are currently working on this! Expected in v2.6.0',
        },
        {
            id: '3',
            title: 'DM notifications not working',
            description: 'I\'m not receiving DM notifications for case updates even though I have DMs enabled.',
            type: 'bug',
            severity: 'medium',
            status: 'completed',
            upvotes: 8,
            downvotes: 0,
            author: 'User#9012',
            createdAt: '2026-01-10',
            adminResponse: 'Fixed in v2.5.1',
        },
    ]);

    const [filter, setFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    const filteredSuggestions = suggestions.filter(s => {
        if (filter !== 'all' && s.status !== filter) return false;
        if (typeFilter !== 'all' && s.type !== typeFilter) return false;
        return true;
    });

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'pending': return 'incident-badge scheduled';
            case 'approved': return 'incident-badge monitoring';
            case 'in-progress': return 'incident-badge identified';
            case 'completed': return 'incident-badge resolved';
            case 'rejected': return 'incident-badge investigating';
            default: return 'incident-badge';
        }
    };

    return (
        <div className="page-container">
            <Header />

            <main className="main-content">
                <div className="section-header" style={{ marginBottom: '24px' }}>
                    <h1 className="section-title">Suggestions & Bug Reports</h1>
                    <button className="btn btn-primary">+ Submit Suggestion</button>
                </div>

                {/* Filters */}
                <div className="card" style={{ marginBottom: '24px', padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Type</div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {['all', 'feature', 'bug'].map((t) => (
                                    <button
                                        key={t}
                                        className={`btn ${typeFilter === t ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => setTypeFilter(t)}
                                    >
                                        {t === 'all' ? 'All' : t === 'feature' ? '✨ Features' : '🐛 Bugs'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Status</div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {['all', 'pending', 'approved', 'in-progress', 'completed', 'rejected'].map((s) => (
                                    <button
                                        key={s}
                                        className={`btn ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => setFilter(s)}
                                        style={{ textTransform: 'capitalize' }}
                                    >
                                        {s === 'all' ? 'All' : s.replace('-', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Suggestions List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredSuggestions.map((sug) => (
                        <div key={sug.id} className="card">
                            <div style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '16px' }}>{sug.type === 'feature' ? '✨' : '🐛'}</span>
                                            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{sug.title}</h3>
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                            by {sug.author} • {new Date(sug.createdAt).toLocaleDateString()}
                                            {sug.severity && (
                                                <span style={{ marginLeft: '8px', color: sug.severity === 'critical' ? 'var(--status-major)' : 'var(--text-secondary)' }}>
                                                    • Severity: {sug.severity}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className={getStatusBadgeClass(sug.status)}>
                                        {sug.status.replace('-', ' ')}
                                    </span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{sug.description}</p>

                                {sug.adminResponse && (
                                    <div style={{
                                        background: 'var(--bg-tertiary)',
                                        borderLeft: '3px solid var(--gov-gold)',
                                        padding: '12px 16px',
                                        borderRadius: '4px',
                                        marginBottom: '16px'
                                    }}>
                                        <div style={{ fontSize: '11px', color: 'var(--gov-gold)', marginBottom: '4px', fontWeight: 600 }}>ADMIN RESPONSE</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{sug.adminResponse}</div>
                                    </div>
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span>👍</span> {sug.upvotes}
                                    </button>
                                    <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span>👎</span> {sug.downvotes}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredSuggestions.length === 0 && (
                    <div className="card">
                        <div className="empty-state">
                            <div className="empty-state-icon">💡</div>
                            <p>No suggestions found matching your filters</p>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
