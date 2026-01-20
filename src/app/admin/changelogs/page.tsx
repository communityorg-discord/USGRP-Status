'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Changelog {
    id: number;
    system: string;
    version: string;
    title: string;
    created_at: string;
    changes: {
        added?: string[];
        changed?: string[];
        fixed?: string[];
        removed?: string[];
    };
}

export default function AdminChangelogsPage() {
    const router = useRouter();
    const [changelogs, setChangelogs] = useState<Changelog[]>([]);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [system, setSystem] = useState('Gov Utils Bot');
    const [version, setVersion] = useState('');
    const [title, setTitle] = useState('');
    const [added, setAdded] = useState('');
    const [changed, setChanged] = useState('');
    const [fixed, setFixed] = useState('');
    const [removed, setRemoved] = useState('');

    const systems = ['Gov Utils Bot', 'Economy Bot', 'Admin Dashboard', 'Webmail', 'Status Portal'];

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
            const data = await res.json();
            if (data.authenticated && data.permissionLevel >= 3) {
                setAuthenticated(true);
                fetchChangelogs();
            } else {
                router.push('/admin');
            }
        } else {
            router.push('/admin');
        }
    };

    const fetchChangelogs = async () => {
        try {
            const res = await fetch('/api/changelogs');
            if (res.ok) {
                const data = await res.json();
                setChangelogs(data.changelogs || []);
            }
        } catch (e) {
            console.error('Failed to fetch changelogs:', e);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const changelogData = {
            system,
            version,
            title,
            changes: {
                added: added.split('\n').filter(l => l.trim()),
                changed: changed.split('\n').filter(l => l.trim()),
                fixed: fixed.split('\n').filter(l => l.trim()),
                removed: removed.split('\n').filter(l => l.trim()),
            }
        };

        try {
            const res = await fetch('/api/admin/changelogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(changelogData),
            });

            if (res.ok) {
                setShowForm(false);
                setVersion('');
                setTitle('');
                setAdded('');
                setChanged('');
                setFixed('');
                setRemoved('');
                fetchChangelogs();
            }
        } catch (e) {
            console.error('Failed to create changelog:', e);
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
                        {showForm ? 'Cancel' : '+ New Changelog'}
                    </button>
                </div>

                <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>📋 Manage Changelogs</h1>

                {showForm && (
                    <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
                        <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Create New Changelog</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">System</label>
                                    <select
                                        className="form-input"
                                        value={system}
                                        onChange={(e) => setSystem(e.target.value)}
                                    >
                                        {systems.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Version</label>
                                    <input
                                        className="form-input"
                                        placeholder="e.g., v2.1.0"
                                        value={version}
                                        onChange={(e) => setVersion(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input
                                    className="form-input"
                                    placeholder="Brief description of this release"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">✓ Added (one per line)</label>
                                    <textarea
                                        className="form-input"
                                        rows={4}
                                        placeholder="New feature 1&#10;New feature 2"
                                        value={added}
                                        onChange={(e) => setAdded(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">◐ Changed (one per line)</label>
                                    <textarea
                                        className="form-input"
                                        rows={4}
                                        placeholder="Updated feature 1&#10;Improved feature 2"
                                        value={changed}
                                        onChange={(e) => setChanged(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">🔧 Fixed (one per line)</label>
                                    <textarea
                                        className="form-input"
                                        rows={4}
                                        placeholder="Bug fix 1&#10;Bug fix 2"
                                        value={fixed}
                                        onChange={(e) => setFixed(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">✕ Removed (one per line)</label>
                                    <textarea
                                        className="form-input"
                                        rows={4}
                                        placeholder="Deprecated feature 1"
                                        value={removed}
                                        onChange={(e) => setRemoved(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Create Changelog</button>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="card"><div className="empty-state">Loading...</div></div>
                ) : changelogs.length === 0 ? (
                    <div className="card">
                        <div className="empty-state">
                            <div className="empty-state-icon">📋</div>
                            <p>No changelogs yet</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Click "New Changelog" to create one</p>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {changelogs.map((log) => (
                            <div key={log.id} className="card" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <div>
                                        <span style={{
                                            background: 'var(--gov-gold)',
                                            color: '#000',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            marginRight: '8px'
                                        }}>{log.version}</span>
                                        <span style={{ fontWeight: 600 }}>{log.title}</span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                        {log.system} • {new Date(log.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    {log.changes.added?.length ? `+${log.changes.added.length} added ` : ''}
                                    {log.changes.changed?.length ? `◐${log.changes.changed.length} changed ` : ''}
                                    {log.changes.fixed?.length ? `🔧${log.changes.fixed.length} fixed ` : ''}
                                    {log.changes.removed?.length ? `-${log.changes.removed.length} removed` : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
