'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Suggestion {
    id: number;
    suggestion_id: string;
    title: string;
    description: string;
    type: string;
    status: string;
    upvotes: number;
    downvotes: number;
    user_tag: string;
    created_at: string;
    admin_response?: string;
}

export default function AdminSuggestionsPage() {
    const router = useRouter();
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
    const [response, setResponse] = useState('');
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
            const data = await res.json();
            if (data.authenticated && data.permissionLevel >= 3) {
                setAuthenticated(true);
                fetchSuggestions();
            } else {
                router.push('/admin');
            }
        } else {
            router.push('/admin');
        }
    };

    const fetchSuggestions = async () => {
        try {
            const res = await fetch('/api/suggestions');
            if (res.ok) {
                const data = await res.json();
                setSuggestions(data.suggestions || []);
            }
        } catch (e) {
            console.error('Failed to fetch suggestions:', e);
        }
        setLoading(false);
    };

    const handleRespond = async () => {
        if (!selectedSuggestion || !newStatus) return;

        try {
            const res = await fetch(`/api/admin/suggestions/${selectedSuggestion.suggestion_id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, adminResponse: response }),
            });

            if (res.ok) {
                setSelectedSuggestion(null);
                setResponse('');
                setNewStatus('');
                fetchSuggestions();
            }
        } catch (e) {
            console.error('Failed to update suggestion:', e);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#f0883e';
            case 'approved': return '#3fb950';
            case 'in-progress': return '#58a6ff';
            case 'completed': return '#3fb950';
            case 'rejected': return '#f85149';
            default: return '#8b949e';
        }
    };

    if (!authenticated) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Checking authentication...</div>;
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '32px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px' }}>
                    <button className="btn btn-secondary" onClick={() => router.push('/admin')}>
                        ← Back to Admin
                    </button>
                </div>

                <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>💡 Manage Suggestions</h1>

                {loading ? (
                    <div className="card"><div className="empty-state">Loading...</div></div>
                ) : suggestions.length === 0 ? (
                    <div className="card">
                        <div className="empty-state">
                            <div className="empty-state-icon">💡</div>
                            <p>No suggestions yet</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Users can submit via /suggest in Discord</p>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {suggestions.map((sug) => (
                            <div key={sug.id} className="card" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div>
                                        <span style={{ marginRight: '8px' }}>{sug.type === 'feature' ? '✨' : '🐛'}</span>
                                        <span style={{ fontWeight: 600 }}>{sug.title}</span>
                                        <span style={{
                                            marginLeft: '12px',
                                            fontSize: '11px',
                                            padding: '2px 8px',
                                            background: getStatusColor(sug.status),
                                            borderRadius: '4px',
                                            textTransform: 'capitalize'
                                        }}>{sug.status}</span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                        {sug.user_tag} • {new Date(sug.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                                    {sug.description}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                        👍 {sug.upvotes} • 👎 {sug.downvotes} • ID: {sug.suggestion_id}
                                    </div>
                                    <button
                                        className="btn btn-primary"
                                        style={{ fontSize: '12px', padding: '6px 12px' }}
                                        onClick={() => {
                                            setSelectedSuggestion(sug);
                                            setNewStatus(sug.status);
                                            setResponse(sug.admin_response || '');
                                        }}
                                    >
                                        Respond
                                    </button>
                                </div>
                                {sug.admin_response && (
                                    <div style={{
                                        marginTop: '12px',
                                        padding: '12px',
                                        background: 'var(--bg-tertiary)',
                                        borderLeft: '3px solid var(--gov-gold)',
                                        borderRadius: '4px',
                                        fontSize: '13px'
                                    }}>
                                        <strong style={{ color: 'var(--gov-gold)' }}>Admin Response:</strong> {sug.admin_response}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Response Modal */}
                {selectedSuggestion && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div className="card" style={{ width: '500px', padding: '24px' }}>
                            <h3 style={{ marginBottom: '16px' }}>Respond to Suggestion</h3>
                            <p style={{ fontSize: '14px', marginBottom: '16px' }}>{selectedSuggestion.title}</p>

                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-input"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Response (optional)</label>
                                <textarea
                                    className="form-input"
                                    rows={4}
                                    placeholder="Your response to this suggestion..."
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button className="btn btn-secondary" onClick={() => setSelectedSuggestion(null)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handleRespond}>
                                    Update Suggestion
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
