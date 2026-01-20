'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RoadmapItem {
    id: number;
    title: string;
    description: string;
    system: string;
    quarter: string;
    status: string;
    progress: number;
}

export default function AdminRoadmapPage() {
    const router = useRouter();
    const [items, setItems] = useState<RoadmapItem[]>([]);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [system, setSystem] = useState('Gov Utils Bot');
    const [quarter, setQuarter] = useState('Q1 2026');
    const [status, setStatus] = useState('planned');

    const systems = ['Gov Utils Bot', 'Economy Bot', 'Admin Dashboard', 'Webmail', 'Status Portal', 'All Systems'];
    const quarters = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026', 'Q1 2027'];
    const statuses = ['planned', 'in-progress', 'completed'];

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
            const data = await res.json();
            if (data.authenticated && data.permissionLevel >= 3) {
                setAuthenticated(true);
                fetchRoadmap();
            } else {
                router.push('/admin');
            }
        } else {
            router.push('/admin');
        }
    };

    const fetchRoadmap = async () => {
        try {
            const res = await fetch('/api/roadmap');
            if (res.ok) {
                const data = await res.json();
                setItems(data.items || []);
            }
        } catch (e) {
            console.error('Failed to fetch roadmap:', e);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/admin/roadmap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, system, quarter, status }),
            });

            if (res.ok) {
                setShowForm(false);
                setTitle('');
                setDescription('');
                fetchRoadmap();
            }
        } catch (e) {
            console.error('Failed to create roadmap item:', e);
        }
    };

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'completed': return '#3fb950';
            case 'in-progress': return '#f0883e';
            default: return '#8b949e';
        }
    };

    if (!authenticated) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Checking authentication...</div>;
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '32px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button className="btn btn-secondary" onClick={() => router.push('/admin')}>
                        ← Back to Admin
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : '+ New Roadmap Item'}
                    </button>
                </div>

                <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>🗺️ Manage Roadmap</h1>

                {showForm && (
                    <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
                        <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Create Roadmap Item</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input
                                    className="form-input"
                                    placeholder="Feature name"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    placeholder="What this feature will do..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">System</label>
                                    <select className="form-input" value={system} onChange={(e) => setSystem(e.target.value)}>
                                        {systems.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Quarter</label>
                                    <select className="form-input" value={quarter} onChange={(e) => setQuarter(e.target.value)}>
                                        {quarters.map(q => <option key={q} value={q}>{q}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                                        {statuses.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Create Item</button>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="card"><div className="empty-state">Loading...</div></div>
                ) : items.length === 0 ? (
                    <div className="card">
                        <div className="empty-state">
                            <div className="empty-state-icon">🗺️</div>
                            <p>No roadmap items yet</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Click "New Roadmap Item" to add one</p>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {items.map((item) => (
                            <div key={item.id} className="card" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                            <span style={{
                                                width: '10px',
                                                height: '10px',
                                                borderRadius: '50%',
                                                background: getStatusColor(item.status)
                                            }}></span>
                                            <span style={{ fontWeight: 600 }}>{item.title}</span>
                                            <span style={{
                                                fontSize: '11px',
                                                padding: '2px 8px',
                                                background: 'var(--bg-tertiary)',
                                                borderRadius: '12px'
                                            }}>{item.system}</span>
                                        </div>
                                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '22px' }}>
                                            {item.description}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>
                                        {item.quarter}
                                        <br />
                                        <span style={{ textTransform: 'capitalize' }}>{item.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
