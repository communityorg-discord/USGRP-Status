'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface RoadmapItem {
    id: string;
    title: string;
    description: string;
    system: string;
    status: 'planned' | 'in-progress' | 'completed';
    quarter: string;
    progress: number;
}

export default function RoadmapPage() {
    const roadmapItems: RoadmapItem[] = [
        // Q1 2026
        { id: '1', title: 'Status Portal Launch', description: 'Public status page with incident management', system: 'Infrastructure', status: 'in-progress', quarter: 'Q1 2026', progress: 70 },
        { id: '2', title: 'Mobile Dashboard', description: 'Responsive admin dashboard for mobile devices', system: 'Admin Dashboard', status: 'planned', quarter: 'Q1 2026', progress: 0 },
        { id: '3', title: 'Advanced Permission System', description: 'Granular permission grants and request workflow', system: 'Gov Utils Bot', status: 'completed', quarter: 'Q1 2026', progress: 100 },

        // Q2 2026
        { id: '4', title: 'Audit Log Search', description: 'Advanced search and filtering for audit logs', system: 'Gov Utils Bot', status: 'planned', quarter: 'Q2 2026', progress: 0 },
        { id: '5', title: 'Economy Dashboard', description: 'Web dashboard for economy management', system: 'Economy Bot', status: 'planned', quarter: 'Q2 2026', progress: 0 },
        { id: '6', title: 'API v2', description: 'Public API with authentication for third-party integrations', system: 'Infrastructure', status: 'planned', quarter: 'Q2 2026', progress: 0 },
    ];

    const quarters = [...new Set(roadmapItems.map(i => i.quarter))];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'var(--status-operational)';
            case 'in-progress': return 'var(--status-degraded)';
            case 'planned': return 'var(--text-muted)';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div className="page-container">
            <Header />

            <main className="main-content">
                <div className="section-header" style={{ marginBottom: '32px' }}>
                    <h1 className="section-title">Roadmap</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                        Planned features and improvements across all USGRP systems
                    </p>
                </div>

                {/* Legend */}
                <div className="card" style={{ marginBottom: '32px', padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--status-operational)' }}></span>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Completed</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--status-degraded)' }}></span>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>In Progress</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--text-muted)' }}></span>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Planned</span>
                        </div>
                    </div>
                </div>

                {/* Roadmap by Quarter */}
                {quarters.map((quarter) => (
                    <div key={quarter} style={{ marginBottom: '40px' }}>
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: 600,
                            color: 'var(--gov-gold)',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <span style={{
                                width: '40px',
                                height: '40px',
                                background: 'rgba(212, 168, 75, 0.1)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px'
                            }}>📅</span>
                            {quarter}
                        </h2>

                        <div style={{ display: 'grid', gap: '12px' }}>
                            {roadmapItems.filter(i => i.quarter === quarter).map((item) => (
                                <div key={item.id} className="card" style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                                <span style={{
                                                    width: '10px',
                                                    height: '10px',
                                                    borderRadius: '50%',
                                                    background: getStatusColor(item.status)
                                                }}></span>
                                                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{item.title}</h3>
                                                <span style={{
                                                    fontSize: '11px',
                                                    padding: '2px 8px',
                                                    background: 'var(--bg-tertiary)',
                                                    borderRadius: '12px',
                                                    color: 'var(--text-muted)'
                                                }}>
                                                    {item.system}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '22px' }}>
                                                {item.description}
                                            </p>
                                        </div>

                                        {item.status === 'in-progress' && (
                                            <div style={{
                                                minWidth: '100px',
                                                marginLeft: '20px',
                                                textAlign: 'right'
                                            }}>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                                    {item.progress}%
                                                </div>
                                                <div style={{
                                                    width: '100px',
                                                    height: '6px',
                                                    background: 'var(--bg-tertiary)',
                                                    borderRadius: '3px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <div style={{
                                                        width: `${item.progress}%`,
                                                        height: '100%',
                                                        background: 'var(--status-degraded)',
                                                        borderRadius: '3px'
                                                    }}></div>
                                                </div>
                                            </div>
                                        )}

                                        {item.status === 'completed' && (
                                            <span style={{ color: 'var(--status-operational)', fontSize: '20px' }}>✓</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </main>

            <Footer />
        </div>
    );
}
