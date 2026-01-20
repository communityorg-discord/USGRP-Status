'use client';

import { useState, useEffect } from 'react';
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
    const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoadmap();
    }, []);

    const fetchRoadmap = async () => {
        try {
            const res = await fetch('/api/roadmap');
            if (res.ok) {
                const data = await res.json();
                setRoadmapItems(data.items || []);
            }
        } catch (e) {
            console.error('Failed to fetch roadmap:', e);
        }
        setLoading(false);
    };

    const quarters = [...new Set(roadmapItems.map(i => i.quarter))].sort();

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

                {/* Loading */}
                {loading && (
                    <div className="card">
                        <div className="empty-state">
                            <p>Loading roadmap...</p>
                        </div>
                    </div>
                )}

                {/* Roadmap by Quarter */}
                {!loading && quarters.map((quarter) => (
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
                                                {item.system && (
                                                    <span style={{
                                                        fontSize: '11px',
                                                        padding: '2px 8px',
                                                        background: 'var(--bg-tertiary)',
                                                        borderRadius: '12px',
                                                        color: 'var(--text-muted)'
                                                    }}>
                                                        {item.system}
                                                    </span>
                                                )}
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

                {!loading && roadmapItems.length === 0 && (
                    <div className="card">
                        <div className="empty-state">
                            <div className="empty-state-icon">🗺️</div>
                            <p>No roadmap items yet</p>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
