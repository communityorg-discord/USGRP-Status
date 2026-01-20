'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Suggestion {
    id: string;
    suggestion_id: string;
    title: string;
    description: string;
    type: 'feature' | 'bug';
    severity?: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'rejected';
    upvotes: number;
    downvotes: number;
    user_tag: string;
    created_at: string;
    admin_response?: string;
}

export default function SuggestionsPage() {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [filter, setFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSuggestions();
    }, [filter, typeFilter]);

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            let url = '/api/suggestions?';
            if (typeFilter !== 'all') url += `type=${typeFilter}&`;
            if (filter !== 'all') url += `status=${filter}`;

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setSuggestions(data.suggestions || []);
            }
        } catch (e) {
            console.error('Failed to fetch suggestions:', e);
        }
        setLoading(false);
    };

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

                {/* Loading */}
                {loading && (
                    <div className="card">
                        <div className="empty-state">
                            <p>Loading suggestions...</p>
                        </div>
                    </div>
                )}

                {/* Suggestions List */}
                {!loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {suggestions.map((sug) => (
                            <div key={sug.id} className="card">
                                <div style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '16px' }}>{sug.type === 'feature' ? '✨' : '🐛'}</span>
                                                <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{sug.title}</h3>
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                by {sug.user_tag || 'Anonymous'} • {new Date(sug.created_at).toLocaleDateString()}
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

                                    {sug.admin_response && (
                                        <div style={{
                                            background: 'var(--bg-tertiary)',
                                            borderLeft: '3px solid var(--gov-gold)',
                                            padding: '12px 16px',
                                            borderRadius: '4px',
                                            marginBottom: '16px'
                                        }}>
                                            <div style={{ fontSize: '11px', color: 'var(--gov-gold)', marginBottom: '4px', fontWeight: 600 }}>ADMIN RESPONSE</div>
                                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{sug.admin_response}</div>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <span className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'default' }}>
                                            <span>👍</span> {sug.upvotes}
                                        </span>
                                        <span className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'default' }}>
                                            <span>👎</span> {sug.downvotes}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && suggestions.length === 0 && (
                    <div className="card">
                        <div className="empty-state">
                            <div className="empty-state-icon">💡</div>
                            <p>No suggestions found</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                                Use /suggest in Discord to submit a suggestion!
                            </p>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
