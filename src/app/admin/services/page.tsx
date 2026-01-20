'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Service {
    id: number;
    service_id: string;
    name: string;
    description: string;
    icon: string;
    status: string;
}

export default function AdminServicesPage() {
    const router = useRouter();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
            const data = await res.json();
            if (data.authenticated && data.permissionLevel >= 3) {
                setAuthenticated(true);
                fetchServices();
            } else {
                router.push('/admin');
            }
        } else {
            router.push('/admin');
        }
    };

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/status');
            if (res.ok) {
                const data = await res.json();
                setServices(data.services || []);
            }
        } catch (e) {
            console.error('Failed to fetch services:', e);
        }
        setLoading(false);
    };

    const updateStatus = async (serviceId: string, status: string) => {
        // This would call the API to update - for now just UI
        setServices(services.map(s =>
            s.service_id === serviceId ? { ...s, status } : s
        ));
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

                <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>🖥️ Manage Services</h1>

                {loading ? (
                    <div className="card"><div className="empty-state">Loading...</div></div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {services.map((service) => (
                            <div key={service.service_id} className="card" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <span style={{ fontSize: '32px' }}>{service.icon}</span>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '16px' }}>{service.name}</div>
                                            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{service.description}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {['operational', 'degraded', 'partial', 'major', 'maintenance'].map((status) => (
                                            <button
                                                key={status}
                                                className={`btn ${service.status === status ? 'btn-primary' : 'btn-secondary'}`}
                                                onClick={() => updateStatus(service.service_id, status)}
                                                style={{
                                                    fontSize: '11px',
                                                    padding: '6px 10px',
                                                    textTransform: 'capitalize'
                                                }}
                                            >
                                                {status}
                                            </button>
                                        ))}
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
