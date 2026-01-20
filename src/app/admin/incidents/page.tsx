'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Incident {
    id: number;
    incident_id: string;
    title: string;
    status: string;
    severity: string;
    message: string;
    affected_services: string;
    created_at: string;
}

export default function AdminIncidentsPage() {
    const router = useRouter();
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [severity, setSeverity] = useState('minor');
    const [message, setMessage] = useState('');
    const [affectedServices, setAffectedServices] = useState<string[]>([]);

    const services = [
        { id: 'gov-utils', name: 'Federal Administration System' },
        { id: 'economy-bot', name: 'National Treasury System' },
        { id: 'admin-dashboard', name: 'Executive Control Panel' },
        { id: 'webmail', name: 'Official Communications Hub' },
        { id: 'status-portal', name: 'Public Affairs Portal' },
        { id: 'vps-primary', name: 'Primary Data Center (ALPHA)' },
        { id: 'vps-secondary', name: 'Secondary Data Center (BRAVO)' },
    ];

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
            const data = await res.json();
            if (data.authenticated && data.permissionLevel >= 3) {
                setAuthenticated(true);
                fetchIncidents();
            } else {
                router.push('/admin');
            }
        } else {
            router.push('/admin');
        }
    };

    const fetchIncidents = async () => {
        try {
            const res = await fetch('/api/status');
            if (res.ok) {
                const data = await res.json();
                setIncidents(data.incidents || []);
            }
        } catch (e) {
            console.error('Failed to fetch incidents:', e);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/admin/incidents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    severity,
                    message,
                    affectedServices
                }),
            });

            if (res.ok) {
                setShowForm(false);
                setTitle('');
                setMessage('');
                setAffectedServices([]);
                fetchIncidents();
            }
        } catch (e) {
            console.error('Failed to create incident:', e);
        }
    };

    const toggleService = (serviceId: string) => {
        if (affectedServices.includes(serviceId)) {
            setAffectedServices(affectedServices.filter(s => s !== serviceId));
        } else {
            setAffectedServices([...affectedServices, serviceId]);
        }
    };

    const getSeverityColor = (sev: string) => {
        switch (sev) {
            case 'critical': return '#f85149';
            case 'major': return '#f0883e';
            case 'minor': return '#f0c000';
            case 'maintenance': return '#58a6ff';
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
                        {showForm ? 'Cancel' : '+ Report Incident'}
                    </button>
                </div>

                <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>🔴 Manage Incidents</h1>

                {showForm && (
                    <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
                        <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Report New Incident</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input
                                    className="form-input"
                                    placeholder="Brief description of the issue"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Severity</label>
                                <select className="form-input" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                                    <option value="minor">Minor - Performance issues</option>
                                    <option value="major">Major - Partial outage</option>
                                    <option value="critical">Critical - Full outage</option>
                                    <option value="maintenance">Maintenance - Planned downtime</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Message</label>
                                <textarea
                                    className="form-input"
                                    rows={4}
                                    placeholder="Detailed information about the incident..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Affected Services</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {services.map(s => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            className={`btn ${affectedServices.includes(s.id) ? 'btn-primary' : 'btn-secondary'}`}
                                            style={{ fontSize: '12px' }}
                                            onClick={() => toggleService(s.id)}
                                        >
                                            {s.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Create Incident</button>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="card"><div className="empty-state">Loading...</div></div>
                ) : incidents.length === 0 ? (
                    <div className="card">
                        <div className="empty-state">
                            <div className="empty-state-icon">✓</div>
                            <p>No active incidents</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>All systems are operating normally</p>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {incidents.map((inc) => (
                            <div key={inc.id} className="card" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div>
                                        <span style={{
                                            display: 'inline-block',
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            background: getSeverityColor(inc.severity),
                                            marginRight: '8px'
                                        }}></span>
                                        <span style={{ fontWeight: 600 }}>{inc.title}</span>
                                        <span style={{
                                            marginLeft: '12px',
                                            fontSize: '11px',
                                            padding: '2px 8px',
                                            background: getSeverityColor(inc.severity),
                                            borderRadius: '4px',
                                            textTransform: 'capitalize'
                                        }}>{inc.severity}</span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                        {inc.status} • {new Date(inc.created_at).toLocaleString()}
                                    </div>
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{inc.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
